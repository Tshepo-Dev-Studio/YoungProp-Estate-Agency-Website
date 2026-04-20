import { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  experience_level: string;
  current_employer?: string;
  ffc_number?: string;
  motivation?: string;
  agent_type: string;
  status: string;
  created_at: string;
}

function agentTypeLabel(type: string) {
  const map: Record<string, string> = {
    full_time: "Full-Time Agent",
    part_time: "Part-Time Agent",
    intern: "Intern / Trainee",
    referral_partner: "Referral Partner",
  };
  return map[type] ?? type;
}

function experienceLabel(level: string) {
  const map: Record<string, string> = {
    entry: "Entry Level (0–2 years)",
    mid: "Mid Level (2–5 years)",
    senior: "Senior (5+ years)",
    experienced: "Experienced",
  };
  return map[level] ?? level;
}

export default function AdminApplications() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/portal");
  }, [user, navigate]);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("agent_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load applications.");
    } else {
      setApplications(data ?? []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    if (!supabase) return;
    setUpdating(id);
    const { error } = await supabase
      .from("agent_applications")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update application status.");
    } else {
      toast.success(`Application ${status === "approved" ? "approved" : "declined"}.`);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
    setUpdating(null);
  }

  const filtered = applications.filter((a) => {
    if (filterStatus === "all") return true;
    return a.status === filterStatus;
  });

  const counts = {
    new: applications.filter((a) => a.status === "new").length,
    approved: applications.filter((a) => a.status === "approved").length,
    declined: applications.filter((a) => a.status === "declined").length,
  };

  return (
    <PortalLayout title="Agent Applications">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">New Applications</p>
                  <p className="text-3xl font-bold text-[#0A1628]">{counts.new}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{counts.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Declined</p>
                  <p className="text-3xl font-bold text-red-500">{counts.declined}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-semibold text-[#0A1628]">
                  Applications from Join Us Form
                </CardTitle>
                <CardDescription>
                  Review applications submitted via the public website's "Join Our Team" page.
                </CardDescription>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {!supabase ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Supabase not configured. Applications are stored in Supabase.
              </div>
            ) : loading ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Loading applications...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No applications found with the current filter.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((app) => {
                  const isExpanded = expandedId === app.id;
                  return (
                    <div
                      key={app.id}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      {/* Application Header */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : app.id)
                        }
                      >
                        <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {app.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-[#0A1628]">
                              {app.full_name}
                            </p>
                            <Badge
                              className={`text-xs border-0 ${
                                app.status === "new"
                                  ? "bg-blue-100 text-blue-700"
                                  : app.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {app.status === "new"
                                ? "New"
                                : app.status === "approved"
                                ? "Approved"
                                : "Declined"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {agentTypeLabel(app.agent_type)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(app.created_at).toLocaleDateString("en-ZA", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {app.status === "new" && (
                            <>
                              <Button
                                size="sm"
                                disabled={updating === app.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(app.id, "approved");
                                }}
                                className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updating === app.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(app.id, "declined");
                                }}
                                className="h-7 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                <a
                                  href={`mailto:${app.email}`}
                                  className="text-[#0A1628] hover:text-[#C9A84C]"
                                >
                                  {app.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <a
                                  href={`tel:${app.phone}`}
                                  className="text-[#0A1628] hover:text-[#C9A84C]"
                                >
                                  {app.phone}
                                </a>
                              </div>
                              {app.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-gray-600">{app.location}</span>
                                </div>
                              )}
                              {app.current_employer && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-gray-600">
                                    Currently at: {app.current_employer}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-600">
                                  Experience: {experienceLabel(app.experience_level)}
                                </span>
                              </div>
                              {app.ffc_number && (
                                <div className="flex items-center gap-2 text-sm">
                                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-gray-600">
                                    FFC: {app.ffc_number}
                                  </span>
                                </div>
                              )}
                            </div>
                            {app.motivation && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  Motivation
                                </p>
                                <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">
                                  {app.motivation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
