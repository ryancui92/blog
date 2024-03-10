import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { groupByYear } from './theme/utils'
import { getPosts } from './theme/meta'

const posts = await getPosts()
const yearGroups = groupByYear(posts)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ryan\'s Blog',
  description: '装模作样五分钟，荣华富贵二十年',
  head: [
    ['link', { rel: 'icon', href: 'https://static.ryancui.com/meta-images/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://static.ryancui.com/meta-images/IMG_1052.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts' },
      { text: 'Tags', link: '/tags' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryancui92' }
    ],
    outline: {
      level: [2, 3],
    },
    lastUpdated: {
      text: 'Updated at',
    },
    sidebar: {
      '/posts/': yearGroups.map(yearGroup => ({
        text: yearGroup.year,
        items: yearGroup.posts.map(post => ({
          text: post.title,
          link: `/${post.path}`,
        })),
      }))
    },
    search: {
      provider: 'local',
    },
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
  },
})
