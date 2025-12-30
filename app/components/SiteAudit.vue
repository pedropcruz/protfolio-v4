<script setup lang="ts">
import { gsap } from "gsap";

const { t } = useI18n();
const { $posthog } = useNuxtApp();
const url = ref("");
const status = ref<"IDLE" | "SCANNING" | "RESULT">("IDLE");
const loadingText = ref("");
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

  if (!url.value.includes(".")) {
    alert("INVALID_TARGET_DETECTED");
    return;
  }

  status.value = "SCANNING";
  loadingText.value = t("audit_scanning");

  // Track attempt
  $posthog()?.capture("audit_started", {
    target_url: url.value,
  });

  // Start progress bar animation
  const tl = gsap.timeline();

  if (barRef.value) {
    tl.to(barRef.value, { width: "30%", duration: 0.5, ease: "power1.inOut" })
      .add(() => {
        loadingText.value = t("audit_scanning");
      })
      .to(barRef.value, { width: "50%", duration: 1, ease: "power1.inOut" })
      .add(() => {
        loadingText.value = t("audit_analyzing");
      });
  }

  try {
    // Call real API endpoint
    const data = await $fetch<AuditResult>("/api/audit", {
      method: "POST",
      body: { url: url.value },
    });

    // Track success
    $posthog()?.capture("audit_completed", {
      target_url: url.value,
      score: data.score,
      verdict: data.verdict,
    });

    // Complete progress bar animation
    if (barRef.value) {
      tl.to(barRef.value, { width: "85%", duration: 0.3, ease: "steps(5)" }).to(
        barRef.value,
        {
          width: "100%",
          duration: 0.2,
          onComplete: () => {
            result.value = data;
            status.value = "RESULT";
          },
        },
      );
    } else {
      result.value = data;
      status.value = "RESULT";
    }
  } catch (error) {
    // Track failure
    $posthog()?.capture("audit_failed", {
      target_url: url.value,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    // Handle error
    tl.kill();
    result.value = {
      score: 0,
      verdict: "CONNECTION FAILED",
      issues: ["INVALID URL", "SERVER UNREACHABLE", "CHECK YOUR URL"],
      cta: "TRY AGAIN",
    };
    status.value = "RESULT";
  }
};

const reset = () => {
  status.value = "IDLE";
  url.value = "";
  result.value = null;
  if (barRef.value) {
    gsap.set(barRef.value, { width: 0 });
  }
};
</script>

<template>
  <div
    class="w-full lg:max-w-md bg-black border-4 border-black p-1 relative shadow-hard"
  >
    <!-- Header Bar -->
    <div
      class="bg-electric w-full h-6 mb-1 flex items-center justify-between px-2"
    >
      <span class="font-mono text-[10px] font-bold tracking-widest"
        >AUTO_DIAGNOSTIC_TOOL_V1</span
      >
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-black rounded-full" />
        <div class="w-2 h-2 bg-black rounded-full opacity-50" />
      </div>
    </div>

    <!-- Inner Content -->
    <div
      class="bg-white p-4 min-h-[320px] flex flex-col justify-center relative overflow-hidden"
    >
      <!-- SCANNING STATE -->
      <div
        v-if="status === 'SCANNING'"
        class="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 z-20"
      >
        <div class="w-full h-2 bg-white/20 mb-4 overflow-hidden">
          <div ref="barRef" class="h-full bg-electric w-0" />
        </div>
        <span class="text-electric font-mono text-xs animate-pulse uppercase">
          {{ loadingText }}
        </span>
      </div>

      <!-- RESULT STATE -->
      <div
        v-if="status === 'RESULT' && result"
        class="absolute inset-0 bg-electric flex flex-col justify-between p-6 z-20 text-black"
      >
        <div class="text-center">
          <span class="font-mono text-xs font-bold block mb-1 opacity-60">
            {{ t("audit_score") }}
          </span>
          <div class="text-7xl font-archivo leading-none tracking-tighter mb-2">
            {{ result.score }}
          </div>
          <UBadge
            :label="result.verdict"
            size="lg"
            :ui="{
              base: 'rounded-none bg-black text-white font-bold uppercase',
            }"
          />
        </div>

        <ul
          class="text-xs font-mono font-bold space-y-1 my-4 border-t-2 border-black/20 pt-2 overflow-y-auto max-h-24"
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
            base: 'rounded-none bg-black text-white font-archivo hover:bg-white hover:text-black uppercase text-sm justify-center py-3',
          }"
        />
        <UButton
          variant="link"
          label="RESET"
          size="sm"
          class="absolute top-2 right-2"
          :ui="{
            base: 'text-xs font-bold underline p-0',
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
        <label class="font-archivo font-bold text-xl uppercase leading-none">
          {{ t("audit_title") }}
        </label>
        <UInput
          v-model="url"
          type="text"
          :placeholder="t('audit_placeholder')"
          size="xl"
          :ui="{
            base: 'w-full bg-gray-100 border-2 border-black rounded-none font-mono text-sm focus:bg-electric/20 uppercase',
            leading: 'pointer-events-none',
          }"
        >
          <template #leading>
            <span class="text-black/40 font-mono text-xs">&gt;</span>
          </template>
        </UInput>
        <UButton
          type="submit"
          :label="t('audit_btn')"
          block
          size="xl"
          :ui="{
            base: 'rounded-none bg-black hover:bg-opacity-90 text-electric font-archivo uppercase tracking-wide justify-center py-4 font-bold hover:cursor-pointer text-sm',
          }"
        />
        <p class="text-[10px] font-mono opacity-50 text-center leading-tight">
          * BRUTAL HONESTY. NO FEELINGS SPARED.
        </p>
      </form>
    </div>
  </div>
</template>
