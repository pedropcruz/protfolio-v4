<script setup lang="ts">
import { gsap } from "gsap";
import type { EstimateResponse } from "~/utils/types";

const SERVICES = [
  "BRANDING",
  "UI/UX DESIGN",
  "FRONTEND DEV",
  "BACKEND DEV",
  "CONSULTING",
];

const { t, locale } = useI18n();

// State
const projectType = ref<"FIXED" | "RETAINER">("FIXED");
const velocity = ref<"STANDARD" | "EXPRESS">("STANDARD");
const selectedServices = ref<string[]>([]);
const description = ref("");
const files = ref<File[]>([]);

const loading = ref(false);
const result = ref<EstimateResponse | null>(null);

const receiptRef = ref<HTMLElement | null>(null);

// Handlers
const toggleService = (service: string) => {
  if (selectedServices.value.includes(service)) {
    selectedServices.value = selectedServices.value.filter(
      (s) => s !== service,
    );
  } else {
    selectedServices.value.push(service);
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files) {
    const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    files.value = [...files.value, ...newFiles].slice(0, 3); // Max 3 images
  }
};

const handleEstimate = async () => {
  if (selectedServices.value.length === 0 && !description.value) return;

  loading.value = true;
  result.value = null;

  // --- MOCKED BEHAVIOR START ---
  setTimeout(() => {
    const isRetainer = projectType.value === "RETAINER";
    const multiplier = velocity.value === "EXPRESS" ? 1.3 : 1;

    const mockResult: EstimateResponse = {
      type: "ESTIMATE",
      invoiceId: `PC-${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, "0")}`,
      date: new Date().toLocaleDateString("en-GB"),
      totalCost: Math.floor((isRetainer ? 4500 : 12500) * multiplier),
      totalHours: isRetainer ? 60 : 180,
      feasibility: locale.value === "pt" ? "IDEAL" : "OPTIMAL",
      breakdown: [
        {
          item:
            locale.value === "pt"
              ? "ARQUITETURA DE SISTEMA"
              : "SYSTEM ARCHITECTURE & CORE SETUP",
          hours: 40,
          cost: 2500,
        },
        {
          item:
            locale.value === "pt"
              ? "IMPLEMENTAÇÃO UI NEO-BRUTALISTA"
              : "NEO-BRUTALIST UI IMPLEMENTATION",
          hours: 80,
          cost: 6000,
        },
        {
          item:
            locale.value === "pt"
              ? "MÓDULOS WEBGL INTERATIVOS"
              : "INTERACTIVE WEBGL MODULES",
          hours: 40,
          cost: 3000,
        },
        {
          item:
            locale.value === "pt"
              ? "OTIMIZAÇÃO DE PERFORMANCE (60FPS)"
              : "PERFORMANCE OPTIMIZATION (60FPS)",
          hours: 20,
          cost: 1000,
        },
      ],
      message:
        locale.value === "pt"
          ? "ANÁLISE COMPLETA. ESCOPO DO PROJETO DENTRO DOS PARÂMETROS ACEITÁVEIS. STACK RECOMENDADA: REACT + GSAP + WEBGL."
          : "ANALYSIS COMPLETE. PROJECT SCOPE WITHIN ACCEPTABLE PARAMETERS. RECOMMENDED TECH STACK: REACT + GSAP + WEBGL.",
    };

    result.value = mockResult;
    loading.value = false;
  }, 2000);
};

// Receipt Animation
watch(result, (newVal) => {
  if (newVal && receiptRef.value) {
    nextTick(() => {
      const lines = receiptRef.value?.querySelectorAll(".receipt-line");
      if (lines) {
        gsap.fromTo(
          lines,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.1, stagger: 0.05, ease: "none" },
        );
      }
    });
  }
});

// Cleanup object URLs to avoid memory leaks
onUnmounted(() => {
  // Although we create object URLs in the template, Vue handles cleanup mostly,
  // but strictly speaking we should revoke them.
  // For simplicity in this scope, we skip manual revocation list management unless issues arise.
});

// Helper to create object URL in template
const getImageUrl = (file: File) => URL.createObjectURL(file);
</script>

