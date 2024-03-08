import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Ryan\'s Blog',
  description: '若你喜欢怪人，其实我很美',
  head: [
    ['link', { rel: 'icon', href: 'https://static.ryancui.com/meta-images/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://static.ryancui.com/meta-images/IMG_1052.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryancui92' }
    ],
    outline: {
      level: [2, 3],
    },
  },
})
