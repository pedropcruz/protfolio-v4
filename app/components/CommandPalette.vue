<script setup lang="ts">
import { gsap } from 'gsap';

const { t } = useI18n();
const isOpen = ref(false);
provide('commandPaletteOpen', isOpen);
const query = ref('');
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
    id: 'home',
    label: t('cmd_home'),
    category: 'NAVIGATION',
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  {
    id: 'projects',
    label: t('cmd_projects'),
    category: 'NAVIGATION',
    action: () =>
      document
        .getElementById('projects-section')
        ?.scrollIntoView({ behavior: 'smooth' })
  },
  {
    id: 'blog',
    label: t('cmd_blog'),
    category: 'NAVIGATION',
    action: () =>
      document
        .getElementById('blog-section')
        ?.scrollIntoView({ behavior: 'smooth' })
  },
  {
    id: 'estimator',
    label: t('cmd_estimator'),
    category: 'TOOLS',
    action: () =>
      document
        .getElementById('estimator')
        ?.scrollIntoView({ behavior: 'smooth' })
  },
  {
    id: 'email',
    label: t('cmd_email'),
    category: 'COMMUNICATION',
    action: () => (window.location.href = 'mailto:me@pedropcruz.pt')
  },
  {
    id: 'cv',
    label: t('cmd_cv'),
    category: 'ASSETS',
    action: () => alert('DOWNLOADING_ASSET...')
  },
  {
    id: 'github',
    label: t('cmd_gh'),
    category: 'EXTERNAL',
    action: () => window.open(SOCIAL_LINKS.github, '_blank')
  }
]);

// Filter Logic
const filteredCommands = computed(() => {
  const lowerQuery = query.value.toLowerCase();
  return commands.value.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.category.toLowerCase().includes(lowerQuery)
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
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (e.key === 'Escape') {
    closePalette();
  }
};

const handleNav = (e: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value =
      (selectedIndex.value + 1) % filteredCommands.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value =
      (selectedIndex.value - 1 + filteredCommands.value.length) %
      filteredCommands.value.length;
  } else if (e.key === 'Enter') {
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
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
        );
      }
    });
  } else {
    query.value = '';
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
      activeElement.scrollIntoView({ block: 'nearest' });
    }
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleNav);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keydown', handleNav);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-200 flex items-start justify-center pt-[20vh] px-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-md"
        @click="closePalette"
      />

      <!-- Container -->
      <div
        ref="containerRef"
        class="relative w-full max-w-2xl bg-surface border border-border-visible rounded-lg overflow-hidden flex flex-col max-h-[60vh]"
      >
        <!-- Input Area -->
        <div class="flex items-center p-4 border-b border-border">
          <span class="text-accent mr-4 font-mono font-bold">&gt;</span>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="t('cmd_placeholder')"
            class="w-full bg-transparent text-white font-sans text-lg placeholder-text-disabled focus:outline-none"
          />
          <span
            class="text-xs font-mono text-text-secondary border border-border-visible px-2 py-1 rounded"
            >ESC</span
          >
        </div>

        <!-- Command List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div
            v-if="filteredCommands.length === 0"
            class="p-8 text-center font-mono text-text-disabled uppercase"
          >
            {{ t('cmd_no_results') }}
          </div>
          <ul v-else ref="listRef" class="py-2">
            <li
              v-for="(cmd, index) in filteredCommands"
              :key="cmd.id"
              class="px-4 py-3 flex justify-between items-center cursor-pointer transition-colors duration-200 font-mono uppercase text-sm"
              :class="
                index === selectedIndex
                  ? 'bg-accent text-black'
                  : 'text-text-primary hover:bg-surface-raised'
              "
              @click="executeCommand(cmd)"
              @mouseenter="selectedIndex = index"
            >
              <div class="flex items-center gap-4">
                <span
                  class="w-1 h-1 rounded-full"
                  :class="index === selectedIndex ? 'bg-black' : 'bg-accent'"
                />
                <span>{{ cmd.label }}</span>
              </div>
              <span
                class="font-mono uppercase tracking-wider text-xs text-text-secondary"
                >{{ cmd.category }}</span
              >
            </li>
          </ul>
        </div>

        <!-- Bottom Bar -->
        <div
          class="p-2 bg-surface text-text-secondary text-xs font-mono flex justify-between uppercase"
        >
          <span>{{ t('cmd_override') }}</span>
          <span>{{ filteredCommands.length }} AVAILABLE</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
