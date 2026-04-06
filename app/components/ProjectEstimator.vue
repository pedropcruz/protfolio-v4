<script setup lang="ts">
import { gsap } from 'gsap';
import type { EstimateResponse } from '~/utils/types';

const SERVICES = [
  { id: 'consultoria-tecnica', key: 'est_svc_consulting' },
  { id: 'frontend', key: 'est_svc_frontend' },
  { id: 'backend', key: 'est_svc_backend' },
  { id: 'saas', key: 'est_svc_saas' }
];

const BUDGET_RANGES = [
  { value: '<5000', key: 'est_budget_1' },
  { value: '5000-15000', key: 'est_budget_2' },
  { value: '15000-30000', key: 'est_budget_3' },
  { value: '>30000', key: 'est_budget_4' }
];

const MONTHLY_HOURS = [
  { value: '20h', key: 'est_hours_1' },
  { value: '40h', key: 'est_hours_2' },
  { value: '60h', key: 'est_hours_3' },
  { value: 'unlimited', key: 'est_hours_unlimited' }
];

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { $posthog } = useNuxtApp();

// State
const name = ref('');
const email = ref('');
const projectType = ref<'fixed' | 'retainer'>('fixed');
const velocity = ref<'standard' | 'express'>('standard');
const selectedServices = ref<string[]>([]);
const problem = ref('');
const currentSolution = ref('');
const expectedOutcome = ref('');
const budgetRange = ref('');
const monthlyHours = ref('');
const consentGiven = ref(false);

const loading = ref(false);
const error = ref('');
const result = ref<EstimateResponse | null>(null);
const isExisting = ref(false);
const receiptRef = ref<HTMLElement | null>(null);
const estimatorRef = ref<HTMLElement | null>(null);

// Track first interaction per field
const interacted = ref<Set<string>>(new Set());

function trackInteraction(field: string) {
  if (interacted.value.has(field)) return;
  interacted.value.add(field);
  $posthog?.()?.capture('estimator_field_interacted', {
    field_name: field,
    locale: locale.value,
    ...getUtmParams()
  });
}

function getUtmParams() {
  return {
    utm_source: (route.query.utm_source as string) || undefined,
    utm_medium: (route.query.utm_medium as string) || undefined,
    utm_campaign: (route.query.utm_campaign as string) || undefined
  };
}

const emailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
);

const isValid = computed(() => {
  return (
    name.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    emailValid.value &&
    selectedServices.value.length > 0 &&
    problem.value.trim().length >= 30 &&
    expectedOutcome.value.trim().length >= 30 &&
    consentGiven.value &&
    (projectType.value === 'fixed'
      ? budgetRange.value !== ''
      : monthlyHours.value !== '')
  );
});

// Handlers
const toggleService = (serviceId: string) => {
  if (selectedServices.value.includes(serviceId)) {
    selectedServices.value = selectedServices.value.filter(
      (s) => s !== serviceId
    );
  } else {
    selectedServices.value.push(serviceId);
    $posthog?.()?.capture('estimator_service_selected', {
      service_name: serviceId,
      locale: locale.value,
      ...getUtmParams()
    });
  }
};

