import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Search, User, Phone, Mail, Home, TrendingUp, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

type ContactType = "buyer" | "seller" | "tenant" | "landlord";

const TYPE_LABELS: Record<ContactType, string> = {
  buyer: "Buyers",
  seller: "Sellers",
  tenant: "Tenants",
  landlord: "Landlords",
};

const TYPE_COLORS: Record<ContactType, string> = {
  buyer: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  seller: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  tenant: "bg-green-500/10 text-green-400 border-green-500/20",
  landlord: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const STAGE_COLORS = [
  "border-l-slate-400",
  "border-l-blue-400",
  "border-l-amber-400",
  "border-l-orange-400",
  "border-l-green-400",
  "border-l-red-400",
];

export default function Contacts() {
  const [activeType, setActiveType] = useState<ContactType>("buyer");
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [, navigate] = useLocation();
  const { data: pipeline, refetch } = trpc.contacts.getPipelineSummary.useQuery(
    { contactType: activeType },
    { refetchOnWindowFocus: false }
  );

  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("Contact added — new contact has been created.");
      setShowAddDialog(false);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createContact.mutate({
      fullName: fd.get("fullName") as string,
      phone: fd.get("phone") as string || undefined,
      email: fd.get("email") as string || undefined,
      contactType: activeType,
      source: fd.get("source") as string || undefined,
      budget: fd.get("budget") as string || undefined,
      propertyAddress: fd.get("propertyAddress") as string || undefined,
      initialNote: fd.get("initialNote") as string || undefined,
    });
  };

  const totalContacts = pipeline?.total ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM Contacts</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your buyers, sellers, tenants, and landlords</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New {TYPE_LABELS[activeType].slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Full Name *</Label>
                  <Input name="fullName" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. Sipho Dlamini" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input name="phone" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="0XX XXX XXXX" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="email@example.com" />
                </div>
                <div>
                  <Label>Source</Label>
                  <Select name="source">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="How did they find us?" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {["Referral", "Property24", "Website", "Walk-in", "Social Media", "Cold Call", "Other"].map(s => (
                        <SelectItem key={s} value={s} className="text-white">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(activeType === "buyer" || activeType === "tenant") && (
                  <div>
                    <Label>Budget</Label>
                    <Input name="budget" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. R1.5M - R2M" />
                  </div>
                )}
                {(activeType === "seller" || activeType === "landlord") && (
                  <div className="col-span-2">
                    <Label>Property Address</Label>
                    <Input name="propertyAddress" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="Full property address" />
                  </div>
                )}
                <div className="col-span-2">
                  <Label>Initial Note</Label>
                  <Textarea name="initialNote" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="First contact notes, requirements, etc." rows={3} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 border-slate-600 text-slate-300">Cancel</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" disabled={createContact.isPending}>
                  {createContact.isPending ? "Adding..." : "Add Contact"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(TYPE_LABELS) as ContactType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeType === type
                ? TYPE_COLORS[type] + " border"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Search + summary */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${TYPE_LABELS[activeType].toLowerCase()}...`}
            className="pl-9 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <span className="text-slate-400 text-sm">{totalContacts} total {TYPE_LABELS[activeType].toLowerCase()}</span>
      </div>

      {/* Pipeline Kanban */}
      {pipeline ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipeline.stages.map((stageData, idx) => {
            const filtered = search
              ? stageData.contacts.filter((c: any) =>
                  c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                  c.phone?.includes(search) ||
                  c.email?.toLowerCase().includes(search.toLowerCase())
                )
              : stageData.contacts;

            return (
              <div key={stageData.stage} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">{stageData.stage}</h3>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {filtered.length}
                  </Badge>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {filtered.map((contact: any) => (
                    <Card
                      key={contact.id}
                      className={`bg-slate-800 border-slate-700 border-l-4 ${STAGE_COLORS[idx % STAGE_COLORS.length]} cursor-pointer hover:border-slate-500 transition-all`}
                      onClick={() => navigate(`/portal/contacts/${contact.id}`)}
                    >
                      <CardContent className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium truncate">{contact.fullName}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Phone className="w-3 h-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.budget && (
                          <div className="flex items-center gap-1 text-xs text-amber-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>{contact.budget}</span>
                          </div>
                        )}
                        {contact.propertyAddress && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Home className="w-3 h-3" />
                            <span className="truncate">{contact.propertyAddress}</span>
                          </div>
                        )}
                        {contact.source && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-500 mt-1">
                            {contact.source}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {filtered.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-slate-600 text-xs border border-dashed border-slate-700 rounded-lg">
                      No contacts
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}
