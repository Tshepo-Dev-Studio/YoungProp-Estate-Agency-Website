import { Shield, Users, TrendingUp, Clock, Award, MapPin } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield,
    title: 'PPRA Registered',
    description: 'Fully registered and compliant with the Property Practitioners Regulatory Authority, ensuring professional and ethical service.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    description: 'Deep knowledge of Walkerville, Ohenimuri, and the broader Gauteng property market. We know every street and every opportunity.',
  },
  {
    icon: Users,
    title: 'Client-First Approach',
    description: 'Every transaction is handled with precision and care. We prioritise your needs and keep you informed at every step.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'Access to real-time market data and insights to help you make informed decisions whether buying, selling, or investing.',
  },
  {
    icon: Clock,
    title: 'Timely Execution',
    description: 'We understand that time is critical in property transactions. Our team ensures swift, efficient processing without compromising quality.',
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'Hundreds of successful transactions and a growing portfolio of satisfied clients across Gauteng and beyond.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#f8f7f4]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Why YoungProp</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4 gold-underline gold-underline-center">
            Your Trusted Property Partner
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-6">
            YoungProp Estate Agency combines local expertise with professional standards to deliver
            a seamless property experience for buyers, sellers, and investors alike.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/5 group-hover:bg-navy flex items-center justify-center mb-4 transition-colors">
                  <Icon size={22} className="text-navy group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-navy text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* About section */}
        <div className="mt-16 bg-navy rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">About Us</p>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Welcome to YoungProp Estate Agency
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                YoungProp Estate Agency is a dedicated real estate firm focused on providing clients
                with a seamless property experience. With a particular emphasis on vacant land sales,
                we assist buyers, sellers, investors, and developers with tailored solutions that
                prioritise clarity, professionalism, and timely execution.
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                Our team is driven by a commitment to excellence, ensuring that every transaction —
                whether a first-time purchase or portfolio expansion — is handled with precision and care.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/contact" className="btn-gold">
                  Contact Us
                </a>
                <a href="/about" className="btn-outline-white">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative min-h-64 lg:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="YoungProp Estate Agency"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-navy/30" />
              {/* Agent card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    T
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">Tshepo Serote</p>
                    <p className="text-gold text-xs">Principal Property Practitioner</p>
                    <a href="tel:0737124178" className="text-gray-500 text-xs hover:text-navy">073 712 4178</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
