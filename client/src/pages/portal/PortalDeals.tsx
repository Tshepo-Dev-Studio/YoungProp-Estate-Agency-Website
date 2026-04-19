import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Briefcase, ChevronRight, Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const dealSchema = z.object({
  propertyTitle: z.string().min(2, "Property title required"),
  propertyAddress: z.string().optional(),
  dealType: z.enum(["sale", "rental", "valuation", "referral"]),
  clientName: z.string().min(2, "Client name required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().optional(),
  askingPrice: z.string().optional(),
  notes: z.string().optional(),
});

type DealForm = z.infer<typeof dealSchema>;

const stages = [
  { key: "lead", label: "Lead", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { key: "viewing_scheduled", label: "Viewing", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { key: "offer_made", label: "Offer Made", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { key: "offer_accepted", label: "Offer Accepted", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { key: "conveyancing", label: "Conveyancing", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { key: "transfer", label: "Transfer", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { key: "closed_won", label: "Closed ✓", color: "bg-green-100 text-green-700 border-green-200" },
  { key: "closed_lost", label: "Closed ✗", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function PortalDeals() {
  const [open, setOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [newStage, setNewStage] = useState("");

  const utils = trpc.useUtils();
  const { data: deals, isLoading } = trpc.portal.listMyDeals.useQuery();
  const createDeal = trpc.portal.createDeal.useMutation({
    onSuccess: () => {
      utils.portal.listMyDeals.invalidate();
      utils.portal.getDashboardStats.invalidate();
      setOpen(false);
      toast.success("Deal created successfully!");
    },
    onError: () => toast.error("Failed to create deal"),
  });
  const updateStage = trpc.portal.updateDealStage.useMutation({
    onSuccess: () => {
      utils.portal.listMyDeals.invalidate();
      utils.portal.getDashboardStats.invalidate();
      setSelectedDeal(null);
      toast.success("Deal stage updated!");
    },
    onError: () => toast.error("Failed to update stage"),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DealForm>({
    resolver: zodResolver(dealSchema),
    defaultValues: { dealType: "sale" },
  });

  const onSubmit = (data: DealForm) => {
    createDeal.mutate({
      ...data,
      clientEmail: data.clientEmail || undefined,
      askingPrice: data.askingPrice ? Number(data.askingPrice) : undefined,
    });
    reset();
  };

  const activeDeals = deals?.filter((d) => !["closed_won", "closed_lost"].includes(d.stage)) ?? [];
  const closedDeals = deals?.filter((d) => ["closed_won", "closed_lost"].includes(d.stage)) ?? [];

  return (
    <PortalLayout title="My Deals">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{activeDeals.length} active · {closedDeals.length} closed</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Property Title *</Label>
                    <Input {...register("propertyTitle")} placeholder="e.g. 3-bed house in Midrand" className="mt-1" />
                    {errors.propertyTitle && <p className="text-red-500 text-xs mt-1">{errors.propertyTitle.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label>Property Address</Label>
                    <Input {...register("propertyAddress")} placeholder="Full address" className="mt-1" />
                  </div>
                  <div>
                    <Label>Deal Type *</Label>
                    <Select defaultValue="sale" onValueChange={(v) => setValue("dealType", v as "sale" | "rental" | "valuation" | "referral")}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                        <SelectItem value="valuation">Valuation</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Asking Price (R)</Label>
                    <Input {...register("askingPrice")} type="number" placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <Label>Client Name *</Label>
                    <Input {...register("clientName")} placeholder="Full name" className="mt-1" />
                    {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
                  </div>
                  <div>
                    <Label>Client Phone</Label>
                    <Input {...register("clientPhone")} placeholder="+27 ..." className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Client Email</Label>
                    <Input {...register("clientEmail")} type="email" placeholder="client@email.com" className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <Textarea {...register("notes")} placeholder="Any relevant notes..." className="mt-1" rows={3} />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#0A1628] text-white" disabled={createDeal.isPending}>
                  {createDeal.isPending ? "Creating..." : "Create Deal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Deals */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0A1628]">Active Deals ({activeDeals.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-10 text-gray-400">Loading deals...</div>
            ) : activeDeals.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No active deals. Create your first deal above.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activeDeals.map((deal) => {
                  const stage = stages.find((s) => s.key === deal.stage);
                  return (
                    <div key={deal.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-[#0A1628] truncate">{deal.propertyTitle}</p>
                            <Badge className={`text-xs ${stage?.color ?? ""}`}>{stage?.label ?? deal.stage}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{deal.propertyAddress}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{deal.clientName}</span>
                            {deal.clientPhone && <span>{deal.clientPhone}</span>}
                            {deal.askingPrice && <span className="text-[#C9A84C] font-medium">R {Number(deal.askingPrice).toLocaleString()}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Select
                            value={deal.stage}
                            onValueChange={(stage) => {
                              updateStage.mutate({ dealId: deal.id, stage: stage as typeof deal.stage });
                            }}
                          >
                            <SelectTrigger className="w-40 text-xs h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {stages.map((s) => (
                                <SelectItem key={s.key} value={s.key} className="text-xs">{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Closed Deals */}
        {closedDeals.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0A1628]">Closed Deals ({closedDeals.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {closedDeals.map((deal) => {
                  const stage = stages.find((s) => s.key === deal.stage);
                  return (
                    <div key={deal.id} className="px-5 py-3 opacity-70">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#0A1628]">{deal.propertyTitle}</p>
                          <p className="text-xs text-gray-500">{deal.clientName}</p>
                        </div>
                        <Badge className={`text-xs ${stage?.color ?? ""}`}>{stage?.label ?? deal.stage}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
