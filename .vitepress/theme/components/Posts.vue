<script lang="ts" setup>
import { computed } from 'vue'
import ArticleList from './ArticleList.vue'
import { groupByYear } from '../utils'
import { data as posts } from '../../../posts.data'

const data = computed(() => groupByYear(posts))
</script>

<template>
  <div class="my-main vp-doc">
    <h1>
      Posts
    </h1>
    <div v-for="yearItem in data" class="mb-8">
      <div class="font-bold text-4.5 mb-2 font-mono">
        {{ yearItem.year }}
      </div>
      <ArticleList :articles="yearItem.posts" without-year />
    </div>
  </div>
</template>


