import { useState } from "react";
import { useEffect } from "react";
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
  CreditCard,
  CheckCircle2,
  Clock,
  HandshakeIcon,
  Eye,
  EyeOff,
  Link2,
  Copy,
  CheckCheck,
  Loader2,
} from "lucide-react";

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function stageLabel(stage: string) {
  const map: Record<string, string> = {
    lead: "Lead",
    viewing_scheduled: "Viewing Scheduled",
    offer_made: "Offer Made",
    offer_accepted: "Offer Accepted",
    conveyancing: "Conveyancing",
    transfer: "Transfer",
    closed_won: "Closed — Won",
    closed_lost: "Closed — Lost",
  };
  return map[stage] ?? stage;
}

export default function AdminPayouts() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filterPaid, setFilterPaid] = useState<string>("all");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/portal");
  }, [user, navigate]);

  const { data: payouts = [], isLoading, refetch } =
    trpc.portal.listReferralPayouts.useQuery();
  const { data: partners = [] } = trpc.portal.listAllReferralPartners.useQuery();

  const markFeePaid = trpc.portal.markReferralFeePaid.useMutation({
    onSuccess: () => {
      toast.success("Referral fee status updated.");
      refetch();
    },
    onError: () => toast.error("Failed to update fee status."),
  });

  const generateLinkMutation = trpc.portal.generateReferralPartnerLink.useMutation({
    onSuccess: (data) => {
      setGeneratedLink(data.portalUrl);
      toast.success("Partner portal link generated!");
    },
    onError: (err) => toast.error(err.message ?? "Failed to generate link."),
  });

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePrice = trpc.portal.toggleShowPriceToReferrer.useMutation({
    onSuccess: () => {
      toast.success("Price visibility updated.");
      refetch();
    },
  });

  const filtered = payouts.filter((p) => {
    if (filterPaid === "paid" && !p.referralFeePaid) return false;
    if (filterPaid === "pending" && p.referralFeePaid) return false;
    return true;
  });

  const totalFees = payouts.reduce((sum, p) => sum + Number(p.referralFeeAmount ?? 0), 0);
  const totalPaid = payouts
    .filter((p) => p.referralFeePaid)
    .reduce((sum, p) => sum + Number(p.referralFeeAmount ?? 0), 0);
  const totalPending = totalFees - totalPaid;

  return (
    <PortalLayout title="Referral Payouts">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Referral Fees</p>
                  <p className="text-2xl font-bold text-[#0A1628]">
                    {formatZAR(totalFees)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {payouts.length} referral{payouts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <HandshakeIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fees Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatZAR(totalPaid)}
                  </p>
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
                  <p className="text-sm text-gray-500 mb-1">Fees Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatZAR(totalPending)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Referral Partners */}
        {partners.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0A1628]">
                  Registered Referral Partners ({partners.length})
                </CardTitle>
                <p className="text-xs text-gray-400">Click a partner to generate their portal link</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer border border-transparent hover:border-[#C9A84C]/30"
                    onClick={() => {
                      setSelectedPartnerId(p.id);
                      setGeneratedLink(null);
                      setShowLinkDialog(true);
                    }}
                  >
                    <div className="w-9 h-9 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {p.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#0A1628] text-sm truncate">
                        {p.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{p.email ?? p.phone}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        className={`text-xs flex-shrink-0 ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700 border-0"
                            : p.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 border-0"
                            : "bg-gray-100 text-gray-600 border-0"
                        }`}
                      >
                        {p.status}
                      </Badge>
                      <Link2 className="w-3.5 h-3.5 text-[#C9A84C]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payouts Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-semibold text-[#0A1628]">
                  Referral Fee Payouts
                </CardTitle>
                <CardDescription>
                  Manage referral fee payments. Toggle price visibility for each deal.
                </CardDescription>
              </div>
              <select
                value={filterPaid}
                onChange={(e) => setFilterPaid(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Loading payout data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No referral payouts found. Link deals to referral partners to track fees here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Referral Partner
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Client / Property
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Deal Stage
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Show Price
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
                          <p className="font-medium text-[#0A1628]">
                            {deal.referralPartnerName}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-700">{deal.clientName}</p>
                          <p className="text-xs text-gray-400">{deal.propertyTitle}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-gray-600">
                            {stageLabel(deal.stage)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[#0A1628]">
                          {deal.referralFeeAmount
                            ? formatZAR(Number(deal.referralFeeAmount))
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              togglePrice.mutate({
                                dealId: deal.id,
                                show: !deal.showPriceToReferrer,
                              })
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              deal.showPriceToReferrer
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                            title={
                              deal.showPriceToReferrer
                                ? "Price visible to partner"
                                : "Price hidden from partner"
                            }
                          >
                            {deal.showPriceToReferrer ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {deal.referralFeePaid ? (
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
                            disabled={markFeePaid.isPending}
                            onClick={() =>
                              markFeePaid.mutate({
                                dealId: deal.id,
                                paid: !deal.referralFeePaid,
                              })
                            }
                            className={`text-xs h-7 px-3 ${
                              deal.referralFeePaid
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {deal.referralFeePaid ? "Mark Unpaid" : "Mark Paid"}
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
      {/* Generate Partner Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A1628]">
              Generate Referral Partner Portal Link
            </DialogTitle>
            <DialogDescription>
              This creates a unique, shareable link for the partner to access their personalised
              referral portal. They sign in with their Manus account and the link grants them
              access to their referral history and submission form.
            </DialogDescription>
          </DialogHeader>

          {!generatedLink ? (
            <div className="space-y-4 mt-2">
              {selectedPartnerId && (() => {
                const partner = partners.find((p) => p.id === selectedPartnerId);
                if (!partner) return null;
                return (
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {partner.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#0A1628] text-sm">{partner.fullName}</p>
                      <p className="text-xs text-gray-500">{partner.email ?? partner.phone}</p>
                    </div>
                  </div>
                );
              })()}
              <Button
                className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white"
                disabled={!selectedPartnerId || generateLinkMutation.isPending}
                onClick={() => {
                  const partner = partners.find((p) => p.id === selectedPartnerId);
                  if (!partner) return;
                  generateLinkMutation.mutate({
                    partnerId: partner.id,
                    partnerName: partner.fullName,
                    partnerEmail: partner.email ?? undefined,
                    origin: window.location.origin,
                  });
                }}
              >
                {generateLinkMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</>
                ) : (
                  <><Link2 className="w-4 h-4 mr-2" /> Generate Portal Link</>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-800">Portal Link Ready</p>
                <p className="text-xs text-green-600 mt-1">
                  Share this link with the referral partner. It remains active until you deactivate it.
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
                    <><CheckCheck className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Link</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedLink(null);
                    setShowLinkDialog(false);
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
