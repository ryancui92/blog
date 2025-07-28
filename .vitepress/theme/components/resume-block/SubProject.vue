<script setup lang="ts">
import ExternalLink from './ExternalLink.vue'
import TechTags from './TechTags.vue'

defineProps<{
  title: string
  tags?: string[]
  link?: string
}>()
</script>

<template>
  <div
    class="text-3.5 p-6 print:py-0 print:pr-0 rounded-2 print:rounded-0
  bg-[linear-gradient(rgba(152,236,215,0.2)_0%,rgb(229,239,122,0.2)_100%)] print:bg-none
    b-solid b-1px b-[rgba(221,221,221,0.2)] print:b-0 print:b-l-2px"
  >
    <div class="text-4.2 font-bold mb-2">
      {{ title }}
    </div>
    <TechTags :tags="tags" class="mb-1" />
    <ExternalLink v-if="link" :href="link" />
    <slot />
  </div>
</template>
