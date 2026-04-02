import { Link } from 'wouter';
import { TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const BENEFITS = [
  'Accurate market valuation based on current data',
  'No obligation — completely free of charge',
  'Expert advice from a registered property practitioner',
  'Fast turnaround within 24–48 hours',
];

export default function ValuationCTA() {
  return (
    <section className="py-20 gradient-navy relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <TrendingUp size={12} />
              Free Property Valuation
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              What Is Your Property
              <span className="text-gold block">Worth Today?</span>
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Get an accurate, no-obligation valuation of your property from our experienced team.
              Whether you're planning to sell, refinance, or simply want to know your asset's value,
              we provide comprehensive market assessments backed by real data.
            </p>
            <ul className="space-y-3 mb-8">
              {BENEFITS.map(benefit => (
                <li key={benefit} className="flex items-start gap-3 text-white/80 text-sm">
                  <CheckCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="/valuation" className="btn-gold">
                Request Free Valuation
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20to%20request%20a%20free%20property%20valuation."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-navy mb-1">Quick Enquiry</h3>
            <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer"
                  readOnly
                  onClick={() => { window.location.href = '/valuation'; }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer"
                  readOnly
                  onClick={() => { window.location.href = '/valuation'; }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Property Address</label>
                <input
                  type="text"
                  placeholder="Property address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer"
                  readOnly
                  onClick={() => { window.location.href = '/valuation'; }}
                />
              </div>
              <Link href="/valuation" className="btn-navy w-full justify-center mt-2">
                Get Free Valuation
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">
              100% free, no obligation. PPRA registered agency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
