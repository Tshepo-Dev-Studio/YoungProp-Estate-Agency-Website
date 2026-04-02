import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables. Listings and forms will use fallback data.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types matching Supabase schema
export interface Listing {
  id: string;
  title: string;
  description: string | null;
  property_type: 'vacant_land' | 'plot' | 'house' | 'apartment' | 'commercial';
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  price: number;
  size: number | null;
  size_unit: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  address: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  images: string[];
  featured: boolean;
  is_new: boolean;
  agent_name: string | null;
  agent_phone: string | null;
  agent_email: string | null;
  web_ref: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_location: string | null;
  client_photo: string | null;
  rating: number;
  review: string;
  property_type: string | null;
  featured: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: 'market_insights' | 'area_guide' | 'buying_tips' | 'selling_tips' | 'investment' | 'news';
  tags: string[];
  author: string | null;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

export interface LeadInsert {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  property_id?: string;
  property_title?: string;
  lead_type: 'inquiry' | 'valuation' | 'contact' | 'wishlist';
}

export interface ValuationInsert {
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb?: string;
  city?: string;
  property_type?: string;
  size?: string;
  notes?: string;
}

// Fallback data for when Supabase is not configured
export const FALLBACK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Spacious Vacant Stand - Ohenimuri',
    description: 'Prime vacant land in the sought-after Ohenimuri area of Walkerville. Ideal for residential development with easy access to major roads.',
    property_type: 'vacant_land',
    status: 'for_sale',
    price: 380000,
    size: 970,
    size_unit: 'm2',
    bedrooms: null,
    bathrooms: null,
    garages: null,
    address: null,
    suburb: 'Ohenimuri',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    featured: true,
    is_new: true,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-001',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prime Plot - Walkerville Manor',
    description: 'Beautiful plot in Walkerville Manor with stunning views. Perfect for building your dream home.',
    property_type: 'plot',
    status: 'for_sale',
    price: 420000,
    size: 1240,
    size_unit: 'm2',
    bedrooms: null,
    bathrooms: null,
    garages: null,
    address: null,
    suburb: 'Walkerville Manor',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    featured: true,
    is_new: true,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-002',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Residential Stand - Ohenimuri',
    description: 'Well-positioned residential stand in a quiet neighbourhood. Utilities nearby.',
    property_type: 'vacant_land',
    status: 'for_sale',
    price: 340000,
    size: 906,
    size_unit: 'm2',
    bedrooms: null,
    bathrooms: null,
    garages: null,
    address: null,
    suburb: 'Ohenimuri',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'],
    featured: false,
    is_new: true,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-003',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Large Corner Stand - Walkerville',
    description: 'Exceptional corner stand offering maximum exposure and development potential.',
    property_type: 'vacant_land',
    status: 'for_sale',
    price: 430000,
    size: 1487,
    size_unit: 'm2',
    bedrooms: null,
    bathrooms: null,
    garages: null,
    address: null,
    suburb: 'Ohenimuri',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    featured: true,
    is_new: false,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-004',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Affordable Starter Plot',
    description: 'Entry-level plot perfect for first-time buyers looking to build their own home.',
    property_type: 'plot',
    status: 'for_sale',
    price: 310000,
    size: 605,
    size_unit: 'm2',
    bedrooms: null,
    bathrooms: null,
    garages: null,
    address: null,
    suburb: 'Ohenimuri',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80'],
    featured: false,
    is_new: true,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-005',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Family Home - Walkerville',
    description: 'Charming 3-bedroom family home in a secure neighbourhood with a large garden.',
    property_type: 'house',
    status: 'for_sale',
    price: 1250000,
    size: 220,
    size_unit: 'm2',
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    address: null,
    suburb: 'Walkerville',
    city: 'Walkerville',
    province: 'Gauteng',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
    featured: true,
    is_new: true,
    agent_name: 'Tshepo Serote',
    agent_phone: '073 712 4178',
    agent_email: 'info@youngprop.co.za',
    web_ref: 'YP-006',
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    client_name: 'Sipho Dlamini',
    client_location: 'Walkerville, Gauteng',
    client_photo: null,
    rating: 5,
    review: 'YoungProp made buying my first plot an absolute breeze. Tshepo was professional, patient and guided me through every step. I highly recommend them to anyone looking for land in Walkerville.',
    property_type: 'Vacant Land',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    client_name: 'Nomsa Khumalo',
    client_location: 'Johannesburg South',
    client_photo: null,
    rating: 5,
    review: 'Exceptional service from start to finish. The team at YoungProp understood exactly what I was looking for and found me the perfect plot within my budget. Very impressed!',
    property_type: 'Plot',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    client_name: 'Pieter van der Berg',
    client_location: 'Mondeor, Johannesburg',
    client_photo: null,
    rating: 5,
    review: 'I sold my vacant land through YoungProp and the process was seamless. They marketed my property well and got me a great price. Will definitely use them again.',
    property_type: 'Vacant Land',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    client_name: 'Thandi Mokoena',
    client_location: 'Walkerville Manor',
    client_photo: null,
    rating: 4,
    review: 'Professional and responsive team. They kept me updated throughout the entire process and answered all my questions promptly. Great experience overall.',
    property_type: 'Plot',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    client_name: 'Johan Pretorius',
    client_location: 'Gauteng',
    client_photo: null,
    rating: 5,
    review: "YoungProp helped me find an investment plot that exceeded my expectations. Their knowledge of the Walkerville area is unmatched. Highly recommended for property investors.",
    property_type: 'Plot',
    featured: true,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Walkerville: Why Vacant Land is the Smart Investment in 2025',
    slug: 'walkerville-vacant-land-investment-2025',
    excerpt: "Discover why Walkerville is becoming one of Gauteng's most sought-after areas for vacant land investment, with prices rising steadily and demand outpacing supply.",
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    category: 'market_insights',
    tags: ['Walkerville', 'Investment', 'Vacant Land'],
    author: 'Tshepo Serote',
    published: true,
    published_at: new Date().toISOString(),
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: "First-Time Buyer's Guide to Purchasing Vacant Land in South Africa",
    slug: 'first-time-buyers-guide-vacant-land-south-africa',
    excerpt: 'Everything you need to know about buying vacant land in South Africa, from understanding title deeds to navigating the transfer process.',
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    category: 'buying_tips',
    tags: ['First-Time Buyer', 'Vacant Land', 'South Africa'],
    author: 'YoungProp Team',
    published: true,
    published_at: new Date().toISOString(),
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'How to Maximise the Value of Your Land Before Selling',
    slug: 'maximise-land-value-before-selling',
    excerpt: 'Practical tips to increase the market value of your vacant land or plot before listing it for sale, from boundary surveys to zoning upgrades.',
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'selling_tips',
    tags: ['Selling', 'Land Value', 'Tips'],
    author: 'YoungProp Team',
    published: true,
    published_at: new Date().toISOString(),
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
  },
];
