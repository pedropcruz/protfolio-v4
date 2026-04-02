<script setup lang="ts">
interface Props {
  width?: 'normal' | 'wide' | 'full'
  dotGrid?: boolean
  padding?: boolean
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 'normal',
  dotGrid: false,
  padding: true,
  tag: 'section'
})

const widthClasses: Record<string, string> = {
  normal: 'mx-auto max-w-6xl',
  wide: 'mx-auto max-w-7xl',
  full: 'w-full'
}

const containerClass = computed(() => [
  widthClasses[props.width],
  props.padding && props.width !== 'full' ? 'px-6 md:px-12 lg:px-16' : '',
  'py-24 md:py-32',
  props.dotGrid ? 'dot-grid' : ''
])
</script>

<template>
  <component :is="tag" :class="containerClass">
    <slot />
  </component>
</template>
