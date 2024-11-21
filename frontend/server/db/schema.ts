import { relations } from "drizzle-orm";
import {
  text,
  pgTable,
  uuid,
  timestamp,
  varchar,
  bigint,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const jobsTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  upwk_title: text("upwk_title").notNull(),
  upwk_url: text("upwk_url").notNull(),
  upwk_description: text("upwk_description").notNull(),
  upwk_timestamp: timestamp("upwk_timestamp").notNull(),
  upwk_budget: text("upwk_budget"),
  is_seen_by_user: boolean("is_seen_by_user").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Types
export type Job = typeof jobsTable.$inferSelect;
export type InsertJob = typeof jobsTable.$inferInsert;
