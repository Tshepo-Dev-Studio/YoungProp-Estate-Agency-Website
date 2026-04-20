import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Shield,
  UserPlus,
  Copy,
  CheckCheck,
  Mail,
  Loader2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { toast } from "sonner";

const agentTypeLabels: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  referral_partner: "Referral Partner",
  intern: "Intern",
};

export default function AdminAgents() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"agent" | "intern" | "admin">("agent");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      navigate("/portal");
    }
  }, [user, loading]);

  const { data: agents, isLoading } = trpc.portal.listAllAgents.useQuery();
  const { data: invites } = trpc.portal.listAgentInvites.useQuery();
  type Agent = NonNullable<typeof agents>[number];

  const createInviteMutation = trpc.portal.createAgentInvite.useMutation({
    onSuccess: (data) => {
      setGeneratedLink(data.inviteUrl);
      toast.success("Invite link generated successfully!");
    },
    onError: (err) => toast.error(err.message ?? "Failed to create invite."),
  });

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const pendingInvites = invites?.filter((i) => !i.used && new Date(i.expiresAt) > new Date()) ?? [];
  const usedInvites = invites?.filter((i) => i.used) ?? [];

  return (
    <PortalLayout title="Agents & Interns">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-[#C9A84C]" />
            <span>Admin view — all registered agents and interns</span>
          </div>
          <Button
            onClick={() => {
              setGeneratedLink(null);
              setInviteEmail("");
              setInviteRole("agent");
              setShowInviteDialog(true);
            }}
            className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white text-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invite Agent
          </Button>
        </div>

        {/* Agents Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#0A1628] text-sm">Active Team Members</h2>
              <Badge className="bg-[#0A1628] text-white text-xs">{agents?.length ?? 0}</Badge>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
              </div>
            ) : !agents || agents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No agents have set up their profiles yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Use the "Invite Agent" button to send your first invite link.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {agents.map((agent: Agent) => (
                  <div key={agent.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {agent.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0A1628]">{agent.fullName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {agentTypeLabels[agent.agentType] ?? agent.agentType}
                            </Badge>
                            <Badge
                              className={`text-xs border-0 ${
                                agent.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {agent.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {agent.phone && <p>{agent.phone}</p>}
                        {agent.ffcNumber && (
                          <p className="text-[#C9A84C]">FFC: {agent.ffcNumber}</p>
                        )}
                        {agent.commissionRate && (
                          <p className="text-gray-400">
                            Commission: {agent.commissionRate}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h2 className="font-semibold text-[#0A1628] text-sm">Pending Invites</h2>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                  {pendingInvites.length}
                </Badge>
              </div>
              <div className="divide-y divide-gray-50">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-[#0A1628]">{invite.email}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {invite.role}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Used Invites */}
        {usedInvites.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h2 className="font-semibold text-[#0A1628] text-sm">Accepted Invites</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {usedInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="px-5 py-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-500">{invite.email}</span>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Accepted
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      {invite.usedAt
                        ? new Date(invite.usedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A1628]">Invite a New Team Member</DialogTitle>
            <DialogDescription>
              Generate a secure invite link. The recipient clicks it, signs in, and sets up their
              portal profile. Links expire after 7 days.
            </DialogDescription>
          </DialogHeader>

          {!generatedLink ? (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="agent@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <select
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as "agent" | "intern" | "admin")
                  }
                  className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
                >
                  <option value="agent">Agent</option>
                  <option value="intern">Intern</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button
                className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white"
                disabled={!inviteEmail.trim() || createInviteMutation.isPending}
                onClick={() =>
                  createInviteMutation.mutate({
                    email: inviteEmail.trim(),
                    role: inviteRole,
                    origin: window.location.origin,
                  })
                }
              >
                {createInviteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...
                  </>
                ) : (
                  "Generate Invite Link"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-800">Invite Link Ready</p>
                <p className="text-xs text-green-600 mt-1">
                  Share this link with the new team member. It expires in 7 days.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 break-all font-mono border border-gray-200">
                {generatedLink}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-white"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4 mr-2" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" /> Copy Link
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedLink(null);
                    setInviteEmail("");
                    setShowInviteDialog(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
