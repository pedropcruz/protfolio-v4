import { pgTable, uuid, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  projectType: text('project_type').notNull(), // 'fixed' | 'retainer'
  velocity: text('velocity').notNull(), // 'standard' | 'express'
  services: text('services').array().notNull(),
  problem: text('problem').notNull(),
  currentSolution: text('current_solution'),
  expectedOutcome: text('expected_outcome').notNull(),
  budgetRange: text('budget_range'), // only for fixed
  monthlyHours: text('monthly_hours'), // only for retainer
  estimateResponse: jsonb('estimate_response').notNull(),
  locale: text('locale').notNull().default('en'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  ip: text('ip'),
  consentGiven: boolean('consent_given').notNull().default(true),
  consentTimestamp: timestamp('consent_timestamp').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});
