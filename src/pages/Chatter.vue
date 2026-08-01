<template>
  <div class="flex-1 flex flex-col">
    <BannerSection />
    <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">说说</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">共 {{ chatters.length }} 条说说</p>
        </div>
        <div class="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4 shrink-0">
          <button
            @click="sortAscending = !sortAscending"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all border border-white/40 dark:border-white/10"
            :class="sortAscending ? 'bg-accent text-white shadow-md' : 'bg-glass-50 text-slate-500 hover:text-accent'"
            :title="sortAscending ? '从新到旧' : '从旧到新'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
          <SearchBar inline :search-fn="searchChatters" placeholder="搜索说说..." />
        </div>
      </div>

      <div v-if="loading" class="text-center py-20 text-slate-400">
        <div class="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm">加载中...</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(chatter, i) in sortedChatters"
          :key="chatter.slug"
          class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg p-5 md:p-6 transition-all duration-500 hover:shadow-xl animate-fade-in-up"
          :style="{ animationDelay: `${i * 30}ms` }"
        >
          <div class="flex items-start gap-3">
            <img
              :src="siteConfig.avatarUrl"
              :alt="siteConfig.authorName"
              class="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-sm shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ siteConfig.authorName }}</span>
                <span class="text-xs text-slate-400">{{ chatter.date }}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">{{ chatter.title }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 font-serif leading-relaxed">{{ chatter.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { siteConfig } from '@/siteConfig'
import BannerSection from '@/components/BannerSection.vue'
import BackButton from '@/components/BackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import type { SearchResultItem } from '@/components/SearchBar.vue'

interface ChatterItem {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

const chatters = ref<ChatterItem[]>([])
const loading = ref(true)
const sortAscending = ref(false)

const sortedChatters = computed(() => {
  let sorted = [...chatters.value]
  if (sortAscending.value) {
    sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } else {
    sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  return sorted
})

function searchChatters(query: string): SearchResultItem[] {
  const q = query.toLowerCase()
  return chatters.value
    .filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    )
    .map(c => ({
      title: c.title,
      description: c.description,
      tag: 'div',
      bindings: {},
    }))
}

/** 简单 frontmatter 解析 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!fmMatch) return { data: {}, content: raw }
  const fmStr = fmMatch[1]
  const content = raw.slice(fmMatch[0].length)
  const data: Record<string, string> = {}
  for (const line of fmStr.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.*)/)
    if (kvMatch) {
      data[kvMatch[1]] = kvMatch[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return { data, content }
}

onMounted(async () => {
  try {
    const cacheBust = `?v=${__BUILD_TIME__}`
    const baseUrl = import.meta.env.BASE_URL || '/'
    const resp = await fetch(`${baseUrl}Chatter/config.json${cacheBust}`)
    if (!resp.ok) { loading.value = false; return }
    const config = await resp.json()

    const results = await Promise.all(
      (config.files || [])
        .filter((f: any) => f.enabled)
        .map(async (entry: any) => {
          try {
            const rawResp = await fetch(`${baseUrl}Chatter/${encodeURIComponent(entry.filename)}${cacheBust}`)
            if (!rawResp.ok) return null
            const raw = await rawResp.text()
            const { data, content } = parseFrontmatter(raw)
            const slug = entry.filename.replace(/\.md$/, '')
            return {
              slug,
              title: data.title || '无标题',
              date: data.date || '1970-01-01',
              description: data.description || '',
              content: content.trim(),
            } as ChatterItem
          } catch {
            return null
          }
        })
    )

    chatters.value = results
      .filter((c): c is ChatterItem => c !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (e) {
    console.error('[Chatter] 加载失败:', e)
  } finally {
    loading.value = false
  }
})
</script>
