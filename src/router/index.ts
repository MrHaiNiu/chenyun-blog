import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/posts/:slug',
      name: 'post',
      component: () => import('@/pages/PostDetail.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/pages/Timeline.vue'),
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/pages/Friends.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/About.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/pages/Projects.vue'),
    },
    {
      path: '/project/:slug',
      name: 'project-detail',
      component: () => import('@/pages/ProjectDetail.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/pages/Gallery.vue'),
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('@/pages/Music.vue'),
    },
    {
      path: '/chatter',
      name: 'chatter',
      component: () => import('@/pages/Chatter.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
