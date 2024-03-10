<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import ArticleList from './ArticleList.vue'
import { data, type PostMeta } from '../../../posts.data'

const { params } = useData()

function initTags(post: PostMeta[]) {
  const data: Record<string, PostMeta[]> = {}
  for (let i = 0; i < post.length; i++) {
    const element = post[i]
    const tags = element.tags
    // tags是数组，需要tags按照数组语法的格式书写
    if (Array.isArray(tags)) {
      tags.forEach((item) => {
        if (!data[item]) {
          data[item] = []
        }
        data[item].push(element)
      })
    }
  }
  return data
}

const posts = computed(() => initTags(data))
let selectTag = ref(params.value?.tag ?? '')

// set font-size
const getFontSize = (length: number) => {
  let size = length * 0.04 + 0.85
  return { fontSize: `${size}em` }
}
</script>

<template>
  <div class="my-main vp-doc">
    <h1>
      Tags
    </h1>
    <div class="tags">
      <a
        :href="`/tags/${key}`"
        v-for="(item, key) in posts"
        class="tag"
        :style="getFontSize(posts[key].length)"
        :class="{ activetag: selectTag === key }"
      >
        {{ key }} <span class="tag-length">{{ posts[key].length }}</span>
      </a>
    </div>

    <h4 class="header" v-show="selectTag">
      <svg
        t="1641783753540"
        class="fas-icon"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1254"
        :style="{
          width: '20px',
        }"
      >
        <path
          d="M995.126867 592.38l-360.08 360.08a53.333333 53.333333 0 0 1-71.333334 3.68l356.22-356.22a64 64 0 0 0 0-90.506667L495.8402 85.333333h45.573333a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667z m-128 0l-360.08 360.08a53.333333 53.333333 0 0 1-75.426667 0l-416-416A52.986667 52.986667 0 0 1 0.0002 498.746667V138.666667a53.393333 53.393333 0 0 1 53.333333-53.333334h360.08a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 0-85.333333 85.333334 85.426667 85.426667 0 0 0 85.333333-85.333334z"
          fill="var(--vp-c-brand)"
          p-id="1255"
        ></path>
      </svg>
      <span class="header-text">{{ selectTag }}</span>
    </h4>
    <ArticleList :articles="posts[selectTag]" />
  </div>
</template>

<style scoped>
.tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: left;
  margin-bottom: 10px;
  padding-bottom: 20px;
}

.tag {
  display: inline-block;
  margin-right: 8px;
  font-size: 0.85em;
  line-height: 25px;
  transition: 0.4s;
  color: #a1a1a1;
  cursor: pointer;
  text-decoration: none;
}

.tag:hover {
  color: var(--vp-c-hover);
}

.activetag {
  color: var(--vp-c-hover);
}

.tag-length {
  color: var(--vp-c-brand);
  font-size: 12px !important;
  position: relative;
  top: -8px;
}

.header {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: left;
}

.fas-icon {
  width: 2rem;
  height: 2rem;
}

.header-text {
  padding-left: 10px;
}
</style>
