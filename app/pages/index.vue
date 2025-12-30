<script setup lang="ts">
// Blog Archive modal state
const showArchive = ref(false)

const { data: projects } = await useAsyncData(
  'projects',
  async () => {
    const all = await queryCollection('projects').all()
    return all.sort((a, b) => Number(a.displayId) - Number(b.displayId))
  }
)

const { data: blogPosts } = await useAsyncData(
  'blog',
  async () => {
    return await queryCollection('blog').order('date', 'DESC').all()
  }
)

const openArchive = () => {
  showArchive.value = true
}

const closeArchive = () => {
  showArchive.value = false
}
</script>

<template>
  <div>
    <Hero />
    <Marquee />
    <ProjectShowcase :projects="projects || []" />
    <BlogGrid :posts="blogPosts || []" @open-archive="openArchive" />
    <ProjectEstimator />
    <CVSection />

    <BlogArchive
      :posts="blogPosts || []"
      :is-open="showArchive"
      @close="closeArchive"
    />
  </div>
</template>
