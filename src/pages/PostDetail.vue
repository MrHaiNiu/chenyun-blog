<template>
  <div class="flex-1 flex flex-col">
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-16 pb-32 relative z-10 flex-1">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-6 mt-6">
        <aside class="hidden lg:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <BackButton />
            <div class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-5 animate-pulse">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-4"></div>
              <div class="space-y-2">
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
              </div>
            </div>
          </div>
        </aside>
        <div class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden animate-pulse">
          <div class="p-6 md:p-10">
            <div class="flex gap-2 mb-4">
              <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-14"></div>
              <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-10"></div>
            </div>
            <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-2"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div v-else-if="post" class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-6 mt-6">
        <!-- Left Sidebar: BackButton + TOC + ProfileCard -->
        <aside class="hidden lg:block">
          <div class="sticky top-24 flex flex-col gap-4">
            <BackButton />
            <div
              v-if="toc.length > 0"
              class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-5"
            >
              <h3 class="text-sm font-black text-slate-900 dark:text-white mb-4 border-l-4 border-accent pl-2">
                目录
              </h3>
              <nav
                ref="tocNav"
                class="space-y-1.5 max-h-[calc(100vh-18rem)] overflow-y-auto pr-3"
              >
                <a
                  v-for="item in toc"
                  :key="item.id"
                  :href="`#${item.id}`"
                  :data-toc-id="item.id"
                  :class="[
                    'block text-sm transition-all duration-200 hover:text-accent rounded px-1 -mx-1',
                    item.level === 1 ? 'font-bold' : '',
                    item.level === 2 ? 'ml-3' : '',
                    item.level === 3 ? 'ml-6 text-xs' : '',
                    activeId === item.id
                      ? 'text-accent font-bold bg-accent/10'
                      : item.level === 1
                        ? 'text-slate-800 dark:text-slate-200'
                        : item.level === 2
                          ? 'text-slate-600 dark:text-slate-400'
                          : 'text-slate-500 dark:text-slate-500',
                  ]"
                  @click="handleTocClick($event, item.id)"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>
            <ProfileCard :post-count="posts.length" :photo-count="photoCount" :friend-count="friendsData.length" />
          </div>
        </aside>

        <!-- Article Body -->
        <article
          class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden"
        >
          <div class="p-6 md:p-10">
            <!-- Title & Meta -->
            <header class="mb-8">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="px-2 py-1 bg-accent-soft text-accent dark:text-accent-light rounded-md text-xs font-bold"
                >
                  {{ tag }}
                </span>
                <span class="text-xs text-slate-400 font-bold">{{ post.date }}</span>
              </div>
              <h1 class="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {{ post.title }}
              </h1>
              <p v-if="post.description" class="text-base text-slate-600 dark:text-slate-400 mt-3 font-serif">
                {{ post.description }}
              </p>
            </header>

            <!-- Content -->
            <div
              class="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:font-serif prose-p:leading-relaxed prose-li:font-serif"
              v-html="htmlContent"
            />

            <!-- Share -->
            <footer class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between">
                <RouterLink
                  to="/timeline"
                  class="text-sm font-bold text-accent hover:text-accent-dark transition-colors"
                >
                  ← 返回归档
                </RouterLink>
                <div class="flex items-center gap-2">
                  <button
                    @click="copyLink"
                    class="px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-colors"
                  >
                    分享文章
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>

      <!-- Not Found -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <p class="text-6xl font-black text-slate-300 dark:text-slate-700">404</p>
        <p class="text-lg text-slate-500 dark:text-slate-400 mt-4">文章未找到</p>
        <RouterLink to="/" class="mt-6 px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-colors">
          返回首页
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { fetchArchivePostBySlug, fetchArchivesPosts } from '@/utils/content-loader'
import type { PostMeta, TocItem, Album, Friend } from '@/types'
import { useToastStore } from '@/stores/toast'
import BackButton from '@/components/BackButton.vue'
import ProfileCard from '@/components/ProfileCard.vue'

const route = useRoute()
const toastStore = useToastStore()

