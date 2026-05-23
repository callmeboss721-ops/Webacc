import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAccounts, getAccountById, createAccount, updateAccount, deleteAccount,
  getAgents, getAgentById, createAgent, updateAgent, deleteAgent,
  getExpenses, createExpense, updateExpense, deleteExpense,
  createSlip, getSlipsByExpense,
  getDashboardStats,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== ACCOUNTS =====
  accounts: router({
    list: protectedProcedure
      .input(z.object({ search: z.string().optional(), bankCode: z.string().optional() }).optional())
      .query(({ ctx, input }) => getAccounts(ctx.user.id, input?.search, input?.bankCode)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => getAccountById(input.id, ctx.user.id)),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        bankCode: z.string().min(1),
        bankName: z.string().min(1),
        accountNumber: z.string().min(1),
        accountType: z.string().optional(),
        pin: z.string().optional(),
        phone: z.string().optional(),
        lineId: z.string().optional(),
        promptpay: z.string().optional(),
        balance: z.string().optional(),
        amountDue: z.string().optional(),
        amountPaid: z.string().optional(),
        note: z.string().optional(),
        avatarUrl: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => createAccount({ ...input, userId: ctx.user.id })),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        bankCode: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: z.string().optional(),
        pin: z.string().optional(),
        phone: z.string().optional(),
        lineId: z.string().optional(),
        promptpay: z.string().optional(),
        balance: z.string().optional(),
        amountDue: z.string().optional(),
        amountPaid: z.string().optional(),
        note: z.string().optional(),
        avatarUrl: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      }))
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return updateAccount(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteAccount(input.id, ctx.user.id)),
  }),

  // ===== AGENTS =====
  agents: router({
    list: protectedProcedure.query(({ ctx }) => getAgents(ctx.user.id)),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        phone: z.string().optional(),
        lineId: z.string().optional(),
        note: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => createAgent({ ...input, userId: ctx.user.id })),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        lineId: z.string().optional(),
        note: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      }))
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return updateAgent(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteAgent(input.id, ctx.user.id)),
  }),

  // ===== EXPENSES =====
  expenses: router({
    list: protectedProcedure
      .input(z.object({ agentId: z.number().optional() }).optional())
      .query(({ ctx, input }) => getExpenses(ctx.user.id, input?.agentId)),

    create: protectedProcedure
      .input(z.object({
        agentId: z.number().optional(),
        accountId: z.number().optional(),
        type: z.enum(["due", "reimbursed"]),
        amount: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["pending", "paid", "cancelled"]).optional(),
        slipUrl: z.string().optional(),
        slipKey: z.string().optional(),
        dueDate: z.date().optional(),
        note: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => createExpense({ ...input, userId: ctx.user.id })),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "paid", "cancelled"]).optional(),
        slipUrl: z.string().optional(),
        slipKey: z.string().optional(),
        paidAt: z.date().optional(),
        note: z.string().optional(),
        amount: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return updateExpense(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteExpense(input.id, ctx.user.id)),
  }),

  // ===== SLIPS / FILE UPLOAD =====
  slips: router({
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        mimeType: z.string(),
        base64Data: z.string(),
        expenseId: z.number().optional(),
        accountId: z.number().optional(),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const key = `slips/${ctx.user.id}/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        await createSlip({
          userId: ctx.user.id,
          expenseId: input.expenseId,
          accountId: input.accountId,
          fileUrl: url,
          fileKey: key,
          fileName: input.fileName,
          mimeType: input.mimeType,
          note: input.note,
        });
        return { url, key };
      }),

    listByExpense: protectedProcedure
      .input(z.object({ expenseId: z.number() }))
      .query(({ ctx, input }) => getSlipsByExpense(input.expenseId, ctx.user.id)),
  }),

  // ===== DASHBOARD =====
  dashboard: router({
    stats: protectedProcedure.query(({ ctx }) => getDashboardStats(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
