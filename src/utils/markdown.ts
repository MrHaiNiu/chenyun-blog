import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import type { PostMeta, TocItem } from '@/types'

// Simple frontmatter parser (browser-compatible, no Buffer dependency)
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!fmMatch) return { data: {}, content: raw }

  const fmStr = fmMatch[1]
  const content = raw.slice(fmMatch[0].length)
  const data: Record<string, any> = {}

  // Parse YAML-like frontmatter (simplified)
  const lines = fmStr.split('\n')
  let currentKey = ''
  let currentArray: string[] | null = null

  for (const line of lines) {
    const arrayItemMatch = line.match(/^\s*-\s+(.+)/)
    if (arrayItemMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = []
      }
      data[currentKey].push(arrayItemMatch[1].replace(/^["']|["']$/g, ''))
      continue
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      let value = kvMatch[2].trim()
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '')
      if (value === '') {
        // Could be an array following
        data[currentKey] = []
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array: ["tag1", "tag2"]
        data[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean)
      } else {
        data[currentKey] = value
      }
    }
  }

  return { data, content }
}

// Glob import all markdown files eagerly
const mdModules = import.meta.glob('/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = []

  for (const [path, raw] of Object.entries(mdModules)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw as string)

    posts.push({
      slug,
      title: data.title || '无标题',
      date: data.date || '1970-01-01',
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || '',
      mood: data.mood || '',
      content,
    })
  }

  posts.sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime()
    return dateDiff !== 0 ? dateDiff : b.slug.localeCompare(a.slug)
  })

  return posts
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getRecentPosts(count: number = 5): PostMeta[] {
  return getAllPosts().slice(0, count)
}

export async function renderMarkdown(content: string): Promise<{ html: string; toc: TocItem[] }> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeKatex)
    .use(rehypeStringify)

  const file = await processor.process(content)
  const html = String(file)
  const toc = extractToc(content)

  return { html, toc }
}

export function extractToc(content: string): TocItem[] {
  const lines = content.split('\n')
  const toc: TocItem[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,3})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/[*_`~]/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
      toc.push({ id, text, level })
    }
  }

  return toc
}
