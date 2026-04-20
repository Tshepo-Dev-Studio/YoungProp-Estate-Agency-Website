import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Users, TrendingUp, Home, DollarSign, Target, Activity,
  BarChart3, ArrowUpRight, Briefcase, Star, AlertCircle
} from "lucide-react";

function KPICard({ title, value, sub, icon: Icon, trend, color = "amber" }: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; trend?: string; color?: string;
}) {
  const colorMap: Record<string, string> = {
    amber: "text-amber-400 bg-amber-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    green: "text-green-400 bg-green-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    red: "text-red-400 bg-red-500/10",
  };
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-lg ${colorMap[color] ?? colorMap.amber}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CeoDashboard() {
  const [, navigate] = useLocation();
  const { data: kpis, isLoading } = trpc.ceo.getDashboardKPIs.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: pipeline } = trpc.ceo.getPipelineOverview.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: agentPerf } = trpc.ceo.getAgentPerformance.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: revenueTrend } = trpc.ceo.getRevenueTrend.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: news } = trpc.ceo.getCompanyNews.useQuery(undefined, { refetchOnWindowFocus: false });

  const formatCurrency = (v: number) =>
    v >= 1_000_000
      ? `R${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
      ? `R${(v / 1_000).toFixed(0)}K`
      : `R${v.toFixed(0)}`;

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const maxRevenue = Math.max(...(revenueTrend?.map(m => m.revenue) ?? [1]));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CEO Command Centre</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => navigate("/portal/contacts")}>
            <Users className="w-4 h-4 mr-1" /> Contacts
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => navigate("/portal/deals")}>
            <Briefcase className="w-4 h-4 mr-1" /> Deals
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Contacts"
          value={kpis?.contacts.total ?? 0}
          sub={`${kpis?.contacts.buyers ?? 0} buyers · ${kpis?.contacts.sellers ?? 0} sellers`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Active Deals"
          value={kpis?.deals.active ?? 0}
          sub={`${kpis?.deals.closed ?? 0} closed total`}
          icon={Briefcase}
          color="amber"
        />
        <KPICard
          title="Commission YTD"
          value={formatCurrency(kpis?.commission.ytd ?? 0)}
          sub={`${formatCurrency(kpis?.commission.mtd ?? 0)} this month`}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Active Agents"
          value={kpis?.team.activeAgents ?? 0}
          sub="On the team"
          icon={Star}
          color="purple"
        />
        <KPICard
          title="Active Listings"
          value={kpis?.listings.active ?? 0}
          sub="On market"
          icon={Home}
          color="amber"
        />
        <KPICard
          title="New Leads (MTD)"
          value={kpis?.leads.newThisMonth ?? 0}
          sub={`${kpis?.leads.total ?? 0} total all time`}
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Expenses YTD"
          value={formatCurrency(kpis?.expenses.ytd ?? 0)}
          sub="All categories"
          icon={Activity}
          color="red"
        />
        <KPICard
          title="Pipeline Value"
          value={formatCurrency(pipeline?.reduce((s, p) => s + (p.totalValue ?? 0), 0) ?? 0)}
          sub={`${kpis?.deals.total ?? 0} deals total`}
          icon={BarChart3}
          color="green"
        />
      </div>

      {/* Revenue trend + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend bar chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Commission Revenue — Last 12 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {(revenueTrend ?? []).map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-amber-500/70 rounded-t hover:bg-amber-400 transition-all"
                    style={{ height: `${maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                    title={`${m.month}: ${formatCurrency(m.revenue)}`}
                  />
                  <span className="text-slate-600 text-[9px] rotate-45 origin-left">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal pipeline by stage */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> Deal Pipeline by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(pipeline ?? []).filter(p => p.count > 0).map(p => (
                <div key={p.stage} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs w-32 capitalize">{p.stage.replace(/_/g, " ")}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((p.count / Math.max(...(pipeline?.map(x => x.count) ?? [1]))) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-white text-xs w-6 text-right">{p.count}</span>
                  <span className="text-slate-500 text-xs w-20 text-right">{formatCurrency(p.totalValue)}</span>
                </div>
              ))}
              {(pipeline ?? []).every(p => p.count === 0) && (
                <p className="text-slate-500 text-sm text-center py-4">No active deals yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent performance + Company news */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent performance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Agent Performance
              </span>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs" onClick={() => navigate("/portal/agents")}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(agentPerf ?? []).length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No agents yet</p>
            ) : (
              <div className="space-y-3">
                {(agentPerf ?? []).slice(0, 5).map(agent => (
                  <div key={agent.agentId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                      {agent.name?.charAt(0) ?? "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium truncate">{agent.name}</span>
                        <span className="text-green-400 text-xs ml-2">{formatCurrency(agent.commissionEarned)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{agent.activeDeals} active</span>
                        <span>{agent.closedDeals} closed</span>
                        <span>{agent.totalContacts} contacts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company news */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Company News & Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(news ?? []).length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No announcements yet</p>
            ) : (
              <div className="space-y-3">
                {(news ?? []).slice(0, 4).map((item: any) => (
                  <div key={item.id} className="border-l-2 border-amber-500/40 pl-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      {item.pinned && <Badge className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">Pinned</Badge>}
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 capitalize">{item.category.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{item.content}</p>
                    <p className="text-slate-600 text-xs mt-1">{new Date(item.publishedAt).toLocaleDateString("en-ZA")}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
