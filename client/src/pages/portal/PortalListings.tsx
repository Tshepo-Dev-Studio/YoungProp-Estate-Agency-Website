import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";

export default function PortalListings() {
  return (
    <PortalLayout title="Listings">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">Manage property listings shown on the public website</p>
          <Button
            className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white"
            onClick={() => toast.info("Listing management coming soon — connect via Supabase dashboard for now")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Listing
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0A1628] mb-2">Listings Management</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Property listings are currently managed directly in the Supabase database.
              A full listing editor with photo uploads is coming in the next update.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://supabase.com/dashboard/project/mtitddkujudfdddxudhk/editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-[#0A1628] text-[#0A1628]">
                  <ExternalLink className="w-4 h-4 mr-2" /> Open Supabase Editor
                </Button>
              </a>
              <a
                href="/properties"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" /> View Public Listings
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-100">
          <CardContent className="p-5">
            <h4 className="font-semibold text-[#0A1628] mb-3">How to Add a Listing Right Now</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2"><span className="font-bold text-[#C9A84C]">1.</span> Click "Open Supabase Editor" above</li>
              <li className="flex gap-2"><span className="font-bold text-[#C9A84C]">2.</span> Select the <code className="bg-white px-1 rounded text-xs">website_listings</code> table</li>
              <li className="flex gap-2"><span className="font-bold text-[#C9A84C]">3.</span> Click "Insert row" and fill in the property details</li>
              <li className="flex gap-2"><span className="font-bold text-[#C9A84C]">4.</span> The listing will appear on the public website immediately</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
