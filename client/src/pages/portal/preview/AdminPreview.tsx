import { useState } from "react";
import { Link, useLocation } from "wouter";

// ─── Sample Data ────────────────────────────────────────────────────────────
const DEALS = [
  { id: 1, address: "123 Maple Ave, Sandton", agent: "Tshepo Serote", stage: "Under Contract", value: 1500000, commission: 45000, commissionPaid: false },
  { id: 2, address: "45 Ocean Drive, Cape Town", agent: "Sarah Jenkins", stage: "Offer Made", value: 3200000, commission: 96000, commissionPaid: false },
  { id: 3, address: "78 Willow Lane, Pretoria", agent: "David Nkosi", stage: "Viewing Scheduled", value: 950000, commission: 28500, commissionPaid: false },
  { id: 4, address: "12 Fern Street, Johannesburg", agent: "Tshepo Serote", stage: "Closed Won", value: 2100000, commission: 63000, commissionPaid: true },
  { id: 5, address: "99 Baobab Rd, Midrand", agent: "Sarah Jenkins", stage: "Lead", value: 780000, commission: 23400, commissionPaid: false },
];
const LEADS = [
  { id: 1, name: "John Smith", source: "Website", type: "Buyer", date: "2026-04-18", status: "New" },
  { id: 2, name: "Emily Davis", source: "Phone", type: "Seller", date: "2026-04-17", status: "Contacted" },
  { id: 3, name: "Michael Brown", source: "Referral", type: "Buyer", date: "2026-04-16", status: "New" },
  { id: 4, name: "Nomsa Khumalo", source: "WhatsApp", type: "Valuation", date: "2026-04-15", status: "Qualified" },
];
const AGENTS = [
  { id: 1, name: "Tshepo Serote", role: "Principal", ffc: "FFC-2024-001", deals: 12, commission: 84000 },
  { id: 2, name: "Sarah Jenkins", role: "Agent", ffc: "FFC-2024-002", deals: 8, commission: 38400 },
  { id: 3, name: "David Nkosi", role: "Intern", ffc: "FFC-2024-003", deals: 4, commission: 0 },
];
const APPLICATIONS = [
  { id: 1, name: "Lerato Mokoena", email: "lerato@email.com", type: "Agent", experience: "3 years", date: "2026-04-19", status: "Pending" },
  { id: 2, name: "Sipho Dlamini", email: "sipho@email.com", type: "Intern", experience: "Fresh", date: "2026-04-18", status: "Reviewed" },
];
const REFERRAL_PARTNERS = [
  { id: 1, name: "Nomsa Khumalo", email: "nomsa@email.com", referrals: 4, earned: 6500, pending: 4500 },
  { id: 2, name: "Pieter van der Berg", email: "pieter@email.com", referrals: 2, earned: 3000, pending: 3000 },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { section: "OVERVIEW", items: [
    { label: "Dashboard", path: "/portal/preview/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "All Deals", path: "/portal/preview/admin/deals", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "All Leads", path: "/portal/preview/admin/leads", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Valuations", path: "/portal/preview/admin/valuations", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Listings", path: "/portal/preview/admin/listings", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ]},
  { section: "TEAM", items: [
    { label: "Agents & Interns", path: "/portal/preview/admin/agents", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Applications", path: "/portal/preview/admin/applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Referral Partners", path: "/portal/preview/admin/referral-partners", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ]},
  { section: "FINANCE", items: [
    { label: "Commission Tracker", path: "/portal/preview/admin/commission", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Referral Payouts", path: "/portal/preview/admin/payouts", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  ]},
  { section: "SETTINGS", items: [
    { label: "My Profile", path: "/portal/preview/admin/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ]},
];

function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-56 min-h-screen bg-[#0F1B2D] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/portal/preview/admin">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center shrink-0">
              <span className="text-[#0F1B2D] font-bold text-sm">YP</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">YoungProp</p>
              <p className="text-[#C9A84C] text-xs">Admin Portal</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
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

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
            <span className="text-[#0F1B2D] font-bold text-xs">TS</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Tshepo Serote</p>
            <p className="text-gray-500 text-xs truncate">tshepo@youngprop.co.za</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-[#C9A84C] text-[#0F1B2D] px-2 py-0.5 rounded-full">Admin</span>
          <Link href="/portal/preview">
            <span className="text-gray-500 text-xs hover:text-white cursor-pointer ml-auto">← Back</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ─── Stage Badge ──────────────────────────────────────────────────────────────
function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    "Lead": "bg-gray-100 text-gray-600",
    "Viewing Scheduled": "bg-blue-100 text-blue-700",
    "Offer Made": "bg-amber-100 text-amber-700",
    "Under Contract": "bg-purple-100 text-purple-700",
    "Closed Won": "bg-green-100 text-green-700",
    "Closed Lost": "bg-red-100 text-red-600",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[stage] || "bg-gray-100 text-gray-600"}`}>{stage}</span>;
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Good morning, Tshepo</h1>
      <p className="text-gray-500 text-sm mb-8">Here is your agency overview for today.</p>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Deals", value: "24", sub: "18 active", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "New Leads", value: "7", sub: "this week", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { label: "Commission YTD", value: "R 142,500", sub: "all agents", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Active Agents", value: "4", sub: "registered staff", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-gray-500 text-sm font-medium">{kpi.label}</p>
              <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={kpi.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F1B2D]">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Recent Deals */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F1B2D]">Recent Deals</h2>
            <Link href="/portal/preview/admin/deals"><span className="text-xs text-[#C9A84C] font-medium cursor-pointer hover:underline">View all</span></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEALS.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-6 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F1B2D] truncate">{d.address}</p>
                  <p className="text-xs text-gray-400">{d.agent}</p>
                </div>
                <StageBadge stage={d.stage} />
                <p className="text-sm font-semibold text-[#0F1B2D] w-28 text-right">R {d.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Tasks */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#0F1B2D]">Tasks</h2>
            </div>
            <div className="px-5 py-3 space-y-3">
              {["Review contract for 123 Maple Ave", "Follow up with new leads", "Prepare weekly report"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 shrink-0 ${i === 0 ? "bg-[#C9A84C] border-[#C9A84C]" : "border-gray-300"}`}></div>
                  <p className={`text-sm ${i === 0 ? "line-through text-gray-400" : "text-gray-700"}`}>{t}</p>
                </div>
              ))}
            </div>
          </div>
          {/* New Leads */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-[#0F1B2D]">New Leads</h2>
            </div>
            <div className="px-5 py-3 space-y-2">
              {LEADS.slice(0, 3).map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0F1B2D]/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#0F1B2D]">{l.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#0F1B2D] truncate">{l.name}</p>
                    <p className="text-[10px] text-gray-400">{l.source} · {l.type}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{l.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0F1B2D] rounded-xl px-6 py-5 flex items-center gap-4">
        <p className="text-white font-semibold mr-4">Quick Actions</p>
        {["New Deal", "Add Task", "View Leads", "Manage Listings"].map((a) => (
          <button key={a} className="flex items-center gap-2 border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C9A84C]/10 transition-colors">
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

function AllDeals() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1B2D]">All Deals</h1>
          <p className="text-gray-500 text-sm">All active and closed deals across all agents</p>
        </div>
        <button className="bg-[#C9A84C] text-[#0F1B2D] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#b8963e] transition-colors">+ New Deal</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Property</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Agent</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Stage</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Value</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DEALS.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">{d.address}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{d.agent}</td>
                <td className="px-4 py-4"><StageBadge stage={d.stage} /></td>
                <td className="px-6 py-4 text-sm font-semibold text-[#0F1B2D] text-right">R {d.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <span className={d.commissionPaid ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                    R {d.commission.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AllLeads() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">All Leads</h1>
      <p className="text-gray-500 text-sm mb-6">All enquiries received across all channels</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Name</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Source</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {LEADS.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">{l.name}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{l.source}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{l.type}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{l.date}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.status === "New" ? "bg-green-100 text-green-700" : l.status === "Contacted" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Agents() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Agents & Interns</h1>
      <p className="text-gray-500 text-sm mb-6">All registered staff members</p>
      <div className="grid grid-cols-3 gap-5">
        {AGENTS.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#0F1B2D] flex items-center justify-center">
                <span className="text-white font-bold">{a.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div>
                <p className="font-semibold text-[#0F1B2D]">{a.name}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.role === "Principal" ? "bg-[#C9A84C]/20 text-[#C9A84C]" : a.role === "Agent" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{a.role}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">FFC Number</span><span className="font-medium text-[#0F1B2D]">{a.ffc}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Active Deals</span><span className="font-medium text-[#0F1B2D]">{a.deals}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Commission YTD</span><span className="font-semibold text-[#C9A84C]">R {a.commission.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Applications() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Applications</h1>
      <p className="text-gray-500 text-sm mb-6">Join Us form submissions from the public website</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Applicant</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Experience</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {APPLICATIONS.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[#0F1B2D]">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{a.type}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{a.experience}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{a.date}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{a.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-[#C9A84C] font-semibold hover:underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReferralPartners() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Referral Partners</h1>
      <p className="text-gray-500 text-sm mb-6">External partners who refer clients to YoungProp</p>
      <div className="grid grid-cols-2 gap-5">
        {REFERRAL_PARTNERS.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0F1B2D] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{p.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div>
                <p className="font-semibold text-[#0F1B2D]">{p.name}</p>
                <p className="text-xs text-gray-400">{p.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-lg font-bold text-[#0F1B2D]">{p.referrals}</p>
                <p className="text-xs text-gray-500">Referrals</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-lg font-bold text-green-700">R {p.earned.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Earned</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-lg font-bold text-amber-700">R {p.pending.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Commission() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-6">Commission Tracker</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Commission", value: "R 142,500", sub: "All closed deals", color: "text-[#0F1B2D]" },
          { label: "Commission Paid", value: "R 63,000", sub: "Marked as paid", color: "text-green-600" },
          { label: "Commission Pending", value: "R 79,500", sub: "Awaiting payment", color: "text-amber-600" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-gray-500 text-sm mb-2">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>
      {/* Per-agent breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {AGENTS.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0F1B2D] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{a.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <p className="font-semibold text-[#0F1B2D] text-sm">{a.name}</p>
            </div>
            <p className="text-xl font-bold text-[#C9A84C]">R {a.commission.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mb-3">YTD Commission</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#C9A84C] h-1.5 rounded-full" style={{ width: `${Math.min((a.commission / 100000) * 100, 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#0F1B2D]">Closed Deal Commissions</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Property</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Agent</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Sale Price</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Commission</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DEALS.filter(d => d.stage === "Closed Won").map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">{d.address}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{d.agent}</td>
                <td className="px-4 py-4 text-sm text-right font-semibold text-[#0F1B2D]">R {d.value.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-right font-semibold text-[#C9A84C]">R {d.commission.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.commissionPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {d.commissionPaid ? "Paid" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Payouts() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0F1B2D] mb-1">Referral Payouts</h1>
      <p className="text-gray-500 text-sm mb-6">Manage referral fee payments to external partners</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Partner</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Property</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Sale Price</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Referral Fee</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">Nomsa Khumalo</td>
              <td className="px-4 py-4 text-sm text-gray-600">12 Fern Street, Johannesburg</td>
              <td className="px-4 py-4 text-sm text-right font-semibold text-[#0F1B2D]">R 2,100,000</td>
              <td className="px-4 py-4 text-sm text-right font-semibold text-[#C9A84C]">R 3,500</td>
              <td className="px-6 py-4 text-center"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Paid</span></td>
              <td className="px-6 py-4 text-right"><button className="text-xs text-gray-400 font-medium">View</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">Pieter van der Berg</td>
              <td className="px-4 py-4 text-sm text-gray-600">45 Ocean Drive, Cape Town</td>
              <td className="px-4 py-4 text-sm text-right font-semibold text-[#0F1B2D]">R 3,200,000</td>
              <td className="px-4 py-4 text-sm text-right font-semibold text-[#C9A84C]">R 5,000</td>
              <td className="px-6 py-4 text-center"><span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Pending</span></td>
              <td className="px-6 py-4 text-right"><button className="text-xs text-[#C9A84C] font-semibold hover:underline">Mark Paid</button></td>
            </tr>
          </tbody>
        </table>
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
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">This page is part of the design prototype.</p>
        <p className="text-gray-400 text-xs mt-1">Content will be populated once the layout is approved.</p>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AdminPreview() {
  const [location] = useLocation();

  const renderPage = () => {
    if (location === "/portal/preview/admin/deals") return <AllDeals />;
    if (location === "/portal/preview/admin/leads") return <AllLeads />;
    if (location === "/portal/preview/admin/agents") return <Agents />;
    if (location === "/portal/preview/admin/applications") return <Applications />;
    if (location === "/portal/preview/admin/referral-partners") return <ReferralPartners />;
    if (location === "/portal/preview/admin/commission") return <Commission />;
    if (location === "/portal/preview/admin/payouts") return <Payouts />;
    if (location === "/portal/preview/admin/valuations") return <GenericPage title="Valuations" description="All valuation requests submitted through the public website" />;
    if (location === "/portal/preview/admin/listings") return <GenericPage title="Listings" description="All active property listings managed by the agency" />;
    if (location === "/portal/preview/admin/profile") return <GenericPage title="My Profile" description="Admin profile settings and preferences" />;
    return <Dashboard />;
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <Sidebar currentPath={location} />
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/portal/preview"><span className="hover:text-[#C9A84C] cursor-pointer">← All Prototypes</span></Link>
            <span>/</span>
            <span className="text-[#C9A84C] font-medium">Admin Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center">
              <span className="text-[#0F1B2D] font-bold text-xs">TS</span>
            </div>
          </div>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
