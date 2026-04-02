import { useState, useEffect } from 'react';
import { trackPropertyView, trackLead } from '@/lib/analytics';
import { useParams, Link } from 'wouter';
import { MapPin, Maximize2, Bed, Bath, Car, Phone, Mail, ArrowLeft, Share2, Heart, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase, FALLBACK_LISTINGS, type Listing } from '@/lib/supabase';
import { formatPrice } from '@/components/PropertyCard';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, string> = {
  vacant_land: 'Vacant Land',
  plot: 'Plot',
  house: 'House',
  apartment: 'Apartment',
  commercial: 'Commercial',
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase
          .from('website_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          const fallback = FALLBACK_LISTINGS.find(l => l.id === id);
          setProperty(fallback || null);
        } else {
          setProperty(data as Listing);
        }
      } catch {
        const fallback = FALLBACK_LISTINGS.find(l => l.id === id);
        setProperty(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property) {
      trackPropertyView(property.id, property.title, property.price);
    }
  }, [property]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('website_leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        property_id: property?.id,
        property_title: property?.title,
        lead_type: 'inquiry',
      });

      if (error) throw error;
      setSubmitted(true);
      trackLead('inquiry');
      toast.success('Enquiry sent! We\'ll contact you shortly.');
    } catch {
      toast.error('Failed to send enquiry. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin text-gold" size={36} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-navy mb-4">Property Not Found</h1>
          <Link href="/properties" className="btn-navy">Back to Properties</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Image gallery */}
        <div className="bg-navy-dark">
          <div className="container py-4">
            <Link href="/properties" className="flex items-center gap-2 text-white/60 hover:text-gold text-sm transition-colors">
              <ArrowLeft size={14} />
              Back to Properties
            </Link>
          </div>
          <div className="relative" style={{ height: '420px' }}>
            <img
              src={images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-gold w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                      {TYPE_LABELS[property.property_type] || property.property_type}
                    </span>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-navy mt-1">
                      {property.title}
                    </h1>
                    {(property.suburb || property.city) && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={14} className="text-gold" />
                        {[property.suburb, property.city, property.province].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-bold text-navy font-display">
                      {formatPrice(property.price)}
                    </div>
                    {property.web_ref && (
                      <p className="text-xs text-gray-400 mt-1">Ref: {property.web_ref}</p>
                    )}
                  </div>
                </div>

                {/* Property specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                  {property.size && (
                    <div className="text-center">
                      <Maximize2 size={20} className="text-gold mx-auto mb-1" />
                      <p className="font-semibold text-navy text-sm">{property.size.toLocaleString()} {property.size_unit || 'm²'}</p>
                      <p className="text-xs text-gray-400">Stand Size</p>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="text-center">
                      <Bed size={20} className="text-gold mx-auto mb-1" />
                      <p className="font-semibold text-navy text-sm">{property.bedrooms}</p>
                      <p className="text-xs text-gray-400">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath size={20} className="text-gold mx-auto mb-1" />
                      <p className="font-semibold text-navy text-sm">{property.bathrooms}</p>
                      <p className="text-xs text-gray-400">Bathrooms</p>
                    </div>
                  )}
                  {property.garages && (
                    <div className="text-center">
                      <Car size={20} className="text-gold mx-auto mb-1" />
                      <p className="font-semibold text-navy text-sm">{property.garages}</p>
                      <p className="text-xs text-gray-400">Garages</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mt-4">
                    <h2 className="font-semibold text-navy mb-2">Property Description</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: agent + inquiry form */}
            <div className="space-y-4">
              {/* Agent card */}
              {property.agent_name && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-navy mb-3 text-sm">Listed By</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg">
                      {property.agent_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-sm">{property.agent_name}</p>
                      <p className="text-gold text-xs">Property Practitioner</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {property.agent_phone && (
                      <a href={`tel:${property.agent_phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 w-full bg-navy text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors justify-center">
                        <Phone size={14} />
                        {property.agent_phone}
                      </a>
                    )}
                    <a
                      href={`https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27m%20interested%20in%20${encodeURIComponent(property.title)}%20(Ref:%20${property.web_ref || property.id})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full bg-[#25D366] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#1ebe5d] transition-colors justify-center"
                    >
                      WhatsApp Agent
                    </a>
                  </div>
                </div>
              )}

              {/* Inquiry form */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-navy mb-1">Send an Enquiry</h3>
                <p className="text-xs text-gray-400 mb-4">We'll respond within 24 hours.</p>

                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-navy">Enquiry Sent!</p>
                    <p className="text-sm text-gray-500 mt-1">We'll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    />
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                    />
                    <textarea
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold w-full justify-center"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                      {submitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
