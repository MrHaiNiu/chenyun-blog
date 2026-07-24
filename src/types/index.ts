export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  cover: string
  mood?: string
  content?: string
}

export interface Friend {
  id: string
  name: string
  url: string
  description: string
  avatar: string
  themeColor: string
}

export interface Project {
  id: string
  name: string
  description: string
  icon: string
  githubUrl: string
  tags: string[]
  content?: string
  slug?: string
}

export interface Photo {
  url: string
  caption?: string
}

export interface Album {
  id: string
  title: string
  description: string
  cover: string
  date: string
  photos: Photo[]
}

export interface TocItem {
  id: string
  text: string
  level: number
}
