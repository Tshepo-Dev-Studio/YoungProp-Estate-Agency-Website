import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Home, MapPin, DollarSign, Eye, Edit2, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  sold: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  let: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  withdrawn: "bg-red-500/10 text-red-400 border-red-500/20",
};

const LISTING_TYPE_COLORS: Record<string, string> = {
  sale: "bg-amber-500/10 text-amber-400",
  rental: "bg-blue-500/10 text-blue-400",
  commercial: "bg-purple-500/10 text-purple-400",
  development: "bg-green-500/10 text-green-400",
};

export default function PortalListings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [, navigate] = useLocation();

  const { data: listings, refetch, isLoading } = trpc.portal.getListings.useQuery(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { refetchOnWindowFocus: false }
  );

  const filtered = (listings ?? []).filter((l: any) => {
    const matchSearch = !search ||
      l.address?.toLowerCase().includes(search.toLowerCase()) ||
      l.suburb?.toLowerCase().includes(search.toLowerCase()) ||
      l.refNo?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.listingType === typeFilter;
    return matchSearch && matchType;
  });

  const formatPrice = (price: string | null) => {
    if (!price) return "—";
    const n = parseFloat(price);
    if (isNaN(n)) return price;
    return n >= 1_000_000 ? `R${(n / 1_000_000).toFixed(2)}M` : `R${(n / 1_000).toFixed(0)}K`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Listings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all property listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => toast.info("Property24 importer coming soon")}>
            <ExternalLink className="w-4 h-4 mr-2" /> Import from P24
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" onClick={() => toast.info("Listing editor coming soon")}>
            <Plus className="w-4 h-4 mr-2" /> Add Listing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by address, suburb, ref..."
            className="pl-9 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            {["active", "pending", "sold", "let", "withdrawn"].map(s => (
              <SelectItem key={s} value={s} className="text-white capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            {["sale", "rental", "commercial", "development"].map(t => (
              <SelectItem key={t} value={t} className="text-white capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-slate-400 text-sm self-center">{filtered.length} listings</span>
      </div>

      {/* Listings grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No listings found</p>
          <p className="text-sm mt-1">Add your first listing or import from Property24</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing: any) => (
            <Card key={listing.id} className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-all">
              <div className="h-36 bg-slate-700 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                {listing.mainImageUrl ? (
                  <img src={listing.mainImageUrl} alt={listing.address} className="w-full h-full object-cover" />
                ) : (
                  <Home className="w-10 h-10 text-slate-600" />
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className={`text-xs border ${STATUS_COLORS[listing.status] ?? ""}`}>
                    {listing.status}
                  </Badge>
                  {listing.listingType && (
                    <Badge className={`text-xs ${LISTING_TYPE_COLORS[listing.listingType] ?? ""}`}>
                      {listing.listingType}
                    </Badge>
                  )}
                </div>
                {listing.refNo && (
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-slate-300 text-xs px-2 py-0.5 rounded">
                    {listing.refNo}
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <div>
                  <p className="text-white font-medium text-sm truncate">{listing.address}</p>
                  {listing.suburb && (
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.suburb}{listing.city ? `, ${listing.city}` : ""}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatPrice(listing.askingPrice)}</span>
                  {listing.listingType === "rental" && <span className="text-slate-400 text-xs font-normal">/month</span>}
                </div>
                {(listing.bedrooms || listing.bathrooms || listing.garages) && (
                  <div className="flex gap-3 text-xs text-slate-400">
                    {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
                    {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
                    {listing.garages && <span>{listing.garages} garage</span>}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:text-white text-xs" onClick={() => toast.info("Listing detail view coming soon")}>
                    <Eye className="w-3 h-3 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => toast.info("Listing editor coming soon")}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  {listing.property24Url && (
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => window.open(listing.property24Url, "_blank")}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
