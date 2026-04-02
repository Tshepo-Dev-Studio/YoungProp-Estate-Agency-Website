import { useState } from 'react';
import { CheckCircle, Loader2, TrendingUp, Clock, Shield, Star } from 'lucide-react';
import { trackLead } from '@/lib/analytics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PROPERTY_TYPES = [
  'Vacant Land', 'Plot', 'House', 'Apartment', 'Commercial', 'Farm', 'Other',
];

export default function Valuation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    city: '',
    property_type: '',
    size: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('website_valuations').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        suburb: formData.suburb || undefined,
        city: formData.city || undefined,
        property_type: formData.property_type || undefined,
        size: formData.size || undefined,
        notes: formData.notes || undefined,
      });

      if (error) throw error;

      // Also create a lead record
      await supabase.from('website_leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Valuation request for: ${formData.address}`,
        lead_type: 'valuation',
      });

      setSubmitted(true);
      trackLead('valuation');
      toast.success('Valuation request submitted! We\'ll contact you within 24 hours.');
    } catch {
      toast.error('Failed to submit. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-navy pt-24 pb-14">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <TrendingUp size={12} />
            100% Free, No Obligation
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Free Property Valuation
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Get an accurate, professional valuation of your property from our registered practitioners.
            No cost, no obligation — just expert advice.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy mb-3">
                    Request Received!
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Our team will review your property details
                    and contact you within 24–48 hours with a comprehensive valuation.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a href="/properties" className="btn-navy">Browse Properties</a>
                    <a
                      href="https://wa.me/27737124178"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-gold"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-navy mb-1">Request Your Valuation</h2>
                  <p className="text-gray-500 text-sm mb-6">Fill in the details below and we'll get back to you promptly.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="e.g. 073 712 4178"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Property Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Street address or stand number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Suburb</label>
                        <input
                          type="text"
                          name="suburb"
                          value={formData.suburb}
                          onChange={handleChange}
                          placeholder="e.g. Ohenimuri"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Walkerville"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Property Type</label>
                        <select
                          name="property_type"
                          value={formData.property_type}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
                        >
                          <option value="">Select type</option>
                          {PROPERTY_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Approximate Size</label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          placeholder="e.g. 900m² or 2 hectares"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Any additional information about your property..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold w-full justify-center text-base py-4"
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
                      {submitting ? 'Submitting...' : 'Request Free Valuation'}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting, you agree to be contacted by YoungProp Estate Agency.
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-navy rounded-xl p-6 text-white">
              <h3 className="font-display text-lg font-bold mb-4">What You'll Receive</h3>
              <ul className="space-y-3">
                {[
                  'Comprehensive market analysis',
                  'Comparable sales data',
                  'Recommended listing price',
                  'Marketing strategy advice',
                  'Expert consultation call',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle size={14} className="text-gold flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-navy mb-4">Why Choose YoungProp?</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'PPRA Registered Agency' },
                  { icon: Clock, text: 'Response within 24 hours' },
                  { icon: Star, text: '5-star rated service' },
                  { icon: TrendingUp, text: 'Local market expertise' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-gold" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#25D366] rounded-xl p-5 text-white">
              <p className="font-semibold mb-2">Prefer to chat?</p>
              <p className="text-sm text-white/80 mb-4">Message us on WhatsApp for an instant response.</p>
              <a
                href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20a%20free%20property%20valuation."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-[#25D366] font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-green-50 transition-colors"
              >
                WhatsApp Us Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
