<script setup lang="ts">
const showArchive = ref(false);

const { data: projects } = await useAsyncData('projects', async () => {
  const all = await queryCollection('projects').all();
  return all.sort((a, b) => Number(a.displayId) - Number(b.displayId));
});

const { data: blogPosts } = await useAsyncData('blog', async () => {
  return await queryCollection('blog').order('date', 'DESC').all();
});

const openArchive = () => {
  showArchive.value = true;
};

const closeArchive = () => {
  showArchive.value = false;
};
</script>

<template>
  <div>
    <SectionContainer width="normal">
      <Hero />
    </SectionContainer>

    <SectionContainer
      width="full"
      dot-grid
    >
      <Marquee />
    </SectionContainer>

    <SectionContainer
      width="full"
      :padding="false"
    >
      <ProjectShowcase :projects="projects || []" />
    </SectionContainer>

    <SectionContainer width="wide">
      <BlogGrid
        :posts="blogPosts || []"
        @open-archive="openArchive"
      />
    </SectionContainer>

    <SectionContainer
      width="wide"
      dot-grid
    >
      <ProjectEstimator />
    </SectionContainer>

    <SectionContainer
      width="normal"
      dot-grid
    >
      <CVSection />
    </SectionContainer>

    <BlogArchive
      :posts="blogPosts || []"
      :is-open="showArchive"
      @close="closeArchive"
    />
  </div>
</template>