const post = ref<PostMeta | undefined>(undefined)
const loading = ref(true)
const htmlContent = ref('')
const toc = ref<TocItem[]>([])
const posts = ref<PostMeta[]>([])
const albums = ref<Album[]>([])
const friendsData = ref<Friend[]>([])
const photoCount = computed(() => albums.value.reduce((sum, a) => sum + a.photos.length, 0))
const activeId = ref('')
const tocNav = ref<HTMLElement | null>(null)
let scrollCleanup: (() => void) | null = null

function handleTocClick(e: MouseEvent, id: string) {
  e.preventDefault()
  const target = document.getElementById(id)
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
    activeId.value = id
  }
}

function updateActiveHeading() {
  const headings = document.querySelectorAll('article h1, article h2, article h3')
  if (!headings.length) return

  let active = ''
  const scrollY = window.scrollY + 100

  for (const heading of headings) {
    const top = heading.getBoundingClientRect().top + window.scrollY
    if (top <= scrollY) {
      active = heading.id
    }
  }

  if (!active && headings.length > 0) {
    active = headings[0].id
  }

  if (active !== activeId.value) {
    activeId.value = active
    scrollTocToActive()
  }
}

function scrollTocToActive() {
  if (!tocNav.value || !activeId.value) return
  const activeLink = tocNav.value.querySelector(`[data-toc-id="${activeId.value}"]`) as HTMLElement | null
  if (!activeLink) return

  const navRect = tocNav.value.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()

  if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
    activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

/**
 * Inject heading IDs directly into the HTML string before v-html renders it.
 * This guarantees IDs are present in the DOM from the very first paint.
 */
function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[1-3])(\s[^>]*)?>(.+?)<\/\1>/gi,
    (_match, tag, attrs, content) => {
      const text = content.replace(/<[^>]*>/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
      // Avoid duplicating an existing id attribute
      if (/id=/i.test(attrs || '')) return _match
      return `<${tag}${attrs || ''} id="${id}">${content}</${tag}>`
    },
  )
}

async function loadPost() {
  loading.value = true
  const slug = route.params.slug as string
  post.value = (await fetchArchivePostBySlug(slug)) ?? undefined

  if (post.value?.content) {
    const result = await renderMarkdown(post.value.content)
    toc.value = result.toc
    // Inject IDs into headings BEFORE rendering, so the DOM has them from the start
    htmlContent.value = addHeadingIds(result.html)

    await nextTick()
    updateActiveHeading()
    if (scrollCleanup) scrollCleanup()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    scrollCleanup = () => window.removeEventListener('scroll', updateActiveHeading)
  }
  loading.value = false
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  toastStore.showToast('✨ 链接已复制到剪贴板', 'success')
}

watch(() => route.params.slug, loadPost)

async function loadSidebarData() {
  // 异步加载文章总数、Albums 和 Friends 数据
  const baseUrl = import.meta.env.BASE_URL || '/'
  posts.value = await fetchArchivesPosts()
  try {
    const albumResp = await fetch(`${baseUrl}Gallery/albums.json?t=${Date.now()}`)
    if (albumResp.ok) albums.value = await albumResp.json()
  } catch (_e) { /* ignore */ }
  try {
    const friendResp = await fetch(`${baseUrl}Friends/friends.json?t=${Date.now()}`)
    if (friendResp.ok) friendsData.value = await friendResp.json()
  } catch (_e) { /* ignore */ }
}

onMounted(async () => {
  await Promise.all([loadPost(), loadSidebarData()])
})

onBeforeUnmount(() => {
  if (scrollCleanup) scrollCleanup()
})
</script>

<style scoped>
/* Custom thin scrollbar for TOC nav */
nav.max-h-\[calc\(100vh-18rem\)\]::-webkit-scrollbar {
  width: 4px;
}
nav.max-h-\[calc\(100vh-18rem\)\]::-webkit-scrollbar-track {
  background: transparent;
}
nav.max-h-\[calc\(100vh-18rem\)\]::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 999px;
}
nav.max-h-\[calc\(100vh-18rem\)\]::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Scroll margin for heading anchors */
:deep(article h1, article h2, article h3) {
  scroll-margin-top: 6rem;
}
</style>
