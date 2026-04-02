<script setup lang="ts">
import { gsap } from 'gsap';

const { t } = useI18n();
const { $posthog } = useNuxtApp();
const url = ref('');
const status = ref<'IDLE' | 'SCANNING' | 'RESULT'>('IDLE');
const loadingText = ref('');
const result = ref<AuditResult | null>(null);

const barRef = ref<HTMLElement | null>(null);

interface AuditResult {
  score: number;
  verdict: string;
  issues: string[];
  cta: string;
  metrics?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const handleAudit = async () => {
  if (!url.value) return;

  if (!url.value.includes('.')) {
    alert('INVALID_TARGET_DETECTED');
    return;
  }

  status.value = 'SCANNING';
  loadingText.value = t('audit_scanning');

  // Track attempt
  $posthog()?.capture('audit_started', {
    target_url: url.value
  });

  // Start progress bar animation
  const tl = gsap.timeline();

  if (barRef.value) {
    tl.to(barRef.value, { width: '30%', duration: 0.5, ease: 'power1.inOut' })
      .add(() => {
        loadingText.value = t('audit_scanning');
      })
      .to(barRef.value, { width: '50%', duration: 1, ease: 'power1.inOut' })
      .add(() => {
        loadingText.value = t('audit_analyzing');
      });
  }

  try {
    // Call real API endpoint
    const data = await $fetch<AuditResult>('/api/audit', {
      method: 'POST',
      body: { url: url.value }
    });

    // Track success
    $posthog()?.capture('audit_completed', {
      target_url: url.value,
      score: data.score,
      verdict: data.verdict
    });

    // Complete progress bar animation
    if (barRef.value) {
      tl.to(barRef.value, { width: '85%', duration: 0.3, ease: 'steps(5)' }).to(
        barRef.value,
        {
          width: '100%',
          duration: 0.2,
          onComplete: () => {
            result.value = data;
            status.value = 'RESULT';
          }
        }
      );
    } else {
      result.value = data;
      status.value = 'RESULT';
    }
  } catch (error) {
    // Track failure
    $posthog()?.capture('audit_failed', {
      target_url: url.value,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Handle error
    tl.kill();
    result.value = {
      score: 0,
      verdict: 'CONNECTION FAILED',
      issues: ['INVALID URL', 'SERVER UNREACHABLE', 'CHECK YOUR URL'],
      cta: 'TRY AGAIN'
    };
    status.value = 'RESULT';
  }
};

const reset = () => {
  status.value = 'IDLE';
  url.value = '';
  result.value = null;
  if (barRef.value) {
    gsap.set(barRef.value, { width: 0 });
  }
};
</script>

<template>
  <div
    class="w-full lg:max-w-md bg-surface border border-border-visible rounded-lg p-1 relative"
  >
    <!-- Header Bar -->
    <div
      class="bg-surface-raised w-full h-6 mb-1 rounded-t-md flex items-center justify-between px-2"
    >
      <span class="label text-text-secondary">ROAST MY SITE</span>
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-accent rounded-full" />
        <div class="w-2 h-2 bg-text-disabled rounded-full" />
      </div>
    </div>

    <!-- Inner Content -->
    <div
      class="bg-surface p-4 min-h-80 flex flex-col justify-center relative overflow-hidden rounded-b-md"
    >
      <!-- SCANNING STATE -->
      <div
        v-if="status === 'SCANNING'"
        class="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 z-20"
      >
        <div class="w-full h-2 bg-border mb-4 overflow-hidden rounded-full">
          <div ref="barRef" class="h-full bg-accent w-0 rounded-full" />
        </div>
        <span class="font-mono text-xs text-text-secondary uppercase">
          {{ loadingText }}
        </span>
      </div>

      <!-- RESULT STATE -->
      <div
        v-if="status === 'RESULT' && result"
        class="absolute inset-0 bg-surface flex flex-col justify-between p-6 z-20"
      >
        <div class="text-center">
          <span class="label text-text-disabled block mb-1">
            {{ t('audit_score') }}
          </span>
          <div
            class="text-7xl font-display leading-none tracking-tighter mb-2 text-white"
          >
            {{ result.score }}
          </div>
          <UBadge
            :label="result.verdict"
            size="lg"
            :ui="{
              base: 'bg-accent text-black font-bold uppercase rounded-full px-3 py-1'
            }"
          />
        </div>

        <ul
          class="text-xs font-mono font-bold space-y-1 my-4 border-t border-border pt-2 overflow-y-auto max-h-24 text-text-primary"
        >
          <li
            v-for="(issue, i) in result.issues"
            :key="i"
            class="flex items-center gap-2"
          >
            <UIcon name="i-lucide-x" class="text-red-600 size-4 shrink-0" />
            {{ issue }}
          </li>
        </ul>

        <UButton
          to="mailto:me@pedropcruz.pt"
          :label="t('audit_cta')"
          block
          size="lg"
          :ui="{
            base: 'rounded-full bg-accent text-black font-sans font-bold hover:bg-accent/90 uppercase text-sm justify-center py-3'
          }"
        />
        <UButton
          variant="link"
          label="RESET"
          size="sm"
          class="absolute top-2 right-2"
          :ui="{
            base: 'text-xs font-bold text-text-secondary hover:text-accent p-0'
          }"
          @click="reset"
        />
      </div>

      <!-- IDLE STATE (INPUT) -->
      <form
        class="flex flex-col gap-4 transition-opacity"
        :class="status !== 'IDLE' ? 'opacity-0' : 'opacity-100'"
        @submit.prevent="handleAudit"
      >
        <label
          class="font-sans font-bold text-xl text-white uppercase leading-none"
        >
          {{ t('audit_title') }}
        </label>
        <UInput
          v-model="url"
          type="text"
          :placeholder="t('audit_placeholder')"
          :aria-label="t('audit_title')"
          size="xl"
          :ui="{
            base: 'w-full bg-surface border border-border rounded-lg font-mono text-sm text-text-primary focus:border-accent uppercase'
          }"
        >
          <template #leading>
            <span class="text-text-disabled font-mono text-xs">&gt;</span>
          </template>
        </UInput>
        <UButton
          type="submit"
          :label="t('audit_btn')"
          block
          size="xl"
          :ui="{
            base: 'rounded-full bg-accent hover:bg-accent/90 text-black font-sans uppercase tracking-wide justify-center py-4 font-bold hover:cursor-pointer text-sm'
          }"
        />
        <p
          class="text-[10px] font-mono text-text-disabled text-center leading-tight"
        >
          * BRUTAL HONESTY. NO FEELINGS SPARED.
        </p>
      </form>
    </div>
  </div>
</template>
