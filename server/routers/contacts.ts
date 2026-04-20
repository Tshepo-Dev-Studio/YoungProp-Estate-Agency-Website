import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { contacts, contactNotes, contactStageHistory } from "../../drizzle/schema";
import { eq, and, desc, like, or } from "drizzle-orm";

// Pipeline stages per contact type
export const CONTACT_STAGES = {
  buyer: ["General", "App Set", "Seen", "Follow-Up", "Signed", "Cancelled"],
  seller: ["General", "Evaluation", "Mandate Signed", "Seeking Buyers", "Buyer Found", "Cancelled"],
  tenant: ["General", "App Set", "Seen", "Application", "Approved", "Active Tenant", "Cancelled"],
  landlord: ["General", "Evaluation", "Mandate Signed", "Seeking Tenants", "Tenant Found", "Active Lease", "Cancelled"],
} as const;

const contactInput = z.object({
  fullName: z.string().min(1),
  firstName: z.string().optional(),
  surname: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  idNumber: z.string().optional(),
  contactType: z.enum(["buyer", "seller", "tenant", "landlord"]),
  currentStage: z.string().default("General"),
  source: z.string().optional(),
  assignedAgentId: z.number().optional(),
  assistantAgentId: z.number().optional(),
  assignedAdminId: z.number().optional(),
  // POPIA
  popiaConsent: z.boolean().optional(),
  // Buyer fields
  budget: z.string().optional(),
  preApproval: z.enum(["yes", "no", "in_progress"]).optional(),
  areaOfInterest: z.string().optional(),
  requirements: z.string().optional(),
  // Seller fields
  propertyAddress: z.string().optional(),
  estimatedValue: z.string().optional(),
  mandateType: z.enum(["sole", "open", "joint_sole"]).optional(),
  initialNote: z.string().optional(),
});

export const contactsRouter = router({
  // List contacts — admin/ceo sees all, agent sees own
  list: protectedProcedure
    .input(z.object({
      contactType: z.enum(["buyer", "seller", "tenant", "landlord"]).optional(),
      search: z.string().optional(),
      stage: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const isAdminOrCeo = ctx.user.role === "admin" || ctx.user.role === "ceo";
      
      let query = db.select().from(contacts);
      
      const conditions = [];
      
      // Scope to agent's own contacts unless admin/ceo
      if (!isAdminOrCeo) {
        conditions.push(eq(contacts.assignedAgentId, ctx.user.id));
      }
      
      if (input.contactType) {
        conditions.push(eq(contacts.contactType, input.contactType));
      }
      
      if (input.stage) {
        conditions.push(eq(contacts.currentStage, input.stage));
      }
      
      if (input.search) {
        conditions.push(
          or(
            like(contacts.fullName, `%${input.search}%`),
            like(contacts.phone, `%${input.search}%`),
            like(contacts.email, `%${input.search}%`)
          )
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }
      
      const results = await query
        .orderBy(desc(contacts.updatedAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return results;
    }),

  // Get single contact with notes and stage history
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      
      const [contact] = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, input.id))
        .limit(1);
      
      if (!contact) throw new Error("Contact not found");
      
      const notes = await db
        .select()
        .from(contactNotes)
        .where(eq(contactNotes.contactId, input.id))
        .orderBy(desc(contactNotes.createdAt));
      
      const history = await db
        .select()
        .from(contactStageHistory)
        .where(eq(contactStageHistory.contactId, input.id))
        .orderBy(desc(contactStageHistory.changedAt));
      
      return { contact, notes, history };
    }),

  // Create contact
  create: protectedProcedure
    .input(contactInput)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { initialNote, ...contactData } = input;
      
      const [created] = await db.insert(contacts).values({
        ...contactData,
        userId: ctx.user.id,
        assignedAgentId: contactData.assignedAgentId ?? ctx.user.id,
        leadDate: new Date(),
      });
      
      const contactId = (created as any).insertId;
      
      // Save initial note if provided
      if (initialNote && contactId) {
        await db.insert(contactNotes).values({
          contactId,
          noteType: "intro_inquiry",
          noteContent: initialNote,
          author: ctx.user.name ?? "System",
        });
      }
      
      // Record initial stage in history
      if (contactId) {
        await db.insert(contactStageHistory).values({
          contactId,
          fromStage: null,
          toStage: contactData.currentStage ?? "General",
          changedBy: ctx.user.id,
          notes: "Contact created",
        });
      }
      
      return { success: true, contactId };
    }),

  // Update contact
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      data: contactInput.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db
        .update(contacts)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),

  // Update stage — records history automatically
  updateStage: protectedProcedure
    .input(z.object({
      contactId: z.number(),
      newStage: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      // Get current stage
      const [contact] = await db
        .select({ currentStage: contacts.currentStage })
        .from(contacts)
        .where(eq(contacts.id, input.contactId))
        .limit(1);
      
      if (!contact) throw new Error("Contact not found");
      
      // Update stage
      await db
        .update(contacts)
        .set({ currentStage: input.newStage, lastContactedDate: new Date(), updatedAt: new Date() })
        .where(eq(contacts.id, input.contactId));
      
      // Record history
      await db.insert(contactStageHistory).values({
        contactId: input.contactId,
        fromStage: contact.currentStage,
        toStage: input.newStage,
        changedBy: ctx.user.id,
        notes: input.notes,
      });
      
      return { success: true };
    }),

  // Add note to contact
  addNote: protectedProcedure
    .input(z.object({
      contactId: z.number(),
      noteType: z.enum(["intro_inquiry", "transcript_log", "transcript_summary", "custom_notes"]),
      noteContent: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(contactNotes).values({
        contactId: input.contactId,
        noteType: input.noteType,
        noteContent: input.noteContent,
        author: ctx.user.name ?? "Agent",
      });
      
      // Update last contacted date
      await db
        .update(contacts)
        .set({ lastContactedDate: new Date(), updatedAt: new Date() })
        .where(eq(contacts.id, input.contactId));
      
      return { success: true };
    }),

  // Delete contact (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "ceo") {
        throw new Error("Insufficient permissions");
      }
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  // Get pipeline summary — count per stage per type
  getPipelineSummary: protectedProcedure
    .input(z.object({
      contactType: z.enum(["buyer", "seller", "tenant", "landlord"]),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { stages: [], total: 0 };
      const isAdminOrCeo = ctx.user.role === "admin" || ctx.user.role === "ceo";
      
      const conditions = [eq(contacts.contactType, input.contactType)];
      if (!isAdminOrCeo) {
        conditions.push(eq(contacts.assignedAgentId, ctx.user.id));
      }
      
      const results = await db
        .select()
        .from(contacts)
        .where(and(...conditions));
      
      const stages = CONTACT_STAGES[input.contactType];
      const summary = stages.map((stage: string) => ({
        stage,
        count: results.filter((c: typeof results[0]) => c.currentStage === stage).length,
        contacts: results.filter((c: typeof results[0]) => c.currentStage === stage),
      }));
      
      return { stages: summary, total: results.length };
    }),

  // Get stages for a contact type
  getStages: protectedProcedure
    .input(z.object({
      contactType: z.enum(["buyer", "seller", "tenant", "landlord"]),
    }))
    .query(({ input }) => {
      return CONTACT_STAGES[input.contactType];
    }),
});
