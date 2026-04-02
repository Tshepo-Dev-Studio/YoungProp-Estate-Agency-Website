import { useState, useEffect } from 'react';
import { useSearch } from 'wouter';
import { Search, Filter, MapPin, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PropertyCard from '@/components/PropertyCard';
import { supabase, FALLBACK_LISTINGS, type Listing } from '@/lib/supabase';

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'plot', label: 'Plots' },
  { value: 'house', label: 'Houses' },
  { value: 'apartment', label: 'Apartments' },
  { value: 'commercial', label: 'Commercial' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: '0-300000', label: 'Under R300,000' },
  { value: '300000-500000', label: 'R300k – R500k' },
  { value: '500000-1000000', label: 'R500k – R1M' },
  { value: '1000000-2000000', label: 'R1M – R2M' },
  { value: '2000000-999999999', label: 'R2M+' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Properties() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [propertyType, setPropertyType] = useState(params.get('type') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        let query = supabase
          .from('website_listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (propertyType !== 'all') {
          query = query.eq('property_type', propertyType);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
          setListings(FALLBACK_LISTINGS);
        } else {
          setListings(data as Listing[]);
        }
      } catch {
        setListings(FALLBACK_LISTINGS);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [propertyType]);

  // Client-side filtering
  const filtered = listings
    .filter(l => {
      const q = searchQuery.toLowerCase();
      if (q && !l.title.toLowerCase().includes(q) &&
          !l.suburb?.toLowerCase().includes(q) &&
          !l.city?.toLowerCase().includes(q) &&
          !l.web_ref?.toLowerCase().includes(q)) {
        return false;
      }
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (l.price < min || l.price > max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('all');
    setPriceRange('all');
    setSortBy('newest');
  };

  const hasFilters = searchQuery || propertyType !== 'all' || priceRange !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-navy pt-24 pb-12">
        <div className="container">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Browse Listings</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Properties for Sale
          </h1>
          <p className="text-white/60">
            {loading ? 'Loading...' : `${filtered.length} properties found in Walkerville & Gauteng`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search & filter bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by area, suburb, or reference..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>

            {/* Type filter */}
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
            >
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* Price filter */}
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
            >
              {PRICE_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-gold" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
            <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-400 mb-2">No Properties Found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search filters.</p>
            <button onClick={clearFilters} className="btn-navy">Clear Filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} properties found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
