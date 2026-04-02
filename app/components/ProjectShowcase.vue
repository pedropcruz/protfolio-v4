<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsCollectionItem } from '@nuxt/content';

const props = defineProps<{
  projects: ProjectsCollectionItem[];
}>();

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n();
const { getProjectUrl } = useContentUrl();
const { getLocalized } = useLocalizedValue();
const showcaseRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  gsap.context(() => {
    if (showcaseRef.value && containerRef.value) {
      const sections = gsap.utils.toArray('.project-slide');

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: showcaseRef.value,
          pin: true,
          scrub: 1,
          end: () => '+=' + (containerRef.value?.offsetWidth || 0),
          invalidateOnRefresh: true
        }
      });
    }
  }, showcaseRef.value!);
});
</script>

<template>
  <section
    id="projects-section"
    ref="showcaseRef"
    class="w-full h-screen overflow-hidden flex flex-col justify-center relative bg-black"
  >
    <header
      class="relative md:absolute top-0 md:top-10 left-0 md:left-16 z-10 px-6 md:px-0 py-6 md:py-0 w-full md:w-auto"
    >
      <h2
        class="text-2xl md:text-4xl font-sans bg-surface-raised text-white border border-border-visible rounded-lg px-4 py-2 inline-block"
      >
        {{ t('selected_works') }}
      </h2>
      <p class="mt-2 label text-text-secondary">
        {{ t('click_inspect') }}
      </p>
    </header>

    <div
      ref="containerRef"
      class="flex h-[60vh] md:h-[70vh] items-center pl-6 md:pl-16 w-max mt-4 md:mt-0"
    >
      <NuxtLink
        v-for="(project, i) in props.projects"
        :key="project.id"
        :to="getProjectUrl(project)"
        class="project-slide cursor-pointer shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-full p-4 md:p-8 border-r border-border flex flex-col justify-between bg-black hover:bg-surface-raised transition-colors group overflow-hidden"
      >
        <div class="border-b border-border pb-4 mb-4">
          <span
            class="font-display text-6xl md:text-9xl text-text-disabled group-hover:text-accent transition-colors"
          >
            0{{ project.displayId }}
          </span>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              :label="tag"
              variant="outline"
              size="lg"
              :ui="{
                base: 'border border-border-visible rounded-full text-text-secondary font-mono uppercase transition-colors'
              }"
            />
          </div>

          <h3
            class="text-4xl md:text-6xl lg:text-8xl font-display leading-[0.85] uppercase font-bold text-white"
          >
            {{ project.title }}
          </h3>

          <p
            class="font-sans text-sm md:text-xl text-text-secondary max-w-xl line-clamp-3 md:line-clamp-none"
          >
            {{ getLocalized(project.description) }}
          </p>

          <UTooltip :text="t('click_inspect')">
            <span
              class="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity text-accent font-bold uppercase tracking-wide inline-flex items-center gap-2"
            >
              {{ t('view_case_study') }}
              <UIcon
                name="i-lucide-arrow-right"
                class="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </UTooltip>
        </div>
      </NuxtLink>

      <div class="project-slide shrink-0 w-[10vw]" aria-hidden="true" />
    </div>
  </section>
</template>
