<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import dayjs from 'dayjs'

const { Layout } = DefaultTheme
const { page } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="vp-doc mb-2">
        <h1 class="mb-2">
          {{ page.title }}
        </h1>
        <div class="text-3.5 lh-6 text-[var(--vp-c-text-2)]">
          <div class="font-mono">
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
      <div class="flex justify-center gap-1 my-1 text-[var(--vp-c-text-3)] text-3">
        <a href="https://vitepress.dev/" target="_blank" class="decoration-underline underline-offset-2 transition-all hover:text-[var(--vp-c-brand)]">VitePress</a>
        | Ryan Cui 2020-{{ dayjs().get('y') }}
      </div>
    </template>
  </Layout>
</template>
