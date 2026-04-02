<script setup lang="ts">
import { gsap } from 'gsap';

// Define the exposed methods
export interface TransitionHandle {
  play: (onMiddleCallback?: () => void) => void;
}

const curtainRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);

// Expose the play method
const play = (onMiddleCallback?: () => void) => {
  gsap.context(() => {
    const tl = gsap.timeline();

    // 1. Fade IN (full-screen opacity)
    tl.set(curtainRef.value, { pointerEvents: 'all' });
    tl.fromTo(
      curtainRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    // 2. Show label briefly
    tl.fromTo(
      textRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.15, ease: 'power2.out' },
      '-=0.1'
    );

    // 3. Fire callback at midpoint
    tl.add(() => {
      if (onMiddleCallback) onMiddleCallback();
    }, '+=0.1');

    // 4. Hide label
    tl.to(textRef.value, { opacity: 0, duration: 0.15, ease: 'power2.out' });

    // 5. Fade OUT
    tl.to(curtainRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    tl.set(curtainRef.value, { pointerEvents: 'none' });
  }, curtainRef.value!);
};

defineExpose({
  play
});
</script>

<template>
  <div
    ref="curtainRef"
    class="fixed inset-0 z-100 bg-black pointer-events-none opacity-0"
  >
    <div
      ref="textRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
    >
      <span class="label text-text-secondary">LOADING</span>
    </div>
  </div>
</template>
