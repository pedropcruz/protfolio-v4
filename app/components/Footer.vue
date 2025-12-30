<template>
  <UFooter
    :ui="{
      root: 'bg-black text-electric py-12 md:py-20 px-4 md:px-12 border-t-4 border-electric w-full m-0',
      container: 'mx-auto',
      left: 'w-full',
      right: 'flex flex-wrap gap-4 md:gap-6 font-mono text-xl font-bold',
      bottom:
        'mt-12 md:mt-20 pt-8 border-t-4 border-electric font-mono text-xs md:text-sm flex flex-col md:flex-row justify-between gap-4',
    }"
  >
    <template #left>
      <a
        href="mailto:me@pedropcruz.pt"
        class="text-3xl md:text-6xl lg:text-8xl font-archivo leading-none break-all hover:text-white transition-colors underline decoration-4 underline-offset-8"
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
        class="p-2 pb-0 border-2 border-transparent hover:border-electric hover:bg-white/10 transition-colors text-electric"
      >
        <UIcon :name="`lucide:${key}`" class="size-6" />
      </a>
    </template>

    <template #bottom>
      <span>© {{ new Date().getFullYear() }} PEDRO CRUZ</span>
      <span>NEO-BRUTALISM // V.2.0</span>
    </template>
  </UFooter>
</template>
