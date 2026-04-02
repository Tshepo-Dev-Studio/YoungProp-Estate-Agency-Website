// Google Analytics 4 and Meta Pixel integration

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Initialize Google Analytics
export function initGA() {
  if (!GA_MEASUREMENT_ID) {
    console.info('[Analytics] Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID to enable.');
    return;
  }

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  console.info('[Analytics] Google Analytics initialized:', GA_MEASUREMENT_ID);
}

// Initialize Meta Pixel
export function initMetaPixel() {
  if (!META_PIXEL_ID) {
    console.info('[Analytics] Meta Pixel not configured. Set VITE_META_PIXEL_ID to enable.');
    return;
  }

  // Load Meta Pixel script
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq!('init', META_PIXEL_ID);
  window.fbq!('track', 'PageView');

  console.info('[Analytics] Meta Pixel initialized:', META_PIXEL_ID);
}

// Track page view (call on route change)
export function trackPageView(path: string) {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
  }
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

// Track custom events
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
  if (window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
}

// Track lead submission
export function trackLead(leadType: string) {
  trackEvent('generate_lead', { lead_type: leadType });
  if (window.fbq) {
    window.fbq('track', 'Lead', { content_name: leadType });
  }
}

// Track property view
export function trackPropertyView(propertyId: string, propertyTitle: string, price: number) {
  trackEvent('view_item', {
    item_id: propertyId,
    item_name: propertyTitle,
    value: price,
    currency: 'ZAR',
  });
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [propertyId],
      content_name: propertyTitle,
      value: price,
      currency: 'ZAR',
    });
  }
}

// Track contact button clicks
export function trackContact(method: 'phone' | 'email' | 'whatsapp') {
  trackEvent('contact', { method });
}
