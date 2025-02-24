import { nextTick, onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { type Theme, useRoute } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import MyLayout from './components/MyLayout.vue'
import Tags from './components/Tags.vue'
import Posts from './components/Posts.vue'
import HomePart from './components/HomePart.vue'
import mediumZoom from 'medium-zoom'
import Resume from './components/Resume.vue'
import 'virtual:uno.css'
import '@shikijs/vitepress-twoslash/style.css'
import './global.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // @ts-ignore
    app.use(TwoslashFloatingVue)
    app.component('Tags', Tags)
    app.component('Posts', Posts)
    app.component('HomePart', HomePart)
    app.component('Resume', Resume)
  },
  setup() {
    // https://github.com/vuejs/vitepress/issues/854
    const route = useRoute()
    function initZoom() {
      mediumZoom('.main img, .my-main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(initZoom)
    watch(() => route.path, () => nextTick(initZoom))
  }
} satisfies Theme
