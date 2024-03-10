import { getPosts } from '../.vitepress/theme/meta'

export default {
  async paths() {
    // FIXME: dynamic routes do not support data loader
    // https://github.com/vuejs/vitepress/issues/2826
    const posts = await getPosts()
    const tagSet = new Set()
    for (let i = 0; i < posts.length; i++) {
      const element = posts[i]
      const tags = element.tags
      // tags是数组，需要tags按照数组语法的格式书写
      if (Array.isArray(tags)) {
        tags.forEach(tag => tagSet.add(tag))
      }
    }
    return Array.from(tagSet).map(tag => ({
      params: { tag },
    }))
  }
}
