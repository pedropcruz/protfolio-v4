import { process } from 'std-env';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const slug = String(query.slug || '');

  if (!slug) {
    return {
      views: 0,
      reads: 0,
      avgTime: '0m',
      shares: 0
    };
  }

  let projectId: string = config.posthogProjectId || '';
  let apiKey: string = config.posthogApiKey || '';

  if (!projectId) {
    projectId = process.env.NUXT_POSTHOG_PROJECT_ID || '';
  }
  if (!apiKey) {
    apiKey = process.env.NUXT_POSTHOG_API_KEY || '';
  }

  projectId = String(projectId || '').trim();
  apiKey = String(apiKey || '').trim();
  const host = config.public.posthogHost || 'https://eu.i.posthog.com';

  // Fallback structure matches the component expectation
  const fallback = {
    views: 0,
    reads: 0,
    avgTime: '0m',
    shares: 0
  };

  if (!projectId || !apiKey) {
    console.error('❌ CONFIG ERROR: Missing PostHog credentials');
    return fallback;
  }

  try {
    // Query 1: Views (using post_viewed event)
    const viewsQuery = `
      select 
        count() as views, 
        count(distinct distinct_id) as readers
      from events 
      where event = 'post_viewed' 
      and properties.slug = '${slug}'
    `;

    // Query 2: Avg Time (using $pageleave event which tracks active duration)
    // We match $current_url containing the slug to ensure relevance
    const timeQuery = `
      select 
        avg(toFloat(properties.$active_duration)) as avg_duration_ms
      from events 
      where event = '$pageleave' 
      and properties.$current_url like '%/${slug}%'
      and toFloat(properties.$active_duration) > 0
    `;

    const queryPayload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          select 
            (${viewsQuery}).1 as views,
            (${viewsQuery}).2 as readers,
            (${timeQuery}) as avg_duration
        `
      }
    };

    const response = await $fetch<{ results: [number, number, number][] }>(
      `${host}/api/projects/${projectId}/query/`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: queryPayload
      }
    );

    const [views, readers, avgDurationMs] =
      response.results && response.results[0] ? response.results[0] : [0, 0, 0];

    // Format duration from ms to "Xm Ys"
    let avgTime = '0m';
    if (avgDurationMs && avgDurationMs > 0) {
      const seconds = Math.floor(avgDurationMs / 1000);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      avgTime = `${m}m ${s}s`;
    }

    return {
      views: views || 0,
      reads: readers || 0,
      avgTime,
      shares: 0 // Placeholder
    };
  } catch (error: any) {
    console.error('❌ POSTHOG API ERROR:', error.message);
    if (error.data) {
      console.error('Error Detail:', JSON.stringify(error.data, null, 2));
    }
    return fallback;
  }
});
