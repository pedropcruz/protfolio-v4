<script setup lang="ts">
const props = defineProps<{
  lang: 'en' | 'pt'
}>()

const { locale } = useI18n()
</script>

<template>
  <div v-if="locale === lang">
    <slot />
  </div>
</template>
