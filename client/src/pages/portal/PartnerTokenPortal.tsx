import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Home,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const STAGE_LABELS: Record<string, string> = {
  lead: "New Lead",
  viewing_scheduled: "Viewing Scheduled",
  offer_made: "Offer Made",
  offer_accepted: "Offer Accepted",
  conveyancing: "Conveyancing",
  transfer: "Transfer",
  closed_won: "Closed",
  closed_lost: "Unsuccessful",
};

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-blue-100 text-blue-700",
  viewing_scheduled: "bg-purple-100 text-purple-700",
  offer_made: "bg-amber-100 text-amber-700",
  offer_accepted: "bg-orange-100 text-orange-700",
  conveyancing: "bg-indigo-100 text-indigo-700",
  transfer: "bg-teal-100 text-teal-700",
  closed_won: "bg-green-100 text-green-700",
  closed_lost: "bg-red-100 text-red-700",
};

export default function PartnerTokenPortal() {
  const { token } = useParams<{ token: string }>();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Referral form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [propertyInterest, setPropertyInterest] = useState("");
  const [notes, setNotes] = useState("");
  const [referralType, setReferralType] = useState<"sale" | "rental" | "valuation">("sale");
  const [submitted, setSubmitted] = useState(false);

  const { data: tokenData, isLoading: validating } = trpc.portal.validatePartnerToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token && isAuthenticated, retry: false }
  );

  const { data: referrals, isLoading: loadingReferrals } = trpc.portal.getMyReferrals.useQuery(
    undefined,
    { enabled: !!tokenData && (tokenData as { valid: boolean }).valid && isAuthenticated }
  );

  const { data: earnings } = trpc.portal.getReferralEarnings.useQuery(
    undefined,
    { enabled: !!tokenData && (tokenData as { valid: boolean }).valid && isAuthenticated }
  );

  const submitMutation = trpc.portal.submitReferral.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setPropertyInterest("");
      setNotes("");
      toast.success("Referral submitted successfully! We'll be in touch shortly.");
      setTimeout(() => setSubmitted(false), 4000);
    },
    onError: (err) => toast.error(err.message ?? "Submission failed. Please try again."),
  });

  if (loading || validating) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <div className="w-14 h-14 bg-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">YP</span>
            </div>
            <h2 className="text-xl font-bold text-[#0A1628] mb-2">Referral Partner Portal</h2>
            <p className="text-gray-500 text-sm mb-6">
              Sign in to access your personalised referral portal.
            </p>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white">
                Sign In
              </Button>
            </a>
            <div className="mt-4">
              <Link href="/">
                <a className="text-sm text-gray-400 hover:text-[#C9A84C] flex items-center justify-center gap-1">
                  <Home className="w-3 h-3" /> Back to Website
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenData || !(tokenData as { valid: boolean }).valid) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#0A1628] mb-2">Invalid Portal Link</h2>
            <p className="text-gray-500 text-sm mb-6">
              This referral portal link is no longer active. Please contact YoungProp to get a new link.
            </p>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Website</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const td = tokenData as { valid: true; partnerName: string; partnerEmail?: string };
  const partnerInitials = td.partnerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const totalEarnings = earnings?.total ?? 0;
  const paidEarnings = earnings?.paid ?? 0;
  const pendingEarnings = earnings?.pending ?? 0;
  const totalReferrals = earnings?.count ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0A1628] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              YP
            </div>
            <div>
              <div className="text-white font-semibold text-sm">YoungProp</div>
              <div className="text-[#C9A84C] text-xs">Referral Partner Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-white text-xs font-bold">
                {partnerInitials}
              </div>
              <span className="text-white text-sm hidden sm:block">{td.partnerName}</span>
            </div>
            <Link href="/">
              <a className="text-gray-400 hover:text-white text-xs flex items-center gap-1">
                <Home className="w-3 h-3" /> Website
              </a>
            </Link>
            <button
              onClick={() => logout()}
              className="text-gray-400 hover:text-red-400 text-xs flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2f50] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {td.partnerName.split(" ")[0]}
          </h1>
          <p className="text-gray-300 text-sm">
            Track your referrals and earnings — all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Referrals", value: totalReferrals, icon: TrendingUp, color: "text-blue-600" },
            { label: "Total Earned", value: `R ${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-[#C9A84C]" },
            { label: "Paid Out", value: `R ${paidEarnings.toLocaleString()}`, icon: CheckCircle2, color: "text-green-600" },
            { label: "Pending", value: `R ${pendingEarnings.toLocaleString()}`, icon: Clock, color: "text-amber-600" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-xl font-bold text-[#0A1628]">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Referral History */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-[#0A1628]">My Referrals</h2>
              <Badge className="bg-[#0A1628] text-white text-xs">{totalReferrals} total</Badge>
            </div>
            {loadingReferrals ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
              </div>
            ) : !referrals || referrals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No referrals yet</p>
                <p className="text-xs mt-1">Submit your first referral below to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Client</th>
                      <th className="text-left px-5 py-3 font-medium">Type</th>
                      <th className="text-left px-5 py-3 font-medium">Stage</th>
                      <th className="text-left px-5 py-3 font-medium">Referral Fee</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-left px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {referrals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-[#0A1628]">{deal.clientName}</td>
                        <td className="px-5 py-3.5 capitalize text-gray-600">{deal.dealType}</td>
                        <td className="px-5 py-3.5">
                          <Badge className={`${STAGE_COLORS[deal.stage] ?? "bg-gray-100 text-gray-600"} border-0 text-xs`}>
                            {STAGE_LABELS[deal.stage] ?? deal.stage}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-gray-700">
                          {deal.referralFeeAmount
                            ? `R ${Number(deal.referralFeeAmount).toLocaleString()}`
                            : "TBC"}
                        </td>
                        <td className="px-5 py-3.5">
                          {deal.referralFeePaid ? (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Paid</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Pending</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                          {new Date(deal.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="font-semibold text-[#0A1628]">How Referral Fees Work</h2>
              {showHowItWorks ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showHowItWorks && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      step: "1",
                      title: "Submit a Referral",
                      desc: "Fill in the client's contact details and what they're looking for. We'll take it from there.",
                    },
                    {
                      step: "2",
                      title: "We Work the Deal",
                      desc: "Our agents contact your referral and guide them through the process. You can track progress here.",
                    },
                    {
                      step: "3",
                      title: "You Get Paid",
                      desc: "Once the deal closes, your referral fee is processed and paid directly to your bank account.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-[#0A1628] text-sm">{item.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Standard Referral Fees</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { type: "Sale", fee: "R 2,500" },
                      { type: "Rental", fee: "R 1,500" },
                      { type: "Valuation", fee: "R 500" },
                    ].map((f) => (
                      <div key={f.type} className="bg-white rounded-lg p-2 border border-amber-100">
                        <div className="text-sm font-bold text-[#0A1628]">{f.fee}</div>
                        <div className="text-xs text-gray-500">{f.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Referral */}
        <Card className="shadow-sm border-[#C9A84C]/30">
          <CardContent className="p-0">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#C9A84C]" />
                <h2 className="font-semibold text-[#0A1628]">Submit a New Referral</h2>
              </div>
              {showForm ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showForm && (
              <div className="px-5 pb-5 border-t border-gray-100">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-[#0A1628]">Referral Submitted!</p>
                    <p className="text-gray-500 text-sm mt-1">
                      We'll contact your client within 24 hours.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Client Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Sipho Dlamini"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Client Phone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+27 82 000 0000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Client Email</Label>
                        <Input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Referral Type</Label>
                        <select
                          value={referralType}
                          onChange={(e) => setReferralType(e.target.value as "sale" | "rental" | "valuation")}
                          className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
                        >
                          <option value="sale">Property Sale</option>
                          <option value="rental">Rental</option>
                          <option value="valuation">Valuation</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Property Interest</Label>
                      <Input
                        value={propertyInterest}
                        onChange={(e) => setPropertyInterest(e.target.value)}
                        placeholder="e.g. 3-bedroom house in Sandton, budget R1.5M"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Additional Notes</Label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any other details about the client or their requirements..."
                        rows={3}
                        className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none"
                      />
                    </div>
                    <Button
                      className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-white"
                      disabled={!clientName.trim() || !clientPhone.trim() || submitMutation.isPending}
                      onClick={() =>
                        submitMutation.mutate({
                          clientName: clientName.trim(),
                          clientPhone: clientPhone.trim(),
                          clientEmail: clientEmail || undefined,
                          propertyInterest: propertyInterest || undefined,
                          notes: notes || undefined,
                          referralType,
                        })
                      }
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Submit Referral
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1628] mt-8 py-6 px-6 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} YoungProp Estate Agency · Referral Partner Portal
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Questions? Contact us at{" "}
          <a href="mailto:info@youngprop.co.za" className="text-[#C9A84C] hover:underline">
            info@youngprop.co.za
          </a>
        </p>
      </footer>
    </div>
  );
}
