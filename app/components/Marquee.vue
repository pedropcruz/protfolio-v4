<script setup lang="ts">
import { gsap } from 'gsap';
import { STACK_ITEMS } from '~/utils/constants';

const marqueeRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (marqueeRef.value) {
    const content = marqueeRef.value.querySelector('.marquee-content');
    if (content && marqueeRef.value.childElementCount === 1) {
      const clone = content.cloneNode(true);
      marqueeRef.value.appendChild(clone);
    }

    const childrenArray = Array.from(marqueeRef.value.children);
    gsap.to(childrenArray, {
      xPercent: -100,
      repeat: -1,
      duration: 20,
      ease: 'linear'
    });
  }
});
</script>

<template>
  <section
    class="w-full text-text-secondary overflow-hidden select-none"
  >
    <div ref="marqueeRef" class="flex whitespace-nowrap overflow-hidden w-full">
      <div class="marquee-content flex gap-8 md:gap-12 px-6">
        <span
          v-for="(item, i) in STACK_ITEMS"
          :key="i"
          class="text-2xl md:text-5xl font-bold font-display tracking-tighter"
        >
          {{ item }} /
        </span>
      </div>
    </div>
  </section>
</template>
