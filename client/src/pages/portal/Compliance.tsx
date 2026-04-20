import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShieldCheck, Plus, AlertTriangle, CheckCircle2, Clock, FileText, Calendar } from "lucide-react";

const DOC_TYPES = [
  "FFC Certificate", "EAAB Registration", "PI Insurance", "POPIA Compliance",
  "FICA Policy", "Employment Contract", "NDA", "Mandate Agreement",
  "Sale Agreement Template", "Rental Agreement Template", "Other"
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  valid: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: <CheckCircle2 className="w-4 h-4" /> },
  expiring_soon: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="w-4 h-4" /> },
  expired: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <AlertTriangle className="w-4 h-4" /> },
  pending: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Clock className="w-4 h-4" /> },
};

export default function Compliance() {
  const [showDialog, setShowDialog] = useState(false);
  const [docType, setDocType] = useState("");
  const [status, setStatus] = useState<"valid" | "expiring_soon" | "expired" | "pending">("valid");

  const { data: docs, refetch } = trpc.ceo.getComplianceDocs.useQuery(undefined, { refetchOnWindowFocus: false });

  const addDoc = trpc.ceo.addComplianceDoc.useMutation({
    onSuccess: () => { toast.success("Document added"); setShowDialog(false); refetch(); },
    onError: (err: any) => toast.error(err.message),
  });

  const valid = (docs ?? []).filter((d: any) => d.status === "valid").length;
  const expiring = (docs ?? []).filter((d: any) => d.status === "expiring_soon").length;
  const expired = (docs ?? []).filter((d: any) => d.status === "expired").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance</h1>
          <p className="text-slate-400 text-sm mt-1">Regulatory documents, FFC certificates, and POPIA compliance</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader><DialogTitle>Add Compliance Document</DialogTitle></DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addDoc.mutate({
                documentName: fd.get("documentName") as string,
                documentType: docType,
                status,
                expiryDate: fd.get("expiryDate") as string || undefined,
                notes: fd.get("notes") as string || undefined,
                holderName: fd.get("holderName") as string || undefined,
              });
            }} className="space-y-4">
              <div>
                <Label>Document Name *</Label>
                <Input name="documentName" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. John Smith FFC Certificate 2026" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Document Type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {DOC_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {Object.keys(STATUS_CONFIG).map(s => <SelectItem key={s} value={s} className="text-white capitalize">{s.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Holder Name</Label>
                  <Input name="holderName" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="Agent or company name" />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input name="expiryDate" type="date" className="bg-slate-700 border-slate-600 text-white mt-1" />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" className="bg-slate-700 border-slate-600 text-white mt-1" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1 border-slate-600 text-slate-300" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" disabled={addDoc.isPending}>
                  {addDoc.isPending ? "Saving..." : "Add Document"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{valid}</p>
              <p className="text-green-400 text-xs">Valid</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-5 h-5 text-amber-400" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{expiring}</p>
              <p className="text-amber-400 text-xs">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{expired}</p>
              <p className="text-red-400 text-xs">Expired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents list */}
      {(docs ?? []).length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No compliance documents yet</p>
          <p className="text-sm mt-1">Add FFC certificates, EAAB registrations, and other compliance documents</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(docs ?? []).map((doc: any) => {
            const cfg = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.pending;
            const daysUntilExpiry = doc.expiryDate
              ? Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;
            return (
              <Card key={doc.id} className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-slate-700 flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{doc.documentName}</p>
                      <Badge className={`text-xs border ${cfg.color} flex items-center gap-1`}>
                        {cfg.icon} {doc.status?.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {doc.documentType && <span className="text-slate-400 text-xs">{doc.documentType}</span>}
                      {doc.holderName && <span className="text-slate-500 text-xs">· {doc.holderName}</span>}
                      {doc.expiryDate && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span className={daysUntilExpiry !== null && daysUntilExpiry < 30 ? "text-amber-400" : "text-slate-500"}>
                            Expires {new Date(doc.expiryDate).toLocaleDateString("en-ZA")}
                            {daysUntilExpiry !== null && daysUntilExpiry > 0 && ` (${daysUntilExpiry}d)`}
                          </span>
                        </div>
                      )}
                    </div>
                    {doc.notes && <p className="text-slate-500 text-xs mt-1">{doc.notes}</p>}
                  </div>
                  {doc.documentUrl && (
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white flex-shrink-0" onClick={() => window.open(doc.documentUrl, "_blank")}>
                      View
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
