<template>
  <div class="flex-1 flex flex-col">
    <main class="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-16 pb-32 relative z-10 flex-1">
      <div v-if="project" class="grid grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)] gap-6 mt-6">
        <!-- Left Sidebar: BackButton + TOC (no ProfileCard) -->
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
          </div>
        </aside>

        <!-- Article Body -->
        <article
          class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden"
        >
          <div class="p-6 md:p-10">
            <!-- Title & Meta -->
            <header class="mb-8">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-4xl">{{ project.icon }}</span>
                <h1 class="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {{ project.name }}
                </h1>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="px-2 py-1 bg-accent-soft text-accent dark:text-accent-light rounded-md text-xs font-bold"
                >
                  {{ tag }}
                </span>
              </div>
              <p v-if="project.description" class="text-base text-slate-600 dark:text-slate-400 mt-3 font-serif">
                {{ project.description }}
              </p>
            </header>

            <!-- Content -->
            <div
              class="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:font-serif prose-p:leading-relaxed prose-li:font-serif"
              v-html="htmlContent"
            />

            <!-- Footer: Back + GitHub -->
            <footer class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between">
                <RouterLink
                  to="/projects"
                  class="text-sm font-bold text-accent hover:text-accent-dark transition-colors"
                >
                  ← 返回项目
                </RouterLink>
                <a
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  在 GitHub 上查看 →
                </a>
              </div>
            </footer>
          </div>
        </article>
      </div>

      <!-- Not Found -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <p class="text-6xl font-black text-slate-300 dark:text-slate-700">404</p>
        <p class="text-lg text-slate-500 dark:text-slate-400 mt-4">项目未找到</p>
        <RouterLink to="/projects" class="mt-6 px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-colors">
          返回项目
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown, fetchProjectBySlug } from '@/utils/markdown'
import type { Project, TocItem } from '@/types'
import BackButton from '@/components/BackButton.vue'

const route = useRoute()

const project = ref<Project | undefined>(undefined)
const htmlContent = ref('')
const toc = ref<TocItem[]>([])

async function loadProject() {
  const slug = route.params.slug as string
  project.value = (await fetchProjectBySlug(slug)) ?? undefined

  if (project.value?.content) {
    const result = await renderMarkdown(project.value.content)
    htmlContent.value = result.html
    toc.value = result.toc

    await nextTick()
    // Add IDs to headings
    document.querySelectorAll('article h1, article h2, article h3').forEach((heading) => {
      const text = heading.textContent || ''
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
      heading.id = id
    })
  } else {
    htmlContent.value = '<p>该工具本作者使用在Win下的WSL2平台，系统为Ubuntu22，个人使用请依据自己数据进行修改(这些工具只是整合了一些流程)</p>'
  }
}

watch(() => route.params.slug, loadProject)
onMounted(loadProject)
</script>
