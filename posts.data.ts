import { defineLoader } from 'vitepress'
import { readFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import matter from 'gray-matter'
import dayjs from 'dayjs'

const execAsync = promisify(exec)

export interface PostMeta {
  title: string
  path: string
  date: string
  tags: string[]
  hide: boolean
  mtime: number
}

// Helper to get last git commit time (in ms)
async function getGitCommitTime(file: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`git log -1 --format=%ct -- "${file}"`)
    return parseInt(stdout.trim(), 10) * 1000 // convert to ms
  } catch {
    return 0
  }
}

declare const data: PostMeta[]

export { data }

export default defineLoader({
  watch: ['./posts/**/*.md'],
  async load(watchedFiles: string[]): Promise<PostMeta[]> {
    let posts: PostMeta[] = await Promise.all(
      watchedFiles.map(async (item) => {
        const content = await readFile(item, 'utf-8')
        const { data } = matter(content)
        const commitTime = await getGitCommitTime(item)
        return {
          title: data.title ?? '',
          path: item.split('/').slice(-2).join('/').replace('.md', ''),
          date: dayjs(data.date).subtract(8, 'hour').format('YYYY/MM/DD'),
          tags: data.tags ?? [],
          hide: data.hide ?? false,
          mtime: commitTime,
        }
      }),
    )
    posts = posts.filter(p => !p.hide)
    posts.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
    return posts
  },
})
