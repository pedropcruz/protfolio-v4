interface ServiceRate {
  minCost: number;
  maxCost: number;
  minHours: number;
  maxHours: number;
}

const BASE_RATES: Record<string, ServiceRate> = {
  'consultoria-tecnica': { minCost: 2000, maxCost: 8000, minHours: 20, maxHours: 80 },
  'frontend': { minCost: 5000, maxCost: 15000, minHours: 40, maxHours: 120 },
  'backend': { minCost: 5000, maxCost: 15000, minHours: 40, maxHours: 120 },
  'saas': { minCost: 15000, maxCost: 40000, minHours: 120, maxHours: 320 }
};

const RETAINER_RATES: Record<string, { min: number; max: number }> = {
  'consultoria-tecnica': { min: 60, max: 100 },
  'frontend': { min: 70, max: 120 },
  'backend': { min: 70, max: 120 },
  'saas': { min: 80, max: 150 }
};

const EXPRESS_SURCHARGE = 0.30;
const FLOOR_PRICE = 2000;

interface EstimateInput {
  services: string[];
  projectType: 'fixed' | 'retainer';
  velocity: 'standard' | 'express';
  budgetRange?: string;
  monthlyHours?: string;
  locale: string;
}

interface BreakdownItem {
  item: string;
  hoursMin: number;
  hoursMax: number;
  costMin: number;
  costMax: number;
}

interface EstimateResult {
  invoiceId: string;
  date: string;
  totalCostMin: number;
  totalCostMax: number;
  totalHoursMin: number;
  totalHoursMax: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  feasibility: string;
  breakdown: BreakdownItem[];
  expressSurcharge: boolean;
  message: string;
}

const SERVICE_LABELS: Record<string, { en: string; pt: string }> = {
  'consultoria-tecnica': { en: 'TECHNICAL CONSULTING', pt: 'CONSULTORIA TECNICA' },
  'frontend': { en: 'FRONTEND DEVELOPMENT', pt: 'DESENVOLVIMENTO FRONTEND' },
  'backend': { en: 'BACKEND DEVELOPMENT', pt: 'DESENVOLVIMENTO BACKEND' },
  'saas': { en: 'SAAS DEVELOPMENT', pt: 'DESENVOLVIMENTO SAAS' }
};

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const invoiceId = `PC-${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}`;
  const date = new Date().toLocaleDateString('en-GB');
  const isPt = input.locale === 'pt';

  if (input.projectType === 'retainer') {
    return calculateRetainer(input, invoiceId, date, isPt);
  }

  return calculateFixed(input, invoiceId, date, isPt);
}

function calculateFixed(input: EstimateInput, invoiceId: string, date: string, isPt: boolean): EstimateResult {
  const breakdown: BreakdownItem[] = [];
  let totalMin = 0;
  let totalMax = 0;
  let hoursMin = 0;
  let hoursMax = 0;

  for (const service of input.services) {
    const rate = BASE_RATES[service];
    if (!rate) continue;

    const label = isPt ? SERVICE_LABELS[service]?.pt : SERVICE_LABELS[service]?.en;
    breakdown.push({
      item: label || service.toUpperCase(),
      hoursMin: rate.minHours,
      hoursMax: rate.maxHours,
      costMin: rate.minCost,
      costMax: rate.maxCost
    });

    totalMin += rate.minCost;
    totalMax += rate.maxCost;
    hoursMin += rate.minHours;
    hoursMax += rate.maxHours;
  }

  // Apply EXPRESS surcharge
  const expressSurcharge = input.velocity === 'express';
  if (expressSurcharge) {
    const surchargeMin = Math.round(totalMin * EXPRESS_SURCHARGE);
    const surchargeMax = Math.round(totalMax * EXPRESS_SURCHARGE);

    breakdown.push({
      item: isPt ? 'SURCHARGE EXPRESS (+30%)' : 'EXPRESS SURCHARGE (+30%)',
      hoursMin: 0,
      hoursMax: 0,
      costMin: surchargeMin,
      costMax: surchargeMax
    });

    totalMin += surchargeMin;
    totalMax += surchargeMax;
  }

  // Apply floor
  totalMin = Math.max(totalMin, FLOOR_PRICE);

  // Budget sanity check
  const feasibility = getBudgetFeasibility(input.budgetRange, totalMin, totalMax, isPt);

  const message = isPt
    ? 'ANALISE COMPLETA. ESCOPO DO PROJETO DENTRO DOS PARAMETROS ACEITAVEIS.'
    : 'ANALYSIS COMPLETE. PROJECT SCOPE WITHIN ACCEPTABLE PARAMETERS.';

  return {
    invoiceId,
    date,
    totalCostMin: totalMin,
    totalCostMax: totalMax,
    totalHoursMin: hoursMin,
    totalHoursMax: hoursMax,
    feasibility,
    breakdown,
    expressSurcharge,
    message
  };
}

