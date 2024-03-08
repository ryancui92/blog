import DefaultTheme from 'vitepress/theme'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { useData, useRoute, type Theme } from 'vitepress'
// @ts-ignore
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData()
    const route = useRoute()

    // Obtain configuration from: https://giscus.app/
    giscusTalk({
        repo: 'ryancui92/blog',
        repoId: 'MDEwOlJlcG9zaXRvcnk5NzM3MzcyNA==',
        category: 'Announcements',
        categoryId: 'DIC_kwDOBc3OHM4CdyTN',
        mapping: 'title', // default: `pathname`
        inputPosition: 'top', // default: `top`
        lang: 'en', // default: `zh-CN`
        lightTheme: 'light', // default: `light`
        darkTheme: 'transparent_dark', // default: `transparent_dark`
      }, {
        frontmatter, route
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true
    )
  }
} satisfies Theme
