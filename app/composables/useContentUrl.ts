import type { BlogCollectionItem, ProjectsCollectionItem } from '@nuxt/content';

export function useContentUrl() {
  const localePath = useLocalePath();

  const getSlugFromStem = (stem: string) => {
    return stem.replace(/^(blog|projects)\//, '');
  };

  const getBlogUrl = (post: BlogCollectionItem) => {
    const stem = String(post.stem || '');
    const slug = getSlugFromStem(stem);
    return localePath(`/blog/${slug}`);
  };

  const getProjectUrl = (project: ProjectsCollectionItem) => {
    const stem = String(project.stem || '');
    const slug = getSlugFromStem(stem);
    return localePath(`/projects/${slug}`);
  };

  return {
    getBlogUrl,
    getProjectUrl,
    getSlugFromStem
  };
}
