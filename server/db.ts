import { eq, and, desc, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, accounts, agents, expenses, slips, type Account, type Agent, type Expense, type Slip, type InsertAccount, type InsertAgent, type InsertExpense, type InsertSlip } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== ACCOUNTS =====
export async function getAccounts(userId: number, search?: string, bankCode?: string) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(accounts).where(eq(accounts.userId, userId)).$dynamic();
  if (search) {
    query = query.where(and(
      eq(accounts.userId, userId),
      or(
        like(accounts.name, `%${search}%`),
        like(accounts.accountNumber, `%${search}%`),
        like(accounts.bankName, `%${search}%`),
        like(accounts.phone, `%${search}%`)
      )
    ));
  }
  if (bankCode && bankCode !== 'all') {
    query = query.where(and(eq(accounts.userId, userId), eq(accounts.bankCode, bankCode)));
  }
  return query.orderBy(desc(accounts.createdAt));
}

export async function getAccountById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, userId))).limit(1);
  return result[0];
}

export async function createAccount(data: InsertAccount) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(accounts).values(data);
  return result;
}

export async function updateAccount(id: number, userId: number, data: Partial<InsertAccount>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(accounts).set(data).where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
}

export async function deleteAccount(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
}

// ===== AGENTS =====
export async function getAgents(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agents).where(eq(agents.userId, userId)).orderBy(desc(agents.createdAt));
}

export async function getAgentById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agents).where(and(eq(agents.id, id), eq(agents.userId, userId))).limit(1);
  return result[0];
}

export async function createAgent(data: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(agents).values(data);
}

export async function updateAgent(id: number, userId: number, data: Partial<InsertAgent>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(agents).set(data).where(and(eq(agents.id, id), eq(agents.userId, userId)));
}

export async function deleteAgent(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(agents).where(and(eq(agents.id, id), eq(agents.userId, userId)));
}

// ===== EXPENSES =====
export async function getExpenses(userId: number, agentId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (agentId) {
    return db.select().from(expenses).where(and(eq(expenses.userId, userId), eq(expenses.agentId, agentId))).orderBy(desc(expenses.createdAt));
  }
  return db.select().from(expenses).where(eq(expenses.userId, userId)).orderBy(desc(expenses.createdAt));
}

export async function createExpense(data: InsertExpense) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(expenses).values(data);
}

export async function updateExpense(id: number, userId: number, data: Partial<InsertExpense>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(expenses).set(data).where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
}

export async function deleteExpense(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
}

// ===== SLIPS =====
export async function createSlip(data: InsertSlip) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(slips).values(data);
}

export async function getSlipsByExpense(expenseId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slips).where(and(eq(slips.expenseId, expenseId), eq(slips.userId, userId)));
}

// ===== DASHBOARD STATS =====
export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalAccounts: 0, totalPaid: 0, totalDue: 0, totalProof: 0 };
  const [acctCount] = await db.select({ count: sql<number>`count(*)` }).from(accounts).where(eq(accounts.userId, userId));
  const [paidSum] = await db.select({ sum: sql<string>`COALESCE(SUM(amount), 0)` }).from(expenses).where(and(eq(expenses.userId, userId), eq(expenses.status, 'paid')));
  const [dueSum] = await db.select({ sum: sql<string>`COALESCE(SUM(amount), 0)` }).from(expenses).where(and(eq(expenses.userId, userId), eq(expenses.status, 'pending')));
  const [slipCount] = await db.select({ count: sql<number>`count(*)` }).from(slips).where(eq(slips.userId, userId));
  return {
    totalAccounts: Number(acctCount?.count ?? 0),
    totalPaid: parseFloat(paidSum?.sum ?? '0'),
    totalDue: parseFloat(dueSum?.sum ?? '0'),
    totalProof: Number(slipCount?.count ?? 0),
  };
}
