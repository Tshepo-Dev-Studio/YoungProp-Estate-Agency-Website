import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { TRPCError } from "@trpc/server";
import {
  contacts, deals, agentProfiles, leads, fullListings,
  expenses, goals, complianceDocs, companyNews, activityLog
} from "../../drizzle/schema";
import { eq, and, desc, gte, count, sum, sql } from "drizzle-orm";

// CEO-only middleware
const ceoProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "ceo" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "CEO or Admin access required" });
  }
  return next({ ctx });
});

export const ceoRouter = router({
  // Main dashboard KPIs
  getDashboardKPIs: ceoProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Contact counts
    const [contactCounts] = await db
      .select({ total: count() })
      .from(contacts);

    const buyerCount = await db.select({ c: count() }).from(contacts).where(eq(contacts.contactType, "buyer"));
    const sellerCount = await db.select({ c: count() }).from(contacts).where(eq(contacts.contactType, "seller"));
    const tenantCount = await db.select({ c: count() }).from(contacts).where(eq(contacts.contactType, "tenant"));
    const landlordCount = await db.select({ c: count() }).from(contacts).where(eq(contacts.contactType, "landlord"));

    // Deal stats
    const allDeals = await db.select().from(deals);
    const activeDeals = allDeals.filter(d => !["closed_won", "closed_lost"].includes(d.stage));
    const closedDeals = allDeals.filter(d => d.stage === "closed_won");
    
    // Commission YTD
    const commissionYTD = closedDeals
      .filter(d => d.closedAt && new Date(d.closedAt) >= startOfYear)
      .reduce((sum, d) => sum + parseFloat(d.commissionAmount?.toString() ?? "0"), 0);

    // Commission MTD
    const commissionMTD = closedDeals
      .filter(d => d.closedAt && new Date(d.closedAt) >= startOfMonth)
      .reduce((sum, d) => sum + parseFloat(d.commissionAmount?.toString() ?? "0"), 0);

    // Active agents
    const [agentCount] = await db
      .select({ c: count() })
      .from(agentProfiles)
      .where(eq(agentProfiles.status, "active"));

    // Active listings
    const [listingCount] = await db
      .select({ c: count() })
      .from(fullListings)
      .where(eq(fullListings.status, "active"));

    // New leads this month (website leads)
    const allLeads = await db.select().from(leads);
    const newLeadsThisMonth = allLeads.filter(l => 
      new Date(l.createdAt) >= startOfMonth
    ).length;

    // Expenses YTD
    const allExpenses = await db.select().from(expenses);
    const expensesYTD = allExpenses
      .filter(e => new Date(e.expenseDate) >= startOfYear)
      .reduce((sum, e) => sum + parseFloat(e.amount?.toString() ?? "0"), 0);

    return {
      contacts: {
        total: contactCounts?.total ?? 0,
        buyers: buyerCount[0]?.c ?? 0,
        sellers: sellerCount[0]?.c ?? 0,
        tenants: tenantCount[0]?.c ?? 0,
        landlords: landlordCount[0]?.c ?? 0,
      },
      deals: {
        total: allDeals.length,
        active: activeDeals.length,
        closed: closedDeals.length,
        pipeline: allDeals.filter(d => d.stage === "lead").length,
      },
      commission: {
        ytd: commissionYTD,
        mtd: commissionMTD,
      },
      team: {
        activeAgents: agentCount?.c ?? 0,
      },
      listings: {
        active: listingCount?.c ?? 0,
      },
      leads: {
        newThisMonth: newLeadsThisMonth,
        total: allLeads.length,
      },
      expenses: {
        ytd: expensesYTD,
      },
    };
  }),

  // Pipeline overview — deals by stage
  getPipelineOverview: ceoProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allDeals = await db.select().from(deals);
    
    const stages = ["lead", "viewing_scheduled", "offer_made", "offer_accepted", "conveyancing", "transfer", "closed_won", "closed_lost"];
    
    return stages.map(stage => ({
      stage,
      count: allDeals.filter(d => d.stage === stage).length,
      totalValue: allDeals
        .filter(d => d.stage === stage)
        .reduce((sum, d) => sum + parseFloat(d.offerPrice?.toString() ?? d.askingPrice?.toString() ?? "0"), 0),
    }));
  }),

  // Contact pipeline overview — contacts by type and stage
  getContactPipeline: ceoProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};

    const allContacts = await db.select().from(contacts);
    
    const types = ["buyer", "seller", "tenant", "landlord"] as const;
    const result: Record<string, Record<string, number>> = {};
    
    for (const type of types) {
      const typeContacts = allContacts.filter(c => c.contactType === type);
      result[type] = {};
      for (const c of typeContacts) {
        result[type][c.currentStage] = (result[type][c.currentStage] ?? 0) + 1;
      }
    }
    
    return result;
  }),

  // Agent performance table
  getAgentPerformance: ceoProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const agents = await db.select().from(agentProfiles).where(eq(agentProfiles.status, "active"));
    const allDeals = await db.select().from(deals);
    const allContacts = await db.select().from(contacts);

    return agents.map(agent => {
      const agentDeals = allDeals.filter(d => d.agentId === agent.userId);
      const agentContacts = allContacts.filter(c => c.assignedAgentId === agent.userId);
      const closedDeals = agentDeals.filter(d => d.stage === "closed_won");
      const commissionEarned = closedDeals.reduce(
        (sum, d) => sum + parseFloat(d.commissionAmount?.toString() ?? "0"), 0
      );
      
      return {
        agentId: agent.userId,
        name: agent.fullName,
        agentType: agent.agentType,
        activeDeals: agentDeals.filter(d => !["closed_won", "closed_lost"].includes(d.stage)).length,
        closedDeals: closedDeals.length,
        totalContacts: agentContacts.length,
        commissionEarned,
        targetMonthly: parseFloat(agent.targetMonthly?.toString() ?? "0"),
        commissionRate: parseFloat(agent.commissionRate?.toString() ?? "50"),
      };
    });
  }),

  // Revenue trend — last 12 months
  getRevenueTrend: ceoProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allDeals = await db
      .select()
      .from(deals)
      .where(eq(deals.stage, "closed_won"));

    const months: { month: string; revenue: number; deals: number }[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = date.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
      
      const monthDeals = allDeals.filter(d => {
        if (!d.closedAt) return false;
        const closed = new Date(d.closedAt);
        return closed >= date && closed < nextDate;
      });
      
      months.push({
        month: label,
        revenue: monthDeals.reduce((sum, d) => sum + parseFloat(d.commissionAmount?.toString() ?? "0"), 0),
        deals: monthDeals.length,
      });
    }
    
    return months;
  }),

  // Recent activity feed
  getRecentActivity: ceoProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(activityLog)
        .orderBy(desc(activityLog.createdAt))
        .limit(input.limit);
    }),

  // Company news
  getCompanyNews: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(companyNews)
      .orderBy(desc(companyNews.pinned), desc(companyNews.publishedAt))
      .limit(20);
  }),

  createCompanyNews: ceoProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      category: z.enum(["announcement", "policy", "training", "achievement", "market_update", "general"]),
      pinned: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(companyNews).values({
        ...input,
        authorId: ctx.user.id,
      });
      return { success: true };
    }),

  // Goals overview
  getGoals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const isAdminOrCeo = ctx.user.role === "admin" || ctx.user.role === "ceo";
    
    if (isAdminOrCeo) {
      return db.select().from(goals).orderBy(desc(goals.createdAt));
    }
    
    return db.select().from(goals).where(eq(goals.userId, ctx.user.id));
  }),

  createGoal: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      goalType: z.enum(["revenue", "deals", "listings", "leads", "commission", "custom"]),
      targetValue: z.number(),
      unit: z.string().default("ZAR"),
      period: z.enum(["monthly", "quarterly", "annual"]),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(goals).values({
        ...input,
        targetValue: input.targetValue.toString(),
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        userId: ctx.user.id,
      });
      return { success: true };
    }),

  // Compliance overview
  getComplianceDocs: ceoProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(complianceDocs)
      .orderBy(desc(complianceDocs.expiryDate));
  }),

  // Expenses overview
  getExpenses: ceoProcedure
    .input(z.object({
      year: z.number().optional(),
      month: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(expenses)
        .orderBy(desc(expenses.expenseDate))
        .limit(100);
    }),

  addExpense: ceoProcedure
    .input(z.object({
      description: z.string().min(2),
      amount: z.number().positive(),
      category: z.string().default("Other"),
      expenseDate: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(expenses).values({
        description: input.description,
        amount: input.amount.toString(),
        category: input.category,
        expenseDate: new Date(input.expenseDate),
        notes: input.notes,
        userId: ctx.user.id,
      });
      return { success: true };
    }),

  addGoal: ceoProcedure
    .input(z.object({
      title: z.string().min(2),
      goalType: z.enum(["revenue", "deals", "listings", "leads", "commission", "custom"]),
      targetValue: z.number().positive(),
      period: z.enum(["monthly", "quarterly", "annual"]).default("monthly"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 3, 1);
      await db.insert(goals).values({
        title: input.title,
        goalType: input.goalType,
        targetValue: input.targetValue.toString(),
        currentValue: "0",
        period: input.period,
        startDate: input.startDate ? new Date(input.startDate) : now,
        endDate: input.endDate ? new Date(input.endDate) : end,
        userId: ctx.user.id,
        status: "active",
      });
      return { success: true };
    }),

  addComplianceDoc: ceoProcedure
    .input(z.object({
      documentName: z.string().min(2),
      documentType: z.string().optional(),
      status: z.enum(["valid", "expiring_soon", "expired", "pending"]).default("valid"),
      expiryDate: z.string().optional(),
      notes: z.string().optional(),
      holderName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.insert(complianceDocs).values({
        docName: input.documentName,
        docType: input.documentType ?? "Other",
        status: input.status,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
        notes: input.notes,
      });
      return { success: true };
    }),
});
