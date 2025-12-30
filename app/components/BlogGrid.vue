<script setup lang="ts">
import type { BlogCollectionItem } from "@nuxt/content"

const props = defineProps<{
  posts: BlogCollectionItem[]
}>()

const emit = defineEmits<{
  openArchive: []
}>()

const { t } = useI18n()
const { getBlogUrl } = useContentUrl()
const { getLocalized } = useLocalizedValue()
const visiblePosts = computed(() => props.posts.slice(0, 3))
</script>

<template>
  <section
    id="blog-section"
    class="py-20 md:py-32 px-4 md:px-12 border-b-4 border-black"
  >
    <div
      class="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b-4 border-black pb-4 mb-12 gap-6 lg:gap-0"
    >
      <div
        class="flex flex-col md:flex-row items-start md:items-end gap-2 md:gap-4"
      >
        <h2 class="text-4xl md:text-6xl font-archivo uppercase font-bold">
          {{ t("system_logs") }}
        </h2>
        <span class="font-mono text-lg md:text-xl mb-1 md:mb-2 animate-pulse">
          {{ t("read_only") }}
        </span>
      </div>

      <button
        type="button"
        class="font-mono font-bold text-sm md:text-base underline decoration-2 underline-offset-4 hover:bg-black hover:text-electric hover:decoration-electric px-2 py-1 whitespace-nowrap cursor-pointer"
        @click="emit('openArchive')"
      >
        [ {{ t("view_archive") }} ]
      </button>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-4 border-l-4 border-black"
    >
      <NuxtLink
        v-for="post in visiblePosts"
        :key="post.id"
        :to="getBlogUrl(post)"
        class="cursor-pointer relative border-r-4 border-b-4 border-black p-6 md:p-8 flex flex-col justify-between group hover:bg-black hover:text-electric transition-all active:scale-[0.98] min-h-62.5 md:aspect-square"
      >
        <div class="flex justify-between font-mono text-xs opacity-60">
          <span>// {{ post.category }}</span>
          <span>{{ post.date }}</span>
        </div>
        <h3
          class="text-3xl md:text-4xl font-archivo uppercase leading-none break-words mt-4 md:mt-0 font-bold"
        >
          {{ getLocalized(post.title) }}
        </h3>
        <div class="w-full h-1 bg-black group-hover:bg-electric mt-4 md:mt-0" />
      </NuxtLink>
    </div>
  </section>
</template>
