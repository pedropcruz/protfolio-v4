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

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: true,
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
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
