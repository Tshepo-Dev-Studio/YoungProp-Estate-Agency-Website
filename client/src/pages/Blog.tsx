import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Calendar, User, ArrowRight, Tag, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase, FALLBACK_BLOG_POSTS, type BlogPost } from '@/lib/supabase';

const CATEGORY_LABELS: Record<string, string> = {
  market_insights: 'Market Insights',
  area_guide: 'Area Guide',
  buying_tips: 'Buying Tips',
  selling_tips: 'Selling Tips',
  investment: 'Investment',
  news: 'News',
};

const CATEGORY_COLORS: Record<string, string> = {
  market_insights: 'bg-blue-100 text-blue-700',
  area_guide: 'bg-green-100 text-green-700',
  buying_tips: 'bg-yellow-100 text-yellow-700',
  selling_tips: 'bg-purple-100 text-purple-700',
  investment: 'bg-navy/10 text-navy',
  news: 'bg-gray-100 text-gray-600',
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('website_blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error || !data || data.length === 0) {
          setPosts(FALLBACK_BLOG_POSTS);
        } else {
          setPosts(data as BlogPost[]);
        }
      } catch {
        setPosts(FALLBACK_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];
  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy pt-24 pb-14">
        <div className="container text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Property Insights</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Blog & Articles</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Expert advice, market insights, and area guides to help you make informed property decisions.
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Category filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-gold'
              }`}
            >
              {cat === 'all' ? 'All Articles' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-gold" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No articles found.</div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8 grid md:grid-cols-2 card-hover cursor-pointer">
                  <div className="relative" style={{ minHeight: '280px' }}>
                    <img
                      src={featured.cover_image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[featured.category] || 'bg-gray-100 text-gray-600'}`}>
                        {CATEGORY_LABELS[featured.category] || featured.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">Featured Article</span>
                    <h2 className="font-display text-2xl font-bold text-navy mb-3 hover:text-gold transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      {featured.author && <span className="flex items-center gap-1"><User size={11} />{featured.author}</span>}
                      {featured.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(featured.published_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <span className="text-gold font-medium flex items-center gap-2 text-sm">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover h-full flex flex-col cursor-pointer">
                      <div className="relative overflow-hidden" style={{ height: '200px' }}>
                        <img
                          src={post.cover_image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>
                            {CATEGORY_LABELS[post.category] || post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-navy text-base leading-snug mb-2 line-clamp-2 hover:text-gold transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                          <span className="flex items-center gap-1"><User size={11} />{post.author}</span>
                          <span className="text-gold font-medium flex items-center gap-1">Read <ArrowRight size={11} /></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* SEO tags */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-100">
          <p className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
            <Tag size={14} className="text-gold" />
            Explore by Topic
          </p>
          <div className="flex flex-wrap gap-2">
            {['Walkerville Property', 'Vacant Land', 'Plots for Sale', 'First-Time Buyers', 'Property Investment', 'Gauteng Real Estate', 'Selling Tips', 'Buying Tips', 'Market Insights', 'Area Guides'].map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 hover:bg-gold/10 hover:text-gold px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
