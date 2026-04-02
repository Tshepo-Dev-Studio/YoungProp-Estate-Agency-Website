import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Calendar, User, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { supabase, FALLBACK_BLOG_POSTS, type BlogPost as BlogPostType } from '@/lib/supabase';

const CATEGORY_LABELS: Record<string, string> = {
  market_insights: 'Market Insights',
  area_guide: 'Area Guide',
  buying_tips: 'Buying Tips',
  selling_tips: 'Selling Tips',
  investment: 'Investment',
  news: 'News',
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('website_blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error || !data) {
          const fallback = FALLBACK_BLOG_POSTS.find(p => p.slug === slug);
          setPost(fallback || null);
        } else {
          setPost(data as BlogPostType);
        }
      } catch {
        const fallback = FALLBACK_BLOG_POSTS.find(p => p.slug === slug);
        setPost(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-navy mb-4">Article Not Found</h1>
          <Link href="/blog" className="btn-navy">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  // Format content with basic markdown-like rendering
  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-20" style={{ minHeight: '400px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.cover_image || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80'}')` }}
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative container py-16 flex flex-col justify-end" style={{ minHeight: '400px' }}>
          <Link href="/blog" className="flex items-center gap-2 text-white/60 hover:text-gold text-sm transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block bg-gold/20 border border-gold/30 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 text-shadow">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                    {post.author.charAt(0)}
                  </div>
                  {post.author}
                </span>
              )}
              {publishedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {publishedDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-gold pl-4 mb-8 italic">
                  {post.excerpt}
                </p>
              )}
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
                {paragraphs.map((para, i) => {
                  if (para.startsWith('**') && para.endsWith('**')) {
                    return <h3 key={i} className="font-display text-xl font-bold text-navy mt-6">{para.replace(/\*\*/g, '')}</h3>;
                  }
                  if (para.startsWith('**')) {
                    const parts = para.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i} className="text-gray-600 leading-relaxed">
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy font-semibold">{part}</strong> : part)}
                      </p>
                    );
                  }
                  return <p key={i} className="text-gray-600 leading-relaxed">{para}</p>;
                })}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Tag size={12} />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-navy rounded-xl p-6 text-white">
              <h3 className="font-display text-lg font-bold mb-3">Interested in a Property?</h3>
              <p className="text-white/70 text-sm mb-4">Browse our current listings or request a free valuation.</p>
              <div className="space-y-2">
                <Link href="/properties" className="btn-gold w-full justify-center text-sm">Browse Properties</Link>
                <Link href="/valuation" className="btn-outline-white w-full justify-center text-sm">Free Valuation</Link>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-navy mb-3 text-sm">Contact Our Team</h3>
              <p className="text-gray-500 text-xs mb-4">Have questions about this article or the property market?</p>
              <a
                href="https://wa.me/27737124178"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-2.5 px-4 rounded-lg text-sm hover:bg-[#1ebe5d] transition-colors"
              >
                WhatsApp Us
              </a>
              <a href="tel:0737124178" className="flex items-center justify-center gap-2 w-full mt-2 border border-gray-200 text-navy font-medium py-2.5 px-4 rounded-lg text-sm hover:border-gold hover:text-gold transition-colors">
                073 712 4178
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
