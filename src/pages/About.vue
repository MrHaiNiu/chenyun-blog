<template>
  <main class="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1">
    <BackButton />

    <div class="mt-8">
      <!-- Hero -->
      <div class="text-center mb-10">
        <img
          :src="siteConfig.avatarUrl"
          :alt="siteConfig.authorName"
          class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-xl mx-auto mb-4"
        />
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{{ siteConfig.authorName }}</h1>
        <p class="text-base text-slate-600 dark:text-slate-400 mt-2 font-serif max-w-2xl mx-auto">{{ siteConfig.bio }}</p>
      </div>

      <!-- Content -->
      <article
        v-if="htmlContent"
        class="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 md:p-10"
      >
        <div class="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:font-serif prose-p:leading-relaxed prose-li:font-serif" v-html="htmlContent" />
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { renderMarkdown } from '@/utils/markdown'
import { siteConfig } from '@/siteConfig'
import BackButton from '@/components/BackButton.vue'

const htmlContent = ref('')

onMounted(async () => {
  const aboutContent = `## 个人简介

你好，我是 XingHuiSama。

专注于**计算化学、人工智能与软件工程**的交叉应用。

### 🔬 研究与计算方向

- **图神经网络:** 用于分子性质预测与特征提取。
- **分子对接:** 用于评估配体与受体蛋白的结合模式与亲和力。
- **分子动力学模拟:** 用于探究生物大分子在原子尺度的动态行为与构象变化。

### 💻 软件工程能力

- **后端开发:** 使用 **Spring Boot** 框架构建服务端架构，能够处理复杂的数据逻辑与计算任务调度。
- **前端开发:** 熟练掌握 **Vue.js** 与 **React** 框架，为复杂科学数据的可视化与交互提供流畅的体验。

### 📝 本博客

本博客使用 **Vue 3 + Vite + Tailwind CSS** 构建，重构自原 Next.js 版本。

保留了原站的所有动画效果与视觉风格，同时移除了部分页面并新增了佳句展示与文章卡片布局。

**欢迎各位朋友联系交流~**`

  const result = await renderMarkdown(aboutContent)
  htmlContent.value = result.html
})
</script>
