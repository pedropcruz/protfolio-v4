<script setup lang="ts">
const { open: openCommandPalette } = useCommandPalette();
</script>

<template>
  <UHeader
    :ui="{
      root: 'bg-transparent border-b border-border relative w-full z-40 mx-auto px-6 md:px-12 lg:px-16 py-4 md:py-6',
      body: { base: 'hidden' },
      toggle: { base: 'hidden' }
    }"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <button
          class="label text-text-secondary hover:text-accent transition-colors cursor-pointer"
          @click="openCommandPalette"
        >
          <UIcon
            name="i-lucide-search"
            class="size-4 md:hidden"
          />
          <span class="hidden md:inline">⌘K</span>
        </button>

        <LanguageSwitch />
      </div>
    </template>
  </UHeader>
</template>
