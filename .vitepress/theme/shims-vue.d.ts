declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  CUSDIS?: {
    setTheme: (theme: 'light' | 'dark') => void
    initial: () => void
  }
}
