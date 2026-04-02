<script setup lang="ts">
definePageMeta({
  layout: 'blank'
});

const route = useRoute();
const { locale } = useI18n();

const slug = route.params.slug as string;

const { data: post } = await useAsyncData(`post-${slug}`, async () => {
  const collection = queryCollection('blog');
  let found = await collection.where('stem', '=', `blog/${slug}`).first();

  if (!found) {
    found = await collection.where('stem', '=', slug).first();
  }

  return found;
});

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post Not Found',
    fatal: true
  });
}

const { data: allPosts } = await useAsyncData(`all-posts`, () =>
  queryCollection('blog').order('date', 'DESC').all()
);

const currentIndex = computed(() => {
  if (!post.value || !allPosts.value) return -1;
  return allPosts.value.findIndex((p) => p.id === post.value?.id);
});

const prevPost = computed(() => {
  if (currentIndex.value <= 0 || !allPosts.value) return null;
  return allPosts.value[currentIndex.value - 1];
});

const nextPost = computed(() => {
  if (!allPosts.value || currentIndex.value >= allPosts.value.length - 1)
    return null;
  return allPosts.value[currentIndex.value + 1];
});

const title = computed(() => {
  const t = post.value?.title;
  return typeof t === 'object' && t !== null ? (t as any)[locale.value] : t;
});

const category = computed(() => post.value?.category);
const date = computed(() => post.value?.date);

useSeoMeta({
  title: `${title.value} - Pedro Cruz`,
  description: `${category.value} - ${date.value}`,
  ogTitle: `${title.value} - Pedro Cruz`,
  ogDescription: `${category.value} - ${date.value}`
});

const { data: stats, status } = await useFetch('/api/blog-stats', {
  query: { slug },
  server: false,
  lazy: true
});

watch(
  stats,
  (newStats) => {
    if (post.value && newStats) {
      post.value = {
        ...post.value,
        analytics: newStats
      };
    }
  },
  { immediate: true }
);

onMounted(() => {
  const { $posthog } = useNuxtApp();
  if ($posthog) {
    $posthog().capture('post_viewed', {
      title: title.value,
      category: category.value,
      slug: slug,
      publish_date: date.value
    });
  }
});
</script>

<template>
  <BlogDetail
    v-if="post"
    :post="post"
    :next-post="nextPost"
    :prev-post="prevPost"
    :loading="status === 'pending'"
  />
</template>
