import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { trackLead, trackContact } from '@/lib/analytics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('website_leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        lead_type: 'contact',
      });
      if (error) throw error;
      setSubmitted(true);
      trackLead('contact');
      toast.success('Message sent! We\'ll be in touch shortly.');
    } catch {
      toast.error('Failed to send. Please call us directly at 073 712 4178.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy pt-24 pb-14">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Have a question or ready to start your property journey? Our team is here to help.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Phone, title: 'Phone', value: '073 712 4178', href: 'tel:0737124178' },
              { icon: Mail, title: 'Email', value: 'info@youngprop.co.za', href: 'mailto:info@youngprop.co.za' },
              { icon: MapPin, title: 'Location', value: 'Walkerville, Gauteng, South Africa', href: null },
              { icon: Clock, title: 'Office Hours', value: 'Mon–Fri: 8am–5pm\nSat: 9am–1pm', href: null },
            ].map(({ icon: Icon, title, value, href }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{title}</p>
                  {href ? (
                    <a href={href} className="text-navy font-medium text-sm hover:text-gold transition-colors">{value}</a>
                  ) : (
                    <p className="text-navy font-medium text-sm whitespace-pre-line">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20to%20get%20in%20touch."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-navy mb-3">Message Sent!</h2>
                <p className="text-gray-500">Thank you for reaching out. We'll respond within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-navy mb-1">Send Us a Message</h2>
                <p className="text-gray-500 text-sm mb-6">We respond to all enquiries within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="073 712 4178"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help you?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none" />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-gold w-full justify-center text-base py-4">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
