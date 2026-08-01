<template>
  <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-16 pb-32 relative z-10 flex-1">
    <BackButton />

    <!-- 简历下载按钮 -->
    <a
      href="http://47.95.204.9/%E6%A8%A1%E6%9D%BF%E7%AE%80%E5%8E%86.pdf"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-glass-60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md hover:bg-accent hover:text-white transition-all duration-300 group"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span class="text-sm font-bold">下载简历</span>
    </a>

    <div class="mt-8">
      <!-- Hero -->
      <div class="text-center mb-10">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white dark:bg-slate-800 shadow-xl mx-auto mb-4">
          <img
            :src="siteConfig.avatarUrl"
            :alt="siteConfig.authorName"
            class="w-full h-full object-cover object-[54%_center]"
          />
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{{ siteConfig.authorName }}</h1>
        <p class="text-base text-slate-600 dark:text-slate-400 mt-2 font-serif max-w-2xl mx-auto">{{ bioText }}</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-slate-400">
        <div class="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-sm">加载中...</p>
      </div>

      <!-- Content -->
      <article
        v-else-if="htmlContent"
        class="rounded-3xl bg-glass-50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 md:p-10"
      >
        <div class="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:font-serif prose-p:leading-relaxed prose-li:font-serif" v-html="htmlContent" />
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { renderMarkdown } from '@/utils/markdown'
import { parseFrontmatter, fetchAboutBio } from '@/utils/content-loader'
import { siteConfig } from '@/siteConfig'
import BackButton from '@/components/BackButton.vue'

const htmlContent = ref('')
const loading = ref(true)
const bioText = ref(siteConfig.bio)

onMounted(async () => {
  try {
    const cacheBust = `?v=${__BUILD_TIME__}`
    const baseUrl = import.meta.env.BASE_URL || '/'

    // 读取 config.json 获取文件名
    const cfgResp = await fetch(`${baseUrl}About/config.json${cacheBust}`)
    if (!cfgResp.ok) throw new Error('config not found')
    const cfg = await cfgResp.json()
    const entry = cfg.files && cfg.files.find((f: any) => f.enabled)
    if (!entry || !entry.filename) throw new Error('disabled or no file')

    // 读取 .md 文件
    const mdResp = await fetch(`${baseUrl}About/${encodeURIComponent(entry.filename)}${cacheBust}`)
    if (!mdResp.ok) throw new Error('md not found')
    const raw = await mdResp.text()

    // 解析 frontmatter 提取 bio
    const { data, content } = parseFrontmatter(raw)
    if (data.bio) bioText.value = data.bio

    // 只传正文（不含 frontmatter）给 renderMarkdown
    const result = await renderMarkdown(content)
    htmlContent.value = result.html
  } catch (e) {
    console.error('[About] 加载失败:', e)
  } finally {
    loading.value = false
  }
})
</script>
