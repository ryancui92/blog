<script setup lang="ts">
import type { PostMeta } from '../../../posts.data'

withDefaults(defineProps<{
  articles: PostMeta[]
  withoutYear?: boolean
}>(), {
  withoutYear: false,
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <a
      :href="`/${article.path}`"
      v-for="article in articles"
      :key="article.path"
      class="flex items-center justify-between gap-2 text-[var(--vp-c-text-2)]! hover:text-[var(--vp-c-brand)]! decoration-none! transition-all"
    >
      <div class="truncate">
        {{ article.title }}
      </div>
      <div class="font-mono text-3.5">
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
</style>
