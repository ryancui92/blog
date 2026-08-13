<script setup lang="ts">
import { profile } from './resume-content'
</script>

<template>
  <div class="mt-8 flex flex-col gap-1">
    <div class="flex items-baseline gap-3 mb-4 flex-col sm:flex-row">
      <div class="text-8 font-bold">
        {{ profile.name }}
      </div>
      <div class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ profile.school }}
      </div>
    </div>
    <div class="font-mono">
      手机：{{ profile.phone }}
    </div>
    <div class="font-mono">
      邮箱：<a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
    </div>
  </div>
</template>
