<script setup lang="ts">
import type { BlogCollectionItem } from "@nuxt/content"

const props = defineProps<{
  post: BlogCollectionItem
  nextPost?: BlogCollectionItem | null
  prevPost?: BlogCollectionItem | null
  loading?: boolean
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { getBlogUrl } = useContentUrl()
const { getLocalized } = useLocalizedValue()

const socialLinks = [
  { name: "X", icon: "lucide:x" },
  { name: "LinkedIn", icon: "lucide:linkedin" },
  { name: "Reddit", icon: "lucide:reddit" },
  { name: "Bluesky", icon: "lucide:bluesky" },
]
</script>

<template>
  <div class="min-h-screen bg-electric">
    <!-- Header -->
    <div class="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 border-b-4 border-black bg-electric sticky top-0 z-50">
      <div class="flex flex-col overflow-hidden mr-4">
        <span class="font-mono text-[10px] md:text-xs font-bold uppercase opacity-60 whitespace-nowrap">
          LOG // 0{{ post.id }} // {{ post.category }}
        </span>
        <h2 class="text-xl md:text-4xl font-archivo uppercase leading-none truncate font-bold text-black">
          {{ getLocalized(post.title) }}
        </h2>
      </div>
      <UButton
        :to="localePath('/')"
        icon="i-lucide-x"
        color="neutral"
        variant="outline"
        size="lg"
        square
        :ui="{
          base: 'border-2 border-black hover:bg-black hover:text-electric rounded-none bg-electric',
        }"
      />
    </div>

    <!-- Content -->
    <div class="p-4 md:p-20 font-montserrat text-black bg-white/50">
      <div class="max-w-5xl mx-auto flex flex-col gap-8 md:gap-12">
        <!-- Header Area in Body -->
        <div class="w-full text-left border-b-4 border-black pb-8">
          <div class="flex justify-between items-end mb-4 md:mb-6">
            <UBadge
              :label="post.category"
              size="lg"
              :ui="{
                base: 'rounded-none bg-black text-electric font-mono font-bold',
              }"
            />
            <span class="font-mono text-xs md:text-sm font-bold uppercase">
              {{ post.date }}
            </span>
          </div>
          <h1 class="text-4xl md:text-7xl font-archivo uppercase leading-[0.9] wrap-break-words font-bold text-black">
            {{ getLocalized(post.title) }}
          </h1>
        </div>

        <!-- Analytics Dashboard -->
        <div
          v-if="post.analytics || loading"
          class="w-full bg-black text-electric p-4 md:p-6 shadow-hard border-2 border-transparent"
        >
          <div class="flex justify-between items-center border-b-2 border-electric/30 pb-2 mb-4">
            <span class="font-mono text-xs font-bold animate-pulse flex items-center gap-2">
              <span class="w-2 h-2 bg-electric rounded-full" />
              LIVE ANALYTICS
            </span>
            <span class="font-mono text-xs opacity-60">
              ID: {{ Math.floor(Math.random() * 999999) }}
            </span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span class="block font-mono text-[10px] md:text-xs opacity-60 mb-1">TOTAL VIEWS</span>
              <USkeleton v-if="loading" class="h-8 w-20 bg-electric/20" :ui="{ rounded: 'rounded-none' }" />
              <span v-else class="font-archivo text-xl md:text-3xl">
                {{ post.analytics?.views?.toLocaleString() || 0 }}
              </span>
            </div>
            <div>
              <span class="block font-mono text-[10px] md:text-xs opacity-60 mb-1">READ COUNT</span>
              <USkeleton v-if="loading" class="h-8 w-20 bg-electric/20" :ui="{ rounded: 'rounded-none' }" />
              <span v-else class="font-archivo text-xl md:text-3xl">
                {{ post.analytics?.reads?.toLocaleString() || 0 }}
              </span>
            </div>
            <div>
              <span class="block font-mono text-[10px] md:text-xs opacity-60 mb-1">AVG. TIME</span>
              <USkeleton v-if="loading" class="h-8 w-24 bg-electric/20" :ui="{ rounded: 'rounded-none' }" />
              <span v-else class="font-archivo text-xl md:text-3xl">
                {{ post.analytics?.avgTime || '0m' }}
              </span>
            </div>
            <div>
              <span class="block font-mono text-[10px] md:text-xs opacity-60 mb-1">SHARES</span>
              <USkeleton v-if="loading" class="h-8 w-20 bg-electric/20" :ui="{ rounded: 'rounded-none' }" />
              <span v-else class="font-archivo text-xl md:text-3xl">
                {{ post.analytics?.shares || 0 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Prose Content -->
        <ContentRenderer
          :value="post"
          class="w-full max-w-3xl text-left prose-lg md:prose-xl prose-p:font-medium prose-p:text-black prose-headings:font-archivo prose-headings:uppercase prose-headings:text-black prose-li:text-black prose-strong:text-black"
        />

        <!-- Share Buttons -->
        <div class="mt-8 md:mt-12 pt-12 border-t-4 border-black w-full">
          <span class="font-mono text-sm font-bold opacity-60 block mb-6">
            {{ t("broadcast_signal") }}
          </span>
          <div class="flex gap-4 flex-wrap">
            <UButton
              v-for="social in socialLinks"
              :key="social.name"
              :icon="social.icon"
              size="xl"
              square
              :ui="{
                base: 'rounded-none bg-black text-electric border-4 border-transparent hover:border-black hover:bg-electric hover:text-black shadow-hard',
              }"
            />
          </div>
        </div>

        <!-- Navigation -->
        <div class="w-full mt-8 md:mt-12 flex flex-row justify-between items-center border-t-4 border-black pt-8 md:pt-12">
          <UButton
            v-if="prevPost"
            :to="getBlogUrl(prevPost)"
            variant="ghost"
            :ui="{
              base: 'rounded-none hover:bg-black hover:text-electric p-2 md:p-4',
            }"
          >
            <div class="flex flex-col items-start">
              <span class="text-[10px] md:text-xs opacity-50 mb-1 font-mono">&lt;&lt; PREVIOUS</span>
              <span class="text-sm md:text-xl font-mono font-bold group-hover:underline">
                LOG_0{{ prevPost.id }}
              </span>
            </div>
          </UButton>
          <div v-else />
          
          <UButton
            v-if="nextPost"
            :to="getBlogUrl(nextPost)"
            variant="ghost"
            :ui="{
              base: 'rounded-none hover:bg-black hover:text-electric p-2 md:p-4',
            }"
          >
            <div class="flex flex-col items-end">
              <span class="text-[10px] md:text-xs opacity-50 mb-1 font-mono">NEXT &gt;&gt;</span>
              <span class="text-sm md:text-xl font-mono font-bold group-hover:underline">
                LOG_0{{ nextPost.id }}
              </span>
            </div>
          </UButton>
          <div v-else />
        </div>

        <!-- CTA -->
        <div class="mt-12 md:mt-16 p-6 md:p-12 w-full bg-black text-electric text-center border-4 border-transparent hover:border-white transition-colors mb-12">
          <h3 class="font-archivo text-2xl md:text-4xl mb-4">
            {{ t("need_technologist") }}
          </h3>
          <p class="font-mono text-sm md:text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            If this article resonated with you, we should build something together.
          </p>
          <UButton
            to="mailto:me@pedropcruz.pt"
            :label="t('initiate_contact')"
            size="xl"
            :ui="{
              base: 'rounded-none bg-black text-electric font-archivo border-4 border-transparent hover:border-black hover:bg-electric hover:text-black uppercase text-lg md:text-xl shadow-hard px-8 py-4 md:px-10 md:py-6',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
