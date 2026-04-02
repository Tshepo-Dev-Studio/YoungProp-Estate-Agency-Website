import { Link } from 'wouter';
import { Search, MessageSquare, FileCheck, Key, ArrowRight } from 'lucide-react';

const buyingSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Search',
    description: 'Explore our listings online or tell us what you\'re looking for. We\'ll match you with properties that fit your budget, location, and lifestyle.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'View & Enquire',
    description: 'Book a viewing with one of our registered agents. We\'ll walk you through the property, answer your questions, and provide honest guidance.',
  },
  {
    number: '03',
    icon: FileCheck,
    title: 'Offer & Paperwork',
    description: 'Once you\'ve found the right property, we handle the offer to purchase, negotiate on your behalf, and manage all the legal documentation.',
  },
  {
    number: '04',
    icon: Key,
    title: 'Transfer & Move In',
    description: 'We coordinate with the conveyancer and bank to ensure a smooth transfer. You get the keys — we celebrate with you.',
  },
];

const sellingSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Free Valuation',
    description: 'We start with a free, no-obligation property valuation to determine the right asking price based on current market data and comparable sales.',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Mandate & Marketing',
    description: 'We sign a mandate, photograph your property professionally, and list it across all major portals and our own platform with targeted digital marketing.',
  },
  {
    number: '03',
    icon: FileCheck,
    title: 'Viewings & Offers',
    description: 'We screen buyers, manage viewings, and present all offers to you. We negotiate to achieve the best possible price on your behalf.',
  },
  {
    number: '04',
    icon: Key,
    title: 'Sold & Transferred',
    description: 'We manage the entire sales process through to registration. You receive your proceeds — we handle the complexity so you don\'t have to.',
  },
];

export default function HowWeWork() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Simple, Transparent Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
            How We <span className="text-gold">Work</span>
          </h2>
          <p className="text-navy/60 text-lg leading-relaxed">
            Whether you're buying or selling, our process is designed to be clear, efficient, and stress-free.
            Our registered agents guide you every step of the way.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Buying */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                <Key size={18} className="text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy font-display">Buying a Property</h3>
            </div>
            <div className="space-y-6">
              {buyingSteps.map((step, i) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center shrink-0 font-display">
                      {step.number}
                    </div>
                    {i < buyingSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-navy/10 mt-2 mb-0 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.icon size={15} className="text-gold" />
                      <h4 className="font-bold text-navy text-sm">{step.title}</h4>
                    </div>
                    <p className="text-navy/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 mt-4 text-navy font-semibold text-sm border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
            >
              Browse Properties <ArrowRight size={14} />
            </Link>
          </div>

          {/* Selling */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <FileCheck size={18} className="text-navy" />
              </div>
              <h3 className="text-xl font-bold text-navy font-display">Selling Your Property</h3>
            </div>
            <div className="space-y-6">
              {sellingSteps.map((step, i) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gold text-navy text-sm font-bold flex items-center justify-center shrink-0 font-display">
                      {step.number}
                    </div>
                    {i < sellingSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-gold/20 mt-2 mb-0 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <step.icon size={15} className="text-gold" />
                      <h4 className="font-bold text-navy text-sm">{step.title}</h4>
                    </div>
                    <p className="text-navy/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/valuation"
              className="inline-flex items-center gap-2 mt-4 text-navy font-semibold text-sm border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
            >
              Get Free Valuation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
