import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import UnoCSS from 'unocss/vite'
import svgLoader from 'vite-svg-loader'
import implicitFigures from 'markdown-it-implicit-figures'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ryan\'s Blog',
  head: [
    ['link', { rel: 'icon', href: 'https://static.ryancui.com/meta-images/favicon.ico' }],
    ['script', {}, `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "q65ils55cd");
`]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://static.ryancui.com/meta-images/IMG_1052.png',
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
      text: 'Updated at',
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
