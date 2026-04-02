<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section class="w-full text-center">
    <div class="max-w-2xl mx-auto">
      <span class="label text-text-disabled block mb-2">
        {{ t('cv_subtitle') }}
      </span>
      <p class="font-sans text-text-secondary text-sm md:text-lg mb-4">
        {{ t('cv_text') }}
      </p>
      <a
        href="#"
        class="font-mono font-bold text-xs md:text-sm text-accent hover:underline transition-all px-2 py-1"
      >
        {{ t('cv_link') }}
      </a>
    </div>
  </section>
</template>
