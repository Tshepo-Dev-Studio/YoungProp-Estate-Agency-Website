import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Phone, Mail, Calendar, Filter } from "lucide-react";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-purple-100 text-purple-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const leadTypeLabels: Record<string, string> = {
  property_inquiry: "Property Inquiry",
  valuation: "Valuation",
  contact: "Contact",
  join_us: "Join Us",
  referral: "Referral",
};

export default function PortalLeads() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const utils = trpc.useUtils();
  const { data: leads, isLoading } = trpc.portal.listLeads.useQuery();
  const updateLead = trpc.portal.updateLeadStatus.useMutation({
    onSuccess: () => {
      utils.portal.listLeads.invalidate();
      utils.portal.getDashboardStats.invalidate();
      toast.success("Lead status updated");
    },
  });

  const filtered = leads?.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (typeFilter !== "all" && l.leadType !== typeFilter) return false;
    return true;
  }) ?? [];

  const newCount = leads?.filter((l) => l.status === "new").length ?? 0;

  return (
    <PortalLayout title="Leads">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["new", "contacted", "qualified", "converted"].map((status) => {
            const count = leads?.filter((l) => l.status === status).length ?? 0;
            return (
              <Card key={status} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-[#0A1628]">{count}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">{status}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex flex-wrap gap-3 items-center">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue placeholder="Lead Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="property_inquiry">Property Inquiry</SelectItem>
                <SelectItem value="valuation">Valuation</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="join_us">Join Us</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
            {(statusFilter !== "all" || typeFilter !== "all") && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setStatusFilter("all"); setTypeFilter("all"); }}>
                Clear filters
              </Button>
            )}
            <span className="ml-auto text-sm text-gray-500">{filtered.length} leads</span>
          </CardContent>
        </Card>

        {/* Leads List */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading leads...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No leads found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((lead) => (
                  <div key={lead.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-[#0A1628]">{lead.name}</p>
                          <Badge className={`text-xs ${statusColors[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {lead.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {leadTypeLabels[lead.leadType] ?? lead.leadType}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-[#C9A84C]">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-[#C9A84C]">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </a>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {lead.message && (
                          <p className="text-xs text-gray-400 mt-1.5 italic truncate">"{lead.message}"</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Select
                          value={lead.status}
                          onValueChange={(status) => updateLead.mutate({ leadId: lead.id, status: status as typeof lead.status })}
                        >
                          <SelectTrigger className="w-32 text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
