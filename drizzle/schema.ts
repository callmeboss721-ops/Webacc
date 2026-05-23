import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  bigint,
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

// ตารางบัญชีธนาคาร
export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  bankCode: varchar("bankCode", { length: 32 }).notNull(),
  bankName: varchar("bankName", { length: 128 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 64 }).notNull(),
  accountType: varchar("accountType", { length: 64 }).default("savings"),
  pin: varchar("pin", { length: 64 }),
  phone: varchar("phone", { length: 32 }),
  lineId: varchar("lineId", { length: 128 }),
  promptpay: varchar("promptpay", { length: 64 }),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0"),
  amountDue: decimal("amountDue", { precision: 15, scale: 2 }).default("0"),
  amountPaid: decimal("amountPaid", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  note: text("note"),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

// ตารางทีมงาน/ตัวแทน
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  lineId: varchar("lineId", { length: 128 }),
  note: text("note"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// ตารางรายการค่าใช้จ่าย/ชำระเงิน
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId"),
  accountId: int("accountId"),
  type: mysqlEnum("type", ["due", "reimbursed"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 128 }),
  status: mysqlEnum("status", ["pending", "paid", "cancelled"]).default("pending").notNull(),
  slipUrl: text("slipUrl"),
  slipKey: text("slipKey"),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

// ตารางสลิปหลักฐาน
export const slips = mysqlTable("slips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  expenseId: int("expenseId"),
  accountId: int("accountId"),
  fileUrl: text("fileUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  fileName: varchar("fileName", { length: 255 }),
  mimeType: varchar("mimeType", { length: 128 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Slip = typeof slips.$inferSelect;
export type InsertSlip = typeof slips.$inferInsert;
