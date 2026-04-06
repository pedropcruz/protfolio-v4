<script setup lang="ts">
definePageMeta({
  layout: 'blank'
});

const route = useRoute();
const { locale } = useI18n();

const slug = route.params.slug as string;

// Query the exact file: projects/slug
const { data: project } = await useAsyncData(`project-${slug}`, async () => {
  const collection = queryCollection('projects');
  // Try with prefix first
  let found = await collection.where('stem', '=', `projects/${slug}`).first();

  // Fallback
  if (!found) {
    found = await collection.where('stem', '=', slug).first();
  }

  return found;
});

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project Not Found',
    fatal: true
  });
}

// Localized Description helper
const description = computed(() => {
  const d = project.value?.description;
  return typeof d === 'object' && d !== null ? (d as any)[locale.value] : d;
});

// SEO
useSeoMeta({
  title: `${project.value.title} - Pedro Cruz`,
  description: description.value,
  ogTitle: `${project.value.title} - Pedro Cruz`,
  ogDescription: description.value,
  ogType: 'article'
});

defineOgImage('Template', {
  title: project.value.title,
  description: description.value,
  tags: project.value.tags
});

useSchemaOrg([
  defineWebPage({
    name: `${project.value.title} - Pedro Cruz`,
    description: description.value || ''
  })
]);

onMounted(() => {
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    $posthog().capture('project_viewed', {
      title: project.value?.title,
      slug: slug,
      tags: project.value?.tags
    });
  }
});
</script>

<template>
  <ProjectDetail v-if="project" :project="project" />
</template>
