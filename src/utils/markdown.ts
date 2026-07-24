import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import type { PostMeta, TocItem, Project as ProjectMeta } from '@/types'

// Simple frontmatter parser (browser-compatible, no Buffer dependency)
export function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
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
      const hadQuotes = /^["'].*["']$/.test(value)
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '')
      if (value === '') {
        if (hadQuotes) {
          // Explicit quoted empty string like description: ""
          data[currentKey] = ''
        } else {
          // Could be an array following (like tags: followed by - items)
          data[currentKey] = []
        }
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
  const baseUrl = import.meta.env.BASE_URL || '/'

  let config: { files: Array<{ filename: string; enabled: boolean; cover: string }> }
  try {
    const resp = await fetch(`${baseUrl}Archives/config.json${cacheBust()}`)
    if (!resp.ok) return []
    config = await resp.json()
  } catch {
    return []
  }

  const enabledFiles = config.files.filter((f) => f.enabled)

  const posts = await Promise.all(
    enabledFiles.map(async (entry) => {
      try {
        const rawResp = await fetch(`${baseUrl}Archives/${encodeURIComponent(entry.filename)}${cacheBust()}`)
        if (!rawResp.ok) return null
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

/**
 * Fetch bio from About markdown frontmatter.
 * Falls back to siteConfig.bio if unavailable.
 */
export async function fetchAboutBio(): Promise<string> {
  const baseUrl = import.meta.env.BASE_URL || '/'

  try {
    const cfgResp = await fetch(`${baseUrl}About/config.json?t=${Date.now()}`)
    if (!cfgResp.ok) return ''
    const cfg = await cfgResp.json()
    const entry = cfg.files && cfg.files.find((f: any) => f.enabled)
    if (!entry || !entry.filename) return ''

    const mdResp = await fetch(`${baseUrl}About/${encodeURIComponent(entry.filename)}?t=${Date.now()}`)
    if (!mdResp.ok) return ''
    const raw = await mdResp.text()

    const { data } = parseFrontmatter(raw)
    return data.bio || ''
  } catch {
    return ''
  }
}

/**
 * Fetch all projects from public/Projects/ via runtime fetch().
 * Same pattern as fetchArchivesPosts — reads config.json then .md files.
 */
export interface ProjectConfigFile {
  filename: string
  enabled: boolean
  githubUrl?: string
  icon?: string
  tags?: string[]
  description?: string
  name?: string
}

export async function fetchProjects(): Promise<ProjectMeta[]> {
  const cacheBust = () => `?t=${Date.now()}`
  const baseUrl = import.meta.env.BASE_URL || '/'

  let config: { files: ProjectConfigFile[] }
  try {
    const resp = await fetch(`${baseUrl}Projects/config.json${cacheBust()}`)
    if (!resp.ok) return []
    config = await resp.json()
  } catch {
    return []
  }

  const enabledFiles = config.files.filter((f) => f.enabled)

  const projects = await Promise.all(
    enabledFiles.map(async (entry) => {
      try {
        const rawResp = await fetch(`${baseUrl}Projects/${encodeURIComponent(entry.filename)}${cacheBust()}`)
        if (!rawResp.ok) return null
        const raw = await rawResp.text()
        const { data, content } = parseFrontmatter(raw)
        const slug = entry.filename.replace(/\.md$/, '')
        return {
          id: `proj_${slug}`,
          slug,
          name: data.title || entry.name || slug,
          description: data.description || entry.description || '',
          icon: data.icon || entry.icon || '🚀',
          githubUrl: data.githubUrl || entry.githubUrl || '',
          tags: Array.isArray(data.tags) ? data.tags : (entry.tags || []),
          content: content || '',
        } as ProjectMeta
      } catch {
        return null
      }
    }),
  )

  return projects.filter((p): p is ProjectMeta => p !== null)
}

/**
 * Fetch a single project by slug.
 */
export async function fetchProjectBySlug(slug: string): Promise<ProjectMeta | null> {
  const projects = await fetchProjects()
  return projects.find((p) => p.slug === slug) || null
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
