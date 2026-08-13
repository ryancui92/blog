<script setup lang="ts">
import MainProject from './MainProject.vue'
import { otherProjects } from './resume-content'
</script>

<template>
  <MainProject
    v-for="project in otherProjects"
    :key="project.title"
    :project="project"
  />
</template>
