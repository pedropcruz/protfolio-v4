<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
}>();
</script>

<template>
  <div
    class="w-full border-4 border-black shadow-hard overflow-hidden my-8 md:my-16"
  >
    <NuxtImg
      :src="src"
      :alt="alt || 'Project Image'"
      class="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
    />
  </div>
</template>
