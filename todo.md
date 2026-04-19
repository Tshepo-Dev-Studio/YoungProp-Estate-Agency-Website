# YoungProp Website TODO

- [x] Set up database schema (website_listings, website_leads, website_valuations, website_testimonials, website_blog_posts) in Supabase
- [x] Configure global styles with navy blue and gold color scheme
- [x] Set up Google Fonts (Inter + Playfair Display)
- [x] Build Navbar with sticky scroll behavior and mobile menu
- [x] Build Hero section with search bar and property type tabs
- [x] Build Property Listings page with Supabase integration
- [x] Build Property filtering (type, location, price range)
- [x] Build Property search with autocomplete
- [x] Build individual Property detail page
- [x] Build Lead capture / Property inquiry form with Supabase
- [x] Build Free Valuation form with Supabase
- [x] Build Contact page with form and Supabase
- [x] Build Testimonials section with star ratings
- [x] Build Blog/Articles section with SEO
- [x] Build individual Blog post page
- [x] Build About Us / Team section
- [x] Build WhatsApp click-to-chat floating button
- [x] Integrate Google Analytics (GA4) — dynamic, activated by VITE_GA_MEASUREMENT_ID env var
- [x] Integrate Meta Pixel — dynamic, activated by VITE_META_PIXEL_ID env var
- [x] Build Stats/social proof section
- [x] Build Footer with links, contact info, PPRA badge
- [x] Responsive design for mobile, tablet, desktop
- [x] Add Supabase secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [x] Write Vitest tests for backend procedures (8 tests passing)
- [x] Add Google Analytics Measurement ID (VITE_GA_MEASUREMENT_ID) — G-8GS5M1ECB1
- [x] Add Meta Pixel ID (VITE_META_PIXEL_ID) — YoungProp Estate Agency Pixel 1678097876562490
- [x] Configure custom domain (youngprop.co.za) — instructions provided to user; action required after publishing via Management UI Settings → Domains
- [x] Save final checkpoint with all analytics IDs configured
- [x] Write detailed analytics explainer document (Pixel, GA4, purpose and strategy)
- [x] Write detailed website-building guide and proposal document
- [x] Find YoungProp logo from project files and integrate into Navbar and Footer
- [x] Verify all pages (Properties, Blog, About, Contact, Valuation, Property Detail) are accessible and populated
- [x] Scrape all content from youngprop.co.za — site is behind Cloudflare bot protection; content recovered from 2024 Wayback Machine snapshot and rebuilt from original brand knowledge
- [x] Build "Join Our Team / Agents" page with recruitment form and agent benefits (/join-us)
- [x] Build "Referrals" page with referral program details and submission form (/referrals)
- [x] Valuation page already fully built with Supabase integration and professional copy
- [x] Add JoinUsAndReferralsBanner to homepage with Join Our Team and Referral Programme CTAs
- [x] All original website sections mirrored and improved: 10 pages total, all with professional copy

## GitHub & Vercel Deployment
- [x] Create GitHub repository "YoungProp Estate Agency Website" — github.com/Tshepo-Dev-Studio/YoungProp-Estate-Agency-Website
- [x] Push all website code to GitHub
- [x] Deploy to Vercel — https://young-prop-estate-agency-website.vercel.app
- [x] Configure Vercel environment variables (Supabase, GA4, Meta Pixel)

## Staff & Admin Platform
- [x] Design staff/admin platform architecture (role-based: agent, admin)
- [x] Build PortalDashboard with stats, activity feed, quick actions
- [x] Build PortalDeals — deal pipeline with stage tracking (Prospecting → Closed)
- [x] Build PortalTasks — task management with priority and due dates
- [x] Build PortalLeads — lead management with status updates
- [x] Build PortalListings — listings overview with Supabase editor link
- [x] Build PortalValuations — valuation requests with status management
- [x] Build PortalProfile — agent profile with FFC number, bio, monthly target
- [x] Build AdminAgents — admin-only view of all registered agents
- [x] Connect portal to existing Supabase database (agent_profiles, deals, tasks, activity_log tables)
- [ ] Save final checkpoint and deliver portal to user
