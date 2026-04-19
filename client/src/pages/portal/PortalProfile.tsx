import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { User, Award, Target } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().optional(),
  agentType: z.enum(["full_time", "part_time", "referral_partner", "intern"]),
  ffcNumber: z.string().optional(),
  bio: z.string().optional(),
  targetMonthly: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function PortalProfile() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.portal.getMyProfile.useQuery();
  const upsert = trpc.portal.upsertProfile.useMutation({
    onSuccess: () => {
      utils.portal.getMyProfile.invalidate();
      toast.success("Profile saved successfully!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { agentType: "full_time" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phone: profile.phone ?? "",
        agentType: (profile.agentType as ProfileForm["agentType"]) ?? "full_time",
        ffcNumber: profile.ffcNumber ?? "",
        bio: profile.bio ?? "",
        targetMonthly: profile.targetMonthly?.toString() ?? "",
      });
    } else if (user?.name) {
      setValue("fullName", user.name);
    }
  }, [profile, user]);

  const onSubmit = (data: ProfileForm) => {
    upsert.mutate({
      ...data,
      targetMonthly: data.targetMonthly ? Number(data.targetMonthly) : undefined,
    });
  };

  return (
    <PortalLayout title="My Profile">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Account Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0A1628] flex items-center gap-2">
              <User className="w-4 h-4 text-[#C9A84C]" /> Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "YP"}
              </div>
              <div>
                <p className="font-medium text-[#0A1628]">{user?.name ?? "—"}</p>
                <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Profile Form */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0A1628] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C9A84C]" /> Agent Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading profile...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Full Name *</Label>
                    <Input {...register("fullName")} className="mt-1" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Phone Number</Label>
                    <Input {...register("phone")} placeholder="+27 ..." className="mt-1" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label>Agent Type</Label>
                    <Select
                      defaultValue="full_time"
                      value={profile?.agentType ?? undefined}
                      onValueChange={(v) => setValue("agentType", v as ProfileForm["agentType"])}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full-Time Agent</SelectItem>
                        <SelectItem value="part_time">Part-Time Agent</SelectItem>
                        <SelectItem value="referral_partner">Referral Partner</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label>FFC Number (PPRA)</Label>
                    <Input {...register("ffcNumber")} placeholder="Fidelity Fund Certificate #" className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Bio / About Me</Label>
                    <Textarea {...register("bio")} placeholder="Brief description for your agent profile..." className="mt-1" rows={3} />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-[#C9A84C]" />
                    <Label className="text-sm font-semibold">Monthly Target</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">R</span>
                    <Input {...register("targetMonthly")} type="number" placeholder="e.g. 50000" className="max-w-40" />
                    <span className="text-gray-500 text-sm">per month</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#0A1628] text-white hover:bg-[#0A1628]/90" disabled={upsert.isPending}>
                  {upsert.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
