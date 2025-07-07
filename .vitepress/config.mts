import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import UnoCSS from 'unocss/vite'
import svgLoader from 'vite-svg-loader'
import implicitFigures from 'markdown-it-implicit-figures'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ryan\'s Blog',
  head: [
    ['link', { rel: 'icon', href: 'https://pub-fbd9ea0ab66b4f2aaecd56c71e6d8719.r2.dev/favicon.ico' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://pub-fbd9ea0ab66b4f2aaecd56c71e6d8719.r2.dev/link-green.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts' },
      { text: 'Tags', link: '/tags' },
      { text: 'Resume', link: '/resume' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryancui92' }
    ],
    outline: {
      level: [2, 3],
    },
    lastUpdated: {
      text: 'Updated At',
    },
    search: {
      provider: 'local',
    },
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
    image: {
      lazyLoading: true,
    },
    config: (md) => {
      md.use(implicitFigures, {
        figcaption: true,
        copyAttrs: '^class$'
      })
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(import.meta.resolve('..')),
      },
    },
    plugins: [
      UnoCSS({
        rules: [
          [
            'font-mono',
            { 'font-family': 'JetBrains Mono, monospace' },
          ],
        ],
      }),
      svgLoader(),
    ],
  },
})
