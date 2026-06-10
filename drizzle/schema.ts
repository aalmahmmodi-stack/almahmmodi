import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  sequentialNumber: int("sequentialNumber").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }).notNull(),
  qualification: varchar("qualification", { length: 255 }).notNull(),
  graduationYear: int("graduationYear").notNull(),
  university: varchar("university", { length: 255 }).notNull(),
  notes: text("notes"),
  deficiencies: text("deficiencies"),
  status: mysqlEnum("status", ["مستوفى", "غير مستوفى"]).notNull(),
  nationalNumber: varchar("nationalNumber", { length: 50 }).notNull(),
  isDuplicate: int("isDuplicate").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;