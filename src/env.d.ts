/// <reference types="vite/client" />

// Build-time constant injected by vite.config.ts (used for cache-busting data fetches)
declare const __BUILD_TIME__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
