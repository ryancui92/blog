import type { PostMeta } from './meta'

export function groupByYear(posts: PostMeta[]) {
  const result: {
    year: string
    posts: PostMeta[]
  }[] = []
  let currentYear: { year: string; posts: PostMeta[] } | null = null
  for (const post of posts) {
    if (post.date) {
      const year = post.date.slice(0, 4)
      if (!currentYear || currentYear.year !== year) {
        currentYear = {
          year,
          posts: [post],
        }
        result.push(currentYear)
      }
      else {
        currentYear.posts.push(post)
      }
    }
  }
  return result
}
