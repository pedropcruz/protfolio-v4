<script setup lang="ts">
import { gsap } from 'gsap';
import type { EstimateResponse } from '~/utils/types';

const SERVICES = [
  'BRANDING',
  'UI/UX DESIGN',
  'FRONTEND DEV',
  'BACKEND DEV',
  'CONSULTING'
];

const { t, locale } = useI18n();

// State
const projectType = ref<'FIXED' | 'RETAINER'>('FIXED');
const velocity = ref<'STANDARD' | 'EXPRESS'>('STANDARD');
const selectedServices = ref<string[]>([]);
const description = ref('');
const files = ref<File[]>([]);

const loading = ref(false);
const result = ref<EstimateResponse | null>(null);

const receiptRef = ref<HTMLElement | null>(null);

// Handlers
const toggleService = (service: string) => {
  if (selectedServices.value.includes(service)) {
    selectedServices.value = selectedServices.value.filter(
      (s) => s !== service
    );
  } else {
    selectedServices.value.push(service);
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files) {
    const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
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
    const isRetainer = projectType.value === 'RETAINER';
    const multiplier = velocity.value === 'EXPRESS' ? 1.3 : 1;

    const mockResult: EstimateResponse = {
      type: 'ESTIMATE',
      invoiceId: `PC-${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0')}`,
      date: new Date().toLocaleDateString('en-GB'),
      totalCost: Math.floor((isRetainer ? 4500 : 12500) * multiplier),
      totalHours: isRetainer ? 60 : 180,
      feasibility: locale.value === 'pt' ? 'IDEAL' : 'OPTIMAL',
      breakdown: [
        {
          item:
            locale.value === 'pt'
              ? 'ARQUITETURA DE SISTEMA'
              : 'SYSTEM ARCHITECTURE & CORE SETUP',
          hours: 40,
          cost: 2500
        },
        {
          item:
            locale.value === 'pt'
              ? 'IMPLEMENTA\u00C7\u00C3O UI NEO-BRUTALISTA'
              : 'NEO-BRUTALIST UI IMPLEMENTATION',
          hours: 80,
          cost: 6000
        },
        {
          item:
            locale.value === 'pt'
              ? 'M\u00D3DULOS WEBGL INTERATIVOS'
              : 'INTERACTIVE WEBGL MODULES',
          hours: 40,
          cost: 3000
        },
        {
          item:
            locale.value === 'pt'
              ? 'OTIMIZA\u00C7\u00C3O DE PERFORMANCE (60FPS)'
              : 'PERFORMANCE OPTIMIZATION (60FPS)',
          hours: 20,
          cost: 1000
        }
      ],
      message:
        locale.value === 'pt'
          ? 'AN\u00C1LISE COMPLETA. ESCOPO DO PROJETO DENTRO DOS PAR\u00C2METROS ACEIT\u00C1VEIS. STACK RECOMENDADA: REACT + GSAP + WEBGL.'
          : 'ANALYSIS COMPLETE. PROJECT SCOPE WITHIN ACCEPTABLE PARAMETERS. RECOMMENDED TECH STACK: REACT + GSAP + WEBGL.'
    };

    result.value = mockResult;
    loading.value = false;
  }, 2000);
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
  <div class="scroll-m-24 w-full overflow-hidden">
    <div
      class="w-full max-w-7xl mx-auto relative bg-surface border border-border-visible rounded-lg p-6 md:p-10"
    >
      <h2
        class="text-4xl md:text-7xl font-display mt-4 mb-16 text-white uppercase text-center leading-[0.9]"
      >
        {{ t('est_title') }}
      </h2>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <!-- LEFT COLUMN: CONTROLS -->
        <div class="flex flex-col gap-12">
          <!-- 1. PROJECT TYPE -->
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
                    projectType === 'FIXED'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="projectType = 'FIXED'"
                >
                  {{ t('est_type_fixed') }}
                </button>
                <!-- Tooltip -->
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
                    projectType === 'RETAINER'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="projectType = 'RETAINER'"
                >
                  {{ t('est_type_retainer') }}
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_type_retainer_desc') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. SERVICE MATRIX -->
          <div>
            <label
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_service') }}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                v-for="service in SERVICES"
                :key="service"
                class="p-4 font-bold font-sans text-sm border border-border-visible rounded-lg transition-all text-left uppercase"
                :class="
                  selectedServices.includes(service)
                    ? 'bg-accent text-black'
                    : 'bg-surface text-text-secondary hover:bg-surface-raised'
                "
                @click="toggleService(service)"
              >
                {{ selectedServices.includes(service) ? '\u25A0' : '\u25A1' }}
                {{ service }}
              </button>
            </div>
          </div>

          <!-- 3. VELOCITY -->
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
                    velocity === 'STANDARD'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="velocity = 'STANDARD'"
                >
                  <span class="font-sans text-xl uppercase font-bold">{{
                    t('est_vel_std')
                  }}</span>
                </button>
                <!-- Tooltip -->
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
                    velocity === 'EXPRESS'
                      ? 'bg-accent text-black'
                      : 'bg-surface text-text-secondary hover:bg-surface-raised'
                  "
                  @click="velocity = 'EXPRESS'"
                >
                  <span
                    class="font-sans text-xl uppercase font-bold flex items-center gap-2"
                  >
                    {{ t('est_vel_exp') }}
                    <span class="text-accent">&bull;</span>
                  </span>
                </button>
                <!-- Tooltip -->
                <div
                  class="tooltip-content hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface-raised border border-border-visible text-text-primary rounded-lg p-2 text-xs font-mono text-center z-20 pointer-events-none group-hover:block"
                >
                  {{ t('est_vel_exp_desc') }}
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
              class="label block text-text-secondary mb-4 border-b border-border pb-1"
            >
              {{ t('est_ref') }}
            </label>
            <div
              class="flex-1 border border-border border-dashed bg-surface-raised/20 relative group transition-colors hover:bg-surface-raised/40 p-4 min-h-75 rounded-lg"
              @dragover.prevent
              @drop="handleDrop"
            >
              <textarea
                v-model="description"
                class="w-full h-full bg-transparent p-2 font-sans text-base text-text-primary placeholder-text-disabled focus:outline-none resize-none min-h-62.5"
                :placeholder="t('est_placeholder')"
              />

              <!-- Drag Overlay Text -->
              <div
                v-if="files.length === 0 && !description"
                class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
              >
                <span
                  class="font-sans text-xl md:text-2xl uppercase text-center text-text-disabled"
                >
                  {{ t('est_drag') }}<br />[ .JPG .PNG ]
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
                  class="w-16 h-16 border border-border-visible bg-surface rounded-lg overflow-hidden"
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
              class="w-full rounded-full bg-accent text-black font-bold font-sans text-xl md:text-3xl px-6 py-6 md:px-8 md:py-8 transition-colors uppercase text-center block hover:bg-accent/90"
              @click="handleEstimate"
            >
              {{ loading ? t('est_btn_calc') : t('est_btn_gen') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 5. RESULT: RECEIPT -->
      <div v-if="result" class="mt-20 border-t border-border pt-12">
        <div
          ref="receiptRef"
          class="bg-surface-raised text-text-primary font-mono p-4 md:p-16 border border-border-visible rounded-lg relative max-w-4xl mx-auto"
        >
          <div
            v-if="result.type === 'REFUSAL'"
            class="text-center py-12 receipt-line"
          >
            <h3 class="text-2xl md:text-4xl font-sans text-red-600 mb-6">
              REQUEST REJECTED
            </h3>
            <p
              class="font-bold text-lg md:text-xl mb-8 uppercase max-w-2xl mx-auto text-text-primary"
            >
              {{ result.message }}
            </p>
            <a
              href="mailto:xxx@exemplo.pt"
              class="text-lg md:text-xl text-accent hover:underline"
              >CONTACT HUMAN SUPPORT</a
            >
          </div>

          <div v-else class="space-y-6 text-sm md:text-lg uppercase font-bold">
            <div
              class="flex flex-col md:flex-row justify-between border-b border-border pb-6 receipt-line gap-2"
            >
              <span>INVOICE_ID: {{ result.invoiceId }}</span>
              <span>DATE: {{ result.date }}</span>
            </div>

            <div
              class="py-6 space-y-4 border-b border-dashed border-border receipt-line"
            >
              <div class="flex flex-col md:flex-row justify-between gap-2">
                <span>FEASIBILITY ANALYSIS:</span>
                <span
                  class="bg-accent text-black px-3 py-1 rounded-full inline-block w-max"
                  >{{ result.feasibility }}</span
                >
              </div>
              <p
                class="italic bg-surface p-4 border border-border rounded-lg text-text-secondary"
              >
                "{{ result.message }}"
              </p>
            </div>

            <div class="py-6 receipt-line">
              <h4 class="font-black mb-4 text-text-primary">
                ITEMIZED BREAKDOWN:
              </h4>
              <div
                v-for="(item, i) in result.breakdown"
                :key="i"
                class="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border gap-1"
              >
                <span>{{ item.item }}</span>
                <span class="font-mono text-text-secondary px-1"
                  >{{ item.hours }}H / &euro;{{ item.cost }}</span
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
              class="border-t border-border py-6 flex flex-col md:flex-row justify-between items-end receipt-line gap-6"
            >
              <div class="text-xs max-w-[300px] text-text-disabled normal-case">
                * THIS IS AN ALGORITHMIC ESTIMATE GENERATED BY GEMINI AI. FINAL
                BINDING QUOTE REQUIRES A DISCOVERY CALL. VALID FOR 7 DAYS.
              </div>
              <div class="text-right w-full md:w-auto">
                <div class="label text-text-secondary mb-2">
                  EST. {{ projectType === 'RETAINER' ? 'MONTHLY' : 'TOTAL' }}
                </div>
                <div
                  class="text-4xl md:text-7xl font-sans bg-accent text-black rounded-lg px-6 py-3 inline-block"
                >
                  &euro;{{ result.totalCost }}
                </div>
                <div class="label text-text-secondary mt-2">
                  ~{{ result.totalHours }} HOURS
                  {{ projectType === 'RETAINER' ? '/ MO' : '' }}
                </div>
              </div>
            </div>

            <div class="text-center pt-12 receipt-line">
              <a
                href="mailto:xxx@exemplo.pt"
                class="w-full block rounded-full bg-accent text-black font-bold font-sans px-8 py-6 hover:bg-accent/90 transition-colors uppercase text-lg md:text-xl"
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