<template>
  <div class="py-20 md:py-32 px-4 md:px-12 scroll-m-24 w-full overflow-hidden">
    <div
      class="w-full max-w-7xl mx-auto relative bg-electric p-2 md:p-8 border-4 border-black"
    >
      <!-- Industrial Decor -->
      <div
        class="absolute top-0 left-0 bg-black text-electric font-mono text-xs px-2 py-1 font-bold"
      >
        {{ t("est_config_unit") }}
      </div>

      <h2
        class="text-4xl md:text-7xl font-archivo mt-8 mb-16 text-black uppercase text-center leading-[0.9]"
      >
        {{ t("est_title") }}
      </h2>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <!-- LEFT COLUMN: CONTROLS -->
        <div class="flex flex-col gap-12">
          <!-- 1. PROJECT TYPE -->
          <div>
            <label
              class="block font-mono text-sm font-black mb-4 border-b-4 border-black pb-1 uppercase"
            >
              {{ t("est_type") }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full p-6 font-black font-archivo text-xl md:text-2xl border-4 border-black transition-all uppercase text-center"
                  :class="
                    projectType === 'FIXED'
                      ? 'bg-black text-electric shadow-hard'
                      : 'bg-transparent text-black hover:bg-black hover:text-electric'
                  "
                  @click="projectType = 'FIXED'"
                >
                  {{ t("est_type_fixed") }}
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-4 border-black p-2 text-xs font-mono text-black text-center z-20 pointer-events-none shadow-hard group-hover:block"
                >
                  {{ t("est_type_fixed_desc") }}
                </div>
              </div>

              <div class="tooltip-trigger relative group">
                <button
                  class="w-full p-6 font-black font-archivo text-xl md:text-2xl border-4 border-black transition-all uppercase text-center"
                  :class="
                    projectType === 'RETAINER'
                      ? 'bg-black text-electric shadow-hard'
                      : 'bg-transparent text-black hover:bg-black hover:text-electric'
                  "
                  @click="projectType = 'RETAINER'"
                >
                  {{ t("est_type_retainer") }}
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-4 border-black p-2 text-xs font-mono text-black text-center z-20 pointer-events-none shadow-hard group-hover:block"
                >
                  {{ t("est_type_retainer_desc") }}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. SERVICE MATRIX -->
          <div>
            <label
              class="block font-mono text-sm font-black mb-4 border-b-4 border-black pb-1 uppercase"
            >
              {{ t("est_service") }}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                v-for="service in SERVICES"
                :key="service"
                class="p-4 font-bold font-archivo text-sm border-4 border-black transition-all text-left uppercase"
                :class="
                  selectedServices.includes(service)
                    ? 'bg-black text-electric'
                    : 'bg-transparent text-black hover:bg-black/10'
                "
                @click="toggleService(service)"
              >
                {{ selectedServices.includes(service) ? "■" : "□" }}
                {{ service }}
              </button>
            </div>
          </div>

          <!-- 3. VELOCITY -->
          <div>
            <label
              class="block font-mono text-sm font-black mb-4 border-b-4 border-black pb-1 uppercase"
            >
              {{ t("est_velocity") }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="tooltip-trigger relative group">
                <button
                  class="w-full h-full flex flex-col items-center justify-center p-6 border-4 border-black transition-all"
                  :class="
                    velocity === 'STANDARD'
                      ? 'bg-black text-electric'
                      : 'bg-transparent text-black opacity-60 hover:opacity-100'
                  "
                  @click="velocity = 'STANDARD'"
                >
                  <span class="font-archivo text-xl uppercase">{{
                    t("est_vel_std")
                  }}</span>
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-4 border-black p-2 text-xs font-mono text-black text-center z-20 pointer-events-none shadow-hard group-hover:block"
                >
                  {{ t("est_vel_std_desc") }}
                </div>
              </div>

              <div class="tooltip-trigger relative group">
                <button
                  class="w-full h-full flex flex-col items-center justify-center p-6 border-4 border-black transition-all"
                  :class="
                    velocity === 'EXPRESS'
                      ? 'bg-black text-electric'
                      : 'bg-transparent text-black opacity-60 hover:opacity-100'
                  "
                  @click="velocity = 'EXPRESS'"
                >
                  <span
                    class="font-archivo text-xl uppercase flex items-center gap-2"
                  >
                    {{ t("est_vel_exp") }}
                    <span class="text-red-600 animate-pulse">●</span>
                  </span>
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border-4 border-black p-2 text-xs font-mono text-black text-center z-20 pointer-events-none shadow-hard group-hover:block"
                >
                  {{ t("est_vel_exp_desc") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: CONTEXT & OUTPUT -->
        <div class="flex flex-col gap-12">
          <!-- 4. REFERENCE & VISUALS -->
          <div class="flex-1 flex flex-col">
            <label
              class="block font-mono text-sm font-black mb-4 border-b-4 border-black pb-1 uppercase"
            >
              {{ t("est_ref") }}
            </label>
            <div
              class="flex-1 border-4 border-black border-dashed bg-white/20 relative group transition-colors hover:bg-white/40 p-4 min-h-[300px]"
              @dragover.prevent
              @drop="handleDrop"
            >
              <textarea
                v-model="description"
                class="w-full h-full bg-transparent p-2 font-mono text-base placeholder-black/60 focus:outline-none resize-none min-h-[250px] uppercase font-bold"
                :placeholder="t('est_placeholder')"
              />

              <!-- Drag Overlay Text -->
              <div
                v-if="files.length === 0 && !description"
                class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
              >
                <span
                  class="font-archivo text-xl md:text-2xl uppercase text-center"
                >
                  {{ t("est_drag") }}<br />[ .JPG .PNG ]
                </span>
              </div>

              <!-- Image Previews -->
              <div
                v-if="files.length > 0"
                class="absolute bottom-4 right-4 flex gap-2"
              >
                <div
                  v-for="(file, i) in files"
                  :key="i"
                  class="w-16 h-16 border-4 border-black bg-white overflow-hidden shadow-hard"
                >
                  <img
                    :src="getImageUrl(file)"
                    class="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ACTION -->
          <div class="flex justify-end">
            <button
              class="w-full bg-black text-electric font-black font-archivo text-xl md:text-3xl px-6 py-6 md:px-8 md:py-8 border-4 border-transparent hover:border-black hover:bg-electric hover:text-black transition-colors uppercase shadow-hard text-center block"
              @click="handleEstimate"
            >
              {{ loading ? t("est_btn_calc") : t("est_btn_gen") }}
            </button>
          </div>
        </div>
      </div>

      <!-- 5. RESULT: FACTORY INVOICE -->
      <div v-if="result" class="mt-20 border-t-8 border-black pt-12">
        <div
          ref="receiptRef"
          class="bg-white text-black font-mono p-4 md:p-16 border-x-4 border-b-4 border-black relative max-w-4xl mx-auto shadow-hard"
        >
          <!-- Perforated Top Effect -->
          <div
            class="absolute -top-3 left-0 w-full h-3 bg-[radial-gradient(circle,transparent_50%,#fff_50%)] bg-[length:20px_20px] rotate-180"
          />

          <div
            v-if="result.type === 'REFUSAL'"
            class="text-center py-12 receipt-line"
          >
            <h3 class="text-2xl md:text-4xl font-archivo text-red-600 mb-6">
              REQUEST REJECTED
            </h3>
            <p
              class="font-bold text-lg md:text-xl mb-8 uppercase max-w-2xl mx-auto"
            >
              {{ result.message }}
            </p>
            <a
              href="mailto:xxx@exemplo.pt"
              class="text-lg md:text-xl underline decoration-4 underline-offset-4"
              >CONTACT HUMAN SUPPORT</a
            >
          </div>

          <div v-else class="space-y-6 text-sm md:text-lg uppercase font-bold">
            <div
              class="flex flex-col md:flex-row justify-between border-b-4 border-black pb-6 receipt-line gap-2"
            >
              <span>INVOICE_ID: {{ result.invoiceId }}</span>
              <span>DATE: {{ result.date }}</span>
            </div>

            <div
              class="py-6 space-y-4 border-b-4 border-dashed border-black receipt-line"
            >
              <div class="flex flex-col md:flex-row justify-between gap-2">
                <span>FEASIBILITY ANALYSIS:</span>
                <span
                  class="bg-black text-white px-3 py-1 inline-block w-max"
                  >{{ result.feasibility }}</span
                >
              </div>
              <p
                class="opacity-100 italic bg-electric p-4 border-2 border-black"
              >
                "{{ result.message }}"
              </p>
            </div>

            <div class="py-6 receipt-line">
              <h4
                class="font-black mb-4 underline decoration-2 underline-offset-4"
              >
                ITEMIZED BREAKDOWN:
              </h4>
              <div
                v-for="(item, i) in result.breakdown"
                :key="i"
                class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-black/10 gap-1"
              >
                <span>{{ item.item }}</span>
                <span class="font-mono bg-black/5 px-1 sm:bg-transparent"
                  >{{ item.hours }}H / €{{ item.cost }}</span
                >
              </div>
              <div
                v-if="velocity === 'EXPRESS'"
                class="flex justify-between py-2 text-red-600"
              >
                <span>EXPRESS PRIORITY SURCHARGE</span>
                <span>APPLIED</span>
              </div>
            </div>

            <div
              class="border-t-4 border-black py-6 flex flex-col md:flex-row justify-between items-end receipt-line gap-6"
            >
              <div class="text-xs max-w-[300px] opacity-60 normal-case">
                * THIS IS AN ALGORITHMIC ESTIMATE GENERATED BY GEMINI AI. FINAL
                BINDING QUOTE REQUIRES A DISCOVERY CALL. VALID FOR 7 DAYS.
              </div>
              <div class="text-right w-full md:w-auto">
                <div class="text-sm font-black mb-2">
                  EST. {{ projectType === "RETAINER" ? "MONTHLY" : "TOTAL" }}
                </div>
                <div
                  class="text-4xl md:text-7xl font-archivo bg-electric px-4 py-2 border-4 border-black inline-block"
                >
                  €{{ result.totalCost }}
                </div>
                <div class="text-sm font-black mt-2">
                  ~{{ result.totalHours }} HOURS
                  {{ projectType === "RETAINER" ? "/ MO" : "" }}
                </div>
              </div>
            </div>

            <div class="text-center pt-12 receipt-line">
              <a
                href="mailto:xxx@exemplo.pt"
                class="w-full block bg-black text-electric font-black font-archivo px-8 py-6 border-4 border-transparent hover:border-black hover:bg-electric hover:text-black transition-colors uppercase text-lg md:text-xl shadow-hard"
              >
                ACCEPT & BOOK SLOT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
