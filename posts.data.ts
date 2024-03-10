import { defineLoader } from 'vitepress'
import fs from 'fs-extra'
import matter from 'gray-matter'
import dayjs from 'dayjs'

export interface PostMeta {
  title: string
  path: string
  date: string
  tags: string[]
}

declare const data: PostMeta[]

export { data }

export default defineLoader({
  watch: ['./posts/**/*.md'],
  async load(watchedFiles: string[]): Promise<PostMeta[]> {
    let posts: PostMeta[] = await Promise.all(
      watchedFiles.map(async (item) => {
        const content = await fs.readFile(item, "utf-8")
        const { data } = matter(content)
        return {
          title: data.title ?? '',
          path: item.split('/').slice(-2).join('/').replace('.md', ''),
          date: dayjs(data.date).subtract(8, 'hour').format('YYYY/MM/DD'),
          tags: data.tags ?? [],
        }
      })
    )
    posts.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
    return posts
  }
})
