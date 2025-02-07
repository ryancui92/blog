<script setup lang="ts">
import ExternalIcon from './external.svg?component'

defineProps<{
  href: string
  label?: string
}>()
</script>

<template>
  <a :href="href" target="_blank" class="external-link font-mono inline-flex items-center gap-1 cursor-pointer">
    <span class="text-3.5">{{ label ?? href }}</span>
    <ExternalIcon class="w-4 h-4" />
  </a>
</template>

<style>
.external-link svg path {
  fill: var(--vp-c-brand-1);
}
</style>
