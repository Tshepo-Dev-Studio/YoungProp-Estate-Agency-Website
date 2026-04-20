import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "agent", "intern", "ceo"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Properties table
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  propertyType: mysqlEnum("propertyType", ["vacant_land", "plot", "house", "apartment", "commercial"]).notNull(),
  status: mysqlEnum("status", ["for_sale", "for_rent", "sold", "rented"]).default("for_sale").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  size: decimal("size", { precision: 10, scale: 2 }),
  sizeUnit: varchar("sizeUnit", { length: 10 }).default("m2"),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  garages: int("garages"),
  address: varchar("address", { length: 500 }),
  suburb: varchar("suburb", { length: 100 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  images: text("images"), // JSON array of image URLs
  featured: boolean("featured").default(false),
  isNew: boolean("isNew").default(true),
  agentName: varchar("agentName", { length: 100 }),
  agentPhone: varchar("agentPhone", { length: 20 }),
  agentEmail: varchar("agentEmail", { length: 320 }),
  webRef: varchar("webRef", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Leads / Property inquiries
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  message: text("message"),
  propertyId: int("propertyId"),
  propertyTitle: varchar("propertyTitle", { length: 255 }),
  leadType: mysqlEnum("leadType", ["inquiry", "valuation", "contact", "wishlist"]).default("inquiry").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "closed"]).default("new").notNull(),
  source: varchar("source", { length: 50 }).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Valuation requests
export const valuations = mysqlTable("valuations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  suburb: varchar("suburb", { length: 100 }),
  city: varchar("city", { length: 100 }),
  propertyType: varchar("propertyType", { length: 50 }),
  size: varchar("size", { length: 50 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "scheduled", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = typeof valuations.$inferInsert;

// Testimonials
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 100 }).notNull(),
  clientLocation: varchar("clientLocation", { length: 100 }),
  clientPhoto: varchar("clientPhoto", { length: 500 }),
  rating: int("rating").default(5).notNull(),
  review: text("review").notNull(),
  propertyType: varchar("propertyType", { length: 50 }),
  featured: boolean("featured").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Blog posts
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  category: mysqlEnum("category", ["market_insights", "area_guide", "buying_tips", "selling_tips", "investment", "news"]).default("news").notNull(),
  tags: text("tags"), // JSON array
  author: varchar("author", { length: 100 }).default("YoungProp Team"),
  published: boolean("published").default(false),
  publishedAt: timestamp("publishedAt"),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Agent profiles — staff portal
export const agentProfiles = mysqlTable("agent_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fullName: varchar("fullName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  agentType: mysqlEnum("agentType", ["full_time", "part_time", "referral_partner", "intern"]).default("full_time").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending").notNull(),
  ffcNumber: varchar("ffcNumber", { length: 50 }),
  bio: text("bio"),
  profilePhoto: varchar("profilePhoto", { length: 500 }),
  targetMonthly: decimal("targetMonthly", { precision: 15, scale: 2 }),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("50.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentProfile = typeof agentProfiles.$inferSelect;
export type InsertAgentProfile = typeof agentProfiles.$inferInsert;

// Referral partners — external referrers (separate from agent_profiles)
export const referralPartners = mysqlTable("referral_partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fullName: varchar("fullName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  idNumber: varchar("idNumber", { length: 20 }),
  bankDetails: text("bankDetails"), // JSON: { bank, accountNumber, branchCode, accountType }
  referralSource: varchar("referralSource", { length: 100 }), // How they found YoungProp
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending").notNull(),
  totalReferrals: int("totalReferrals").default(0),
  totalEarnings: decimal("totalEarnings", { precision: 15, scale: 2 }).default("0.00"),
  totalPaid: decimal("totalPaid", { precision: 15, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReferralPartner = typeof referralPartners.$inferSelect;
export type InsertReferralPartner = typeof referralPartners.$inferInsert;

// Deals — property transactions tracked by agents
export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  propertyId: int("propertyId"),
  propertyTitle: varchar("propertyTitle", { length: 255 }).notNull(),
  propertyAddress: varchar("propertyAddress", { length: 500 }),
  dealType: mysqlEnum("dealType", ["sale", "rental", "valuation", "referral"]).default("sale").notNull(),
  stage: mysqlEnum("stage", [
    "lead",
    "viewing_scheduled",
    "offer_made",
    "offer_accepted",
    "conveyancing",
    "transfer",
    "closed_won",
    "closed_lost"
  ]).default("lead").notNull(),
  clientName: varchar("clientName", { length: 100 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 20 }),
  askingPrice: decimal("askingPrice", { precision: 15, scale: 2 }),
  offerPrice: decimal("offerPrice", { precision: 15, scale: 2 }),
  commissionAmount: decimal("commissionAmount", { precision: 15, scale: 2 }),
  commissionPaid: boolean("commissionPaid").default(false),
  // Referral partner linkage
  referralPartnerId: int("referralPartnerId"),
  referralFeeAmount: decimal("referralFeeAmount", { precision: 15, scale: 2 }),
  referralFeePaid: boolean("referralFeePaid").default(false),
  showPriceToReferrer: boolean("showPriceToReferrer").default(false),
  notes: text("notes"),
  expectedCloseDate: timestamp("expectedCloseDate"),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// Tasks — agent to-do items linked to deals or standalone
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  dealId: int("dealId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["todo", "in_progress", "done", "cancelled"]).default("todo").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Activity log — audit trail of all portal actions
export const activityLog = mysqlTable("activity_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: int("entityId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

// Agent invites — admin sends invite link to new agents
export const agentInvites = mysqlTable("agent_invites", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "agent", "intern"]).default("agent").notNull(),
  invitedBy: int("invitedBy").notNull(), // userId of admin who sent invite
  used: boolean("used").default(false).notNull(),
  usedAt: timestamp("usedAt"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentInvite = typeof agentInvites.$inferSelect;
export type InsertAgentInvite = typeof agentInvites.$inferInsert;

// Referral access tokens — admin generates a unique link per referral partner
export const referralAccessTokens = mysqlTable("referral_access_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  partnerId: int("partnerId").notNull(), // referral_partners.id
  partnerName: varchar("partnerName", { length: 100 }).notNull(),
  partnerEmail: varchar("partnerEmail", { length: 320 }),
  active: boolean("active").default(true).notNull(),
  lastAccessedAt: timestamp("lastAccessedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralAccessToken = typeof referralAccessTokens.$inferSelect;
export type InsertReferralAccessToken = typeof referralAccessTokens.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM CONTACTS — central contact record (buyer, seller, tenant, landlord)
// ─────────────────────────────────────────────────────────────────────────────
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // owner (admin/agent who created)
  assignedAgentId: int("assignedAgentId"), // agent responsible
  assistantAgentId: int("assistantAgentId"),
  assignedAdminId: int("assignedAdminId"),

  // Identity
  firstName: varchar("firstName", { length: 100 }),
  surname: varchar("surname", { length: 100 }),
  fullName: varchar("fullName", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  mobile: varchar("mobile", { length: 20 }),
  email: varchar("email", { length: 320 }),
  idNumber: varchar("idNumber", { length: 20 }),

  // Classification
  contactType: mysqlEnum("contactType", ["buyer", "seller", "tenant", "landlord"]).notNull(),
  currentStage: varchar("currentStage", { length: 100 }).notNull().default("General"),
  source: varchar("source", { length: 100 }), // website, deed_search, referral, walk_in, etc.
  leadDate: timestamp("leadDate"),
  lastContactedDate: timestamp("lastContactedDate"),

  // POPIA
  popiaConsent: boolean("popiaConsent").default(false),
  popiaConsentDate: timestamp("popiaConsentDate"),

  // Buyer-specific
  budget: varchar("budget", { length: 100 }),
  preApproval: mysqlEnum("preApproval", ["yes", "no", "in_progress"]),
  areaOfInterest: varchar("areaOfInterest", { length: 255 }),
  requirements: text("requirements"),

  // Seller-specific
  propertyAddress: varchar("propertyAddress", { length: 500 }),
  estimatedValue: varchar("estimatedValue", { length: 100 }),
  mandateType: mysqlEnum("mandateType", ["sole", "open", "joint_sole"]),

  // Notes
  initialNote: text("initialNote"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT NOTES — 4-type note architecture per contact
// ─────────────────────────────────────────────────────────────────────────────
export const contactNotes = mysqlTable("contact_notes", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  noteType: mysqlEnum("noteType", ["intro_inquiry", "transcript_log", "transcript_summary", "custom_notes"]).notNull(),
  noteContent: text("noteContent").notNull(),
  author: varchar("author", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactNote = typeof contactNotes.$inferSelect;
export type InsertContactNote = typeof contactNotes.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT STAGE HISTORY — audit trail of stage changes per contact
// ─────────────────────────────────────────────────────────────────────────────
export const contactStageHistory = mysqlTable("contact_stage_history", {
  id: int("id").autoincrement().primaryKey(),
  contactId: int("contactId").notNull(),
  fromStage: varchar("fromStage", { length: 100 }),
  toStage: varchar("toStage", { length: 100 }).notNull(),
  changedBy: int("changedBy"), // userId
  notes: text("notes"),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export type ContactStageHistory = typeof contactStageHistory.$inferSelect;
export type InsertContactStageHistory = typeof contactStageHistory.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// FULL LISTINGS — internal listing management (separate from public properties)
// ─────────────────────────────────────────────────────────────────────────────
export const fullListings = mysqlTable("full_listings", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  contactId: int("contactId"), // linked seller contact

  // Property details
  refNo: varchar("refNo", { length: 50 }),
  address: varchar("address", { length: 500 }).notNull(),
  suburb: varchar("suburb", { length: 100 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  propertyType: mysqlEnum("propertyType", ["house", "apartment", "townhouse", "vacant_land", "commercial", "farm"]).notNull(),
  listingType: mysqlEnum("listingType", ["for_sale", "for_rent"]).default("for_sale").notNull(),

  // Seller
  sellerName: varchar("sellerName", { length: 100 }),
  sellerPhone: varchar("sellerPhone", { length: 20 }),
  sellerEmail: varchar("sellerEmail", { length: 320 }),

  // Pricing
  askingPrice: decimal("askingPrice", { precision: 15, scale: 2 }),
  priceReduced: boolean("priceReduced").default(false),

  // Mandate
  mandateType: mysqlEnum("mandateType", ["sole", "open", "joint_sole"]),
  mandateStartDate: timestamp("mandateStartDate"),
  mandateExpiry: timestamp("mandateExpiry"),

  // Property specs
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  garages: int("garages"),
  size: decimal("size", { precision: 10, scale: 2 }),
  erfSize: decimal("erfSize", { precision: 10, scale: 2 }),
  description: text("description"),
  features: text("features"), // JSON array

  // Media
  images: text("images"), // JSON array of URLs
  floorPlan: varchar("floorPlan", { length: 500 }),
  virtualTour: varchar("virtualTour", { length: 500 }),

  // Status
  status: mysqlEnum("status", ["draft", "active", "under_offer", "sold", "rented", "withdrawn", "expired"]).default("draft").notNull(),
  listedAt: timestamp("listedAt"),
  soldAt: timestamp("soldAt"),

  // Syndication
  publishToProperty24: boolean("publishToProperty24").default(false),
  publishToPrivateProperty: boolean("publishToPrivateProperty").default(false),
  publishToWebsite: boolean("publishToWebsite").default(true),

  // Source (for scraped/imported listings)
  sourceUrl: varchar("sourceUrl", { length: 1000 }),
  consentRecorded: boolean("consentRecorded").default(false),
  consentType: mysqlEnum("consentType", ["verbal", "written"]),
  consentNotes: text("consentNotes"),

  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FullListing = typeof fullListings.$inferSelect;
export type InsertFullListing = typeof fullListings.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// COMPLIANCE DOCUMENTS — FFC, PI insurance, POPIA, mandates, etc.
// ─────────────────────────────────────────────────────────────────────────────
export const complianceDocs = mysqlTable("compliance_docs", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId"), // null = company-level doc
  docType: varchar("docType", { length: 100 }).notNull(), // FFC, PI_insurance, POPIA_policy, etc.
  docName: varchar("docName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  issueDate: timestamp("issueDate"),
  expiryDate: timestamp("expiryDate"),
  status: mysqlEnum("status", ["valid", "expiring_soon", "expired", "pending"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ComplianceDoc = typeof complianceDocs.$inferSelect;
export type InsertComplianceDoc = typeof complianceDocs.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES — operational costs and expense tracking
// ─────────────────────────────────────────────────────────────────────────────
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // marketing, travel, office, subscriptions, etc.
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("ZAR"),
  receiptUrl: varchar("receiptUrl", { length: 1000 }),
  expenseDate: timestamp("expenseDate").notNull(),
  approved: boolean("approved").default(false),
  approvedBy: int("approvedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// GOALS — agent and company performance targets
// ─────────────────────────────────────────────────────────────────────────────
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // null = company goal
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  goalType: mysqlEnum("goalType", ["revenue", "deals", "listings", "leads", "commission", "custom"]).notNull(),
  targetValue: decimal("targetValue", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("currentValue", { precision: 15, scale: 2 }).default("0.00"),
  unit: varchar("unit", { length: 50 }).default("ZAR"), // ZAR, count, %
  period: mysqlEnum("period", ["monthly", "quarterly", "annual"]).default("monthly").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["active", "achieved", "missed", "cancelled"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY NEWS — internal announcements and updates
// ─────────────────────────────────────────────────────────────────────────────
export const companyNews = mysqlTable("company_news", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["announcement", "policy", "training", "achievement", "market_update", "general"]).default("general").notNull(),
  pinned: boolean("pinned").default(false),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyNews = typeof companyNews.$inferSelect;
export type InsertCompanyNews = typeof companyNews.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// DEED SEARCH RECORDS — property ownership lookups
// ─────────────────────────────────────────────────────────────────────────────
export const deedSearchRecords = mysqlTable("deed_search_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  searchQuery: varchar("searchQuery", { length: 500 }).notNull(),
  area: varchar("area", { length: 200 }),
  ownerName: varchar("ownerName", { length: 200 }),
  erfNumber: varchar("erfNumber", { length: 100 }),
  titleDeedNumber: varchar("titleDeedNumber", { length: 100 }),
  propertyAddress: varchar("propertyAddress", { length: 500 }),
  estimatedValue: decimal("estimatedValue", { precision: 15, scale: 2 }),
  notes: text("notes"),
  contactedOwner: boolean("contactedOwner").default(false),
  contactedDate: timestamp("contactedDate"),
  outcome: varchar("outcome", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeedSearchRecord = typeof deedSearchRecords.$inferSelect;
export type InsertDeedSearchRecord = typeof deedSearchRecords.$inferInsert;
