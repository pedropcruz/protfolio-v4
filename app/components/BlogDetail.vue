<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  post: BlogCollectionItem;
  nextPost?: BlogCollectionItem | null;
  prevPost?: BlogCollectionItem | null;
  loading?: boolean;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const { getBlogUrl } = useContentUrl();
const { getLocalized } = useLocalizedValue();

const socialLinks = [
  { name: 'X' },
  { name: 'LinkedIn' },
  { name: 'Reddit' },
  { name: 'Bluesky' }
];
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <div
      class="h-16 md:h-20 flex justify-between items-center px-6 md:px-12 lg:px-16 border-b border-border bg-surface sticky top-0 z-50"
    >
      <div class="flex flex-col overflow-hidden mr-4">
        <span class="label text-text-secondary whitespace-nowrap">
          {{ post.category }}
        </span>
        <h2
          class="text-xl md:text-4xl font-sans uppercase leading-none truncate font-bold text-white"
        >
          {{ getLocalized(post.title) }}
        </h2>
      </div>
      <UButton
        :to="localePath('/')"
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="lg"
        square
        :ui="{
          base: 'border border-border-visible hover:bg-surface-raised hover:text-accent rounded-lg'
        }"
      />
    </div>

    <!-- Content -->
    <div class="px-6 md:px-12 lg:px-16 py-24 md:py-32 font-sans text-text-primary bg-black">
      <div class="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
        <!-- Header Area in Body -->
        <div class="w-full text-left border-b border-border pb-8">
          <div class="flex justify-between items-end mb-4 md:mb-6">
            <UBadge
              :label="post.category"
              size="lg"
              :ui="{
                base: 'rounded-full border border-border-visible text-text-secondary font-mono uppercase bg-transparent'
              }"
            />
            <span class="label text-text-secondary">
              {{ post.date }}
            </span>
          </div>
          <h1
            class="text-4xl md:text-7xl font-display uppercase leading-[0.9] wrap-break-words font-bold text-white"
          >
            {{ getLocalized(post.title) }}
          </h1>
        </div>

        <!-- Analytics Dashboard -->
        <div
          v-if="post.analytics || loading"
          class="w-full bg-surface border border-border-visible rounded-lg p-4 md:p-6"
        >
          <div
            class="flex justify-between items-center border-b border-border pb-2 mb-4"
          >
            <span class="label text-text-secondary flex items-center gap-2">
              <span class="w-2 h-2 bg-accent rounded-full" />
              LIVE ANALYTICS
            </span>
            <span class="font-mono text-xs text-text-disabled">
              ID: {{ Math.floor(Math.random() * 999999) }}
            </span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span class="label text-text-secondary block mb-1"
                >TOTAL VIEWS</span
              >
              <USkeleton
                v-if="loading"
                class="h-8 w-20 bg-surface-raised rounded-lg"
              />
              <span
                v-else
                class="font-sans font-bold text-xl md:text-3xl text-white"
              >
                {{ post.analytics?.views?.toLocaleString() || 0 }}
              </span>
            </div>
            <div>
              <span class="label text-text-secondary block mb-1"
                >READ COUNT</span
              >
              <USkeleton
                v-if="loading"
                class="h-8 w-20 bg-surface-raised rounded-lg"
              />
              <span
                v-else
                class="font-sans font-bold text-xl md:text-3xl text-white"
              >
                {{ post.analytics?.reads?.toLocaleString() || 0 }}
              </span>
            </div>
            <div>
              <span class="label text-text-secondary block mb-1"
                >AVG. TIME</span
              >
              <USkeleton
                v-if="loading"
                class="h-8 w-24 bg-surface-raised rounded-lg"
              />
              <span
                v-else
                class="font-sans font-bold text-xl md:text-3xl text-white"
              >
                {{ post.analytics?.avgTime || '0m' }}
              </span>
            </div>
            <div>
              <span class="label text-text-secondary block mb-1">SHARES</span>
              <USkeleton
                v-if="loading"
                class="h-8 w-20 bg-surface-raised rounded-lg"
              />
              <span
                v-else
                class="font-sans font-bold text-xl md:text-3xl text-white"
              >
                {{ post.analytics?.shares || 0 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Prose Content -->
        <ContentRenderer
          :value="post"
          class="w-full max-w-3xl text-left prose-lg md:prose-xl prose-p:font-medium prose-p:text-text-primary prose-headings:font-sans prose-headings:uppercase prose-headings:text-white prose-li:text-text-primary prose-strong:text-white"
        />

        <!-- Share Buttons -->
        <div class="mt-8 md:mt-12 pt-12 border-t border-border w-full">
          <span class="label text-text-secondary block mb-6">
            {{ t('broadcast_signal') }}
          </span>
          <div class="flex gap-4 md:gap-6 flex-wrap">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              href="#"
              class="label text-text-secondary hover:text-accent transition-colors"
            >
              SHARE ON {{ social.name.toUpperCase() }}
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div
          class="w-full mt-8 md:mt-12 flex flex-row justify-between items-center border-t border-border pt-8 md:pt-12"
        >
          <UButton
            v-if="prevPost"
            :to="getBlogUrl(prevPost)"
            variant="ghost"
            :ui="{
              base: 'rounded-lg hover:bg-surface-raised p-2 md:p-4'
            }"
          >
            <div class="flex flex-col items-start">
              <span class="label text-text-disabled mb-1"
                >&lt;&lt; PREVIOUS</span
              >
              <span
                class="text-sm md:text-xl font-mono font-bold text-text-primary group-hover:text-accent"
              >
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
              base: 'rounded-lg hover:bg-surface-raised p-2 md:p-4'
            }"
          >
            <div class="flex flex-col items-end">
              <span class="label text-text-disabled mb-1">NEXT &gt;&gt;</span>
              <span
                class="text-sm md:text-xl font-mono font-bold text-text-primary group-hover:text-accent"
              >
                LOG_0{{ nextPost.id }}
              </span>
            </div>
          </UButton>
          <div v-else />
        </div>

        <!-- CTA -->
        <div
          class="mt-12 md:mt-16 p-6 md:p-12 w-full bg-surface border border-border-visible rounded-lg text-center mb-12"
        >
          <h3 class="font-sans font-bold text-2xl md:text-4xl mb-4 text-white">
            {{ t('need_technologist') }}
          </h3>
          <p
            class="font-mono text-sm md:text-lg mb-8 text-text-secondary max-w-2xl mx-auto"
          >
            If this article resonated with you, we should build something
            together.
          </p>
          <UButton
            to="mailto:me@pedropcruz.pt"
            :label="t('initiate_contact')"
            size="xl"
            :ui="{
              base: 'rounded-full bg-accent text-black font-sans font-bold hover:bg-accent/90 uppercase text-lg md:text-xl px-8 py-4 md:px-10 md:py-6'
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
