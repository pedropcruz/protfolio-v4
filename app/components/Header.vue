<template>
  <UHeader
    :ui="{
      root: 'border-b-0 container relative w-full z-40 mx-auto p-4 md:p-10 bg-transparent h-40',
    }"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <LanguageSwitch />
    </template>
  </UHeader>
</template>
