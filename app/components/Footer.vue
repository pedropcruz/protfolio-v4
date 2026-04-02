<script setup lang="ts">
import { SOCIAL_LINKS } from '~/utils/socialLinks';
</script>

<template>
  <UFooter
    :ui="{
      root: 'bg-surface text-text-primary py-12 md:py-20 px-6 md:px-12 lg:px-16 border-t border-border w-full m-0',
      container: 'mx-auto',
      left: 'w-full',
      right: 'flex flex-wrap gap-4 md:gap-6',
      bottom:
        'mt-12 md:mt-20 pt-8 border-t border-border font-mono text-xs md:text-sm flex flex-col md:flex-row justify-between gap-4 text-text-secondary uppercase tracking-widest'
    }"
  >
    <template #left>
      <a
        href="mailto:me@pedropcruz.pt"
        class="text-3xl md:text-6xl lg:text-6xl font-display leading-none break-all text-white hover:text-accent transition-colors"
      >
        me@pedropcruz.pt
      </a>
    </template>

    <template #right>
      <a
        v-for="(url, key) in SOCIAL_LINKS"
        :key="key"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="label text-text-secondary hover:text-accent transition-colors"
      >
        {{ String(key).toUpperCase() }}
      </a>
    </template>

    <template #bottom>
      <span>&copy; {{ new Date().getFullYear() }} PEDRO CRUZ</span>
    </template>
  </UFooter>
</template>
