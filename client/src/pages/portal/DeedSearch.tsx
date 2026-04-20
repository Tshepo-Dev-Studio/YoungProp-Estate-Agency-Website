import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Building2, User, MapPin, Calendar, FileText, AlertCircle } from "lucide-react";

type SearchType = "property" | "owner" | "erf";

interface DeedResult {
  erfNumber: string;
  titleDeedNumber: string;
  registeredOwner: string;
  propertyDescription: string;
  suburb: string;
  municipality: string;
  province: string;
  registrationDate: string;
  extent: string;
  bondHolder?: string;
  purchasePrice?: string;
}

// Mock results for demonstration — real integration requires Deeds Office API or e4 service
const MOCK_RESULTS: DeedResult[] = [
  {
    erfNumber: "ERF 1234",
    titleDeedNumber: "T12345/2019",
    registeredOwner: "SMITH JOHN DAVID",
    propertyDescription: "ERF 1234 SANDTON EXT 5",
    suburb: "Sandton",
    municipality: "City of Johannesburg",
    province: "Gauteng",
    registrationDate: "2019-03-15",
    extent: "450 m²",
    bondHolder: "STANDARD BANK OF SA LTD",
    purchasePrice: "R 2,850,000",
  },
];

export default function DeedSearch() {
  const [searchType, setSearchType] = useState<SearchType>("property");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DeedResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error("Please enter a search term"); return; }
    setIsSearching(true);
    // Simulate API call — real integration would call the Deeds Office API
    await new Promise(r => setTimeout(r, 1200));
    setResults(MOCK_RESULTS);
    setSearched(true);
    setIsSearching(false);
    toast.info("Showing demo results — live Deeds Office integration coming soon");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Deed Search</h1>
        <p className="text-slate-400 text-sm mt-1">Search the Deeds Office for property ownership and title deed information</p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 text-sm font-medium">Live Deeds Office Integration</p>
          <p className="text-amber-400/80 text-xs mt-0.5">
            Full integration with the SA Deeds Office (via e4 or Windeed) is in progress. The search below shows demo results.
            Contact your system administrator to activate live deed searches.
          </p>
        </div>
      </div>

      {/* Search panel */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-base">Search Deeds Office</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-slate-400 text-xs">Search By</Label>
              <Select value={searchType} onValueChange={(v) => setSearchType(v as SearchType)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="property" className="text-white">Property Address</SelectItem>
                  <SelectItem value="owner" className="text-white">Owner Name</SelectItem>
                  <SelectItem value="erf" className="text-white">ERF / Title Deed Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-slate-400 text-xs">
                {searchType === "property" ? "Property Address or Suburb" :
                 searchType === "owner" ? "Owner Full Name (as registered)" :
                 "ERF Number or Title Deed Number"}
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder={
                    searchType === "property" ? "e.g. 12 Main Street, Sandton" :
                    searchType === "owner" ? "e.g. SMITH JOHN DAVID" :
                    "e.g. ERF 1234 or T12345/2019"
                  }
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No records found for "{query}"</p>
              <p className="text-xs mt-1">Try a different search term or search type</p>
            </div>
          ) : (
            results.map((r, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-white font-semibold text-base">{r.propertyDescription}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{r.suburb}, {r.municipality}</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Registered</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Title Deed</p>
                      <p className="text-white text-sm font-medium mt-0.5">{r.titleDeedNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">ERF Number</p>
                      <p className="text-white text-sm font-medium mt-0.5">{r.erfNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Extent</p>
                      <p className="text-white text-sm font-medium mt-0.5">{r.extent}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide">Registered Owner</p>
                        <p className="text-amber-400 text-sm font-medium mt-0.5">{r.registeredOwner}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide">Registration Date</p>
                        <p className="text-white text-sm font-medium mt-0.5">{new Date(r.registrationDate).toLocaleDateString("en-ZA")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wide">Province</p>
                        <p className="text-white text-sm font-medium mt-0.5">{r.province}</p>
                      </div>
                    </div>
                  </div>

                  {(r.bondHolder || r.purchasePrice) && (
                    <div className="pt-3 border-t border-slate-700 grid grid-cols-2 gap-4">
                      {r.bondHolder && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide">Bond Holder</p>
                          <p className="text-white text-sm mt-0.5">{r.bondHolder}</p>
                        </div>
                      )}
                      {r.purchasePrice && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wide">Last Purchase Price</p>
                          <p className="text-green-400 text-sm font-semibold mt-0.5">{r.purchasePrice}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => toast.info("PDF report download coming soon")}>
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Download Report
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={() => toast.info("Save to contact coming soon")}>
                      Save to Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
