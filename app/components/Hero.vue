<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section
    class="min-h-[85vh] flex flex-col justify-between pt-8 md:pt-12 pb-12 px-4 md:px-12 border-l-0 md:border-l-4 border-black ml-0 md:ml-12 relative mb-20"
  >
    <div class="flex flex-col">
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-4 mb-8"
      >
        <h1
          class="text-[18vw] lg:text-[11rem] font-archivo font-bold leading-[0.85] tracking-tighter wrap-break-words w-full"
        >
          PEDRO<br />CRUZ
        </h1>

        <div
          class="text-left lg:text-right font-mono font-bold py-4 lg:py-0 w-full lg:w-auto mt-4 lg:mt-0"
        >
          <div class="mb-1 whitespace-nowrap text-xs md:text-xl">
            {{ t("role") }}
          </div>
          <div class="mb-1 whitespace-nowrap text-xs md:text-xl">
            {{ t("location") }}
          </div>
          <div
            class="text-black bg-white px-2 py-1 inline-block border-2 border-black animate-pulse whitespace-nowrap text-xs md:text-xl"
          >
            {{ t("available_work") }}
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
          class="max-w-2xl font-montserrat font-bold text-xl md:text-2xl uppercase leading-tight"
        >
          {{ t("hero_desc") }}
        </div>

        <div class="w-full lg:w-auto">
          <SiteAudit />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
