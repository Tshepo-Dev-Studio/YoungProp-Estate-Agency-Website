import { useState } from "react";
import { Link, useLocation } from "wouter";

// ─── Sample Data ─────────────────────────────────────────────────────────────
const MY_DEALS = [
  { id: 1, address: "123 Maple Ave, Sandton", stage: "Lead", value: 1500000, daysInStage: 3 },
  { id: 2, address: "45 Ocean Drive, Cape Town", stage: "Offer Made", value: 3200000, daysInStage: 7 },
  { id: 3, address: "78 Willow Lane, Pretoria", stage: "Viewing Scheduled", value: 950000, daysInStage: 1 },
  { id: 4, address: "12 Fern Street, Johannesburg", stage: "Closed Won", value: 2100000, daysInStage: 0 },
  { id: 5, address: "99 Baobab Rd, Midrand", stage: "Lead", value: 780000, daysInStage: 5 },
  { id: 6, address: "7 Acacia Close, Centurion", stage: "Under Contract", value: 1850000, daysInStage: 14 },
];
const MY_LEADS = [
  { id: 1, name: "John Smith", source: "Website", type: "Buyer", date: "2026-04-18", status: "New", notes: "Looking for 3-bed in Sandton" },
  { id: 2, name: "Emily Davis", source: "Phone", type: "Seller", date: "2026-04-17", status: "Contacted", notes: "Wants valuation on Pretoria property" },
  { id: 3, name: "Michael Brown", source: "Referral", type: "Buyer", date: "2026-04-16", status: "Qualified", notes: "Budget R1.5M, Midrand area" },
];
const TASKS = [
  { id: 1, title: "Review contract for 123 Maple Ave", due: "Today", done: true },
  { id: 2, title: "Follow up with John Smith (lead)", due: "Tomorrow", done: false },
  { id: 3, title: "Schedule viewing — 78 Willow Lane", due: "21 Apr", done: false },
  { id: 4, title: "Submit monthly report", due: "25 Apr", done: false },
];
const STAGES = ["Lead", "Viewing Scheduled", "Offer Made", "Under Contract", "Closed Won"];

const STAGE_COLORS: Record<string, string> = {
  "Lead": "bg-gray-100 text-gray-600",
  "Viewing Scheduled": "bg-blue-100 text-blue-700",
  "Offer Made": "bg-amber-100 text-amber-700",
  "Under Contract": "bg-purple-100 text-purple-700",
  "Closed Won": "bg-green-100 text-green-700",
};

