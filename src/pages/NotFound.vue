<template>
  <main class="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-20 md:pt-24 pb-32 relative z-10 flex-1 flex items-center justify-center">
    <div class="text-center">
      <p class="text-7xl md:text-9xl font-black text-slate-300 dark:text-slate-700">404</p>
      <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 mt-4 font-serif">页面未找到</p>
      <p class="text-sm text-slate-400 dark:text-slate-500 mt-2">你访问的页面不存在或已被移除</p>
      <RouterLink
        to="/"
        class="mt-6 inline-block px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-colors"
      >
        返回首页
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts"></script>
