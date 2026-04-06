<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

defineProps<{
  posts: BlogCollectionItem[];
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const { getBlogUrl } = useContentUrl();
const { getLocalized } = useLocalizedValue();
</script>

<template>
  <UModal
    :open="isOpen"
    fullscreen
    :ui="{
      overlay: 'bg-black/90 backdrop-blur-sm',
      content:
        'bg-surface border-0 md:border md:border-border-visible rounded-none md:rounded-lg md:w-[80vw] md:h-[90vh] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
    }"
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #content>
      <div class="relative w-full h-full flex flex-col overflow-hidden">
        <!-- Header -->
        <div
          class="h-16 md:h-20 flex justify-between items-center px-4 md:px-8 border-b border-border bg-surface-raised shrink-0 z-10"
        >
          <h2
            class="text-xl md:text-3xl font-sans uppercase leading-none text-white"
          >
            {{ t('archive_title') }}
          </h2>
          <LazyUButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="lg"
            square
            :ui="{
              base: 'border border-border-visible hover:bg-surface hover:text-accent rounded-lg'
            }"
            @click="emit('close')"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto bg-surface px-6 md:px-12 lg:px-16 py-8 md:py-12">
          <ul class="space-y-4 max-w-6xl mx-auto">
            <li v-for="post in posts" :key="post.id">
              <NuxtLink
                :to="getBlogUrl(post)"
                class="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 cursor-pointer hover:bg-surface-raised p-2 md:p-3 transition-colors rounded-lg border-b border-border"
                @click="emit('close')"
              >
                <!-- Custom Bullet / ID -->
                <div class="flex items-center gap-3 shrink-0">
                  <span class="w-3 h-3 bg-accent shrink-0 transition-colors" />
                  <span
                    class="font-mono text-xs md:text-sm font-bold text-text-disabled group-hover:text-text-secondary"
                  >
                    LOG_{{ String(post.id).padStart(3, '0') }}
                  </span>
                </div>

                <!-- Title -->
                <h3
                  class="text-lg md:text-3xl font-sans font-bold uppercase leading-none text-text-primary group-hover:text-accent transition-colors duration-300"
                >
                  {{ getLocalized(post.title) }}
                </h3>

                <!-- Date -->
                <span
                  class="md:ml-auto font-mono text-xs text-text-disabled group-hover:text-text-secondary uppercase"
                >
                  {{ post.date }} · {{ post.category }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div
          class="p-3 bg-surface-raised text-text-disabled font-mono text-[10px] md:text-xs text-center uppercase border-t border-border"
        >
          {{ posts.length }} entries
        </div>
      </div>
    </template>
  </UModal>
</template>
