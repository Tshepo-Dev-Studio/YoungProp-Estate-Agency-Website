import { and, desc, eq, sql, isNull, not } from "drizzle-orm";
import { z } from "zod";
import {
  agentProfiles,
  deals,
  leads,
  tasks,
  valuations,
  activityLog,
  referralPartners,
  agentInvites,
  referralAccessTokens,
  users,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function logActivity(
  userId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  details?: string
) {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(activityLog).values({ userId, action, entityType, entityId, details });
  } catch (e) {
    console.warn("[Activity Log] Failed:", e);
  }
}

// Resolve agentProfile from userId — returns null if not found
async function getAgentProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(agentProfiles)
    .where(eq(agentProfiles.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

// Resolve referralPartner from userId — returns null if not found
async function getReferralPartnerProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(referralPartners)
    .where(eq(referralPartners.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

// ─── Admin guard ─────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Router ──────────────────────────────────────────────────────────────────
export const portalRouter = router({

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT PROFILE
  // ═══════════════════════════════════════════════════════════════════════════

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const result = await db
      .select()
      .from(agentProfiles)
      .where(eq(agentProfiles.userId, ctx.user.id))
      .limit(1);
    return result[0] ?? null;
  }),

  upsertProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(2),
        phone: z.string().optional(),
        agentType: z
          .enum(["full_time", "part_time", "referral_partner", "intern"])
          .default("full_time"),
        ffcNumber: z.string().optional(),
        bio: z.string().optional(),
        targetMonthly: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await db
        .select()
        .from(agentProfiles)
        .where(eq(agentProfiles.userId, ctx.user.id))
        .limit(1);
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
        await db
          .update(agentProfiles)
          .set(profileData)
          .where(eq(agentProfiles.userId, ctx.user.id));
      } else {
        await db
          .insert(agentProfiles)
          .values({ ...profileData, userId: ctx.user.id });
      }
      await logActivity(ctx.user.id, "profile_updated", "agent_profile");
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // DEALS — scoped by role
  // ═══════════════════════════════════════════════════════════════════════════

  listMyDeals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    if (ctx.user.role === "admin") {
      return db.select().from(deals).orderBy(desc(deals.createdAt)).limit(200);
    }
    const profile = await getAgentProfile(ctx.user.id);
    if (!profile) return [];
    return db
      .select()
      .from(deals)
      .where(eq(deals.agentId, profile.id))
      .orderBy(desc(deals.createdAt));
  }),

  createDeal: protectedProcedure
    .input(
      z.object({
        propertyTitle: z.string().min(2),
        propertyAddress: z.string().optional(),
        dealType: z.enum(["sale", "rental", "valuation", "referral"]).default("sale"),
        clientName: z.string().min(2),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
        askingPrice: z.number().optional(),
        notes: z.string().optional(),
        expectedCloseDate: z.string().optional(),
        referralPartnerId: z.number().optional(),
        referralFeeAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Interns cannot create deals independently
      const profile = await getAgentProfile(ctx.user.id);
      if (profile?.agentType === "intern") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Interns cannot create deals independently. Please ask your manager.",
        });
      }
      const agentId = profile?.id ?? ctx.user.id;
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
        referralPartnerId: input.referralPartnerId,
        referralFeeAmount: input.referralFeeAmount?.toString(),
        expectedCloseDate: input.expectedCloseDate
          ? new Date(input.expectedCloseDate)
          : undefined,
      });
      await logActivity(
        ctx.user.id,
        "deal_created",
        "deal",
        Number(result[0].insertId),
        `New deal: ${input.propertyTitle}`
      );
      return { success: true, id: Number(result[0].insertId) };
    }),

  updateDealStage: protectedProcedure
    .input(
      z.object({
        dealId: z.number(),
        stage: z.enum([
          "lead",
          "viewing_scheduled",
          "offer_made",
          "offer_accepted",
          "conveyancing",
          "transfer",
          "closed_won",
          "closed_lost",
        ]),
        notes: z.string().optional(),
        offerPrice: z.number().optional(),
        commissionAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const updateData: Record<string, unknown> = { stage: input.stage };
      if (input.notes) updateData.notes = input.notes;
      if (input.offerPrice !== undefined)
        updateData.offerPrice = input.offerPrice.toString();
      if (input.commissionAmount !== undefined)
        updateData.commissionAmount = input.commissionAmount.toString();
      if (input.stage === "closed_won" || input.stage === "closed_lost") {
        updateData.closedAt = new Date();
      }
      await db.update(deals).set(updateData).where(eq(deals.id, input.dealId));
      await logActivity(
        ctx.user.id,
        "deal_stage_updated",
        "deal",
        input.dealId,
        `Stage: ${input.stage}`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // TASKS — scoped by role
  // ═══════════════════════════════════════════════════════════════════════════

  listMyTasks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    if (ctx.user.role === "admin") {
      return db.select().from(tasks).orderBy(desc(tasks.createdAt)).limit(200);
    }
    const profile = await getAgentProfile(ctx.user.id);
    if (!profile) return [];
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.agentId, profile.id))
      .orderBy(desc(tasks.createdAt));
  }),

  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        dealId: z.number().optional(),
        dueDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const profile = await getAgentProfile(ctx.user.id);
      const agentId = profile?.id ?? ctx.user.id;
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
    .input(
      z.object({
        taskId: z.number(),
        status: z.enum(["todo", "in_progress", "done", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === "done") updateData.completedAt = new Date();
      await db.update(tasks).set(updateData).where(eq(tasks.id, input.taskId));
      await logActivity(
        ctx.user.id,
        "task_updated",
        "task",
        input.taskId,
        `Status: ${input.status}`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // LEADS — scoped by role
  // ═══════════════════════════════════════════════════════════════════════════

  listLeads: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100);
  }),

  updateLeadStatus: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        status: z.enum(["new", "contacted", "qualified", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(leads)
        .set({ status: input.status })
        .where(eq(leads.id, input.leadId));
      await logActivity(
        ctx.user.id,
        "lead_updated",
        "lead",
        input.leadId,
        `Status: ${input.status}`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // VALUATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  listValuations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(valuations).orderBy(desc(valuations.createdAt)).limit(100);
  }),

  updateValuationStatus: protectedProcedure
    .input(
      z.object({
        valuationId: z.number(),
        status: z.enum(["pending", "scheduled", "completed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(valuations)
        .set({ status: input.status })
        .where(eq(valuations.id, input.valuationId));
      await logActivity(
        ctx.user.id,
        "valuation_updated",
        "valuation",
        input.valuationId,
        `Status: ${input.status}`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD STATS — role-scoped
  // ═══════════════════════════════════════════════════════════════════════════

  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const isAdmin = ctx.user.role === "admin";
    const profile = await getAgentProfile(ctx.user.id);
    const agentId = profile?.id ?? ctx.user.id;

    const [totalLeadsRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads);
    const [newLeadsRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, "new"));
    const [pendingValRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(valuations)
      .where(eq(valuations.status, "pending"));

    let myDealsCount = 0;
    let myActiveDeals = 0;
    let myClosedDeals = 0;
    let myTasksCount = 0;
    let myPendingTasks = 0;
    let commissionYTD = 0;
    let allAgentsCount = 0;

    if (isAdmin) {
      const [td] = await db.select({ count: sql<number>`count(*)` }).from(deals);
      const [ad] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals)
        .where(sql`stage NOT IN ('closed_won','closed_lost')`);
      const [cd] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals)
        .where(eq(deals.stage, "closed_won"));
      const [comm] = await db
        .select({ total: sql<number>`COALESCE(SUM(commissionAmount), 0)` })
        .from(deals)
        .where(
          and(
            eq(deals.stage, "closed_won"),
            sql`YEAR(closedAt) = YEAR(NOW())`
          )
        );
      const [agents] = await db
        .select({ count: sql<number>`count(*)` })
        .from(agentProfiles)
        .where(eq(agentProfiles.status, "active"));
      myDealsCount = Number(td.count);
      myActiveDeals = Number(ad.count);
      myClosedDeals = Number(cd.count);
      commissionYTD = Number(comm.total);
      allAgentsCount = Number(agents.count);
    } else if (profile) {
      const [td] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals)
        .where(eq(deals.agentId, agentId));
      const [ad] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals)
        .where(
          and(
            eq(deals.agentId, agentId),
            sql`stage NOT IN ('closed_won','closed_lost')`
          )
        );
      const [cd] = await db
        .select({ count: sql<number>`count(*)` })
        .from(deals)
        .where(and(eq(deals.agentId, agentId), eq(deals.stage, "closed_won")));
      const [tt] = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(eq(tasks.agentId, agentId));
      const [pt] = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(and(eq(tasks.agentId, agentId), eq(tasks.status, "todo")));
      const [comm] = await db
        .select({ total: sql<number>`COALESCE(SUM(commissionAmount), 0)` })
        .from(deals)
        .where(
          and(
            eq(deals.agentId, agentId),
            eq(deals.stage, "closed_won"),
            sql`YEAR(closedAt) = YEAR(NOW())`
          )
        );
      myDealsCount = Number(td.count);
      myActiveDeals = Number(ad.count);
      myClosedDeals = Number(cd.count);
      myTasksCount = Number(tt.count);
      myPendingTasks = Number(pt.count);
      commissionYTD = Number(comm.total);
    }

    return {
      totalLeads: Number(totalLeadsRow.count),
      newLeads: Number(newLeadsRow.count),
      pendingValuations: Number(pendingValRow.count),
      myDeals: myDealsCount,
      myActiveDeals,
      myClosedDeals,
      myTasks: myTasksCount,
      myPendingTasks,
      commissionYTD,
      allAgentsCount,
      isAdmin,
      agentType: profile?.agentType ?? null,
      targetMonthly: profile?.targetMonthly ? Number(profile.targetMonthly) : null,
    };
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVITY LOG
  // ═══════════════════════════════════════════════════════════════════════════

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    if (ctx.user.role === "admin") {
      return db
        .select()
        .from(activityLog)
        .orderBy(desc(activityLog.createdAt))
        .limit(30);
    }
    return db
      .select()
      .from(activityLog)
      .where(eq(activityLog.userId, ctx.user.id))
      .orderBy(desc(activityLog.createdAt))
      .limit(20);
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Agents management
  // ═══════════════════════════════════════════════════════════════════════════

  listAllAgents: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(agentProfiles).orderBy(agentProfiles.fullName);
  }),

  updateAgentStatus: adminProcedure
    .input(
      z.object({
        agentId: z.number(),
        status: z.enum(["active", "inactive", "pending"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(agentProfiles)
        .set({ status: input.status })
        .where(eq(agentProfiles.id, input.agentId));
      await logActivity(
        ctx.user.id,
        "agent_status_updated",
        "agent_profile",
        input.agentId,
        `Status: ${input.status}`
      );
      return { success: true };
    }),

  updateAgentCommissionRate: adminProcedure
    .input(
      z.object({
        agentId: z.number(),
        commissionRate: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(agentProfiles)
        .set({ commissionRate: input.commissionRate.toString() })
        .where(eq(agentProfiles.id, input.agentId));
      await logActivity(
        ctx.user.id,
        "agent_commission_updated",
        "agent_profile",
        input.agentId,
        `Rate: ${input.commissionRate}%`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Commission tracker
  // ═══════════════════════════════════════════════════════════════════════════

  getCommissionSummary: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { deals: [], summary: { totalCommission: 0, totalPaid: 0, totalPending: 0 } };

    const closedDeals = await db
      .select()
      .from(deals)
      .where(eq(deals.stage, "closed_won"))
      .orderBy(desc(deals.closedAt))
      .limit(200);

    const agentMap = new Map<number, string>();
    const allAgents = await db.select().from(agentProfiles);
    for (const a of allAgents) agentMap.set(a.id, a.fullName);

    const enriched = closedDeals.map((d) => ({
      ...d,
      agentName: agentMap.get(d.agentId) ?? "Unknown",
    }));

    const totalCommission = enriched.reduce(
      (sum, d) => sum + Number(d.commissionAmount ?? 0),
      0
    );
    const totalPaid = enriched
      .filter((d) => d.commissionPaid)
      .reduce((sum, d) => sum + Number(d.commissionAmount ?? 0), 0);
    const totalPending = totalCommission - totalPaid;

    return {
      deals: enriched,
      summary: { totalCommission, totalPaid, totalPending },
    };
  }),

  markCommissionPaid: adminProcedure
    .input(z.object({ dealId: z.number(), paid: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(deals)
        .set({ commissionPaid: input.paid })
        .where(eq(deals.id, input.dealId));
      await logActivity(
        ctx.user.id,
        "commission_marked",
        "deal",
        input.dealId,
        `Paid: ${input.paid}`
      );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Referral payouts
  // ═══════════════════════════════════════════════════════════════════════════

  listReferralPayouts: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    // Get all deals that have a referral partner linked
    const referralDeals = await db
      .select()
      .from(deals)
      .where(not(isNull(deals.referralPartnerId)))
      .orderBy(desc(deals.createdAt))
      .limit(200);

    // Enrich with partner names
    const partnerIds = Array.from(new Set(referralDeals.map((d) => d.referralPartnerId!)));
    const partnerMap = new Map<number, string>();
    if (partnerIds.length > 0) {
      const partners = await db.select().from(referralPartners);
      for (const p of partners) partnerMap.set(p.id, p.fullName);
    }

    return referralDeals.map((d) => ({
      ...d,
      referralPartnerName: partnerMap.get(d.referralPartnerId!) ?? "Unknown",
    }));
  }),

  markReferralFeePaid: adminProcedure
    .input(z.object({ dealId: z.number(), paid: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(deals)
        .set({ referralFeePaid: input.paid })
        .where(eq(deals.id, input.dealId));
      await logActivity(
        ctx.user.id,
        "referral_fee_marked",
        "deal",
        input.dealId,
        `Paid: ${input.paid}`
      );
      return { success: true };
    }),

  toggleShowPriceToReferrer: adminProcedure
    .input(z.object({ dealId: z.number(), show: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(deals)
        .set({ showPriceToReferrer: input.show })
        .where(eq(deals.id, input.dealId));
      return { success: true };
    }),

  listAllReferralPartners: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(referralPartners)
      .orderBy(desc(referralPartners.createdAt));
  }),

  updateReferralPartnerStatus: adminProcedure
    .input(
      z.object({
        partnerId: z.number(),
        status: z.enum(["active", "inactive", "pending"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db
        .update(referralPartners)
        .set({ status: input.status })
        .where(eq(referralPartners.id, input.partnerId));
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // REFERRAL PARTNER — their own view
  // ═══════════════════════════════════════════════════════════════════════════

  getMyReferralPartnerProfile: protectedProcedure.query(async ({ ctx }) => {
    return getReferralPartnerProfile(ctx.user.id);
  }),

  upsertReferralPartnerProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(2),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        referralSource: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const existing = await getReferralPartnerProfile(ctx.user.id);
      if (existing) {
        await db
          .update(referralPartners)
          .set({
            fullName: input.fullName,
            phone: input.phone,
            email: input.email,
            referralSource: input.referralSource,
          })
          .where(eq(referralPartners.userId, ctx.user.id));
      } else {
        await db.insert(referralPartners).values({
          userId: ctx.user.id,
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          referralSource: input.referralSource,
          status: "active",
        });
      }
      return { success: true };
    }),

  getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const partner = await getReferralPartnerProfile(ctx.user.id);
    if (!partner) return [];
    return db
      .select()
      .from(deals)
      .where(eq(deals.referralPartnerId, partner.id))
      .orderBy(desc(deals.createdAt));
  }),

  getReferralEarnings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { total: 0, paid: 0, pending: 0, count: 0 };
    const partner = await getReferralPartnerProfile(ctx.user.id);
    if (!partner) return { total: 0, paid: 0, pending: 0, count: 0 };

    const myDeals = await db
      .select()
      .from(deals)
      .where(eq(deals.referralPartnerId, partner.id));

    const total = myDeals.reduce(
      (sum, d) => sum + Number(d.referralFeeAmount ?? 0),
      0
    );
    const paid = myDeals
      .filter((d) => d.referralFeePaid)
      .reduce((sum, d) => sum + Number(d.referralFeeAmount ?? 0), 0);

    return {
      total,
      paid,
      pending: total - paid,
      count: myDeals.length,
    };
  }),

  submitReferral: protectedProcedure
    .input(
      z.object({
        clientName: z.string().min(2),
        clientPhone: z.string().min(7),
        clientEmail: z.string().email().optional(),
        propertyInterest: z.string().optional(),
        notes: z.string().optional(),
        referralType: z.enum(["sale", "rental", "valuation"]).default("sale"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const partner = await getReferralPartnerProfile(ctx.user.id);
      if (!partner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be a registered referral partner to submit referrals.",
        });
      }
      // Default referral fee by type
      const defaultFee =
        input.referralType === "sale"
          ? 2500
          : input.referralType === "rental"
          ? 1500
          : 500;

      // We create a deal record in "lead" stage linked to this partner
      // agentId defaults to 1 (admin) — admin will assign to an agent later
      const result = await db.insert(deals).values({
        agentId: 1,
        propertyTitle: input.propertyInterest ?? "TBC",
        propertyAddress: undefined,
        dealType: input.referralType === "valuation" ? "valuation" : input.referralType,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        notes: input.notes,
        stage: "lead",
        referralPartnerId: partner.id,
        referralFeeAmount: defaultFee.toString(),
        referralFeePaid: false,
        showPriceToReferrer: false,
      });

      // Update partner's total referrals count
      await db
        .update(referralPartners)
        .set({ totalReferrals: (partner.totalReferrals ?? 0) + 1 })
        .where(eq(referralPartners.id, partner.id));

      await logActivity(
        ctx.user.id,
        "referral_submitted",
        "deal",
        Number(result[0].insertId),
        `Referral: ${input.clientName}`
      );
      return { success: true, id: Number(result[0].insertId) };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Agent Invite System
  // ═══════════════════════════════════════════════════════════════════════════

  createAgentInvite: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "agent", "intern"]).default("agent"),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Generate a secure random token
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await db.insert(agentInvites).values({
        token,
        email: input.email,
        role: input.role,
        invitedBy: ctx.user.id,
        used: false,
        expiresAt,
      });
      const inviteUrl = `${input.origin}/portal/join/${token}`;
      await logActivity(ctx.user.id, "invite_created", "agent_invite", undefined, `Invited: ${input.email}`);
      return { success: true, inviteUrl, token };
    }),

  listAgentInvites: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(agentInvites).orderBy(desc(agentInvites.createdAt)).limit(100);
  }),

  validateInviteToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(agentInvites)
        .where(eq(agentInvites.token, input.token))
        .limit(1);
      const invite = result[0];
      if (!invite) return { valid: false, reason: "not_found" };
      if (invite.used) return { valid: false, reason: "already_used" };
      if (new Date(invite.expiresAt) < new Date()) return { valid: false, reason: "expired" };
      return { valid: true, email: invite.email, role: invite.role };
    }),

  acceptInvite: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        fullName: z.string().min(2),
        phone: z.string().optional(),
        ffcNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const result = await db
        .select()
        .from(agentInvites)
        .where(eq(agentInvites.token, input.token))
        .limit(1);
      const invite = result[0];
      if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired invite link." });
      }
      // Create agent profile
      await db.insert(agentProfiles).values({
        userId: ctx.user.id,
        fullName: input.fullName,
        phone: input.phone,
        agentType: invite.role === "intern" ? "intern" : "full_time",
        ffcNumber: input.ffcNumber,
        status: "active",
      });
      // Mark invite as used
      await db
        .update(agentInvites)
        .set({ used: true, usedAt: new Date() })
        .where(eq(agentInvites.token, input.token));
      // Update user role in users table
      await db
        .update(users)
        .set({ role: invite.role === "admin" ? "admin" : "user" })
        .where(eq(users.id, ctx.user.id));
      await logActivity(ctx.user.id, "invite_accepted", "agent_invite", invite.id, `Profile created: ${input.fullName}`);
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Referral Partner Token Links
  // ═══════════════════════════════════════════════════════════════════════════

  generateReferralPartnerLink: adminProcedure
    .input(
      z.object({
        partnerId: z.number(),
        partnerName: z.string(),
        partnerEmail: z.string().email().optional(),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      await db.insert(referralAccessTokens).values({
        token,
        partnerId: input.partnerId,
        partnerName: input.partnerName,
        partnerEmail: input.partnerEmail,
        active: true,
      });
      const portalUrl = `${input.origin}/partner/${token}`;
      await logActivity(ctx.user.id, "partner_link_generated", "referral_partner", input.partnerId, `Link for: ${input.partnerName}`);
      return { success: true, portalUrl, token };
    }),

  listReferralPartnerTokens: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(referralAccessTokens)
      .orderBy(desc(referralAccessTokens.createdAt))
      .limit(100);
  }),

  validatePartnerToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(referralAccessTokens)
        .where(eq(referralAccessTokens.token, input.token))
        .limit(1);
      const tokenRecord = result[0];
      if (!tokenRecord || !tokenRecord.active) return { valid: false };
      // Update last accessed
      await db
        .update(referralAccessTokens)
        .set({ lastAccessedAt: new Date() })
        .where(eq(referralAccessTokens.token, input.token));
      return {
        valid: true,
        partnerId: tokenRecord.partnerId,
        partnerName: tokenRecord.partnerName,
        partnerEmail: tokenRecord.partnerEmail,
      };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN — Dashboard stats (enhanced with invite + token counts)
  // ═══════════════════════════════════════════════════════════════════════════

  getPendingInvitesCount: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(agentInvites)
      .where(and(eq(agentInvites.used, false)));
    return Number(result[0]?.count ?? 0);
  }),
});