function calculateRetainer(input: EstimateInput, invoiceId: string, date: string, isPt: boolean): EstimateResult {
  const breakdown: BreakdownItem[] = [];

  // Get the highest hourly rate from selected services
  let rateMin = 60;
  let rateMax = 100;

  for (const service of input.services) {
    const rate = RETAINER_RATES[service];
    if (!rate) continue;
    rateMin = Math.max(rateMin, rate.min);
    rateMax = Math.max(rateMax, rate.max);
  }

  // Parse monthly hours
  let hoursMin = 20;
  let hoursMax = 20;

  switch (input.monthlyHours) {
    case '20h': hoursMin = 20; hoursMax = 20; break;
    case '40h': hoursMin = 40; hoursMax = 40; break;
    case '60h': hoursMin = 60; hoursMax = 60; break;
    case 'unlimited': hoursMin = 40; hoursMax = 80; break;
    default: hoursMin = 20; hoursMax = 20;
  }

  let costMin = hoursMin * rateMin;
  let costMax = hoursMax * rateMax;

  for (const service of input.services) {
    const rate = RETAINER_RATES[service];
    if (!rate) continue;
    const label = isPt ? SERVICE_LABELS[service]?.pt : SERVICE_LABELS[service]?.en;
    breakdown.push({
      item: label || service.toUpperCase(),
      hoursMin,
      hoursMax,
      costMin: hoursMin * rate.min,
      costMax: hoursMax * rate.max
    });
  }

  // EXPRESS surcharge
  const expressSurcharge = input.velocity === 'express';
  if (expressSurcharge) {
    const surchargeMin = Math.round(costMin * EXPRESS_SURCHARGE);
    const surchargeMax = Math.round(costMax * EXPRESS_SURCHARGE);

    breakdown.push({
      item: isPt ? 'SURCHARGE EXPRESS (+30%)' : 'EXPRESS SURCHARGE (+30%)',
      hoursMin: 0,
      hoursMax: 0,
      costMin: surchargeMin,
      costMax: surchargeMax
    });

    rateMin = Math.round(rateMin * (1 + EXPRESS_SURCHARGE));
    rateMax = Math.round(rateMax * (1 + EXPRESS_SURCHARGE));
    costMin += surchargeMin;
    costMax += surchargeMax;
  }

  costMin = Math.max(costMin, FLOOR_PRICE);

  const message = isPt
    ? 'ANALISE COMPLETA. VALORES MENSAIS ESTIMADOS COM BASE NOS REQUISITOS.'
    : 'ANALYSIS COMPLETE. MONTHLY VALUES ESTIMATED BASED ON REQUIREMENTS.';

  return {
    invoiceId,
    date,
    totalCostMin: costMin,
    totalCostMax: costMax,
    totalHoursMin: hoursMin,
    totalHoursMax: hoursMax,
    hourlyRateMin: rateMin,
    hourlyRateMax: rateMax,
    feasibility: isPt ? 'IDEAL' : 'OPTIMAL',
    breakdown,
    expressSurcharge,
    message
  };
}

function getBudgetFeasibility(
  budgetRange: string | undefined,
  estimateMin: number,
  estimateMax: number,
  isPt: boolean
): string {
  if (!budgetRange) return isPt ? 'IDEAL' : 'OPTIMAL';

  const budgetMap: Record<string, number> = {
    '<5000': 5000,
    '5000-15000': 15000,
    '15000-30000': 30000,
    '>30000': 50000
  };

  const budgetCeiling = budgetMap[budgetRange];
  if (!budgetCeiling) return isPt ? 'IDEAL' : 'OPTIMAL';

  if (estimateMin > budgetCeiling) {
    return isPt ? 'ACIMA DO BUDGET — REQUER CONVERSA' : 'ABOVE BUDGET — REQUIRES DISCUSSION';
  }

  if (estimateMax > budgetCeiling) {
    return isPt ? 'APERTADO — POSSIVEL COM AJUSTES' : 'TIGHT — FEASIBLE WITH ADJUSTMENTS';
  }

  return isPt ? 'IDEAL' : 'OPTIMAL';
}
