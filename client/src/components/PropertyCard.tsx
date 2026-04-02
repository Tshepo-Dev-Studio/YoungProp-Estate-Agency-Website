import { Link } from 'wouter';
import { MapPin, Maximize2, Bed, Bath, Car, Phone } from 'lucide-react';
import type { Listing } from '../lib/supabase';

interface PropertyCardProps {
  property: Listing;
  compact?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  vacant_land: 'Vacant Land',
  plot: 'Plot',
  house: 'House',
  apartment: 'Apartment',
  commercial: 'Commercial',
};

const STATUS_LABELS: Record<string, string> = {
  for_sale: 'For Sale',
  for_rent: 'To Rent',
  sold: 'Sold',
  rented: 'Rented',
};

const STATUS_COLORS: Record<string, string> = {
  for_sale: 'bg-navy text-white',
  for_rent: 'bg-gold text-navy',
  sold: 'bg-gray-500 text-white',
  rented: 'bg-gray-500 text-white',
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';
  const location = [property.suburb, property.city].filter(Boolean).join(', ');

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover cursor-pointer border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: compact ? '180px' : '220px' }}>
          <img
            src={image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`property-badge ${STATUS_COLORS[property.status]}`}>
              {STATUS_LABELS[property.status]}
            </span>
            {property.is_new && (
              <span className="property-badge bg-gold text-navy">New</span>
            )}
          </div>
          {property.web_ref && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Ref: {property.web_ref}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Type tag */}
          <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">
            {TYPE_LABELS[property.property_type] || property.property_type}
          </span>

          {/* Price */}
          <div className="text-2xl font-bold text-navy font-display mb-1">
            {formatPrice(property.price)}
          </div>

          {/* Title */}
          <h3 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 leading-snug">
            {property.title}
          </h3>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <MapPin size={12} className="text-gold flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Property details */}
          <div className="flex items-center gap-3 text-gray-500 text-xs mt-auto pt-3 border-t border-gray-100">
            {property.size && (
              <div className="flex items-center gap-1">
                <Maximize2 size={12} className="text-gold" />
                <span>{property.size.toLocaleString()} {property.size_unit || 'm²'}</span>
              </div>
            )}
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed size={12} className="text-gold" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath size={12} className="text-gold" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.garages && (
              <div className="flex items-center gap-1">
                <Car size={12} className="text-gold" />
                <span>{property.garages}</span>
              </div>
            )}
          </div>

          {/* Agent */}
          {!compact && property.agent_name && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
                  {property.agent_name.charAt(0)}
                </div>
                <span className="text-xs text-gray-600">{property.agent_name}</span>
              </div>
              {property.agent_phone && (
                <a
                  href={`tel:${property.agent_phone.replace(/\s/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors"
                >
                  <Phone size={11} />
                  Call
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
