<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="w-full py-12 bg-electric text-center px-4">
    <div class="max-w-2xl mx-auto p-4 md:p-8">
      <span class="font-mono text-xs opacity-50 block mb-2 underline decoration-2 underline-offset-4">
        {{ t('cv_subtitle') }}
      </span>
      <p class="font-montserrat font-bold text-sm md:text-lg mb-4 opacity-80 uppercase">
        {{ t('cv_text') }}
      </p>
      <a 
        href="#" 
        class="font-mono font-bold text-xs md:text-sm underline decoration-2 underline-offset-4 hover:bg-black hover:text-electric hover:decoration-electric transition-all px-2 py-1"
      >
        [ {{ t('cv_link') }} ]
      </a>
    </div>
  </section>
</template>
