import { useState } from "react";
import { Link } from "wouter";

const REFERRALS = [
  { id: 1, client: "John Doe", type: "Buyer", submitted: "10 Feb 2026", stage: "Viewing Scheduled", fee: 3500, paid: false },
  { id: 2, client: "Jane Smith", type: "Seller", submitted: "15 Feb 2026", stage: "Offer Made", fee: 5000, paid: false },
  { id: 3, client: "Peter Jones", type: "Buyer", submitted: "01 Mar 2026", stage: "Under Contract", fee: 4200, paid: false },
  { id: 4, client: "Sarah Lee", type: "Seller", submitted: "20 Mar 2026", stage: "Closed Won", fee: 6500, paid: true },
];

const STAGE_COLORS: Record<string, string> = {
  "Lead": "bg-gray-100 text-gray-600",
  "Viewing Scheduled": "bg-blue-100 text-blue-700",
  "Offer Made": "bg-amber-100 text-amber-700",
  "Under Contract": "bg-purple-100 text-purple-700",
  "Closed Won": "bg-green-100 text-green-700",
};

export default function ReferralPreview() {
  const [howOpen, setHowOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "Buying or Selling Property", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalEarned = REFERRALS.filter(r => r.paid).reduce((s, r) => s + r.fee, 0);
  const inProgress = REFERRALS.filter(r => !r.paid && r.stage !== "Closed Won").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", phone: "", email: "", type: "Buying or Selling Property", notes: "" });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header Banner */}
      <div className="bg-[#0F1B2D] px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center shrink-0">
              <span className="text-[#0F1B2D] font-bold">YP</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Welcome back, Nomsa</h1>
              <p className="text-gray-400 text-sm">Here is a summary of your referrals with YoungProp Estate Agency.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/portal/preview">
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">← All Prototypes</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F1B2D]/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0F1B2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0F1B2D]">{REFERRALS.length}</p>
              <p className="text-sm text-gray-500">Total Referrals</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">{inProgress}</p>
              <p className="text-sm text-gray-500">Deals in Progress</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">R {totalEarned.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-[#0F1B2D] text-lg">My Referrals</h2>
            <p className="text-gray-500 text-sm mt-0.5">Track the progress of every client you have referred to YoungProp.</p>
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Client Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Referral Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date Submitted</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Deal Stage</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Referral Fee</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {REFERRALS.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#0F1B2D]">{r.client}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{r.type}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{r.submitted}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[r.stage] || "bg-gray-100 text-gray-600"}`}>{r.stage}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#C9A84C] text-right">R {r.fee.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {r.paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How Referral Fees Work */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <button
            onClick={() => setHowOpen(!howOpen)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-semibold text-[#0F1B2D]">How Referral Fees Work</h2>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${howOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {howOpen && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-6 mt-5">
                {[
                  { step: "1", title: "Submit a Referral", desc: "Fill in the form below with your client's details. We'll take it from there.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                  { step: "2", title: "Deal Progresses", desc: "Our agents contact your referral and manage the entire property transaction.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                  { step: "3", title: "You Get Paid", desc: "Once the deal closes, your referral fee is paid directly to you. No estate agent licence required.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
                      <span className="text-[#C9A84C] font-bold text-sm">{s.step}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F1B2D] text-sm mb-1">{s.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-[#0F1B2D] mb-1">Referral Fee Structure</p>
                <p className="text-xs text-gray-600">Standard referral fee: <strong>R 3,500 – R 6,500</strong> depending on deal value. Fees are paid within 7 days of deal registration. All fees are subject to a signed referral agreement.</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Referral Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h2 className="font-semibold text-[#0F1B2D] text-lg">Refer Another Client</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1 ml-8">Know someone looking to buy, sell, or get a property valuation? Submit their details below.</p>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {submitted && (
              <div className="mb-5 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 text-sm font-medium">Referral submitted successfully! We'll be in touch soon.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Client Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Client Phone Number *</label>
                <input
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 082 123 4567"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Client Email (optional)</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Referral Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] focus:outline-none focus:border-[#C9A84C] bg-white"
                >
                  <option>Buying or Selling Property</option>
                  <option>Rental Property</option>
                  <option>Property Valuation</option>
                  <option>Investment Property</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Additional Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional context about this referral..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0F1B2D] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">* Required fields. We'll contact you once we've reached out to your referral.</p>
              <button
                type="submit"
                className="bg-[#C9A84C] text-[#0F1B2D] font-bold text-sm px-8 py-3 rounded-lg hover:bg-[#b8963e] transition-colors"
              >
                Submit Referral
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
