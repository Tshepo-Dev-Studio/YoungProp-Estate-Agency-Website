import { Link } from "wouter";

export default function PortalPreviewEntry() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0F1B2D] flex items-center justify-center">
            <span className="text-[#C9A84C] font-bold text-lg">YP</span>
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">YoungProp Estate Agency</p>
            <p className="text-lg font-bold text-[#0F1B2D]">Portal Design Preview</p>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F1B2D] mb-3">
          Three Portal Experiences
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          Click any role below to explore the interactive prototype for that user type.
          All data shown is sample data for design review purposes.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Admin Card */}
        <Link href="/portal/preview/admin">
          <div className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Card Header */}
            <div className="bg-[#0F1B2D] p-6">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Admin Portal</h2>
              <p className="text-gray-400 text-sm">Principal / Director view</p>
            </div>
            {/* Card Body */}
            <div className="p-6">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Full dashboard with all-agency KPIs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  All deals across all agents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Team management (agents, applications)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Commission tracker & referral payouts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Leads, valuations, listings control
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1.5 rounded-full">
                  Admin
                </span>
                <span className="text-[#0F1B2D] font-semibold text-sm group-hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Agent Card */}
        <Link href="/portal/preview/agent">
          <div className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-[#1A2E4A] p-6">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Agent Portal</h2>
              <p className="text-gray-400 text-sm">Agent / Intern view</p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Personal dashboard — own deals only
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Kanban deal pipeline by stage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  My leads, tasks, and valuations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Commission YTD tracker
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Agent profile editor
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  Agent
                </span>
                <span className="text-[#0F1B2D] font-semibold text-sm group-hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Referral Partner Card */}
        <Link href="/portal/preview/referral">
          <div className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-[#0D2B1F] p-6">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Referral Partner</h2>
              <p className="text-gray-400 text-sm">External partner view</p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Clean, no-sidebar single page
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Referral history with deal stage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Total earnings & fee status
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  How referral fees work guide
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                  Submit new referral form
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  Partner
                </span>
                <span className="text-[#0F1B2D] font-semibold text-sm group-hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-gray-400 text-center max-w-lg">
        These are interactive design prototypes with sample data. Once you have reviewed and approved the layouts,
        the live portal will be updated to match exactly.
      </p>
    </div>
  );
}
