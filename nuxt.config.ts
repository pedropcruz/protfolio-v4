// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'v-gsap-nuxt',
    'nuxt-studio'
  ],

  devtools: {
    enabled: true
  },

  site: {
    url: 'https://pedropcruz.pt',
    name: 'Pedro Cruz',
    description: 'I find small problems worth solving and ship the product, brand, and code myself. Design, engineering, and product — solo.',
    defaultLocale: 'en'
  },

  ogImage: {
    zeroRuntime: process.env.NODE_ENV === 'production'
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '65%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' }
    ]
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/'
      }
    ]
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
    databaseUrl: '',
    resendApiKey: '',
    discordWebhookUrl: '',
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

  fonts: {
    families: [
      { name: 'Doto', weights: [400, 700, 900], global: true },
      { name: 'Space Mono', weights: [400, 700], global: true }
    ]
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
