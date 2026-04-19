import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { agentProfiles, deals, leads, tasks, valuations, activityLog } from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

// Helper to log activity
async function logActivity(userId: number, action: string, entityType?: string, entityId?: number, details?: string) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(activityLog).values({ userId, action, entityType, entityId, details });
  } catch (e) {
    console.warn("[Activity Log] Failed:", e);
  }
}

export const portalRouter = router({
  // ─── Agent Profile ───────────────────────────────────────────────────────────
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const result = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
    return result[0] ?? null;
  }),

  upsertProfile: protectedProcedure
    .input(z.object({
      fullName: z.string().min(2),
      phone: z.string().optional(),
      agentType: z.enum(["full_time", "part_time", "referral_partner", "intern"]).default("full_time"),
      ffcNumber: z.string().optional(),
      bio: z.string().optional(),
      targetMonthly: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const existing = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
      const profileData = {
        fullName: input.fullName,
        phone: input.phone,
        agentType: input.agentType,
        ffcNumber: input.ffcNumber,
        bio: input.bio,
        targetMonthly: input.targetMonthly?.toString(),
        status: "active" as const,
      };
      if (existing.length > 0) {
        await db.update(agentProfiles).set(profileData).where(eq(agentProfiles.userId, ctx.user.id));
      } else {
        await db.insert(agentProfiles).values({ ...profileData, userId: ctx.user.id });
      }
      await logActivity(ctx.user.id, "profile_updated", "agent_profile");
      return { success: true };
    }),

  // ─── Deals ───────────────────────────────────────────────────────────────────
  listMyDeals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
    if (!profile[0] && ctx.user.role !== "admin") return [];
    const agentId = profile[0]?.id ?? 0;
    if (ctx.user.role === "admin") {
      return db.select().from(deals).orderBy(desc(deals.createdAt)).limit(100);
    }
    return db.select().from(deals).where(eq(deals.agentId, agentId)).orderBy(desc(deals.createdAt));
  }),

  createDeal: protectedProcedure
    .input(z.object({
      propertyTitle: z.string().min(2),
      propertyAddress: z.string().optional(),
      dealType: z.enum(["sale", "rental", "valuation", "referral"]).default("sale"),
      clientName: z.string().min(2),
      clientEmail: z.string().email().optional(),
      clientPhone: z.string().optional(),
      askingPrice: z.number().optional(),
      notes: z.string().optional(),
      expectedCloseDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
      const agentId = profile[0]?.id ?? ctx.user.id;
      const result = await db.insert(deals).values({
        propertyTitle: input.propertyTitle,
        propertyAddress: input.propertyAddress,
        dealType: input.dealType,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        askingPrice: input.askingPrice?.toString(),
        notes: input.notes,
        agentId,
        stage: "lead",
        expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : undefined,
      });
      await logActivity(ctx.user.id, "deal_created", "deal", Number(result[0].insertId), `New deal: ${input.propertyTitle}`);
      return { success: true, id: Number(result[0].insertId) };
    }),

  updateDealStage: protectedProcedure
    .input(z.object({
      dealId: z.number(),
      stage: z.enum(["lead", "viewing_scheduled", "offer_made", "offer_accepted", "conveyancing", "transfer", "closed_won", "closed_lost"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const updateData: Record<string, unknown> = { stage: input.stage };
      if (input.notes) updateData.notes = input.notes;
      if (input.stage === "closed_won" || input.stage === "closed_lost") {
        updateData.closedAt = new Date();
      }
      await db.update(deals).set(updateData).where(eq(deals.id, input.dealId));
      await logActivity(ctx.user.id, "deal_stage_updated", "deal", input.dealId, `Stage: ${input.stage}`);
      return { success: true };
    }),

  // ─── Tasks ───────────────────────────────────────────────────────────────────
  listMyTasks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
    if (!profile[0] && ctx.user.role !== "admin") return [];
    const agentId = profile[0]?.id ?? ctx.user.id;
    if (ctx.user.role === "admin") {
      return db.select().from(tasks).orderBy(desc(tasks.createdAt)).limit(200);
    }
    return db.select().from(tasks).where(and(eq(tasks.agentId, agentId))).orderBy(desc(tasks.createdAt));
  }),

  createTask: protectedProcedure
    .input(z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      dealId: z.number().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
      const agentId = profile[0]?.id ?? ctx.user.id;
      await db.insert(tasks).values({
        title: input.title,
        description: input.description,
        priority: input.priority,
        dealId: input.dealId,
        agentId,
        status: "todo",
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      });
      await logActivity(ctx.user.id, "task_created", "task", undefined, input.title);
      return { success: true };
    }),

  updateTaskStatus: protectedProcedure
    .input(z.object({
      taskId: z.number(),
      status: z.enum(["todo", "in_progress", "done", "cancelled"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === "done") updateData.completedAt = new Date();
      await db.update(tasks).set(updateData).where(eq(tasks.id, input.taskId));
      await logActivity(ctx.user.id, "task_updated", "task", input.taskId, `Status: ${input.status}`);
      return { success: true };
    }),

  // ─── Leads (admin + agent view) ──────────────────────────────────────────────
  listLeads: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
  }),

  updateLeadStatus: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      status: z.enum(["new", "contacted", "qualified", "closed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(leads).set({ status: input.status }).where(eq(leads.id, input.leadId));
      await logActivity(ctx.user.id, "lead_updated", "lead", input.leadId, `Status: ${input.status}`);
      return { success: true };
    }),

  // ─── Valuations ──────────────────────────────────────────────────────────────
  listValuations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(valuations).orderBy(desc(valuations.createdAt)).limit(100);
  }),

  updateValuationStatus: protectedProcedure
    .input(z.object({
      valuationId: z.number(),
      status: z.enum(["pending", "scheduled", "completed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(valuations).set({ status: input.status }).where(eq(valuations.id, input.valuationId));
      await logActivity(ctx.user.id, "valuation_updated", "valuation", input.valuationId, `Status: ${input.status}`);
      return { success: true };
    }),

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const profile = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, ctx.user.id)).limit(1);
    const agentId = profile[0]?.id ?? ctx.user.id;
    const isAdmin = ctx.user.role === "admin";

    const [totalLeads] = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const [newLeads] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "new"));
    const [pendingValuations] = await db.select({ count: sql<number>`count(*)` }).from(valuations).where(eq(valuations.status, "pending"));

    let myDealsCount = 0;
    let myActiveDeals = 0;
    let myClosedDeals = 0;
    let myTasksCount = 0;
    let myPendingTasks = 0;

    if (isAdmin) {
      const [td] = await db.select({ count: sql<number>`count(*)` }).from(deals);
      const [ad] = await db.select({ count: sql<number>`count(*)` }).from(deals).where(sql`stage NOT IN ('closed_won','closed_lost')`);
      const [cd] = await db.select({ count: sql<number>`count(*)` }).from(deals).where(eq(deals.stage, "closed_won"));
      myDealsCount = Number(td.count);
      myActiveDeals = Number(ad.count);
      myClosedDeals = Number(cd.count);
    } else if (profile[0]) {
      const [td] = await db.select({ count: sql<number>`count(*)` }).from(deals).where(eq(deals.agentId, agentId));
      const [ad] = await db.select({ count: sql<number>`count(*)` }).from(deals).where(and(eq(deals.agentId, agentId), sql`stage NOT IN ('closed_won','closed_lost')`));
      const [cd] = await db.select({ count: sql<number>`count(*)` }).from(deals).where(and(eq(deals.agentId, agentId), eq(deals.stage, "closed_won")));
      const [tt] = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.agentId, agentId));
      const [pt] = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(and(eq(tasks.agentId, agentId), eq(tasks.status, "todo")));
      myDealsCount = Number(td.count);
      myActiveDeals = Number(ad.count);
      myClosedDeals = Number(cd.count);
      myTasksCount = Number(tt.count);
      myPendingTasks = Number(pt.count);
    }

    return {
      totalLeads: Number(totalLeads.count),
      newLeads: Number(newLeads.count),
      pendingValuations: Number(pendingValuations.count),
      myDeals: myDealsCount,
      myActiveDeals,
      myClosedDeals,
      myTasks: myTasksCount,
      myPendingTasks,
      isAdmin,
    };
  }),

  // ─── Admin Procedures ─────────────────────────────────────────────────────
  listAllAgents: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Forbidden");
    const db = await getDb();
    if (!db) return [];
    return db.select().from(agentProfiles).orderBy(agentProfiles.fullName);
  }),

  // ─── Activity Log ────────────────────────────────────────────────────────────
  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(activityLog).where(eq(activityLog.userId, ctx.user.id)).orderBy(desc(activityLog.createdAt)).limit(20);
  }),
});
