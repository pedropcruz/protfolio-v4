<script setup lang="ts">
import { gsap } from "gsap";

// Define the exposed methods
export interface TransitionHandle {
  play: (onMiddleCallback?: () => void) => void;
}

const containerRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const columns = [0, 1, 2, 3, 4];

// Expose the play method
const play = (onMiddleCallback?: () => void) => {
  const ctx = gsap.context(() => {
    const cols = containerRef.value?.querySelectorAll(".shutter-col");

    const tl = gsap.timeline({
      onComplete: () => {
        // Optional cleanup
      },
    });

    // 1. Shutter CLOSE (Top to Bottom)
    tl.set(containerRef.value, { pointerEvents: "all" });
    tl.fromTo(
      cols!,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power4.inOut",
      },
    );

    // 2. Show Text
    tl.fromTo(
      textRef.value,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.1 },
      "-=0.2",
    );

    tl.add(() => {
      if (onMiddleCallback) onMiddleCallback();
    }, "+=0.1");

    tl.to(textRef.value, { opacity: 0, duration: 0.1 });

    tl.to(cols!, {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.4,
      stagger: 0.05,
      ease: "power4.inOut",
    });

    tl.set(containerRef.value, { pointerEvents: "none" });
  }, containerRef.value!); // Scope to container
};

defineExpose({
  play,
});
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 z-150 pointer-events-none flex w-full h-full"
  >
    <div
      v-for="i in columns"
      :key="i"
      class="shutter-col flex-1 bg-black border-r border-electric/10 relative overflow-hidden"
      style="transform: scaleY(0)"
    >
      <div
        class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      />
    </div>

    <div
      ref="textRef"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 px-4"
    >
      <div
        class="bg-electric text-black px-4 py-2 md:px-6 md:py-4 font-archivo text-xl md:text-4xl uppercase border-4 border-white shadow-hard break-all text-center"
      >
        LOADING...
      </div>
    </div>
  </div>
</template>
