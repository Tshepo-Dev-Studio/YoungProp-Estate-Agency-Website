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
- [x] Save final checkpoint and deliver portal to user — version 7de85a7f

## Three-Layer Portal System
- [x] Audit existing portal code and map current state
- [x] Write portal design proposal document (Admin, Agent, Referral Partner views)
- [x] Update drizzle/schema.ts — add referral_partners table + 5 new fields to deals table
- [x] Generate and apply migration for new schema
- [x] Update server/routers/portal.ts — add referral partner procedures + admin commission/payout routes + scope agent queries
- [x] Update PortalLayout.tsx — role-based routing (admin sidebar, agent sidebar, referral partner no-sidebar)
- [x] Build ReferralPartnerPortal.tsx — single-page view with referrals table + inline submission form
- [x] Build AdminCommission.tsx — commission tracker with agent breakdown and YTD totals
- [x] Build AdminPayouts.tsx — referral payout management with mark-as-paid
- [x] Build AdminApplications.tsx — review Join Us form submissions from Supabase
- [x] Update PortalDashboard.tsx — role-scoped KPIs (admin vs agent vs intern)
- [x] Update App.tsx — add new portal routes
- [x] Run tests (pnpm test) — 18/18 passing
- [x] Save checkpoint and deliver

## Interactive Portal Prototypes (Design Review Phase)
- [x] Build /portal/preview entry page — switcher letting client jump between all three role prototypes
- [x] Build /portal/preview/admin — Admin prototype: full sidebar, dashboard with sample KPIs, deals table, commission tracker, referral payouts, agents page, applications page
- [x] Build /portal/preview/agent — Agent prototype: scoped sidebar (no Team/Finance), personal KPIs, Kanban deal pipeline, tasks, leads, profile page
- [x] Build /portal/preview/referral — Referral Partner prototype: no sidebar, full-width, stats cards, referral history table, how-it-works, submit form
- [x] Run TypeScript checks — 0 errors
- [x] Save checkpoint and deliver live preview links to client

## Live Portal Conversion & Authentication
- [x] Convert AdminPreview.tsx into live PortalDashboard/AdminAgents/AdminCommission/AdminPayouts/AdminApplications pages with real Supabase data
- [x] Convert AgentPreview.tsx into live PortalDeals (Kanban), PortalLeads, PortalProfile pages with real data scoped to logged-in agent
- [x] Convert ReferralPreview.tsx into live ReferralPartnerPortal.tsx with real referral data and working form submission
- [x] Build invite system: admin sends invite → agent clicks link → completes profile → gets portal access
- [x] Build referral partner token-link system: admin generates unique access link per partner → partner uses link to access their portal (no login required beyond Manus OAuth)
- [x] Add agent_invites table to schema (token, email, role, used, expires_at)
- [x] Add referral_access_tokens table to schema (token, partner_id, active, last_accessed_at)
- [x] Build /portal/join/:token invite acceptance page (agent completes profile)
- [x] Build /partner/:token referral partner access page (token-gated, full portal)
- [x] Add "Invite Agent" button to AdminAgents page with invite management panel
- [x] Add generateReferralPartnerLink + listReferralPartnerTokens procedures to portal router
- [x] Run tests (18/18 passing) and TypeScript checks (0 errors)
- [x] Push to GitHub and save checkpoint

## CEO Master Dashboard
- [x] Design CEO dashboard layout: agency revenue, all deals pipeline, lead conversion funnel, commission YTD, agent performance table, referral stats, website traffic
- [x] Build /portal/ceo route with real-time data from all portal tables
- [x] CEO dashboard gated behind admin role check
- [x] Save checkpoint and deliver CEO dashboard to client

## Platform Merger — ypestateagency-business-platform → youngprop-website

- [x] Update drizzle/schema.ts — add contacts, contact_notes, deal_stages, full_listings, compliance_docs, expenses, goals, company_news tables
- [x] Generate and apply migration SQL for all new tables
- [x] Add tRPC procedures for contacts (CRUD, stage updates, notes, POPIA consent) — server/routers/contacts.ts
- [x] Add tRPC procedures for CEO dashboard (pipeline, commission, leads, agent performance, revenue trend) — server/routers/ceo.ts
- [x] Add tRPC procedures for financials (expenses, goals, addExpense, addGoal) — server/routers/ceo.ts
- [x] Add tRPC procedures for compliance (addComplianceDoc) — server/routers/ceo.ts
- [x] Build CEO Command Centre page — /portal/ceo (KPIs, revenue trend, deal pipeline, agent performance, company news)
- [x] Build CRM Contacts page — /portal/contacts (4-type pipeline Kanban: Buyers, Sellers, Tenants, Landlords)
- [x] Build Contact Profile page — /portal/contacts/:id (notes, stage history, stage update)
- [x] Build Listings page — /portal/listings (full listings management with create/delete)
- [x] Build Deed Search page — /portal/deed-search (area search and property lookup)
- [x] Build Financials page — /portal/financials (KPIs, expenses, goals, P&L overview)
- [x] Build Compliance page — /portal/compliance (document tracker, regulatory checklist, expiry alerts)
- [x] Update PortalLayout.tsx — added CEO Tools section (Command Centre, Financials, Compliance, Deed Search) and Contacts (CRM) to admin sidebar
- [x] Update App.tsx — added all new portal routes
- [x] Run TypeScript checks — 0 errors
- [x] Run all tests — 18/18 passing
- [ ] Push to GitHub and save final checkpoint
