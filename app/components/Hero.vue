<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section
    class="min-h-[85vh] flex flex-col justify-between pt-8 md:pt-12 pb-12 relative"
  >
    <div class="flex flex-col">
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-border pb-4 mb-8"
      >
        <h1
          class="text-[18vw] lg:text-[11rem] font-display font-bold leading-[0.85] tracking-tighter wrap-break-words w-full text-white"
        >
          PEDRO<br />CRUZ
        </h1>

        <div
          class="text-left lg:text-right py-4 lg:py-0 w-full lg:w-auto mt-4 lg:mt-0"
        >
          <div
            class="label text-text-secondary mb-1 whitespace-nowrap text-xs md:text-sm"
          >
            {{ t('role') }}
          </div>
          <div
            class="label text-text-disabled mb-1 whitespace-nowrap text-xs md:text-sm"
          >
            {{ t('location') }}
          </div>
          <div
            class="bg-accent text-black rounded-full px-3 py-1 inline-block whitespace-nowrap text-xs md:text-sm font-mono font-bold"
          >
            {{ t('available_work') }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-end gap-8">
      <ExperienceTicker />

      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12"
      >
        <div
          class="max-w-2xl font-sans text-text-primary text-xl md:text-2xl leading-tight"
        >
          {{ t('hero_desc') }}
        </div>

        <div class="w-full lg:w-auto">
          <SiteAudit />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
