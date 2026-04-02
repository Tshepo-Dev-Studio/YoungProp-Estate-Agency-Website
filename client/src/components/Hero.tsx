import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Properties' },
  { value: 'vacant_land', label: 'Vacant Land' },
  { value: 'plot', label: 'Plots' },
  { value: 'house', label: 'Houses' },
  { value: 'apartment', label: 'Apartments' },
];

const POPULAR_AREAS = [
  'Walkerville', 'Ohenimuri', 'Walkerville Manor', 'Mondeor',
  'Johannesburg South', 'Midvaal', 'Meyerton', 'Vereeniging',
];

const STATS = [
  { value: '50+', label: 'Properties Listed' },
  { value: '200+', label: 'Happy Clients' },
  { value: '5★', label: 'Rated Agency' },
  { value: '100%', label: 'PPRA Registered' },
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, navigate] = useLocation();

  const filteredAreas = POPULAR_AREAS.filter(area =>
    area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (propertyType !== 'all') params.set('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const handleAreaSelect = (area: string) => {
    setSearchQuery(area);
    setShowSuggestions(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/85 via-navy/75 to-navy-dark/90" />

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative container pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
            <MapPin size={12} />
            Walkerville & Gauteng's Trusted Estate Agency
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 text-shadow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Find Your Perfect
            <span className="block text-gold">Property in Gauteng</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Vacant land, plots, and homes for sale in Walkerville and surrounding areas.
            Expert guidance from South Africa's dedicated property specialists.
          </p>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              {/* Property type selector */}
              <div className="relative md:w-44 flex-shrink-0">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full h-12 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                >
                  {PROPERTY_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Search input */}
              <div className="relative flex-1">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by area, suburb or reference..."
                  className="w-full h-12 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
                {/* Autocomplete suggestions */}
                {showSuggestions && filteredAreas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {filteredAreas.map(area => (
                      <button
                        key={area}
                        type="button"
                        onMouseDown={() => handleAreaSelect(area)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors text-left"
                      >
                        <MapPin size={12} className="text-gold flex-shrink-0" />
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search button */}
              <button type="submit" className="btn-gold h-12 px-6 rounded-xl whitespace-nowrap">
                <Search size={16} />
                Search
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-2 px-1">
              <span className="text-xs text-gray-400 self-center">Popular:</span>
              {POPULAR_AREAS.slice(0, 4).map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    setSearchQuery(area);
                    navigate(`/properties?q=${encodeURIComponent(area)}`);
                  }}
                  className="text-xs text-navy hover:text-gold bg-gray-100 hover:bg-gold/10 px-3 py-1 rounded-full transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a href="/properties" className="btn-gold">
              View All Properties
            </a>
            <a href="/valuation" className="btn-outline-white">
              Free Valuation
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-3">
              <div className="text-2xl font-bold text-gold font-display">{stat.value}</div>
              <div className="text-white/70 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}
