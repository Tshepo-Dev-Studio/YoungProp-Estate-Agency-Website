import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Properties',
    href: '/properties',
    children: [
      { label: 'All Properties', href: '/properties' },
      { label: 'Vacant Land', href: '/properties?type=vacant_land' },
      { label: 'Plots', href: '/properties?type=plot' },
      { label: 'Houses', href: '/properties?type=house' },
    ],
  },
  { label: 'Free Valuation', href: '/valuation' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-navy shadow-lg';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* Top bar */}
      <div className="hidden lg:block bg-navy-dark border-b border-white/10">
        <div className="container flex items-center justify-between py-1.5">
          <p className="text-white/60 text-xs">Registered with the PPRA | Serving Walkerville & Gauteng</p>
          <a
            href="tel:0737124178"
            className="flex items-center gap-1.5 text-gold text-xs font-medium hover:text-gold-light transition-colors"
          >
            <Phone size={12} />
            073 712 4178
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center shadow-md group-hover:bg-gold-dark transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" fill="#0d1b3e"/>
              <path d="M9 21V15H15V21" stroke="#0d1b3e" strokeWidth="0.5"/>
            </svg>
          </div>
          <div>
            <span className="block text-white font-bold text-lg leading-tight tracking-wide font-display">YOUNGPROP</span>
            <span className="block text-gold text-xs tracking-[0.2em] uppercase leading-tight">Estate Agency</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-gold text-sm font-medium transition-colors rounded-md hover:bg-white/5"
                >
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-white/5 ${
                  location === link.href ? 'text-gold' : 'text-white/90 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20to%20enquire%20about%20a%20property."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-sm py-2 px-4"
          >
            WhatsApp Us
          </a>
          <Link href="/valuation" className="btn-outline-white text-sm py-2 px-4">
            Free Valuation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-white/90 hover:text-gold hover:bg-white/5 rounded-md text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 border-l border-white/10 pl-4">
                    {link.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-white/60 hover:text-gold text-sm transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href="https://wa.me/27737124178?text=Hi%20YoungProp%2C%20I%27d%20like%20to%20enquire%20about%20a%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-sm justify-center"
              >
                WhatsApp Us
              </a>
              <Link href="/valuation" className="btn-outline-white text-sm justify-center">
                Free Valuation
              </Link>
              <a href="tel:0737124178" className="flex items-center justify-center gap-2 text-gold text-sm">
                <Phone size={14} />
                073 712 4178
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
