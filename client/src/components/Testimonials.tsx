import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase, FALLBACK_TESTIMONIALS, type Testimonial } from '../lib/supabase';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-gold fill-gold' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.client_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col h-full card-hover">
      <div className="flex items-start justify-between mb-4">
        <Quote size={32} className="text-gold/30" />
        <StarRating rating={testimonial.rating} />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 italic">
        "{testimonial.review}"
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-navy text-sm">{testimonial.client_name}</p>
          <p className="text-gray-400 text-xs">{testimonial.client_location}</p>
          {testimonial.property_type && (
            <p className="text-gold text-xs">{testimonial.property_type}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('website_testimonials')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error || !data || data.length === 0) {
          setTestimonials(FALLBACK_TESTIMONIALS);
        } else {
          setTestimonials(data as Testimonial[]);
        }
      } catch {
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4 gold-underline gold-underline-center">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-6">
            Don't just take our word for it. Here's what our satisfied clients have to say
            about their experience with YoungProp Estate Agency.
          </p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-navy/5 rounded-full px-6 py-3 mt-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className="text-gold fill-gold" />
              ))}
            </div>
            <span className="font-bold text-navy">{avgRating}/5</span>
            <span className="text-gray-500 text-sm">from {testimonials.length} reviews</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 bg-navy/5 rounded-2xl p-8">
          <h3 className="font-display text-2xl font-bold text-navy mb-2">
            Ready to Start Your Property Journey?
          </h3>
          <p className="text-gray-500 mb-6">
            Join hundreds of satisfied clients who found their perfect property with YoungProp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/properties" className="btn-navy">Browse Properties</a>
            <a href="/contact" className="btn-outline-gold">Get in Touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}
