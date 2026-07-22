export interface Chatter {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

export const chatters: Chatter[] = [
  {
    slug: 'first-light',
    title: '建站第一天',
    date: '2026-03-23 22:00:00',
    description: '终于把博客搭好了，虽然折腾到深夜，但看着页面一点点成型，成就感满满。',
    content: '终于把博客搭好了！从选框架到调样式，折腾了好几天。看着页面一点点成型，虽然还有很多不足，但成就感满满。接下来要好好写文章了~'
  },
  {
    slug: 'gromacs-running',
    title: 'GROMACS 跑起来了！',
    date: '2026-03-25 14:30:00',
    description: '模拟终于跑起来了，虽然收敛得慢，但至少不报错了。等待结果的过程比写代码还煎熬。',
    content: '模拟终于跑起来了！虽然收敛得慢，但至少不报错了。等待结果的过程比写代码还煎熬。希望这次能出好图~'
  },
  {
    slug: 'bug-fix-99',
    title: 'BUG 修复进度 99%',
    date: '2026-03-28 10:15:00',
    description: '改了一整天的 bug，终于剩最后一个了。剩下的 1% 永远是最难的。',
    content: '改了一整天的 bug，终于剩最后一个了。剩下的 1% 永远是最难的。先去喝杯咖啡，回来继续干！'
  },
  {
    slug: 'tailwind-saves-day',
    title: 'Tailwind CSS 拯救前端',
    date: '2026-04-01 18:00:00',
    description: '不得不承认，Tailwind CSS 真的好用。以前觉得 utility-first 很奇怪，现在真香了。',
    content: '不得不承认，Tailwind CSS 真的好用。以前觉得 utility-first 很奇怪，现在真香了。重构前端的时候，效率提升了不知道多少倍。'
  },
  {
    slug: 'leetcode-100',
    title: 'Leetcode 刷题第一百题！',
    date: '2026-04-05 21:00:00',
    description: '终于刷到第一百题了！虽然有些题还是得看题解，但坚持就是胜利。',
    content: '终于刷到第一百题了！虽然有些题还是得看题解，但坚持就是胜利。下一个目标：两百题！'
  },
]
