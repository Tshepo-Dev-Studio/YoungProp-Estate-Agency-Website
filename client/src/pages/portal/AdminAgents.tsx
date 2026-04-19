import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

const agentTypeLabels: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  referral_partner: "Referral Partner",
  intern: "Intern",
};

export default function AdminAgents() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      navigate("/portal");
    }
  }, [user, loading]);

  const { data: agents, isLoading } = trpc.portal.listAllAgents.useQuery();
  type Agent = NonNullable<typeof agents>[number];

  return (
    <PortalLayout title="All Agents">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4 text-[#C9A84C]" />
          <span>Admin view — all registered agents</span>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading agents...</div>
            ) : !agents || agents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No agents have set up their profiles yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {agents.map((agent: Agent) => (
                  <div key={agent.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {agent.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0A1628]">{agent.fullName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {agentTypeLabels[agent.agentType] ?? agent.agentType}
                            </Badge>
                            <Badge className={`text-xs ${agent.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {agent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {agent.phone && <p>{agent.phone}</p>}
                        {agent.ffcNumber && <p className="text-[#C9A84C]">FFC: {agent.ffcNumber}</p>}
                        {agent.targetMonthly && (
                          <p className="text-gray-400">Target: R {Number(agent.targetMonthly).toLocaleString()}/mo</p>
                        )}
                      </div>
                    </div>
                    {agent.bio && (
                      <p className="text-xs text-gray-400 mt-2 ml-13 pl-13 truncate italic">"{agent.bio}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
