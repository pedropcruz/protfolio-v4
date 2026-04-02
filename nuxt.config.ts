// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxtjs/i18n',
    'v-gsap-nuxt',
    'nuxt-studio'
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Doto:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    posthogApiKey: '',
    posthogProjectId: '',
    public: {
      posthogPublicKey: '',
      posthogHost: 'https://eu.i.posthog.com'
    }
  },

  routeRules: {
    '/': { redirect: '/en' }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'posthog-js'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: false
    }
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'pt', file: 'pt.json' }
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix'
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'pedropcruzthe1',
      repo: 'portfolio-v4',
      branch: 'main'
    }
  }
});
