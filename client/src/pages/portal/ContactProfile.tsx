import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Phone, Mail, Home, Calendar, FileText, Clock, User, TrendingUp, CheckCircle } from "lucide-react";

const STAGES_BY_TYPE: Record<string, string[]> = {
  buyer: ["General", "App Set", "Seen", "Follow-Up", "Signed", "Cancelled"],
  seller: ["General", "Evaluation", "Mandate Signed", "Seeking Buyers", "Buyer Found", "Cancelled"],
  tenant: ["General", "App Set", "Seen", "Application", "Approved", "Active Tenant", "Cancelled"],
  landlord: ["General", "Evaluation", "Mandate Signed", "Seeking Tenants", "Tenant Found", "Active Lease", "Cancelled"],
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  intro_inquiry: "Intro / Inquiry",
  transcript_log: "Transcript Log",
  transcript_summary: "Transcript Summary",
  custom_notes: "Custom Notes",
};

export default function ContactProfile() {
  const [, params] = useRoute("/portal/contacts/:id");
  const [, navigate] = useLocation();
  const contactId = parseInt(params?.id ?? "0");
  
  const [noteType, setNoteType] = useState<"intro_inquiry" | "transcript_log" | "transcript_summary" | "custom_notes">("custom_notes");
  const [noteContent, setNoteContent] = useState("");
  const [stageNote, setStageNote] = useState("");

  const { data, refetch, isLoading } = trpc.contacts.getById.useQuery(
    { id: contactId },
    { enabled: contactId > 0 }
  );

  const updateStage = trpc.contacts.updateStage.useMutation({
    onSuccess: () => { toast.success("Stage updated"); refetch(); setStageNote(""); },
    onError: (err) => toast.error(err.message),
  });

  const addNote = trpc.contacts.addNote.useMutation({
    onSuccess: () => { toast.success("Note added"); refetch(); setNoteContent(""); },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-48" />
          <div className="h-64 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>Contact not found.</p>
        <Button variant="outline" className="mt-4 border-slate-600 text-slate-300" onClick={() => navigate("/portal/contacts")}>
          Back to Contacts
        </Button>
      </div>
    );
  }

  const { contact, notes, history } = data;
  const stages = STAGES_BY_TYPE[contact.contactType] ?? [];
  const stageIdx = stages.indexOf(contact.currentStage);

  return (
    <div className="p-6 space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/portal/contacts")} className="text-slate-400 hover:text-white mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{contact.fullName}</h1>
            <Badge className="capitalize bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {contact.contactType}
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {contact.currentStage}
            </Badge>
          </div>
          {contact.source && (
            <p className="text-slate-400 text-sm mt-1">Source: {contact.source}</p>
          )}
        </div>
      </div>

      {/* Stage progress bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {stages.map((stage, idx) => (
              <div key={stage} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    if (stage !== contact.currentStage) {
                      updateStage.mutate({ contactId: contact.id, newStage: stage });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    idx < stageIdx
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : idx === stageIdx
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-700 text-slate-400 border border-slate-600 hover:border-slate-500"
                  }`}
                >
                  {idx < stageIdx && <CheckCircle className="w-3 h-3" />}
                  {stage}
                </button>
                {idx < stages.length - 1 && <ArrowLeft className="w-3 h-3 text-slate-600 rotate-180" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact details */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {contact.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <a href={`tel:${contact.phone}`} className="hover:text-amber-400">{contact.phone}</a>
                </div>
              )}
              {contact.mobile && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <a href={`tel:${contact.mobile}`} className="hover:text-amber-400">{contact.mobile}</a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <a href={`mailto:${contact.email}`} className="hover:text-amber-400 truncate">{contact.email}</a>
                </div>
              )}
              {contact.idNumber && (
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>ID: {contact.idNumber}</span>
                </div>
              )}
              {contact.budget && (
                <div className="flex items-center gap-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span>Budget: {contact.budget}</span>
                </div>
              )}
              {contact.propertyAddress && (
                <div className="flex items-start gap-2 text-slate-300">
                  <Home className="w-4 h-4 text-slate-500 mt-0.5" />
                  <span>{contact.propertyAddress}</span>
                </div>
              )}
              {contact.areaOfInterest && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Area: {contact.areaOfInterest}</span>
                </div>
              )}
              {contact.popiaConsent && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  <span>POPIA Consent Given</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">
                <div>Added: {new Date(contact.createdAt).toLocaleDateString("en-ZA")}</div>
                {contact.lastContactedDate && (
                  <div>Last contact: {new Date(contact.lastContactedDate).toLocaleDateString("en-ZA")}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Update stage with note */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Move to Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select onValueChange={(val) => updateStage.mutate({ contactId: contact.id, newStage: val, notes: stageNote })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select new stage..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {stages.filter(s => s !== contact.currentStage).map(s => (
                    <SelectItem key={s} value={s} className="text-white">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={stageNote}
                onChange={e => setStageNote(e.target.value)}
                placeholder="Optional note about this stage change..."
                className="bg-slate-700 border-slate-600 text-white text-sm"
                rows={2}
              />
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Add Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={noteType} onValueChange={(v) => setNoteType(v as typeof noteType)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {Object.entries(NOTE_TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val} className="text-white">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
              <Button
                onClick={() => addNote.mutate({ contactId: contact.id, noteType, noteContent })}
                disabled={!noteContent.trim() || addNote.isPending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              >
                {addNote.isPending ? "Saving..." : "Save Note"}
              </Button>
            </CardContent>
          </Card>

          {/* Notes list */}
          <div className="space-y-2">
            {notes.map((note: any) => (
              <Card key={note.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(note.createdAt).toLocaleDateString("en-ZA")}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{note.noteContent}</p>
                  {note.author && <p className="text-xs text-slate-500 mt-1">— {note.author}</p>}
                </CardContent>
              </Card>
            ))}
            {notes.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No notes yet</p>
            )}
          </div>
        </div>

        {/* Stage history */}
        <div>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Stage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((h: any) => (
                  <div key={h.id} className="flex gap-3 text-sm">
                    <div className="w-1 bg-amber-500/30 rounded-full flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-slate-300">
                        {h.fromStage ? (
                          <span><span className="text-slate-500">{h.fromStage}</span> → <span className="text-amber-400">{h.toStage}</span></span>
                        ) : (
                          <span className="text-amber-400">Created at {h.toStage}</span>
                        )}
                      </div>
                      {h.notes && <p className="text-slate-500 text-xs mt-0.5">{h.notes}</p>}
                      <p className="text-slate-600 text-xs">{new Date(h.changedAt).toLocaleDateString("en-ZA")}</p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No history yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
