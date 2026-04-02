<script setup lang="ts">
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <div class="flex items-center gap-3">
    <NuxtLink
      :to="switchLocalePath('en')"
      class="label transition-colors"
      :class="
        locale === 'en'
          ? 'text-accent'
          : 'text-text-disabled hover:text-text-secondary'
      "
    >
      EN
    </NuxtLink>

    <span class="text-text-disabled">/</span>

    <NuxtLink
      :to="switchLocalePath('pt')"
      class="label transition-colors"
      :class="
        locale === 'pt'
          ? 'text-accent'
          : 'text-text-disabled hover:text-text-secondary'
      "
    >
      PT
    </NuxtLink>
  </div>
</template>
