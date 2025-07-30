<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import dayjs from 'dayjs'

const { Layout } = DefaultTheme
const { page } = useData()

console.log(page.value)
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="page.filePath !== 'resume.md'" class="vp-doc mb-2">
        <h1 class="mb-2">
          {{ page.title }}
        </h1>
        <div class="text-3.5 lh-6 text-[var(--vp-c-text-2)]">
          <div class="font-mono print:hidden">
            {{ dayjs(page.frontmatter.date).subtract(8, 'h').format('YYYY/MM/DD HH:mm') }}
          </div>
          <div v-if="Array.isArray(page.frontmatter.tags)">
            <div class="flex-inline flex-wrap items-center gap-1">
              <a
                v-for="tag in page.frontmatter.tags"
                :key="tag"
                :href="`/tags/${tag}`"
                class="decoration-none!"
              >
                {{ tag }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #layout-bottom>
      <footer class="flex justify-center gap-1 my-4 text-[var(--vp-c-text-3)] text-3.2 no-print">
        Ryan's Blog | 2020-{{ dayjs().get('y') }}
      </footer>
    </template>
  </Layout>
</template>
