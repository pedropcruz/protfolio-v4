import { eq, and, gte } from 'drizzle-orm';
import { leads } from '../db/schema';
import { calculateEstimate } from '../utils/pricing';
import { sendClientReceipt, sendPedroNotification } from '../utils/email';
import { notifyDiscord, notifyDiscordError } from '../utils/discord';
import { useDB } from '../utils/db';

interface EstimateBody {
  name: string;
  email: string;
  projectType: 'fixed' | 'retainer';
  velocity: 'standard' | 'express';
  services: string[];
  problem: string;
  currentSolution?: string;
  expectedOutcome: string;
  budgetRange?: string;
  monthlyHours?: string;
  locale: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
}

const VALID_SERVICES = ['consultoria-tecnica', 'frontend', 'backend', 'saas'];
const VALID_BUDGET_RANGES = ['<5000', '5000-15000', '15000-30000', '>30000'];
const VALID_MONTHLY_HOURS = ['20h', '40h', '60h', 'unlimited'];

export default defineEventHandler(async (event) => {
  const body = await readBody<EstimateBody>(event);

  // --- Validation ---
  if (!body.name?.trim() || !body.email?.trim()) {
    throw createError({ statusCode: 400, message: 'Name and email are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address' });
  }

  if (!['fixed', 'retainer'].includes(body.projectType)) {
    throw createError({ statusCode: 400, message: 'Invalid project type' });
  }

  if (!['standard', 'express'].includes(body.velocity)) {
    throw createError({ statusCode: 400, message: 'Invalid velocity' });
  }

  if (!body.services?.length || !body.services.every(s => VALID_SERVICES.includes(s))) {
    throw createError({ statusCode: 400, message: 'At least one valid service is required' });
  }

  if (!body.problem?.trim() || body.problem.trim().length < 30) {
    throw createError({ statusCode: 400, message: 'Problem description must be at least 30 characters' });
  }

  if (!body.expectedOutcome?.trim() || body.expectedOutcome.trim().length < 30) {
    throw createError({ statusCode: 400, message: 'Expected outcome must be at least 30 characters' });
  }

  if (body.projectType === 'fixed' && body.budgetRange && !VALID_BUDGET_RANGES.includes(body.budgetRange)) {
    throw createError({ statusCode: 400, message: 'Invalid budget range' });
  }

  if (body.projectType === 'retainer' && body.monthlyHours && !VALID_MONTHLY_HOURS.includes(body.monthlyHours)) {
    throw createError({ statusCode: 400, message: 'Invalid monthly hours' });
  }

  if (!body.consentGiven) {
    throw createError({ statusCode: 400, message: 'Consent is required' });
  }

  const locale = body.locale === 'pt' ? 'pt' : 'en';

  // --- Rate limiting ---
  const db = useDB();
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  // Check if email already submitted
  const existingLead = await db.select().from(leads).where(eq(leads.email, body.email.toLowerCase())).limit(1);
  if (existingLead.length > 0) {
    return { estimate: existingLead[0].estimateResponse, existing: true };
  }

  // Check IP rate limit (3/day)
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const ipLeads = await db.select().from(leads).where(
    and(eq(leads.ip, ip), gte(leads.createdAt, dayAgo))
  );
  if (ipLeads.length >= 3) {
    throw createError({ statusCode: 429, message: 'Rate limit exceeded. Please try again tomorrow.' });
  }

  // --- Calculate estimate ---
  const estimate = calculateEstimate({
    services: body.services,
    projectType: body.projectType,
    velocity: body.velocity,
    budgetRange: body.budgetRange,
    monthlyHours: body.monthlyHours,
    locale
  });

  // --- Persist lead ---
  try {
    await db.insert(leads).values({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      projectType: body.projectType,
      velocity: body.velocity,
      services: body.services,
      problem: body.problem.trim(),
      currentSolution: body.currentSolution?.trim() || null,
      expectedOutcome: body.expectedOutcome.trim(),
      budgetRange: body.budgetRange || null,
      monthlyHours: body.monthlyHours || null,
      estimateResponse: estimate,
      locale,
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      ip,
      consentGiven: true,
      consentTimestamp: new Date()
    });
  }
  catch (err) {
    console.error('[Estimate] DB insert failed:', err);
    await notifyDiscordError('DB insert failed', String(err));
    // Still return the estimate even if DB fails (graceful degradation)
  }

  // --- Send emails + Discord (async, don't block response) ---
  const emailData = {
    name: body.name.trim(),
    email: body.email.toLowerCase().trim(),
    projectType: body.projectType,
    velocity: body.velocity,
    services: body.services,
    problem: body.problem.trim(),
    currentSolution: body.currentSolution?.trim(),
    expectedOutcome: body.expectedOutcome.trim(),
    budgetRange: body.budgetRange,
    monthlyHours: body.monthlyHours,
    locale,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
    estimate
  };

  // Fire and forget — don't block the response
  Promise.all([
    sendClientReceipt(emailData),
    sendPedroNotification(emailData),
    notifyDiscord({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      projectType: body.projectType,
      velocity: body.velocity,
      services: body.services,
      totalCostMin: estimate.totalCostMin,
      totalCostMax: estimate.totalCostMax,
      locale,
      utmSource: body.utmSource
    })
  ]).catch(err => {
    console.error('[Estimate] Async notifications failed:', err);
  });

  return { estimate, existing: false };
});
