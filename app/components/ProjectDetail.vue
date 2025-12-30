<script setup lang="ts">
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{
  project: ProjectsCollectionItem;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const { getLocalized } = useLocalizedValue();
</script>

<template>
  <div class="min-h-screen bg-electric">
    <!-- Header -->
    <div
      class="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 border-b-4 border-black bg-electric sticky top-0 z-50"
    >
      <div class="flex flex-col overflow-hidden mr-4">
        <span
          class="font-mono text-[10px] md:text-xs font-bold uppercase opacity-60 whitespace-nowrap"
        >
          CASE STUDY // 0{{ project.displayId }}
        </span>
        <h2
          class="text-xl md:text-4xl font-archivo uppercase leading-none truncate font-bold"
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
          base: 'border-4 border-black hover:bg-black hover:text-electric rounded-none ',
        }"
      />
    </div>

    <!-- Content -->
    <div class="p-4 md:p-20 font-montserrat text-black bg-white/50">
      <div class="max-w-5xl mx-auto flex flex-col gap-8 md:gap-16">
        <!-- Introduction -->
        <div class="border-b-4 border-black pb-8">
          <h1
            class="text-4xl md:text-7xl font-archivo uppercase mb-4 md:mb-6 leading-none warp-break-words font-bold"
          >
            {{ project.title }}
          </h1>
          <p class="font-mono text-base md:text-xl uppercase max-w-2xl">
            {{ getLocalized(project.description) }}
          </p>
          <div class="flex flex-wrap gap-2 mt-6">
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              :label="tag"
              size="lg"
              :ui="{
                base: 'rounded-none bg-black text-white font-bold uppercase',
              }"
            />
          </div>
        </div>

        <div class="w-full border-4 border-black shadow-hard overflow-hidden">
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
        <div class="bg-black p-6 md:p-8 text-electric shadow-hard">
          <h3
            class="font-archivo text-2xl md:text-3xl uppercase mb-6 border-b-2 border-electric pb-2 inline-block"
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
                class="font-black font-mono text-lg md:text-xl mb-1 uppercase group-hover:text-white transition-colors"
              >
                {{ tech.name }}
              </h4>
              <p class="text-sm opacity-70 group-hover:opacity-100">
                {{ getLocalized(tech.reason) }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-8 md:mt-12 text-center pb-20">
          <h3 class="font-archivo text-2xl md:text-4xl mb-6 uppercase">
            {{ t("need_technologist") }}
          </h3>
          <UButton
            to="mailto:me@pedropcruz.pt"
            :label="t('initiate_contact')"
            size="xl"
            :ui="{
              base: 'rounded-none bg-black text-electric font-archivo hover:bg-electric hover:text-black border-4 border-transparent hover:border-black uppercase text-lg md:text-2xl shadow-hard px-8 py-6',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
