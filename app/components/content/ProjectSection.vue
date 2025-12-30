<script setup lang="ts">
defineProps<{
  heading?: string;
}>();
</script>

<template>
  <div
    class="w-full flex flex-col md:flex-row gap-4 md:gap-8 my-8 md:my-12 items-center justify-center"
  >
    <div class="w-full md:w-1/3 shrink-0">
      <h3
        v-if="heading"
        class="font-archivo text-2xl md:text-3xl uppercase wrap-break-words font-bold"
      >
        {{ heading }}
      </h3>
    </div>

    <div
      class="border-l-4 border-black pl-4 md:pl-8 w-full md:w-2/3 text-lg md:text-xl leading-relaxed font-medium prose-p:mb-4 prose-p:leading-relaxed prose-a:underline hover:prose-a:text-electric"
    >
      <slot />
    </div>
  </div>
</template>
