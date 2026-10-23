<script setup lang="ts">
type IconName =
  | 'venus'
  | 'mars'
  | 'calendar'
  | 'pin'
  | 'mail'
  | 'phone'
  | 'mobile'
  | 'user'
  | 'document'
  | 'star'
  | 'chevron'

type Shape = readonly [tag: 'path' | 'circle' | 'rect' | 'polygon', attrs: Record<string, string | number>]

withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 20 })

const SHAPES: Record<IconName, Shape[]> = {
  venus: [
    ['circle', { cx: 12, cy: 9, r: 6 }],
    ['path', { d: 'M12 15v7M9 19h6' }],
  ],
  mars: [
    ['circle', { cx: 10, cy: 14, r: 6 }],
    ['path', { d: 'M16 3h5v5M21 3l-6.75 6.75' }],
  ],
  calendar: [
    ['rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }],
    ['path', { d: 'M8 2v4M16 2v4M3 10h18' }],
  ],
  pin: [
    ['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }],
    ['circle', { cx: 12, cy: 10, r: 3 }],
  ],
  mail: [
    ['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
    ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }],
  ],
  phone: [
    [
      'path',
      {
        d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z',
      },
    ],
  ],
  mobile: [
    ['rect', { x: 5, y: 2, width: 14, height: 20, rx: 2 }],
    ['path', { d: 'M12 18h.01' }],
  ],
  user: [
    ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: 12, cy: 7, r: 4 }],
  ],
  document: [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8' }],
  ],
  star: [['polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }]],
  chevron: [['path', { d: 'm6 9 6 6 6-6' }]],
}
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <component :is="tag" v-for="([tag, attrs], index) in SHAPES[name]" :key="index" v-bind="attrs" />
  </svg>
</template>

<style scoped>
.app-icon {
  flex: none;
}
</style>
