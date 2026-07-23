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

/**
 * @deprecated 已废弃 — 使用 fetchArchivesPosts() 替代
 * 保留此函数仅作为兼容引用。
 */
export function getAllPosts(): PostMeta[] {
  return []
}

export function getPostBySlug(_slug: string): PostMeta | undefined {
  return undefined
}

export function getRecentPosts(_count: number = 5): PostMeta[] {
  return []
}

// ====== Async fetch functions for runtime-loaded posts (public/Archives/) ======

/**
 * Fetch all posts from public/Archives/ via runtime fetch().
 * Reads config.json first, then fetches each enabled .md file.
 */
export async function fetchArchivesPosts(): Promise<PostMeta[]> {
  /** 添加时间戳避免浏览器缓存 */
  const cacheBust = () => `?t=${Date.now()}`

  let config: { files: Array<{ filename: string; enabled: boolean; cover: string }> }
  try {
    const resp = await fetch(`/Archives/config.json${cacheBust()}`)
    if (!resp.ok) return []
    config = await resp.json()
  } catch {
    return []
  }

  const enabledFiles = config.files.filter((f) => f.enabled)

  const posts = await Promise.all(
    enabledFiles.map(async (entry) => {
      try {
        const rawResp = await fetch(`/Archives/${encodeURIComponent(entry.filename)}${cacheBust()}`)
        const raw = await rawResp.text()
        const { data, content } = parseFrontmatter(raw)
        const slug = entry.filename.replace(/\.md$/, '')
        return {
          slug,
          title: data.title || '无标题',
          date: data.date || '1970-01-01',
          description: data.description || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          cover: entry.cover || data.cover || '',
          mood: data.mood || '',
          content,
        } as PostMeta
      } catch {
        return null
      }
    }),
  )

  return posts
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return dateDiff !== 0 ? dateDiff : b.slug.localeCompare(a.slug)
    })
}

/**
 * Fetch a single archive post by slug.
 */
export async function fetchArchivePostBySlug(slug: string): Promise<PostMeta | null> {
  const posts = await fetchArchivesPosts()
  return posts.find((p) => p.slug === slug) || null
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
