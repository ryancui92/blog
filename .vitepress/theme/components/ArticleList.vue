<script setup lang="ts">
import { withBase } from 'vitepress'
import type { PostMeta } from '../../../posts.data'

withDefaults(defineProps<{
  articles: PostMeta[]
  withoutYear?: boolean
}>(), {
  withoutYear: false,
})
</script>

<template>
  <div class="articles">
    <a
      :href="`/${article.path}`"
      v-for="(article, index) in articles"
      :key="article.path"
      class="article"
    >
      <div class="title">
        {{ article.title }}
      </div>
      <div class="date">
        {{ withoutYear ? article.date.slice(5) : article.date }}
      </div>
    </a>
  </div>
</template>

<style scoped>
.articles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--vp-c-text-2);
  transition: color 0.3s ease;
  text-decoration: none;
}

.article:hover {
  text-decoration: none;
  color: var(--vp-c-brand);
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  font-family: monospace;
  font-size: 13px;
}
</style>
