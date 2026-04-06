<script setup lang="ts">
const isExpanded = shallowRef(false);
const showGrid = shallowRef(false);
const osKey = shallowRef('CMD');
const activeTab = ref<'LOCAL' | 'GLOBAL'>('LOCAL');

// Fetch Global Stats
const { data: globalStats, refresh: refreshStats } = useFetch('/api/stats', {
  immediate: false,
  server: false, // Client-side fetch only when requested
  lazy: true
});

// Watch tab change to fetch data
watch(activeTab, (newTab) => {
  if (newTab === 'GLOBAL' && !globalStats.value) {
    refreshStats();
  }
});

// Refs for direct DOM manipulation (High Performance)
const fpsRef = shallowRef<HTMLElement | null>(null);
const msRef = shallowRef<HTMLElement | null>(null);
const memRef = shallowRef<HTMLElement | null>(null);
const nodesRef = shallowRef<HTMLElement | null>(null);
const coordsRef = shallowRef<HTMLElement | null>(null);
const velocityRef = shallowRef<HTMLElement | null>(null);
const timeRef = shallowRef<HTMLElement | null>(null);

// Logic Refs (using regular variables where reactivity isn't needed for performance)
let requestRef: number;
let lastTime = 0;
let frames = 0;
let lastScrollY = 0;

const update = () => {
  const now = performance.now();
  frames++;

  // 1. FPS & MS Calculation (every 1 second)
  if (now - lastTime >= 1000) {
    if (fpsRef.value) fpsRef.value.innerText = frames.toString();
    if (msRef.value) msRef.value.innerText = (1000 / frames).toFixed(1);

    // Memory (Chrome only, simulated otherwise)
    if (memRef.value) {
      const p = performance as unknown as {
        memory?: { usedJSHeapSize: number };
      };
      const mem = p.memory
        ? Math.round(p.memory.usedJSHeapSize / 1024 / 1024)
        : Math.floor(Math.random() * (200 - 100) + 100);
      memRef.value.innerText = `${mem}MB`;
    }

    // DOM Nodes
    if (nodesRef.value) {
      nodesRef.value.innerText = document
        .getElementsByTagName('*')
        .length.toString();
    }

    frames = 0;
    lastTime = now;
  }

  // 2. Scroll Velocity (Instant)
  if (velocityRef.value) {
    const currentScroll = window.scrollY;
    const diff = Math.abs(currentScroll - lastScrollY);
    velocityRef.value.innerText = diff.toString().padStart(3, '0');
    lastScrollY = currentScroll;
  }

  // 3. Time
  if (timeRef.value) {
    const d = new Date();
    timeRef.value.innerText = d.toLocaleTimeString('en-GB', { hour12: false });
  }

  requestRef = requestAnimationFrame(update);
};

