<script setup lang="ts">
import type { BlogCollectionItem } from "@nuxt/content"

defineProps<{
  posts: BlogCollectionItem[]
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { getBlogUrl } = useContentUrl()
const { getLocalized } = useLocalizedValue()
</script>

<template>
  <UModal
    :open="isOpen"
    fullscreen
    :ui="{
      overlay: 'bg-electric/90 backdrop-blur-sm',
      content: 'bg-electric border-0 md:border-4 md:border-black rounded-none md:w-[80vw] md:h-[90vh] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2'
    }"
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #content>
      <div class="relative w-full h-full flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="h-16 md:h-20 flex justify-between items-center px-4 md:px-8 border-b-4 border-black bg-black text-electric shrink-0 z-10">
          <h2 class="text-xl md:text-3xl font-archivo uppercase leading-none">
            {{ t("archive_title") }}
          </h2>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="outline"
            size="lg"
            square
            :ui="{
              base: 'border-2 border-electric hover:bg-electric hover:text-black rounded-none'
            }"
            @click="emit('close')"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto bg-electric p-4 md:p-12">
          <ul class="space-y-4 max-w-5xl mx-auto">
            <li
              v-for="post in posts"
              :key="post.id"
            >
              <NuxtLink
                :to="getBlogUrl(post)"
                class="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 cursor-pointer hover:bg-black hover:text-electric p-2 md:p-3 transition-colors border-b border-black/10 hover:border-transparent"
                @click="emit('close')"
              >
                <!-- Custom Bullet / ID -->
                <div class="flex items-center gap-3 shrink-0">
                  <span class="w-3 h-3 bg-black group-hover:bg-electric shrink-0 transition-colors" />
                  <span class="font-mono text-xs md:text-sm font-bold opacity-60 group-hover:opacity-100">
                    LOG_{{ String(post.id).padStart(3, "0") }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-lg md:text-3xl font-archivo uppercase leading-none group-hover:translate-x-2 transition-transform duration-300">
                  {{ getLocalized(post.title) }}
                </h3>

                <!-- Date -->
                <span class="md:ml-auto font-mono text-xs font-bold opacity-50 group-hover:opacity-100 uppercase">
                  {{ post.date }} // {{ post.category }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="p-3 bg-black text-electric font-mono text-[10px] md:text-xs text-center uppercase border-t-4 border-transparent">
          DATABASE_ENTRIES: {{ posts.length }} // END_OF_FILE
        </div>
      </div>
    </template>
  </UModal>
</template>
