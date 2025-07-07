<script setup lang="ts">
import type { PostMeta } from '@/posts.data'
import dayjs from 'dayjs'

const props = withDefaults(defineProps<{
  articles: PostMeta[]
  withoutYear?: boolean
  useMtime?: boolean
}>(), {
  withoutYear: false,
  useMtime: false,
})

function getTime(article: PostMeta): string {
  if (props.useMtime) {
    return dayjs(article.mtime).fromNow()
  } else {
    return props.withoutYear ? article.date.slice(5) : article.date
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
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
        {{ getTime(article) }}
      </div>
    </a>
  </div>
</template>
