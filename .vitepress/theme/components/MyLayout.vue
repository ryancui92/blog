<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import dayjs from 'dayjs'
import { computed, onMounted, watch } from 'vue'

const { Layout } = DefaultTheme
const { page, isDark } = useData()
const route = useRoute()

onMounted(() => {
  watch(isDark, () => {
    if (route.path.startsWith('/posts'))
      window.CUSDIS?.setTheme(isDark.value ? 'dark' : 'light')
  })
})

const currentPage = computed(() => {
  return {
    host: 'https://cusdis.com',
    appId: '8f56c0a6-01a5-4c3b-a2eb-ede59b40adcd',
    theme: isDark.value ? 'dark' : 'light',
    pageId: page.value.relativePath.replace('.md', ''),
    pageTitle: page.value.title,
  }
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="vp-doc title">
        <h1 style="margin-bottom: 0.5rem;">
          {{ page.title }}
        </h1>
        <div class="meta">
          <div>
            Created at:
            {{ dayjs(page.frontmatter.date).subtract(8, 'h').format('YYYY/M/D HH:mm') }}
          </div>
          <div v-if="Array.isArray(page.frontmatter.tags)">
            Tags:
            <div class="tags-container">
              <a
                v-for="tag in page.frontmatter.tags"
                :key="tag"
                :href="`/tags/${tag}`"
              >
                {{ tag }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #layout-bottom>
      <div class="footer">
        Powered by
        <a href="https://vitepress.dev/" target="_blank" class="footer-link">VitePress</a>
        | Copyright © 2020-{{ dayjs().get('y') }} |
        <a href="https://beian.miit.gov.cn/" target="_blank" class="footer-link">粤ICP备19115096号</a>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.title {
  margin-bottom: 1.8rem;
}

.meta {
  margin-top: 0.5rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.tags-container {
  display: inline-flex;
  gap: 4px;
}

.tags-container a {
  text-decoration: none;
}

.footer {
  display: flex;
  justify-content: center;
  gap: 3px;
  margin: 1rem 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.footer-link {
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--vp-c-brand);
}
</style>
