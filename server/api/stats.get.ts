import { process } from 'std-env';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

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

  const fallback = {
    visitors: 0,
    pageViews: 0,
    topProjects: [],
    avgSession: '0m',
    errors: 0
  };

  if (!projectId || !apiKey) {
    const missing = [];
    if (!projectId) missing.push('ProjectID');
    if (!apiKey) missing.push('APIKey');

    console.error(`❌ CONFIG ERROR: Missing ${missing.join(' and ')}`);

    return {
      ...fallback,
      status: `misconfigured: Missing ${missing.join(' & ')}`
    };
  }

  try {
    const queryPayload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          select 
            count() as pageviews, 
            count(distinct distinct_id) as visitors 
          from events 
          where event = '$pageview' 
          and timestamp > now() - interval 30 day
          and properties.$host not in ('localhost', '127.0.0.1', 'localhost:3000')
        `
      }
    };

    const projectsQueryPayload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          select 
            properties.$current_url as url,
            count() as views
          from events 
          where event = '$pageview' 
          and timestamp > now() - interval 30 day
          and properties.$current_url like '%/projects/%'
          and properties.$host not in ('localhost', '127.0.0.1', 'localhost:3000')
          group by url
          order by views desc
          limit 3
        `
      }
    };

    const sessionQueryPayload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          select avg(duration) as avg_duration
          from (
            select 
              dateDiff('second', min(timestamp), max(timestamp)) as duration 
            from events 
            where timestamp > now() - interval 30 day 
            and $session_id != ''
            and properties.$host not in ('localhost', '127.0.0.1', 'localhost:3000')
            group by $session_id
          )
        `
      }
    };

    const errorsQueryPayload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          select count() as errors
          from events
          where event = '$exception'
          and timestamp > now() - interval 30 day
          and properties.$host not in ('localhost', '127.0.0.1', 'localhost:3000')
        `
      }
    };

    const [
      overviewResponse,
      projectsResponse,
      sessionResponse,
      errorsResponse
    ] = await Promise.all([
      $fetch<{ results: [number, number][] }>(
        `${host}/api/projects/${projectId}/query/`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: queryPayload
        }
      ),
      $fetch<{ results: [string, number][] }>(
        `${host}/api/projects/${projectId}/query/`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: projectsQueryPayload
        }
      ),
      $fetch<{ results: [number][] }>(
        `${host}/api/projects/${projectId}/query/`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: sessionQueryPayload
        }
      ),
      $fetch<{ results: [number][] }>(
        `${host}/api/projects/${projectId}/query/`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: errorsQueryPayload
        }
      )
    ]);

    const [pageViews, visitors] =
      overviewResponse.results && overviewResponse.results[0]
        ? overviewResponse.results[0]
        : [0, 0];

    const topProjects = (projectsResponse.results || []).map(([url, views]) => {
      const slug = url.split('/projects/')[1]?.replace(/\/$/, '') || 'unknown';
      return { name: slug, views };
    });

    const avgSessionSeconds =
      sessionResponse.results && sessionResponse.results[0]
        ? sessionResponse.results[0][0]
        : 0;

    const minutes = Math.floor(avgSessionSeconds / 60);
    const seconds = Math.round(avgSessionSeconds % 60);
    const avgSession = `${minutes}m ${seconds}s`;

    const errors =
      errorsResponse.results && errorsResponse.results[0]
        ? errorsResponse.results[0][0]
        : 0;

    console.log('✅ SUCCESS: Data fetched from PostHog');

    return {
      visitors,
      pageViews,
      topProjects,
      avgSession,
      errors,
      lastUpdated: new Date().toISOString(),
      status: 'ok'
    };
  } catch (error: any) {
    console.error('❌ POSTHOG API ERROR:', error.message);

    let errorDetail = 'Connection Failed';

    if (error.data) {
      console.error('Error Body:', JSON.stringify(error.data, null, 2));
      if (error.data.detail) errorDetail = error.data.detail;
    }

    return {
      ...fallback,
      status: `error: ${errorDetail}`
    };
  }
});
