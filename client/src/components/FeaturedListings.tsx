import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, FALLBACK_LISTINGS, type Listing } from '../lib/supabase';
import PropertyCard from './PropertyCard';

const FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'plot', label: 'Plots' },
  { value: 'house', label: 'Houses' },
];

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data, error } = await supabase
          .from('website_listings')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error || !data || data.length === 0) {
          setListings(FALLBACK_LISTINGS.filter(l => l.featured));
        } else {
          setListings(data as Listing[]);
        }
      } catch {
        setListings(FALLBACK_LISTINGS.filter(l => l.featured));
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filtered = activeFilter === 'all'
    ? listings
    : listings.filter(l => l.property_type === activeFilter);

  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Featured Properties</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy gold-underline">
              Handpicked Listings
            </h2>
            <p className="text-gray-500 mt-6 max-w-lg">
              Explore our curated selection of premium properties across Walkerville and Gauteng.
            </p>
          </div>
          <Link href="/properties" className="btn-outline-gold whitespace-nowrap self-start md:self-auto">
            View All Properties
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.value
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No properties found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/properties" className="btn-navy">
            Browse All Listings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
