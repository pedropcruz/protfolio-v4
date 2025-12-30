<script setup lang="ts">
import { gsap } from "gsap";

const { t } = useI18n();
const isOpen = ref(false);
const query = ref("");
const selectedIndex = ref(0);

const inputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

interface Command {
  id: string;
  label: string;
  category: string;
  action: () => void;
  shortcut?: string;
}

const commands = computed<Command[]>(() => [
  {
    id: "home",
    label: t("cmd_home"),
    category: "NAVIGATION",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    id: "projects",
    label: t("cmd_projects"),
    category: "NAVIGATION",
    action: () =>
      document
        .getElementById("projects-section")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "blog",
    label: t("cmd_blog"),
    category: "NAVIGATION",
    action: () =>
      document
        .getElementById("blog-section")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "estimator",
    label: t("cmd_estimator"),
    category: "TOOLS",
    action: () =>
      document
        .getElementById("estimator")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "email",
    label: t("cmd_email"),
    category: "COMMUNICATION",
    action: () => (window.location.href = "mailto:me@pedropcruz.pt"),
  },
  {
    id: "cv",
    label: t("cmd_cv"),
    category: "ASSETS",
    action: () => alert("DOWNLOADING_ASSET..."),
  },
  {
    id: "github",
    label: t("cmd_gh"),
    category: "EXTERNAL",
    action: () => window.open(SOCIAL_LINKS.github, "_blank"),
  },
]);

// Filter Logic
const filteredCommands = computed(() => {
  const lowerQuery = query.value.toLowerCase();
  return commands.value.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.category.toLowerCase().includes(lowerQuery),
  );
});

const closePalette = () => {
  isOpen.value = false;
};

const executeCommand = (cmd: Command) => {
  cmd.action();
  closePalette();
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (e.key === "Escape") {
    closePalette();
  }
};

const handleNav = (e: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value =
      (selectedIndex.value + 1) % filteredCommands.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value =
      (selectedIndex.value - 1 + filteredCommands.value.length) %
      filteredCommands.value.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (filteredCommands.value[selectedIndex.value]) {
      executeCommand(filteredCommands.value[selectedIndex.value]!);
    }
  }
};

// Watch for open state to animate and focus
watch(isOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => inputRef.value?.focus(), 50);
    nextTick(() => {
      if (containerRef.value) {
        gsap.fromTo(
          containerRef.value,
          { opacity: 0, scale: 0.95, y: -20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" },
        );
      }
    });
  } else {
    query.value = "";
  }
});

watch(query, () => {
  selectedIndex.value = 0;
});

watch(selectedIndex, () => {
  if (listRef.value) {
    const activeElement = listRef.value.children[
      selectedIndex.value
    ] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keydown", handleNav);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("keydown", handleNav);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-200 flex items-start justify-center pt-[20vh] px-4"
    >
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-md"
        @click="closePalette"
      />

      <div
        ref="containerRef"
        class="relative w-full max-w-2xl bg-black border-4 border-electric shadow-hard-hover overflow-hidden flex flex-col max-h-[60vh]"
      >
        <div class="flex items-center p-4 border-b-2 border-electric/30">
          <span class="text-electric mr-4 font-mono font-bold animate-pulse"
            >&gt;</span
          >
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="t('cmd_placeholder')"
            class="w-full bg-transparent text-white font-archivo text-xl uppercase placeholder-white/30 focus:outline-none"
          />
          <span
            class="text-xs font-mono text-electric/50 border border-electric/30 px-2 py-1"
            >ESC</span
          >
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white/5">
          <div
            v-if="filteredCommands.length === 0"
            class="p-8 text-center font-mono text-white/40 uppercase"
          >
            {{ t("cmd_no_results") }}
          </div>
          <ul v-else ref="listRef" class="py-2">
            <li
              v-for="(cmd, index) in filteredCommands"
              :key="cmd.id"
              class="px-4 py-3 flex justify-between items-center cursor-pointer transition-colors font-mono uppercase text-sm font-bold"
              :class="
                index === selectedIndex
                  ? 'bg-electric text-black'
                  : 'text-white hover:bg-white/10'
              "
              @click="executeCommand(cmd)"
              @mouseenter="selectedIndex = index"
            >
              <div class="flex items-center gap-4">
                <span
                  class="w-1 h-1"
                  :class="index === selectedIndex ? 'bg-black' : 'bg-electric'"
                />
                <span>{{ cmd.label }}</span>
              </div>
              <span class="opacity-50 text-xs tracking-widest">{{
                cmd.category
              }}</span>
            </li>
          </ul>
        </div>

        <div
          class="p-2 bg-electric text-black text-xs font-mono flex justify-between uppercase font-bold"
        >
          <span>{{ t("cmd_override") }}</span>
          <span>{{ filteredCommands.length }} AVAILABLE</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
