<script setup lang="ts">
import TechTag from './TechTag.vue'
import ExternalLink from './ExternalLink.vue'

defineProps<{
  title: string
  tags: string[]
  link?: string
  images?: string[]
}>()
</script>

<template>
  <div class="py-4 flex flex-col gap-2">
    <div class="font-bold text-5">
      {{ title }}
    </div>
    <div class="flex items-center gap-2">
      <TechTag
        v-for="tag in tags"
        :key="tag"
        :label="tag"
      />
    </div>
    <ExternalLink v-if="link" :href="link" />
    <div v-if="images && images.length > 0" class="flex items-center gap-2">
      <img
        v-for="image in images"
        :key="image"
        :src="image"
        alt="image"
        class="h-30"
      >
    </div>
    <slot name="description" />
    <div>
      <slot />
    </div>
  </div>
</template>
