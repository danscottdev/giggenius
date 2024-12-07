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
  user_id: varchar("user_id", { length: 50 }).notNull(),
  upwk_title: text("upwk_title").notNull(),
  upwk_url: text("upwk_url").notNull(),
  upwk_description: text("upwk_description").notNull(),
  upwk_timestamp: timestamp("upwk_timestamp").notNull(),
  upwk_budget: text("upwk_budget"),
  is_seen_by_user: boolean("is_seen_by_user").notNull().default(false),
  match_analysis_status: text("match_analysis_status"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const matchesTable = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  job_id: uuid("job_id").references(() => jobsTable.id, {
    onDelete: "cascade",
  }),
  user_id: varchar("user_id", { length: 50 }).default("1").notNull(),
  // match_id: uuid("match_id").default("1").notNull(),
  match_strength: integer("match_strength").default(0).notNull(),
  match_analysis: text("match_analysis").default("Analysis").notNull(),
  user_grade: integer("user_grade"),
  user_feedback: text("user_feedback"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const jobsTableRelations = relations(jobsTable, ({ many }) => ({
  matches: many(matchesTable),
}));

export const matchesTableRelations = relations(matchesTable, ({ one }) => ({
  job: one(jobsTable, {
    fields: [matchesTable.job_id],
    references: [jobsTable.id],
  }),
}));

export const matchProcessingTasksTable = pgTable("match_processing_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id")
    .notNull()
    .unique()
    .references(() => matchesTable.id, { onDelete: "cascade" }),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  attempts: integer("attempts").notNull().default(0),
  lastHeartBeat: timestamp("last_heart_beat").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const matchProcessingTasksTableRelations = relations(
  matchProcessingTasksTable,
  ({ one }) => ({
    asset: one(matchesTable, {
      fields: [matchProcessingTasksTable.matchId],
      references: [matchesTable.id],
    }),
    project: one(jobsTable, {
      fields: [matchProcessingTasksTable.jobId],
      references: [jobsTable.id],
    }),
  })
);

// Types
export type Job = typeof jobsTable.$inferSelect;
export type InsertJob = typeof jobsTable.$inferInsert;

export type Match = typeof matchesTable.$inferSelect;
export type InsertMatch = typeof matchesTable.$inferInsert;

export type MatchProcessingTask = typeof matchProcessingTasksTable.$inferSelect;
export type InsertMatchProcessingTask =
  typeof matchProcessingTasksTable.$inferInsert;
