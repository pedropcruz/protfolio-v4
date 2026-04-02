<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  posts: BlogCollectionItem[];
}>();

const emit = defineEmits<{
  openArchive: [];
}>();

const { t } = useI18n();
const { getBlogUrl } = useContentUrl();
const { getLocalized } = useLocalizedValue();
const visiblePosts = computed(() => props.posts.slice(0, 3));
</script>

<template>
  <section
    id="blog-section"
  >
    <div
      class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-border pb-4 mb-12 gap-6 lg:gap-0"
    >
      <div
        class="flex flex-col md:flex-row items-start md:items-end gap-2 md:gap-4"
      >
        <h2
          class="text-4xl md:text-6xl font-display uppercase font-bold text-white"
        >
          {{ t('system_logs') }}
        </h2>
        <span class="label text-text-secondary">
          {{ t('read_only') }}
        </span>
      </div>

      <button
        type="button"
        class="font-mono font-bold text-sm rounded-full border border-border-visible text-text-secondary hover:text-accent hover:border-accent px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
        @click="emit('openArchive')"
      >
        {{ t('view_archive') }}
      </button>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border"
    >
      <NuxtLink
        v-for="post in visiblePosts"
        :key="post.id"
        :to="getBlogUrl(post)"
        class="cursor-pointer relative border-r border-b border-border p-6 md:p-8 flex flex-col justify-between group hover:bg-surface-raised transition-all active:scale-[0.98] min-h-62.5 md:aspect-square"
      >
        <div class="flex justify-between label text-text-secondary">
          <span>{{ post.category }}</span>
          <span>{{ post.date }}</span>
        </div>
        <h3
          class="text-3xl md:text-4xl font-sans uppercase leading-none wrap-break-word mt-4 md:mt-0 font-bold text-white group-hover:text-accent transition-colors"
        >
          {{ getLocalized(post.title) }}
        </h3>
        <div
          class="w-full h-1 bg-border group-hover:bg-accent mt-4 md:mt-0 transition-colors"
        />
      </NuxtLink>
    </div>
  </section>
</template>
