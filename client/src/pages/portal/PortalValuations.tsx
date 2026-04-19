import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardList, Phone, Mail, MapPin, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function PortalValuations() {
  const utils = trpc.useUtils();
  const { data: valuations, isLoading } = trpc.portal.listValuations.useQuery();
  const updateStatus = trpc.portal.updateValuationStatus.useMutation({
    onSuccess: () => {
      utils.portal.listValuations.invalidate();
      utils.portal.getDashboardStats.invalidate();
      toast.success("Valuation status updated");
    },
  });

  const pending = valuations?.filter((v) => v.status === "pending").length ?? 0;

  return (
    <PortalLayout title="Valuations">
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-gray-500 text-sm">{pending} pending valuation{pending !== 1 ? "s" : ""} require attention</p>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading valuations...</div>
            ) : !valuations || valuations.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No valuation requests yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {valuations.map((val) => (
                  <div key={val.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-[#0A1628]">{val.name}</p>
                          <Badge className={`text-xs ${statusColors[val.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {val.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                          {val.email && (
                            <a href={`mailto:${val.email}`} className="flex items-center gap-1 hover:text-[#C9A84C]">
                              <Mail className="w-3 h-3" /> {val.email}
                            </a>
                          )}
                          {val.phone && (
                            <a href={`tel:${val.phone}`} className="flex items-center gap-1 hover:text-[#C9A84C]">
                              <Phone className="w-3 h-3" /> {val.phone}
                            </a>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(val.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {val.address && (
                          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {val.address}
                          </p>
                        )}
                        {val.propertyType && (
                          <p className="text-xs text-gray-400 mt-1">Property type: {val.propertyType}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Select
                          value={val.status}
                          onValueChange={(status) => updateStatus.mutate({ valuationId: val.id, status: status as typeof val.status })}
                        >
                          <SelectTrigger className="w-32 text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