const NAV = [
  { section: "OVERVIEW", items: [
    { label: "Dashboard", path: "/portal/preview/agent", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "My Deals", path: "/portal/preview/agent/deals", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "My Leads", path: "/portal/preview/agent/leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Valuations", path: "/portal/preview/agent/valuations", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Listings", path: "/portal/preview/agent/listings", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ]},
  { section: "SETTINGS", items: [
    { label: "My Profile", path: "/portal/preview/agent/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]},
];

function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-56 min-h-screen bg-[#0F1B2D] flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/portal/preview/agent">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center shrink-0">
              <span className="text-[#0F1B2D] font-bold text-sm">YP</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">YoungProp</p>
              <p className="text-[#C9A84C] text-xs">Agent Portal</p>
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">{group.section}</p>
            {group.items.map((item) => {
              const active = currentPath === item.path;
              return (
                <Link key={item.label} href={item.path}>
                  <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 cursor-pointer transition-all ${active ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                    </svg>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">SJ</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Sarah Jenkins</p>
            <p className="text-gray-500 text-xs truncate">sarah@youngprop.co.za</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">Agent</span>
          <Link href="/portal/preview">
            <span className="text-gray-500 text-xs hover:text-white cursor-pointer ml-auto">← Back</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Good afternoon, Sarah</h1>
      <p className="text-gray-500 text-sm mb-8">Here is your personal deal overview.</p>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "My Active Deals", value: "6", sub: "2 closing this month" },
          { label: "Closed Deals", value: "3", sub: "this year" },
          { label: "Commission YTD", value: "R 38,400", sub: "my earnings" },
          { label: "New Leads", value: "2", sub: "assigned to me" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-gray-500 text-sm font-medium mb-3">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#0F1B2D]">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Kanban Pipeline */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#0F1B2D]">My Deal Pipeline</h2>
          <Link href="/portal/preview/agent/deals"><span className="text-xs text-[#C9A84C] font-medium cursor-pointer hover:underline">View all</span></Link>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {STAGES.map((stage) => {
              const stageDeals = MY_DEALS.filter(d => d.stage === stage);
              return (
                <div key={stage} className="w-44 shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stage}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 font-bold w-5 h-5 rounded-full flex items-center justify-center">{stageDeals.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map((d) => (
                      <div key={d.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all cursor-pointer">
                        <p className="text-xs font-medium text-[#0F1B2D] leading-tight mb-2">{d.address}</p>
                        <p className="text-xs font-bold text-[#C9A84C]">R {d.value.toLocaleString()}</p>
                        {d.daysInStage > 0 && <p className="text-[10px] text-gray-400 mt-1">{d.daysInStage}d in stage</p>}
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-[10px] text-gray-400">No deals</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks + Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F1B2D]">My Tasks</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {TASKS.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded border-2 shrink-0 ${t.done ? "bg-[#C9A84C] border-[#C9A84C]" : "border-gray-300"}`}></div>
                <p className={`text-sm flex-1 ${t.done ? "line-through text-gray-400" : "text-gray-700"}`}>{t.title}</p>
                <span className="text-xs text-gray-400">{t.due}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0F1B2D] rounded-xl p-5">
          <p className="text-white font-semibold mb-4">Quick Actions</p>
          <div className="space-y-2">
            {["New Deal", "Add Task", "View My Leads"].map((a) => (
              <button key={a} className="w-full text-left border border-[#C9A84C]/30 text-[#C9A84C] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#C9A84C]/10 transition-colors">
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyDeals() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1B2D]">My Deals</h1>
          <p className="text-gray-500 text-sm">Sarah Jenkins · 6 active · 3 closed</p>
        </div>
        <button className="bg-[#C9A84C] text-[#0F1B2D] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#b8963e] transition-colors">+ New Deal</button>
      </div>
      {/* Kanban full view */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-5 min-w-max">
          {STAGES.map((stage) => {
            const stageDeals = MY_DEALS.filter(d => d.stage === stage);
            return (
              <div key={stage} className="w-52 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
                  <span className="text-xs text-gray-400 font-medium">{stageDeals.length}</span>
                </div>
                <div className="space-y-3">
                  {stageDeals.map((d) => (
                    <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#C9A84C]/40 transition-all cursor-pointer">
                      <p className="text-sm font-semibold text-[#0F1B2D] leading-tight mb-3">{d.address}</p>
                      <p className="text-base font-bold text-[#C9A84C]">R {d.value.toLocaleString()}</p>
                      {d.daysInStage > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          <p className="text-[10px] text-gray-400">{d.daysInStage} days in stage</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#C9A84C]/40 transition-colors">
                    <p className="text-xs text-gray-400">+ Add deal</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MyLeads() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">My Leads</h1>
      <p className="text-gray-500 text-sm mb-6">Leads assigned to you</p>
      <div className="space-y-4">
        {MY_LEADS.map((l) => (
          <div key={l.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0F1B2D] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{l.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold text-[#0F1B2D]">{l.name}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${l.status === "New" ? "bg-green-100 text-green-700" : l.status === "Contacted" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{l.status}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{l.notes}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>Source: {l.source}</span>
                <span>·</span>
                <span>Type: {l.type}</span>
                <span>·</span>
                <span>{l.date}</span>
              </div>
            </div>
            <button className="text-xs text-[#C9A84C] font-semibold border border-[#C9A84C]/30 px-3 py-1.5 rounded-lg hover:bg-[#C9A84C]/10 transition-colors shrink-0">
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Your agent profile visible to the admin</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SJ</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F1B2D]">Sarah Jenkins</h2>
            <p className="text-gray-500 text-sm">sarah@youngprop.co.za</p>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Agent</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Full Name", value: "Sarah Jenkins" },
            { label: "FFC Number", value: "FFC-2024-002" },
            { label: "Agent Type", value: "Senior Agent" },
            { label: "Phone", value: "082 456 7890" },
            { label: "Monthly Target", value: "R 50,000" },
            { label: "Commission Split", value: "70 / 30" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] bg-gray-50">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Bio</label>
          <div className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 bg-gray-50">
            Experienced property agent specialising in residential sales across Cape Town and surrounds. 5 years in the industry with a strong track record in luxury and family home sales.
          </div>
        </div>
        <button className="mt-6 bg-[#C9A84C] text-[#0F1B2D] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#b8963e] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function GenericPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">{description}</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-500 text-sm">This page is part of the design prototype.</p>
        <p className="text-gray-400 text-xs mt-1">Content will be populated once the layout is approved.</p>
      </div>
    </div>
  );
}

export default function AgentPreview() {
  const [location] = useLocation();

  const renderPage = () => {
    if (location === "/portal/preview/agent/deals") return <MyDeals />;
    if (location === "/portal/preview/agent/leads") return <MyLeads />;
    if (location === "/portal/preview/agent/profile") return <Profile />;
    if (location === "/portal/preview/agent/valuations") return <GenericPage title="Valuations" description="Valuation requests assigned to you" />;
    if (location === "/portal/preview/agent/listings") return <GenericPage title="Listings" description="Active property listings you manage" />;
    return <Dashboard />;
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <Sidebar currentPath={location} />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/portal/preview"><span className="hover:text-[#C9A84C] cursor-pointer">← All Prototypes</span></Link>
            <span>/</span>
            <span className="text-blue-500 font-medium">Agent Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SJ</span>
            </div>
          </div>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
