<script setup lang="ts">
import { gsap } from 'gsap';

const COMPANIES = [
  'SPARQLY',
  'VOLKSWAGEN DIGITAL SOLUTIONS',
  'VALTECH',
  'FIDGROVE',
  'PIKSEL',
  'GRUPO IMPRESA'
];

const currentIndex = ref(0);
const textRef = ref<HTMLElement | null>(null);
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    if (!textRef.value) return;

    gsap.to(textRef.value, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        currentIndex.value = (currentIndex.value + 1) % COMPANIES.length;

        gsap.set(textRef.value, { y: 20 });

        gsap.to(textRef.value, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  }, 3000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm md:text-base tracking-wide mb-8 pb-4 w-full max-w-2xl"
  >
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 bg-accent rounded-full" />
      <span class="label text-text-secondary">PREVIOUSLY_DEPLOYED_AT:</span>
    </div>

    <div class="h-6 md:h-6 overflow-hidden relative min-w-50">
      <div
        ref="textRef"
        class="whitespace-nowrap bg-surface-raised text-accent px-3 py-1 rounded inline-block font-mono text-sm"
      >
        {{ COMPANIES[currentIndex] }}
      </div>
    </div>
  </div>
</template>
