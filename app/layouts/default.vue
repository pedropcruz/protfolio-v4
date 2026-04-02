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
    class="min-h-screen bg-black text-text-primary font-sans selection:bg-accent selection:text-black overflow-x-hidden w-full"
  >
    <ClientOnly>
      <TransitionCurtain ref="curtainRef" />
      <SystemMonitor />
      <CommandPalette />
    </ClientOnly>

    <Header />

    <slot />

    <Footer />
  </div>
</template>

<style scoped></style>
