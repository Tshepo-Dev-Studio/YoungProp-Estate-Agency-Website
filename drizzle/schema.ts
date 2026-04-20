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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
