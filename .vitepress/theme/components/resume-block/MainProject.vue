<script setup lang="ts">
import ExternalLink from './ExternalLink.vue'
import TechTags from './TechTags.vue'
import SubProject from './SubProject.vue'
import type { ResumeProject } from './resume-content'

defineProps<{
  project: ResumeProject
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-3 print:gap-1.5 mb-14 print:mb-6">
    <div class="flex sm:items-center justify-between w-full flex-col sm:flex-row gap-1">
      <div class="font-bold text-5">
        {{ project.title }}
      </div>
      <div v-if="project.time" class="font-mono text-sm">
        {{ project.time }}
      </div>
    </div>
    <TechTags :tags="project.tags" />
    <ExternalLink v-if="project.link" :href="project.link" />
    <div v-if="project.description" v-html="project.description" />
    <div class="flex flex-col gap-4 avoid-page-break">
      <ul v-if="project.items">
        <li
          v-for="item in project.items"
          :key="item"
          v-html="item"
        />
      </ul>
      <SubProject
        v-for="sub in project.subProjects"
        :key="sub.title"
        :project="sub"
      />
    </div>
    <div v-if="project.images && project.images.length > 0" class="no-print grid grid-cols-2 sm:grid-cols-3 gap-4 my-2">
      <img
        v-for="image in project.images"
        :key="image"
        :src="image"
        alt="image"
        class="w-full rounded-1.5"
      >
    </div>
  </div>
</template>
