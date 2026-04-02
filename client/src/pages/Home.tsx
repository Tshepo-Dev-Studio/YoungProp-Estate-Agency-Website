import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedListings from '@/components/FeaturedListings';
import WhyChooseUs from '@/components/WhyChooseUs';
import ValuationCTA from '@/components/ValuationCTA';
import Testimonials from '@/components/Testimonials';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedListings />
      <WhyChooseUs />
      <ValuationCTA />
      <Testimonials />
      <BlogSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
