<script setup lang="ts">
import MainProject from './MainProject.vue'
import { mainProjects } from './resume-content'
</script>

<template>
  <MainProject
    v-for="project in mainProjects"
    :key="project.title"
    :project="project"
  />
</template>
