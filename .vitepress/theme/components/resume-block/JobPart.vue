<script setup lang="ts">
import type { ResumeJob } from './resume-content'

defineProps<{
  job: ResumeJob
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-2 print:gap-1 mb-14 print:mb-6 avoid-page-break">
    <div class="flex sm:items-center justify-between w-full flex-col sm:flex-row gap-1">
      <div class="font-bold text-5">
        {{ job.title }}
      </div>
      <div class="font-mono text-sm">
        {{ job.time }}
      </div>
    </div>
    <div>
      {{ job.position }}
    </div>
    <div class="flex flex-col gap-4 avoid-page-break">
      <ul>
        <li
          v-for="item in job.items"
          :key="item"
          v-html="item"
        />
      </ul>
    </div>
  </div>
</template>
