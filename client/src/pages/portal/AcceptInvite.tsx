import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, Home } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [ffcNumber, setFfcNumber] = useState("");
  const [accepted, setAccepted] = useState(false);

  const { data: invite, isLoading: validating } = trpc.portal.validateInviteToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token && isAuthenticated, retry: false }
  );

  const acceptMutation = trpc.portal.acceptInvite.useMutation({
    onSuccess: () => {
      setAccepted(true);
      setTimeout(() => navigate("/portal"), 2500);
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to accept invite. Please try again.");
    },
  });

  // Loading auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  // Not logged in — prompt sign in first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-14 h-14 bg-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">YP</span>
            </div>
            <CardTitle className="text-[#0A1628]">You've Been Invited</CardTitle>
            <CardDescription>
              Sign in with your Manus account to accept this invitation and set up your YoungProp portal access.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <a href={getLoginUrl()}>
              <Button className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white">
                Sign In to Accept Invite
              </Button>
            </a>
            <div className="mt-4 text-center">
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

  // Validating token
  if (validating) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin mx-auto mb-3" />
          <p className="text-white/70 text-sm">Validating your invite...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!invite || !invite.valid) {
    const reason =
      (invite as { valid: false; reason?: string } | null)?.reason === "already_used"
        ? "This invite link has already been used."
        : (invite as { valid: false; reason?: string } | null)?.reason === "expired"
        ? "This invite link has expired. Please ask your manager to send a new one."
        : "This invite link is invalid or does not exist.";
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#0A1628] mb-2">Invalid Invite Link</h2>
            <p className="text-gray-500 text-sm mb-6">{reason}</p>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Website</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accepted successfully
  if (accepted) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#0A1628] mb-2">Welcome to YoungProp!</h2>
            <p className="text-gray-500 text-sm mb-2">
              Your portal account has been set up successfully.
            </p>
            <p className="text-gray-400 text-xs">Redirecting you to your portal...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleLabel =
    invite.role === "intern" ? "Intern" : invite.role === "admin" ? "Admin" : "Agent";
  const roleColor =
    invite.role === "intern"
      ? "bg-blue-100 text-blue-700"
      : invite.role === "admin"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-14 h-14 bg-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">YP</span>
          </div>
          <CardTitle className="text-[#0A1628] text-xl">Complete Your Profile</CardTitle>
          <CardDescription className="mt-1">
            You've been invited to join YoungProp as{" "}
            <Badge className={`${roleColor} border-0 text-xs`}>{roleLabel}</Badge>
          </CardDescription>
          {invite.email && (
            <p className="text-xs text-gray-400 mt-1">Invite sent to: {invite.email}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Thabo Nkosi"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 82 000 0000"
              className="mt-1"
            />
          </div>
          {invite.role !== "intern" && (
            <div>
              <Label htmlFor="ffcNumber" className="text-sm font-medium text-gray-700">
                FFC Number{" "}
                <span className="text-gray-400 font-normal text-xs">(Fidelity Fund Certificate)</span>
              </Label>
              <Input
                id="ffcNumber"
                value={ffcNumber}
                onChange={(e) => setFfcNumber(e.target.value)}
                placeholder="FFC-XXXXXXXX"
                className="mt-1"
              />
            </div>
          )}
          <Button
            className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white mt-2"
            disabled={!fullName.trim() || acceptMutation.isPending}
            onClick={() =>
              acceptMutation.mutate({
                token: token ?? "",
                fullName: fullName.trim(),
                phone: phone || undefined,
                ffcNumber: ffcNumber || undefined,
              })
            }
          >
            {acceptMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Setting up your account...
              </>
            ) : (
              "Complete Setup & Enter Portal"
            )}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            By completing setup, you agree to YoungProp's terms and policies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
