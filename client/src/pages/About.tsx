import { Link } from 'wouter';
import { Shield, Award, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const VALUES = [
  { icon: Shield, title: 'Integrity', description: 'We operate with complete transparency and honesty in every transaction.' },
  { icon: Users, title: 'Client-First', description: 'Your goals are our priority. We tailor our service to your unique needs.' },
  { icon: Award, title: 'Excellence', description: 'We maintain the highest professional standards in all we do.' },
  { icon: TrendingUp, title: 'Results-Driven', description: 'We are committed to achieving the best possible outcomes for our clients.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-navy pt-24 pb-14">
        <div className="container text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">About Us</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            YoungProp Estate Agency
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            A dedicated real estate firm focused on providing clients with a seamless property experience,
            with a particular emphasis on vacant land sales across Gauteng.
          </p>
        </div>
      </div>

      <div className="container py-14">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
            <h2 className="font-display text-3xl font-bold text-navy mb-4 gold-underline">
              Built on Passion for Property
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed mt-6">
              <p>
                YoungProp Estate Agency was founded with a clear vision: to provide South African property buyers,
                sellers, and investors with a professional, transparent, and results-driven real estate service.
              </p>
              <p>
                Based in Walkerville, Gauteng, we have developed deep expertise in the local property market,
                particularly in vacant land and plot sales — a niche that requires specialist knowledge and
                a thorough understanding of zoning, development potential, and market dynamics.
              </p>
              <p>
                Our team is fully registered with the Property Practitioners Regulatory Authority (PPRA),
                ensuring that every transaction is conducted in accordance with the highest legal and
                ethical standards in South Africa.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/contact" className="btn-navy">Get in Touch <ArrowRight size={16} /></Link>
              <Link href="/properties" className="btn-outline-gold">View Properties</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="YoungProp Estate Agency"
              className="rounded-2xl w-full object-cover shadow-xl"
              style={{ height: '420px' }}
            />
            <div className="absolute -bottom-4 -left-4 bg-gold text-navy rounded-xl p-5 shadow-xl">
              <p className="font-bold text-3xl font-display">PPRA</p>
              <p className="text-xs font-semibold uppercase tracking-wide">Registered Agency</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Our Values</p>
            <h2 className="font-display text-3xl font-bold text-navy gold-underline gold-underline-center">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center card-hover">
                <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Our Team</p>
            <h2 className="font-display text-3xl font-bold text-navy gold-underline gold-underline-center">
              Meet the Team
            </h2>
          </div>
          <div className="flex justify-center mt-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm text-center">
              <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                T
              </div>
              <h3 className="font-display text-xl font-bold text-navy">Tshepo Serote</h3>
              <p className="text-gold text-sm font-semibold mb-3">Principal Property Practitioner</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Registered with the PPRA, Tshepo brings extensive knowledge of the Gauteng property market
                with a specialisation in vacant land and plot sales.
              </p>
              <div className="space-y-2">
                <a href="tel:0737124178" className="flex items-center justify-center gap-2 text-sm text-navy hover:text-gold transition-colors">
                  073 712 4178
                </a>
                <a href="mailto:info@youngprop.co.za" className="flex items-center justify-center gap-2 text-sm text-navy hover:text-gold transition-colors">
                  info@youngprop.co.za
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy rounded-2xl p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Work With Us?
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Whether you're buying, selling, or investing, our team is ready to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-gold">Contact Us <ArrowRight size={16} /></Link>
            <Link href="/valuation" className="btn-outline-white">Free Valuation</Link>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
