import posthog from 'posthog-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const posthogClient = posthog.init(config.public.posthogPublicKey, {
    api_host: config.public.posthogHost || 'https://eu.i.posthog.com',
    capture_pageview: false,
    loaded: (posthog) => {
      // if (import.meta.env.DEV) posthog.debug();
    }
  });

  // Track pageview
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', {
        $current_url: to.fullPath
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient
    }
  };
});
