import { useState, useMemo, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminCommission() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [filterPaid, setFilterPaid] = useState<string>("all");

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/portal");
  }, [user, navigate]);

  const { data, isLoading, refetch } = trpc.portal.getCommissionSummary.useQuery();
  const markPaid = trpc.portal.markCommissionPaid.useMutation({
    onSuccess: () => {
      toast.success("Commission status updated.");
      refetch();
    },
    onError: () => toast.error("Failed to update commission status."),
  });

  const deals = data?.deals ?? [];
  const summary = data?.summary ?? { totalCommission: 0, totalPaid: 0, totalPending: 0 };

  // Unique agents for filter
  const agentNames = Array.from(new Set(deals.map((d) => d.agentName)));

  // Per-agent breakdown
  const agentBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; paid: number; count: number }>();
    for (const deal of deals) {
      const name = deal.agentName;
      const existing = map.get(name) ?? { total: 0, paid: 0, count: 0 };
      const amount = Number(deal.commissionAmount ?? 0);
      map.set(name, {
        total: existing.total + amount,
        paid: existing.paid + (deal.commissionPaid ? amount : 0),
        count: existing.count + 1,
      });
    }
    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats, pending: stats.total - stats.paid }))
      .sort((a, b) => b.total - a.total);
  }, [deals]);

  const filtered = deals.filter((d) => {
    if (filterAgent !== "all" && d.agentName !== filterAgent) return false;
    if (filterPaid === "paid" && !d.commissionPaid) return false;
    if (filterPaid === "pending" && d.commissionPaid) return false;
    return true;
  });

  return (
    <PortalLayout title="Commission Tracker">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Commission</p>
                  <p className="text-2xl font-bold text-[#0A1628]">
                    {formatZAR(summary.totalCommission)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">All closed deals</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commission Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatZAR(summary.totalPaid)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Marked as paid</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commission Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatZAR(summary.totalPending)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Awaiting payment</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Per-Agent Breakdown */}
        {agentBreakdown.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0A1628]">
                Agent Commission Breakdown
              </CardTitle>
              <CardDescription>YTD commission totals per agent across all closed deals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {agentBreakdown.map((agent) => (
                  <div key={agent.name} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-semibold text-[#0A1628] text-sm truncate">{agent.name}</p>
                      <span className="ml-auto text-xs text-gray-400">{agent.count} deal{agent.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total</span>
                        <span className="font-semibold text-[#0A1628]">{formatZAR(agent.total)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Paid</span>
                        <span className="font-medium text-green-600">{formatZAR(agent.paid)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Pending</span>
                        <span className="font-medium text-amber-600">{formatZAR(agent.pending)}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: agent.total > 0 ? `${Math.round((agent.paid / agent.total) * 100)}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Filter:</span>
          </div>
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30"
          >
            <option value="all">All Agents</option>
            {agentNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={filterPaid}
            onChange={(e) => setFilterPaid(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="pending">Pending Only</option>
          </select>
          <span className="text-sm text-gray-400 ml-auto">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Commission Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0A1628]">
              Closed Deal Commissions
            </CardTitle>
            <CardDescription>
              All deals at "Closed Won" stage. Mark commissions as paid once transferred to agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Loading commission data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <DollarSign className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No commission records match the current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sale Price
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((deal) => (
                      <tr
                        key={deal.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#0A1628] leading-tight">
                            {deal.propertyTitle}
                          </p>
                          {deal.closedAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Closed{" "}
                              {new Date(deal.closedAt).toLocaleDateString("en-ZA", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-gray-600">{deal.clientName}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {deal.agentName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700">
                          {deal.offerPrice
                            ? formatZAR(Number(deal.offerPrice))
                            : deal.askingPrice
                            ? formatZAR(Number(deal.askingPrice))
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[#0A1628]">
                          {deal.commissionAmount
                            ? formatZAR(Number(deal.commissionAmount))
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {deal.commissionPaid ? (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={markPaid.isPending}
                            onClick={() =>
                              markPaid.mutate({
                                dealId: deal.id,
                                paid: !deal.commissionPaid,
                              })
                            }
                            className={`text-xs h-7 px-3 ${
                              deal.commissionPaid
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {deal.commissionPaid ? "Mark Unpaid" : "Mark Paid"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
