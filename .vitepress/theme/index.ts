import { nextTick, onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { type Theme, useRoute } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import MyLayout from './components/MyLayout.vue'
import Tags from './components/Tags.vue'
import Posts from './components/Posts.vue'
import HomePart from './components/HomePart.vue'
import mediumZoom from 'medium-zoom'
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
  },
  setup() {
    // vitepress 官方也许会支持
    // https://github.com/vuejs/vitepress/issues/854
    // FIXME: 没有支持 hmr
    const route = useRoute()
    function initZoom() {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(initZoom)
    watch(() => route.path, () => nextTick(initZoom))
  }
} satisfies Theme