const handleEstimate = async () => {
  if (!isValid.value || loading.value) return;

  loading.value = true;
  error.value = '';
  result.value = null;
  isExisting.value = false;

  $posthog?.()?.capture('estimator_submitted', {
    project_type: projectType.value,
    velocity: velocity.value,
    services: selectedServices.value,
    locale: locale.value,
    ...getUtmParams()
  });

  try {
    const utm = getUtmParams();
    const response = await $fetch('/api/estimate', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        email: email.value.trim(),
        projectType: projectType.value,
        velocity: velocity.value,
        services: selectedServices.value,
        problem: problem.value.trim(),
        currentSolution: currentSolution.value.trim() || undefined,
        expectedOutcome: expectedOutcome.value.trim(),
        budgetRange:
          projectType.value === 'fixed' ? budgetRange.value : undefined,
        monthlyHours:
          projectType.value === 'retainer' ? monthlyHours.value : undefined,
        locale: locale.value,
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        consentGiven: true
      }
    });

    result.value = response.estimate as EstimateResponse;
    isExisting.value = response.existing as boolean;

    $posthog?.()?.capture('estimator_result_shown', {
      total_cost_min: result.value?.totalCostMin,
      total_cost_max: result.value?.totalCostMax,
      existing: isExisting.value,
      locale: locale.value,
      ...getUtmParams()
    });

    $posthog?.()?.capture('estimator_email_captured', {
      locale: locale.value,
      ...getUtmParams()
    });
  } catch (err: unknown) {
    const fetchErr = err as {
      statusCode?: number;
      data?: { message?: string };
    };
    if (fetchErr.statusCode === 429) {
      error.value = t('est_rate_limit');
    } else {
      error.value = t('est_error');
    }
    $posthog?.()?.capture('estimator_error', {
      error_message: error.value,
      locale: locale.value,
      ...getUtmParams()
    });
  } finally {
    loading.value = false;
  }
};

// Receipt Animation
watch(result, (newVal) => {
  if (newVal && receiptRef.value) {
    nextTick(() => {
      const lines = receiptRef.value?.querySelectorAll('.receipt-line');
      if (lines) {
        gsap.fromTo(
          lines,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.1, stagger: 0.05, ease: 'none' }
        );
      }
    });
  }
});

// Track estimator view via IntersectionObserver
onMounted(() => {
  if (!estimatorRef.value) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        $posthog?.()?.capture('estimator_viewed', {
          locale: locale.value,
          ...getUtmParams()
        });
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(estimatorRef.value);
});
</script>

