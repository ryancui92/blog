<script setup lang="ts">
import {
  profile,
  skills,
  mainProjects,
  otherProjects,
  jobs,
  type ResumeProject,
} from './resume-content'

function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nodeToMd = (node: Node): string => {
    let result = ''
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent ?? ''
        return
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return
      const el = child as HTMLElement
      const tag = el.tagName.toLowerCase()
      if (tag === 'br') {
        result += '\n'
      } else if (tag === 'em') {
        result += `**${nodeToMd(el).trim()}**`
      } else if (tag === 'code') {
        result += `\`${el.textContent?.trim()}\``
      } else if (tag === 'a') {
        const href = el.getAttribute('href') ?? ''
        result += `[${nodeToMd(el)}](${href})`
      } else {
        result += nodeToMd(el)
      }
    })
    return result
  }
  return nodeToMd(doc.body).trim()
}

function projectSection(projects: ResumeProject[]): string[] {
  const lines: string[] = []
  projects.forEach((p) => {
    lines.push(`### ${p.time ? `${p.title}（${p.time}）` : p.title}`, '')
    if (p.tags?.length) lines.push(`**技术栈**：${p.tags.join(', ')}`, '')
    if (p.link) lines.push(`**链接**：${p.link}`, '')
    if (p.description) lines.push(htmlToMarkdown(p.description), '')
    p.items?.forEach((item) => lines.push(`- ${htmlToMarkdown(item)}`))
    lines.push('')
    p.subProjects?.forEach((sub) => {
      lines.push(`#### ${sub.title}`, '')
      if (sub.tags?.length) lines.push(`**技术栈**：${sub.tags.join(', ')}`, '')
      if (sub.link) lines.push(`**链接**：${sub.link}`, '')
      if (sub.description) lines.push(htmlToMarkdown(sub.description), '')
      sub.items?.forEach((item) => lines.push(`- ${htmlToMarkdown(item)}`))
      lines.push('')
    })
  })
  return lines
}

function buildMarkdown(): string {
  const lines: string[] = []
  lines.push(`# ${profile.name}`, '')
  lines.push(profile.school, '')
  lines.push(`手机：${profile.phone}`, `邮箱：${profile.email}`, '')
  lines.push('## Skill', '')
  skills.forEach((item) => lines.push(`- ${htmlToMarkdown(item)}`))
  lines.push('', '## Main Projects', '')
  lines.push(...projectSection(mainProjects))
  lines.push('## Other Projects', '')
  lines.push(...projectSection(otherProjects))
  lines.push('## Jobs', '')
  jobs.forEach((j) => {
    lines.push(`### ${j.title}（${j.time}）`, '')
    lines.push(`**职位**：${j.position}`, '')
    j.items.forEach((item) => lines.push(`- ${htmlToMarkdown(item)}`))
    lines.push('')
  })
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

function downloadMarkdown() {
  const blob = new Blob([buildMarkdown()], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resume.md'
  a.click()
  URL.revokeObjectURL(url)
}

function printResume() {
  const prevTitle = document.title
  const mql = window.matchMedia('print')
  const restore = () => {
    document.title = prevTitle
    window.removeEventListener('afterprint', restore)
    mql.removeEventListener('change', onPrintChange)
  }
  const onPrintChange = (e: MediaQueryListEvent) => {
    if (!e.matches) restore()
  }
  window.addEventListener('afterprint', restore)
  mql.addEventListener('change', onPrintChange)
  document.title = 'resume'
  window.print()
}
</script>

<template>
  <div class="no-print flex items-center gap-2 mb-6">
    <button class="resume-export-btn" @click="printResume">
      导出 PDF
    </button>
    <button class="resume-export-btn" @click="downloadMarkdown">
      导出 Markdown
    </button>
  </div>
</template>

<style scoped>
.resume-export-btn {
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  padding: 0.25rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(221, 221, 221, 0.5);
  color: var(--vp-c-brand-1);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}

.resume-export-btn:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
