<script setup lang="ts">
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <div
    class="flex bg-black border-4 border-black w-auto shrink-0 shadow-hard h-12 md:h-14"
  >
    <NuxtLink
      :to="switchLocalePath('en')"
      class="px-3 md:px-5 font-mono font-bold text-sm md:text-lg transition-colors flex items-center justify-center"
      :class="
        locale === 'en'
          ? 'bg-electric text-black'
          : 'bg-black text-electric hover:bg-white/20'
      "
    >
      EN
    </NuxtLink>

    <div class="w-0.5 bg-electric/20" />

    <NuxtLink
      :to="switchLocalePath('pt')"
      class="px-3 md:px-5 font-mono font-bold text-sm md:text-lg transition-colors flex items-center justify-center"
      :class="
        locale === 'pt'
          ? 'bg-electric text-black'
          : 'bg-black text-electric hover:bg-white/20'
      "
    >
      PT
    </NuxtLink>
  </div>
</template>
