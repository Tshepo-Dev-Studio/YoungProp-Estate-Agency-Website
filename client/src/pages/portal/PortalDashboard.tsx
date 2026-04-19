import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Briefcase, Users, ClipboardList, CheckSquare,
  TrendingUp, Clock, AlertCircle, ChevronRight, Plus
} from "lucide-react";

const stageColors: Record<string, string> = {
  lead: "bg-gray-100 text-gray-700",
  viewing_scheduled: "bg-blue-100 text-blue-700",
  offer_made: "bg-yellow-100 text-yellow-700",
  offer_accepted: "bg-orange-100 text-orange-700",
  conveyancing: "bg-purple-100 text-purple-700",
  transfer: "bg-indigo-100 text-indigo-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
};

const stageLabels: Record<string, string> = {
  lead: "Lead",
  viewing_scheduled: "Viewing",
  offer_made: "Offer Made",
  offer_accepted: "Offer Accepted",
  conveyancing: "Conveyancing",
  transfer: "Transfer",
  closed_won: "Closed ✓",
  closed_lost: "Closed ✗",
};

export default function PortalDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.portal.getDashboardStats.useQuery();
  const { data: deals } = trpc.portal.listMyDeals.useQuery();
  const { data: tasks } = trpc.portal.listMyTasks.useQuery();
  const { data: leads } = trpc.portal.listLeads.useQuery();

  const recentDeals = deals?.slice(0, 4) ?? [];
  const pendingTasks = tasks?.filter((t) => t.status !== "done" && t.status !== "cancelled").slice(0, 5) ?? [];
  const newLeads = leads?.filter((l) => l.status === "new").slice(0, 5) ?? [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const StatCard = ({ icon: Icon, label, value, sub, color }: {
    icon: React.ElementType; label: string; value: number | string; sub?: string; color: string;
  }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-[#0A1628]">{statsLoading ? "—" : value}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PortalLayout title={`${greeting()}, ${user?.name?.split(" ")[0] ?? "Agent"}`}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} label="My Deals" value={stats?.myDeals ?? 0} sub={`${stats?.myActiveDeals ?? 0} active`} color="bg-[#0A1628]/10 text-[#0A1628]" />
          <StatCard icon={TrendingUp} label="Closed Deals" value={stats?.myClosedDeals ?? 0} sub="this period" color="bg-green-100 text-green-700" />
          <StatCard icon={Users} label="New Leads" value={stats?.newLeads ?? 0} sub={`${stats?.totalLeads ?? 0} total`} color="bg-blue-100 text-blue-700" />
          <StatCard icon={ClipboardList} label="Valuations" value={stats?.pendingValuations ?? 0} sub="pending" color="bg-[#C9A84C]/20 text-[#C9A84C]" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Deals */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0A1628]">Recent Deals</CardTitle>
                <Link href="/portal/deals">
                  <a className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </a>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {recentDeals.length === 0 ? (
                  <div className="text-center py-10 px-6">
                    <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No deals yet</p>
                    <Link href="/portal/deals">
                      <Button size="sm" className="mt-3 bg-[#0A1628] text-white hover:bg-[#0A1628]/90">
                        <Plus className="w-3 h-3 mr-1" /> Add First Deal
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {recentDeals.map((deal) => (
                      <div key={deal.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0A1628] truncate">{deal.propertyTitle}</p>
                            <p className="text-xs text-gray-500 truncate">{deal.clientName}</p>
                          </div>
                          <Badge className={`text-xs flex-shrink-0 ${stageColors[deal.stage] ?? "bg-gray-100 text-gray-700"}`}>
                            {stageLabels[deal.stage] ?? deal.stage}
                          </Badge>
                        </div>
                        {deal.askingPrice && (
                          <p className="text-xs text-[#C9A84C] font-medium mt-1">
                            R {Number(deal.askingPrice).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tasks & Leads */}
          <div className="space-y-4">
            {/* Pending Tasks */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0A1628] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#C9A84C]" /> Tasks
                </CardTitle>
                <Link href="/portal/tasks">
                  <a className="text-xs text-[#C9A84C] hover:underline">View all</a>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {pendingTasks.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">All caught up! 🎉</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="px-5 py-2.5 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          task.priority === "urgent" ? "bg-red-500" :
                          task.priority === "high" ? "bg-orange-500" :
                          task.priority === "medium" ? "bg-yellow-500" : "bg-gray-300"
                        }`} />
                        <p className="text-sm text-gray-700 flex-1 truncate">{task.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* New Leads */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0A1628] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" /> New Leads
                </CardTitle>
                <Link href="/portal/leads">
                  <a className="text-xs text-[#C9A84C] hover:underline">View all</a>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {newLeads.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">No new leads</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {newLeads.map((lead) => (
                      <div key={lead.id} className="px-5 py-2.5">
                        <p className="text-sm font-medium text-[#0A1628]">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.leadType} · {lead.phone ?? lead.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#0A1628] to-[#0A1628]/90">
          <CardContent className="p-5">
            <p className="text-white font-semibold mb-3">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/portal/deals">
                <Button size="sm" className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-white">
                  <Plus className="w-3 h-3 mr-1.5" /> New Deal
                </Button>
              </Link>
              <Link href="/portal/tasks">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <CheckSquare className="w-3 h-3 mr-1.5" /> Add Task
                </Button>
              </Link>
              <Link href="/portal/leads">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <Users className="w-3 h-3 mr-1.5" /> View Leads
                </Button>
              </Link>
              <Link href="/portal/listings">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <Clock className="w-3 h-3 mr-1.5" /> Manage Listings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
