import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  HandshakeIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  DollarSign,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function stageToPlainEnglish(stage: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    lead: { label: "Received — Being Reviewed", color: "bg-blue-100 text-blue-800" },
    viewing_scheduled: { label: "In Progress — Viewing Scheduled", color: "bg-yellow-100 text-yellow-800" },
    offer_made: { label: "In Progress — Offer Made", color: "bg-orange-100 text-orange-800" },
    offer_accepted: { label: "In Progress — Offer Accepted", color: "bg-amber-100 text-amber-800" },
    conveyancing: { label: "In Progress — Legal Process", color: "bg-purple-100 text-purple-800" },
    transfer: { label: "In Progress — Transfer Pending", color: "bg-indigo-100 text-indigo-800" },
    closed_won: { label: "Completed — Payment Due", color: "bg-green-100 text-green-800" },
    closed_lost: { label: "Closed — Not Proceeded", color: "bg-gray-100 text-gray-600" },
  };
  return map[stage] ?? { label: stage, color: "bg-gray-100 text-gray-600" };
}

// ─── Referral submission form schema ─────────────────────────────────────────

const referralSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientPhone: z.string().min(7, "Valid phone number required"),
  clientEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  propertyInterest: z.string().optional(),
  notes: z.string().optional(),
  referralType: z.enum(["sale", "rental", "valuation"]),
});
type ReferralFormData = z.infer<typeof referralSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReferralPartnerPortal() {
  const { user } = useAuth();
  const [feeInfoOpen, setFeeInfoOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: myReferrals = [], isLoading: loadingReferrals } =
    trpc.portal.getMyReferrals.useQuery();
  const { data: earnings } = trpc.portal.getReferralEarnings.useQuery();
  const { data: profile } = trpc.portal.getMyReferralPartnerProfile.useQuery();

  const submitReferral = trpc.portal.submitReferral.useMutation({
    onSuccess: () => {
      toast.success("Referral submitted! We'll be in touch shortly.");
      form.reset({ referralType: "sale" });
      utils.portal.getMyReferrals.invalidate();
      utils.portal.getReferralEarnings.invalidate();
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to submit referral. Please try again.");
    },
  });

  const form = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: { referralType: "sale" },
  });

  const onSubmit = (data: ReferralFormData) => {
    submitReferral.mutate({
      ...data,
      clientEmail: data.clientEmail || undefined,
    });
  };

  const inProgress = myReferrals.filter(
    (r) => !["closed_won", "closed_lost"].includes(r.stage)
  ).length;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#0d2040] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <HandshakeIcon className="w-6 h-6 text-[#C9A84C]" />
          <h1 className="text-xl font-bold">Welcome back, {firstName}</h1>
        </div>
        <p className="text-gray-300 text-sm">
          Here is a summary of your referrals with YoungProp Estate Agency.
        </p>
        {profile?.status === "pending" && (
          <div className="mt-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-yellow-200 text-sm">
            Your referral partner account is pending activation. Contact YoungProp to get started.
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-[#0A1628]">
                  {myReferrals.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <HandshakeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Deals in Progress</p>
                <p className="text-3xl font-bold text-[#0A1628]">{inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-[#C9A84C]">
                  {formatZAR(earnings?.total ?? 0)}
                </p>
                {(earnings?.paid ?? 0) > 0 && (
                  <p className="text-xs text-green-600 mt-0.5">
                    {formatZAR(earnings?.paid ?? 0)} paid
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Referrals Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#0A1628]">
            My Referrals
          </CardTitle>
          <CardDescription>
            Track the progress of every client you have referred to YoungProp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingReferrals ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Loading your referrals...
            </div>
          ) : myReferrals.length === 0 ? (
            <div className="py-10 text-center">
              <HandshakeIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No referrals yet. Use the form below to refer your first client.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Client Referred
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Deal Status
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Your Fee
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myReferrals.map((deal) => {
                    const status = stageToPlainEnglish(deal.stage);
                    const fee = Number(deal.referralFeeAmount ?? 0);
                    return (
                      <tr
                        key={deal.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-3 font-medium text-[#0A1628]">
                          {deal.clientName}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {new Date(deal.createdAt).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {deal.showPriceToReferrer && deal.askingPrice
                            ? `${deal.propertyTitle} — ${formatZAR(Number(deal.askingPrice))}`
                            : deal.propertyTitle !== "TBC"
                            ? deal.propertyTitle
                            : "TBC"}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-[#0A1628]">
                          {fee > 0 ? formatZAR(fee) : "—"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {deal.referralFeePaid ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Structure Info (collapsible) */}
      <Card className="border border-[#C9A84C]/20 bg-amber-50/30 shadow-none">
        <CardHeader
          className="pb-2 cursor-pointer"
          onClick={() => setFeeInfoOpen(!feeInfoOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
              <CardTitle className="text-sm font-semibold text-[#0A1628]">
                How Referral Fees Work
              </CardTitle>
            </div>
            {feeInfoOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CardHeader>
        {feeInfoOpen && (
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                YoungProp pays referral fees within <strong>30 days of property transfer</strong>.
                Fees are agreed upon when your referral is accepted.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-semibold text-[#0A1628] text-xs uppercase tracking-wider mb-1">
                    Seller Referral
                  </p>
                  <p className="text-[#C9A84C] font-bold">R2,500 – R5,000</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Paid on successful sale transfer
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-semibold text-[#0A1628] text-xs uppercase tracking-wider mb-1">
                    Buyer Referral
                  </p>
                  <p className="text-[#C9A84C] font-bold">R1,500 – R3,000</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Paid on successful purchase transfer
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="font-semibold text-[#0A1628] text-xs uppercase tracking-wider mb-1">
                    Valuation Referral
                  </p>
                  <p className="text-[#C9A84C] font-bold">R500 – R1,000</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Paid on completed valuation
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Exact fee is confirmed in writing when your referral is accepted. All fees are
                subject to the referral agreement signed with YoungProp.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Refer a New Client — inline form */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#C9A84C]" />
            <CardTitle className="text-base font-semibold text-[#0A1628]">
              Refer Another Client
            </CardTitle>
          </div>
          <CardDescription>
            Know someone looking to buy, sell, or get a property valuation? Submit their
            details below and we'll take it from there.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="clientName">Client Full Name *</Label>
                <Input
                  id="clientName"
                  placeholder="e.g. John Smith"
                  {...form.register("clientName")}
                />
                {form.formState.errors.clientName && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.clientName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientPhone">Client Phone Number *</Label>
                <Input
                  id="clientPhone"
                  placeholder="e.g. 082 123 4567"
                  {...form.register("clientPhone")}
                />
                {form.formState.errors.clientPhone && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.clientPhone.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail">Client Email (optional)</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@email.com"
                  {...form.register("clientEmail")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="referralType">Referral Type *</Label>
                <Select
                  value={form.watch("referralType")}
                  onValueChange={(val) =>
                    form.setValue("referralType", val as "sale" | "rental" | "valuation")
                  }
                >
                  <SelectTrigger id="referralType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Buying or Selling Property</SelectItem>
                    <SelectItem value="rental">Rental Property</SelectItem>
                    <SelectItem value="valuation">Property Valuation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="propertyInterest">Property Interest (optional)</Label>
                <Input
                  id="propertyInterest"
                  placeholder="e.g. 3-bedroom house in Walkerville, or selling property in Meyerton"
                  {...form.register("propertyInterest")}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other details that might help our agents..."
                  rows={3}
                  {...form.register("notes")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                * Required fields. We'll contact you once we've reached out to your referral.
              </p>
              <Button
                type="submit"
                disabled={submitReferral.isPending}
                className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white px-6"
              >
                {submitReferral.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Referral
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