const handleMouseMove = (e: MouseEvent) => {
  if (coordsRef.value) {
    coordsRef.value.innerText = `X:${e.clientX.toString().padStart(4, '0')} Y:${e.clientY.toString().padStart(4, '0')}`;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleGrid = () => {
  showGrid.value = !showGrid.value;
};

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(() => {
  // Detect OS for shortcut hint
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  osKey.value = isMac ? 'CMD' : 'CTRL';

  lastTime = performance.now();
  requestRef = requestAnimationFrame(update);
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  if (requestRef) cancelAnimationFrame(requestRef);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
  <div>
    <!-- Debug Grid Overlay -->
    <div
      v-if="showGrid"
      class="fixed inset-0 z-90 pointer-events-none flex justify-between px-4 md:px-12"
    >
      <div class="w-px h-full bg-red-500/30" />
      <div class="w-px h-full bg-red-500/30 hidden md:block" />
      <div class="w-px h-full bg-red-500/30 hidden md:block" />
      <div class="w-px h-full bg-red-500/30" />

      <div class="absolute inset-0 flex flex-col justify-between py-12">
        <div class="h-px w-full bg-red-500/30" />
        <div class="h-px w-full bg-red-500/30" />
        <div class="h-px w-full bg-red-500/30" />
      </div>
    </div>

    <!-- Monitor Panel -->
    <div
      class="fixed bottom-4 right-4 z-100 font-mono text-xs leading-tight transition-all duration-300 bg-surface border border-border-visible rounded-lg"
      :class="isExpanded ? 'w-70' : 'w-auto'"
    >
      <!-- Title Bar -->
      <div
        class="flex justify-between items-center px-3 py-2 bg-surface-raised text-text-primary cursor-pointer select-none rounded-t-lg"
        @click="toggleExpanded"
      >
        <span class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-accent rounded-full" />
          <span class="label">MONITOR</span>
        </span>
        <svg
          class="w-3 h-3 text-text-secondary transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </div>

      <div
        v-show="isExpanded"
        class="p-4 space-y-3"
      >
        <!-- TABS -->
        <div class="flex gap-2 mb-3">
          <button
            class="flex-1 py-1 px-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200"
            :class="
              activeTab === 'LOCAL'
                ? 'bg-accent text-black rounded-full'
                : 'text-text-secondary hover:text-text-primary'
            "
            @click="activeTab = 'LOCAL'"
          >
            LOCAL
          </button>
          <button
            class="flex-1 py-1 px-2 text-xs font-mono uppercase tracking-wider transition-colors duration-200"
            :class="
              activeTab === 'GLOBAL'
                ? 'bg-accent text-black rounded-full'
                : 'text-text-secondary hover:text-text-primary'
            "
            @click="activeTab = 'GLOBAL'"
          >
            GLOBAL (30d)
          </button>
        </div>

        <!-- LOCAL CONTENT -->
        <div
          v-show="activeTab === 'LOCAL'"
          class="space-y-3"
        >
          <div class="flex justify-between border-b border-border pb-2">
            <div class="flex flex-col">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
              >FPS</span>
              <span
                ref="fpsRef"
                class="text-xl text-white font-sans"
              >60</span>
            </div>
            <div class="flex flex-col text-right">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
              >LATENCY</span>
              <span class="text-white font-sans"><span ref="msRef">16.7</span>ms</span>
            </div>
            <div class="flex flex-col text-right">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
              >LOCAL_TIME</span>
              <span
                ref="timeRef"
                class="text-white font-sans"
              >00:00:00</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 border-b border-border pb-2">
            <div>
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary block"
              >MEMORY_HEAP</span>
              <span
                ref="memRef"
                class="text-white font-sans"
              >---MB</span>
            </div>
            <div class="text-right">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary block"
              >DOM_NODES</span>
              <span
                ref="nodesRef"
                class="text-white font-sans"
              >---</span>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
              >CURSOR_POS</span>
              <span
                ref="coordsRef"
                class="text-white font-sans"
              >WAITING_INPUT</span>
            </div>
            <div class="flex justify-between">
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
              >SCROLL_VEL</span>
              <span class="text-white font-sans"><span ref="velocityRef">000</span> px/f</span>
            </div>
          </div>
        </div>

        <!-- GLOBAL CONTENT -->
        <div
          v-if="activeTab === 'GLOBAL'"
          class="space-y-3 min-h-[140px]"
        >
          <div
            v-if="!globalStats"
            class="flex items-center justify-center h-full py-8 text-text-disabled"
          >
            CONNECTING...
          </div>
          <div
            v-else-if="
              globalStats.status
                && globalStats.status.startsWith('misconfigured')
            "
            class="text-center py-4 text-orange-500 text-[10px] break-all p-2"
          >
            {{ globalStats.status.replace('misconfigured: ', '') }}
          </div>
          <div
            v-else-if="globalStats.status === 'error'"
            class="text-center py-4 text-red-500 text-[10px]"
          >
            SERVER_ERROR (Check Logs)
          </div>
          <div
            v-else
            class="space-y-3"
          >
            <div class="flex justify-between border-b border-border pb-2">
              <div class="flex flex-col">
                <span
                  class="font-mono uppercase tracking-wider text-xs text-text-secondary"
                >VISITORS</span>
                <span class="text-xl text-white font-sans">{{
                  globalStats.visitors
                }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span
                  class="font-mono uppercase tracking-wider text-xs text-text-secondary"
                >PAGE_VIEWS</span>
                <span class="text-xl text-white font-sans">{{
                  globalStats.pageViews
                }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <span
                class="font-mono uppercase tracking-wider text-[10px] text-text-secondary block mb-1"
              >TOP_PROJECTS</span>
              <div
                v-for="(p, i) in globalStats.topProjects"
                :key="i"
                class="flex justify-between text-[10px]"
              >
                <span
                  class="uppercase truncate max-w-30 text-text-primary"
                >{{ p.name }}</span>
                <span class="text-white font-sans">{{ p.views }}</span>
              </div>
              <div
                v-if="globalStats.topProjects.length === 0"
                class="text-[10px] text-text-disabled"
              >
                NO_DATA_YET
              </div>
            </div>

            <div
              class="pt-2 border-t border-border flex justify-between text-[10px] text-text-secondary"
            >
              <span>AVG_SESSION: {{ globalStats.avgSession }}</span>
              <span>ERRORS: {{ globalStats.errors }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 border-t border-border flex gap-2">
          <button
            class="flex-1 py-1 border border-border-visible text-center text-text-secondary rounded transition-colors duration-200 hover:bg-surface-raised hover:text-text-primary"
            :class="{ 'bg-accent text-black! border-accent!': showGrid }"
            @click="toggleGrid"
          >
            {{ showGrid ? 'HIDE_GRID' : 'SHOW_GRID' }}
          </button>
          <button
            class="flex-1 py-1 border border-border-visible text-center text-text-secondary rounded transition-colors duration-200 hover:bg-surface-raised hover:text-text-primary"
            @click="scrollToTop"
          >
            RESET_VIEW
          </button>
        </div>

        <!-- Shortcut Hint -->
        <div
          class="pt-2 border-t border-border text-center text-text-secondary text-[10px]"
        >
          <span class="text-accent">OVERRIDE:</span> [ {{ osKey }} + K ]
        </div>
      </div>
    </div>
  </div>
</template>
