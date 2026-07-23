<template>
  <div class="flex-1 flex flex-col">
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
      <div v-if="post" class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-6 mt-6">
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
              <nav class="space-y-1.5">
                <a
                  v-for="item in toc"
                  :key="item.id"
                  :href="`#${item.id}`"
                  :class="[
                    'block text-sm transition-colors hover:text-accent',
                    item.level === 1 ? 'font-bold text-slate-800 dark:text-slate-200' : '',
                    item.level === 2 ? 'ml-3 text-slate-600 dark:text-slate-400' : '',
                    item.level === 3 ? 'ml-6 text-xs text-slate-500 dark:text-slate-500' : '',
                  ]"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>
            <ProfileCard :post-count="0" :photo-count="0" :friend-count="0" />
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
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown, fetchArchivePostBySlug } from '@/utils/markdown'
import type { PostMeta, TocItem } from '@/types'
import { useToastStore } from '@/stores/toast'
import BackButton from '@/components/BackButton.vue'
import ProfileCard from '@/components/ProfileCard.vue'

const route = useRoute()
const toastStore = useToastStore()

const post = ref<PostMeta | undefined>(undefined)
const htmlContent = ref('')
const toc = ref<TocItem[]>([])

async function loadPost() {
  const slug = route.params.slug as string
  post.value = (await fetchArchivePostBySlug(slug)) ?? undefined

  if (post.value?.content) {
    const result = await renderMarkdown(post.value.content)
    htmlContent.value = result.html
    toc.value = result.toc

    await nextTick()
    // Add IDs to headings
    document.querySelectorAll('article h1, article h2, article h3').forEach((heading, i) => {
      const text = heading.textContent || ''
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
      heading.id = id
    })
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  toastStore.showToast('✨ 链接已复制到剪贴板', 'success')
}

watch(() => route.params.slug, loadPost)
onMounted(loadPost)
</script>
