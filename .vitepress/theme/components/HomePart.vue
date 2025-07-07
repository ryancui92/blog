<script setup lang="ts">
import { computed } from 'vue'
import ArticleList from './ArticleList.vue'
import { data } from '@/posts.data'

const posts = computed(() => [...data].sort((a, b) => b.mtime - a.mtime).slice(0, 10))
</script>

<template>
  <div class="w-full max-w-560px">
    <h3 class="my-4!">
      最近更新
    </h3>
    <ArticleList :articles="posts" use-mtime />
  </div>
</template>
