<script setup lang="ts">
const { register } = useTransitionCurtain();
const curtainRef = ref(null);

watch(curtainRef, (newVal) => {
  if (newVal) {
    register(newVal);
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-electric text-black font-montserrat selection:bg-black selection:text-electric overflow-x-hidden w-full"
  >
    <ClientOnly>
      <TransitionCurtain ref="curtainRef" />
      <SystemMonitor />
      <CommandPalette />
      <GlobalShader />
    </ClientOnly>

    <Header />

    <slot />

    <Footer />
  </div>
</template>

<style scoped></style>
