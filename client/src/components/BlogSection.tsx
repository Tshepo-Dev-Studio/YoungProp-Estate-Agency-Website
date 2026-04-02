import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { supabase, FALLBACK_BLOG_POSTS, type BlogPost } from '../lib/supabase';

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
  buying_tips: 'bg-gold/20 text-gold-dark',
  selling_tips: 'bg-purple-100 text-purple-700',
  investment: 'bg-navy/10 text-navy',
  news: 'bg-gray-100 text-gray-600',
};

function BlogCard({ post }: { post: BlogPost }) {
  const coverImage = post.cover_image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover h-full flex flex-col cursor-pointer">
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          <img
            src={coverImage}
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
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {post.author && (
                <span className="flex items-center gap-1">
                  <User size={11} />
                  {post.author}
                </span>
              )}
              {publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {publishedDate}
                </span>
              )}
            </div>
            <span className="text-gold font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('website_blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(3);

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

  return (
    <section className="py-20 bg-[#f8f7f4]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Property Insights</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy gold-underline">
              Latest Articles
            </h2>
            <p className="text-gray-500 mt-6 max-w-lg">
              Expert advice, market insights, and area guides to help you make informed property decisions.
            </p>
          </div>
          <Link href="/blog" className="btn-outline-gold whitespace-nowrap self-start md:self-auto">
            View All Articles
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* SEO-friendly tags */}
        <div className="mt-10 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Tag size={11} />
            Popular topics:
          </span>
          {['Walkerville', 'Vacant Land', 'First-Time Buyers', 'Investment', 'Gauteng Property', 'Selling Tips'].map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold px-3 py-1 rounded-full transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
