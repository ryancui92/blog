<script setup lang="ts">
import { computed } from 'vue'
import ArticleList from './ArticleList.vue'
import { data } from '../../../posts.data'

const posts = computed(() => data.slice(0, 10))
</script>

<template>
  <div class="home-part">
    <h3 style="margin: 1rem 0;">
      最近文章
    </h3>
    <ArticleList :articles="posts" />
  </div>
</template>

<style scoped>
.home-part {
  width: 100%;
  max-width: 480px;
}

.link-container {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
}

.link {
  color: var(--vp-c-text-2);
  transition: border 0.3s ease, color 0.3s ease;
  text-decoration: none;
}

.link:hover {
  text-decoration: none;
  color: var(--vp-c-brand);
}
</style>
