<script setup lang="ts">
import JobPart from './JobPart.vue'
import { jobs } from './resume-content'
</script>

<template>
  <JobPart
    v-for="job in jobs"
    :key="job.title"
    :job="job"
  />
</template>
