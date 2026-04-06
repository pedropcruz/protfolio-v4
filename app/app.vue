<script setup>
const { locale } = useI18n();

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: () => locale.value
  }
});

const title = 'Pedro Cruz — Frontend Developer';
const description =
  'I find small problems worth solving and ship the product, brand, and code myself. Design, engineering, and product';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: () => (locale.value === 'pt' ? 'pt_PT' : 'en_US'),
  twitterCard: 'summary_large_image',
  twitterCreator: '@pedropcruzthe1',
  twitterSite: '@pedropcruzthe1'
});

defineOgImage('Template', {
  title,
  description
});

useSchemaOrg([
  definePerson({
    name: 'Pedro Cruz',
    url: 'https://pedropcruz.pt',
    jobTitle: 'CEO',
    worksFor: {
      '@type': 'Organization',
      name: 'SOLOFOUNDER'
    },
    sameAs: [
      'https://github.com/pedropcruz',
      'https://www.linkedin.com/in/pedropcruz/',
      'https://twitter.com/pedropcruzthe1',
      'https://www.instagram.com/pedropcruzthe1/'
    ]
  }),
  defineWebSite({
    name: 'Pedro Cruz',
    description,
    inLanguage: ['en', 'pt']
  })
]);
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
