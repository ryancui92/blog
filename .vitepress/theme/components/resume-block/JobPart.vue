<script setup lang="ts">
defineProps<{
  title: string
  time: string
  position: string
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-2 print:gap-1 mb-14 print:mb-6 avoid-page-break">
    <div class="flex items-center justify-between w-full">
      <div class="font-bold text-5">
        {{ title }}
      </div>
      <div v-if="time" class="font-mono text-sm">
        {{ time }}
      </div>
    </div>
    <div>
      {{ position }}
    </div>
    <div class="flex flex-col gap-4 avoid-page-break">
      <slot />
    </div>
  </div>
</template>
