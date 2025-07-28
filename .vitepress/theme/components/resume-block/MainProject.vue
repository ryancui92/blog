<script setup lang="ts">
import ExternalLink from './ExternalLink.vue'
import TechTags from './TechTags.vue'

defineProps<{
  title: string
  tags: string[]
  link?: string
  images?: string[]
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-2 mb-12 avoid-page-break">
    <div class="font-bold text-5">
      {{ title }}
    </div>
    <TechTags :tags="tags" />
    <ExternalLink v-if="link" :href="link" />
    <div>
      <slot name="description" />
    </div>
    <div class="flex flex-col gap-4 avoid-page-break">
      <slot />
    </div>
    <div v-if="images && images.length > 0" class="no-print grid grid-rows-1 grid-cols-3 gap-4 my-2">
      <img
        v-for="image in images"
        :key="image"
        :src="image"
        alt="image"
        class="w-full rounded-1.5"
      >
    </div>
  </div>
</template>
