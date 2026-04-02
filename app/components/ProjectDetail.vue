<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content';

const props = defineProps<{
  project: ProjectsCollectionItem;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const { getLocalized } = useLocalizedValue();
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <div
      class="h-16 md:h-20 flex justify-between items-center px-6 md:px-12 lg:px-16 border-b border-border bg-surface sticky top-0 z-50"
    >
      <div class="flex flex-col overflow-hidden mr-4">
        <span class="label text-text-secondary whitespace-nowrap">
          CASE STUDY
        </span>
        <h2
          class="text-xl md:text-4xl font-sans uppercase leading-none truncate font-bold text-white"
        >
          {{ project.title }}
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
      <div class="max-w-6xl mx-auto flex flex-col gap-8 md:gap-16">
        <!-- Introduction -->
        <div class="border-b border-border pb-8">
          <h1
            class="text-4xl md:text-7xl font-display uppercase mb-4 md:mb-6 leading-none warp-break-words font-bold text-white"
          >
            {{ project.title }}
          </h1>
          <p
            class="font-sans text-base md:text-xl text-text-secondary max-w-2xl"
          >
            {{ getLocalized(project.description) }}
          </p>
          <div class="flex flex-wrap gap-2 mt-6">
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              :label="tag"
              size="lg"
              :ui="{
                base: 'rounded-full border border-border-visible text-text-secondary font-mono uppercase bg-transparent'
              }"
            />
          </div>
        </div>

        <div class="w-full border border-border rounded-lg overflow-hidden">
          <NuxtImg
            v-if="project.details?.images?.[0]"
            :src="project.details.images[0]"
            alt="Project main visual"
            class="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <div class="w-full">
          <ContentRenderer :value="project" class="project-content" />
        </div>

        <!-- Tech Stack -->
        <div
          class="bg-surface-raised p-6 md:p-8 border border-border-visible rounded-lg"
        >
          <h3
            class="font-sans font-bold text-2xl md:text-3xl uppercase mb-6 border-b border-border pb-2 inline-block text-white"
          >
            Tech Stack
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div
              v-for="(tech, i) in project.details.stack"
              :key="i"
              class="group"
            >
              <h4
                class="font-bold font-mono text-lg md:text-xl mb-1 uppercase text-text-primary group-hover:text-accent transition-colors"
              >
                {{ tech.name }}
              </h4>
              <p
                class="text-sm text-text-secondary group-hover:text-text-primary transition-colors"
              >
                {{ getLocalized(tech.reason) }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div
          class="mt-8 md:mt-12 text-center pb-20 bg-surface-raised border border-border-visible rounded-lg p-6 md:p-12"
        >
          <h3
            class="font-sans font-bold text-2xl md:text-4xl mb-6 uppercase text-white"
          >
            {{ t('need_technologist') }}
          </h3>
          <UButton
            to="mailto:me@pedropcruz.pt"
            :label="t('initiate_contact')"
            size="xl"
            :ui="{
              base: 'rounded-full bg-accent text-black font-sans font-bold hover:bg-accent/90 uppercase text-lg md:text-2xl px-8 py-6'
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
