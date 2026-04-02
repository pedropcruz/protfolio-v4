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
      <div class="flex items-center gap-2">
        <!-- CommandPalette trigger: search icon on mobile, ⌘K badge on desktop -->
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          square
          :ui="{
            base: 'border border-border-visible hover:bg-surface-raised hover:text-accent rounded-lg'
          }"
          @click="openCommandPalette"
        >
          <!-- Mobile: search icon -->
          <UIcon
            name="i-lucide-search"
            class="size-4 md:hidden"
          />
          <!-- Desktop: ⌘K badge -->
          <span class="hidden md:inline font-mono text-xs text-text-secondary">⌘K</span>
        </UButton>

        <LanguageSwitch />
      </div>
    </template>
  </UHeader>
</template>
