import { Link } from 'wouter';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" fill="#0d1b3e"/>
                </svg>
              </div>
              <div>
                <span className="block text-white font-bold text-lg leading-tight font-display">YOUNGPROP</span>
                <span className="block text-gold text-xs tracking-[0.2em] uppercase">Estate Agency</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Your trusted property specialists in Walkerville and Gauteng. Helping buyers, sellers,
              and investors achieve their property goals with professionalism and integrity.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/youngprop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://www.instagram.com/youngprop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/youngprop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Properties for Sale', href: '/properties' },
                { label: 'Vacant Land', href: '/properties?type=vacant_land' },
                { label: 'Plots', href: '/properties?type=plot' },
                { label: 'Houses', href: '/properties?type=house' },
                { label: 'Free Valuation', href: '/valuation' },
                { label: 'Blog & Articles', href: '/blog' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Areas We Serve</h4>
            <ul className="space-y-2.5">
              {[
                'Walkerville',
                'Ohenimuri',
                'Walkerville Manor',
                'Mondeor',
                'Johannesburg South',
                'Midvaal',
                'Meyerton',
                'Vereeniging',
                'Gauteng (All Areas)',
              ].map(area => (
                <li key={area}>
                  <Link
                    href={`/properties?q=${encodeURIComponent(area)}`}
                    className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-1.5"
                  >
                    <MapPin size={11} className="text-gold/50" />
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:0737124178"
                  className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-gold/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={14} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-sm">073 712 4178</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@youngprop.co.za"
                  className="flex items-start gap-3 text-white/60 hover:text-gold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-gold/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={14} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">Email</p>
                    <p className="text-sm">info@youngprop.co.za</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">Location</p>
                    <p className="text-sm">Walkerville, Gauteng<br />South Africa</p>
                  </div>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20to%20enquire%20about%20a%20property."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm w-full justify-center"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {currentYear} YoungProp Estate Agency. All rights reserved.
            Registered with the PPRA.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-gold text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-gold text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
