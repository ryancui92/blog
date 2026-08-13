<script setup lang="ts">
import { skills } from './resume-content'
</script>

<template>
  <ul>
    <li
      v-for="item in skills"
      :key="item"
      v-html="item"
    />
  </ul>
</template>
