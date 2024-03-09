import dayjs from 'dayjs'
import { globby } from 'globby'
import fs from 'fs-extra'
import matter from 'gray-matter'

export interface PostMeta {
  title: string
  path: string
  date: string
  tags: string[]
}

export async function getPosts() {
  let paths = await getPostMDFilePaths()
  let posts: PostMeta[] = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8")
      const { data } = matter(content)
      return {
        title: data.title ?? '',
        path: item.replace('.md', ''),
        date: dayjs(data.date).subtract(8, 'hour').format('YYYY/MM/DD'),
        tags: data.tags ?? [],
      }
    })
  )
  posts.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
  return posts
}

async function getPostMDFilePaths() {
  let paths = await globby(['**.md'], {
    ignore: ['node_modules', 'README.md'],
  })
  return paths.filter((item) => item.includes('posts/'))
}
