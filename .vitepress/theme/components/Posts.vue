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
    <div v-for="yearItem in data" style="margin-bottom: 2rem;">
      <h4 style="margin-bottom: 0.5rem;">
        {{ yearItem.year }}
      </h4>
      <ArticleList :articles="yearItem.posts" without-year />
    </div>
  </div>
</template>