<template>
  <div
    id="estimator"
    ref="estimatorRef"
    class="scroll-m-24 w-full overflow-hidden"
  >
    <div
      class="w-full max-w-7xl mx-auto relative bg-surface border border-border-visible rounded-lg p-6 md:p-10"
    >
      <h2
        class="text-4xl md:text-7xl font-display mt-4 mb-16 text-white uppercase text-center leading-[0.9]"
      >
        {{ t('est_title') }}
      </h2>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <!-- LEFT COLUMN: CONFIGURATION -->
        <div class="flex flex-col gap-12">
          <!-- NAME & EMAIL -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="label block text-text-secondary mb-2 border-b border-border pb-1"
              >
                {{ t('est_name') }}
              </label>
              <input
                v-model="name"
                type="text"
                :placeholder="t('est_name_placeholder')"
                class="w-full bg-surface-raised/20 border border-border-visible rounded-lg p-4 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors"
                @focus="trackInteraction('name')"
              />
            </div>
            <div>
              <label
                class="label block text-text-secondary mb-2 border-b border-border pb-1"
              >
                {{ t('est_email') }}
              </label>
              <input
                v-model="email"
                type="email"
                :placeholder="t('est_email_placeholder')"
                class="w-full bg-surface-raised/20 border border-border-visible rounded-lg p-4 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors"
                :class="{ 'border-red-500': email && !emailValid }"
                @focus="trackInteraction('email')"
              />
            </div>
          </div>

          <!-- PROJECT TYPE -->
          <div>
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_type') }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full p-6 font-bold font-sans text-xl md:text-2xl border border-border-visible rounded-lg transition-all uppercase text-center"
                  :class="
                    projectType === 'fixed'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="
                    projectType = 'fixed';
                    trackInteraction('projectType');
                    $posthog?.()?.capture('estimator_type_selected', {
                      type: 'fixed',
                      locale,
                      ...getUtmParams()
                    });
                  "
                >
                  {{ t('est_type_fixed') }}
                </button>
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_type_fixed_desc') }}
                </div>
              </div>
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full p-6 font-bold font-sans text-xl md:text-2xl border border-border-visible rounded-lg transition-all uppercase text-center"
                  :class="
                    projectType === 'retainer'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="
                    projectType = 'retainer';
                    trackInteraction('projectType');
                    $posthog?.()?.capture('estimator_type_selected', {
                      type: 'retainer',
                      locale,
                      ...getUtmParams()
                    });
                  "
                >
                  {{ t('est_type_retainer') }}
                </button>
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_type_retainer_desc') }}
                </div>
              </div>
            </div>
          </div>

          <!-- SERVICES -->
          <div>
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_service') }}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="service in SERVICES"
                :key="service.id"
                class="p-4 font-bold font-sans text-sm border border-border-visible rounded-lg transition-all text-left uppercase"
                :class="
                  selectedServices.includes(service.id)
                    ? 'bg-accent text-black'
                    : 'bg-surface text-text-secondary hover:bg-surface-raised'
                "
                @click="toggleService(service.id)"
              >
                {{
                  selectedServices.includes(service.id) ? '&#9632;' : '&#9633;'
                }}
                {{ t(service.key) }}
              </button>
            </div>
          </div>

          <!-- VELOCITY -->
          <div>
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_velocity') }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full h-full flex flex-col items-center justify-center p-6 border border-border-visible rounded-lg transition-all"
                  :class="
                    velocity === 'standard'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="
                    velocity = 'standard';
                    trackInteraction('velocity');
                  "
                >
                  <span class="font-sans text-xl uppercase font-bold">{{
                    t('est_vel_std')
                  }}</span>
                </button>
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_vel_std_desc') }}
                </div>
              </div>
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full h-full flex flex-col items-center justify-center p-6 border border-border-visible rounded-lg transition-all"
                  :class="
                    velocity === 'express'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="
                    velocity = 'express';
                    trackInteraction('velocity');
                  "
                >
                  <span
                    class="font-sans text-xl uppercase font-bold flex items-center gap-2"
                  >
                    {{ t('est_vel_exp') }}
                    <span class="text-accent">&bull;</span>
                  </span>
                </button>
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_vel_exp_desc') }}
                </div>
              </div>
            </div>
          </div>

          <!-- BUDGET RANGE (FIXED only) -->
          <div v-if="projectType === 'fixed'">
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_budget') }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="budget in BUDGET_RANGES"
                :key="budget.value"
                class="p-4 font-bold font-sans text-sm border border-border-visible rounded-lg transition-all text-center uppercase"
                :class="
                  budgetRange === budget.value
                    ? 'bg-accent text-black'
                    : 'bg-surface text-text-secondary hover:bg-surface-raised'
                "
                @click="
                  budgetRange = budget.value;
                  trackInteraction('budgetRange');
                "
              >
                {{ t(budget.key) }}
              </button>
            </div>
          </div>

          <!-- MONTHLY HOURS (RETAINER only) -->
          <div v-if="projectType === 'retainer'">
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_hours') }}
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="hours in MONTHLY_HOURS"
                :key="hours.value"
                class="p-4 font-bold font-sans text-sm border border-border-visible rounded-lg transition-all text-center uppercase"
                :class="
                  monthlyHours === hours.value
                    ? 'bg-accent text-black'
                    : 'bg-surface text-text-secondary hover:bg-surface-raised'
                "
                @click="
                  monthlyHours = hours.value;
                  trackInteraction('monthlyHours');
                "
              >
                {{ t(hours.key) }}
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: QUESTIONS & ACTION -->
        <div class="flex flex-col gap-8">
          <!-- GUIDED QUESTIONS -->
          <div>
            <label
              class="label block text-text-secondary mb-2 border-b border-border pb-1"
            >
              {{ t('est_problem') }}
            </label>
            <textarea
              v-model="problem"
              :placeholder="t('est_problem_placeholder')"
              class="w-full bg-surface-raised/20 border border-border-visible rounded-lg p-4 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors resize-none min-h-28"
              @focus="trackInteraction('problem')"
            />
            <span
              class="text-xs font-mono mt-1 block"
              :class="
                problem.trim().length >= 30
                  ? 'text-text-disabled'
                  : 'text-red-500/70'
              "
            >
              {{ problem.trim().length }}/30
            </span>
          </div>

          <div>
            <label
              class="label block text-text-secondary mb-2 border-b border-border pb-1"
            >
              {{ t('est_solution') }}
            </label>
            <textarea
              v-model="currentSolution"
              :placeholder="t('est_solution_placeholder')"
              class="w-full bg-surface-raised/20 border border-border-visible rounded-lg p-4 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors resize-none min-h-20"
              @focus="trackInteraction('currentSolution')"
            />
          </div>

          <div>
            <label
              class="label block text-text-secondary mb-2 border-b border-border pb-1"
            >
              {{ t('est_outcome') }}
            </label>
            <textarea
              v-model="expectedOutcome"
              :placeholder="t('est_outcome_placeholder')"
              class="w-full bg-surface-raised/20 border border-border-visible rounded-lg p-4 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-colors resize-none min-h-28"
              @focus="trackInteraction('outcome')"
            />
            <span
              class="text-xs font-mono mt-1 block"
              :class="
                expectedOutcome.trim().length >= 30
                  ? 'text-text-disabled'
                  : 'text-red-500/70'
              "
            >
              {{ expectedOutcome.trim().length }}/30
            </span>
          </div>

          <!-- CONSENT -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="consentGiven"
              type="checkbox"
              class="mt-1 w-5 h-5 accent-accent"
              @change="trackInteraction('consent')"
            />
            <span class="text-xs text-text-secondary font-mono leading-relaxed">
              <i18n-t keypath="est_consent" tag="span">
                <template #privacy>
                  <NuxtLink
                    :to="localePath('/privacy')"
                    class="text-accent hover:underline"
                    target="_blank"
                  >
                    {{ t('est_consent_privacy') }}
                  </NuxtLink>
                </template>
              </i18n-t>
            </span>
          </label>

          <!-- ERROR -->
          <div
            v-if="error"
            class="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          >
            <p class="text-red-400 font-mono text-sm">{{ error }}</p>
          </div>

          <!-- ACTION -->
          <div class="flex justify-end mt-auto">
            <button
              class="w-full rounded-full font-bold font-sans text-xl md:text-3xl px-6 py-6 md:px-8 md:py-8 transition-all uppercase text-center block"
              :class="
                isValid && !loading
                  ? 'bg-accent text-black hover:bg-accent/90 cursor-pointer'
                  : 'bg-surface-raised text-text-disabled cursor-not-allowed'
              "
              :disabled="!isValid || loading"
              @click="handleEstimate"
            >
              {{ loading ? t('est_btn_calc') : t('est_btn_gen') }}
            </button>
          </div>
        </div>
      </div>

      <!-- RESULT: RECEIPT -->
      <div v-if="result" class="mt-20 pt-12">
        <!-- Existing estimate notice -->
        <div
          v-if="isExisting"
          class="mb-6 bg-accent/10 border border-accent/30 rounded-lg p-3 max-w-3xl mx-auto"
        >
          <p class="text-accent font-mono text-xs text-center uppercase">
            {{ t('est_existing') }}
          </p>
        </div>

        <!-- Receipt container — window style like SiteAudit -->
        <div
          ref="receiptRef"
          class="max-w-3xl mx-auto bg-surface border border-border-visible rounded-lg p-1"
        >
          <!-- Window header bar -->
          <div
            class="bg-surface-raised w-full h-6 rounded-t-md flex items-center justify-between px-3"
          >
            <span class="label text-text-secondary">{{
              result.invoiceId
            }}</span>
            <div class="flex items-center gap-3">
              <span class="label text-text-disabled">{{ result.date }}</span>
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-accent rounded-full" />
                <div class="w-2 h-2 bg-text-disabled rounded-full" />
              </div>
            </div>
          </div>

          <!-- Receipt body -->
          <div class="bg-surface p-6 md:p-10 rounded-b-md dot-grid-subtle">
            <!-- Feasibility badge -->
            <div class="text-center mb-10 receipt-line">
              <span class="label text-text-disabled block mb-2">{{
                t('est_receipt_feasibility')
              }}</span>
              <span
                class="bg-accent text-black px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider"
              >
                {{ result.feasibility }}
              </span>
            </div>

            <!-- Breakdown table -->
            <div class="mb-8 receipt-line">
              <div
                class="label text-text-disabled mb-3 border-b border-border pb-1"
              >
                {{ t('est_receipt_breakdown') }}
              </div>
              <div class="space-y-0">
                <div
                  v-for="(item, i) in result.breakdown"
                  :key="i"
                  class="flex items-baseline justify-between py-3 border-b border-border receipt-line"
                >
                  <span
                    class="font-mono text-xs text-text-primary uppercase font-bold"
                    >{{ item.item }}</span
                  >
                  <div class="flex items-baseline gap-4 shrink-0 ml-4">
                    <span
                      v-if="item.hoursMin > 0"
                      class="label text-text-disabled"
                    >
                      {{ item.hoursMin
                      }}{{
                        item.hoursMin !== item.hoursMax
                          ? `-${item.hoursMax}`
                          : ''
                      }}H
                    </span>
                    <span
                      class="font-mono text-xs text-text-secondary font-bold"
                    >
                      &euro;{{ item.costMin.toLocaleString()
                      }}{{
                        item.costMin !== item.costMax
                          ? ` — ${item.costMax.toLocaleString()}`
                          : ''
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total price — hero section -->
            <div class="receipt-line mb-8">
              <div
                class="bg-surface-raised border border-border-visible rounded-lg p-6 md:p-8"
              >
                <div
                  class="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
                >
                  <!-- Price -->
                  <div>
                    <span class="label text-text-disabled block mb-3">
                      {{
                        projectType === 'retainer'
                          ? t('est_receipt_monthly')
                          : t('est_receipt_total')
                      }}
                    </span>
                    <div
                      class="text-4xl md:text-6xl font-display text-white leading-none tracking-tight"
                    >
                      <template v-if="result.hourlyRateMin">
                        &euro;{{ result.hourlyRateMin }}—{{
                          result.hourlyRateMax
                        }}<span class="text-2xl md:text-3xl text-text-secondary"
                          >/h</span
                        >
                      </template>
                      <template v-else>
                        &euro;{{ result.totalCostMin.toLocaleString()
                        }}<span class="text-text-secondary mx-1">—</span
                        >&euro;{{ result.totalCostMax.toLocaleString() }}
                      </template>
                    </div>
                  </div>
                  <!-- Hours + VAT -->
                  <div
                    class="flex flex-col items-start md:items-end gap-2 shrink-0"
                  >
                    <span
                      class="bg-accent text-black px-3 py-1 rounded-full text-xs font-bold font-mono uppercase whitespace-nowrap"
                    >
                      + {{ locale === 'pt' ? 'IVA' : 'VAT' }} (23%)
                    </span>
                    <span class="label text-text-disabled">
                      ~{{ result.totalHoursMin
                      }}{{
                        result.totalHoursMin !== result.totalHoursMax
                          ? `–${result.totalHoursMax}`
                          : ''
                      }}
                      {{ t('est_receipt_hours')
                      }}{{ projectType === 'retainer' ? ' / MO' : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div class="receipt-line mb-8">
              <p
                class="font-mono text-xs text-text-disabled italic text-center leading-relaxed"
              >
                "{{ result.message }}"
              </p>
            </div>

            <!-- Disclaimer -->
            <div class="receipt-line mb-8">
              <p
                class="font-mono text-[10px] text-text-disabled/60 text-center leading-relaxed normal-case"
              >
                * {{ t('est_disclaimer') }}
              </p>
            </div>

            <!-- CTAs -->
            <div class="receipt-line flex flex-col sm:flex-row gap-3">
              <a
                href="https://cal.com/pedropcruz"
                target="_blank"
                rel="noopener"
                class="flex-1 block rounded-full bg-accent text-black font-bold font-sans px-6 py-4 hover:bg-accent/90 transition-colors uppercase text-sm text-center tracking-wide"
              >
                {{ t('est_receipt_book') }}
              </a>
              <a
                href="mailto:me@pedropcruz.pt"
                class="flex-1 block rounded-full border border-border-visible text-text-primary font-bold font-sans px-6 py-4 hover:bg-surface-raised transition-colors uppercase text-sm text-center tracking-wide"
              >
                {{ t('est_receipt_email') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
