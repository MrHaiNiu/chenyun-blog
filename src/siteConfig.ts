export interface NavLink {
  name: string
  href: string
}

export interface SocialLink {
  type: string
  url?: string
  onClick?: string
}

export interface IcpConfig {
  name: string
  link: string
}

export interface SiteConfig {
  title: string
  faviconUrl: string
  authorName: string
  bio: string
  navTitle: string
  navSuffix: string
  navAfter: string
  avatarUrl: string
  useGradient: boolean
  themeColors: string[]
  bgImages: string[]
  defaultPostCover: string
  socialLinks: SocialLink[]
  navLinks: NavLink[]
  icpConfig: IcpConfig
  friendLinkApplyFormat: string
  enableLevelSystem: boolean
  buildDate: string
  danmakuList: string[]
}

const baseUrl = (typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/')
const logoUrl = baseUrl + 'logo.png'

export const siteConfig: SiteConfig = {
  title: '宸云 の 宝藏之地',
  faviconUrl: logoUrl,
  authorName: '宸云',
  bio: '在代码、学术与分子动力学模拟间穿梭的普通人。近期正埋头于 GROMACS 模拟研究与神经网络计算。',
  navTitle: '宸云',
  navSuffix: 'の',
  navAfter: '宝藏之地',
  avatarUrl: logoUrl,
  useGradient: false,
  themeColors: ['#a18cd1', '#fbc2eb', '#a1c4fd', '#c2e9fb'],
  bgImages: [
    'https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg',
    'https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg',
    'https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg',
  ],
  defaultPostCover: 'https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg',
  socialLinks: [
    { type: 'github', url: 'https://github.com/MrHaiNiu/chenyun-blog' },
    { type: 'email', url: 'mailto:contact@xinghuisama.top' },
    { type: 'wechat' },
  ],
  navLinks: [
    { name: '首页', href: '/' },
    { name: '项目', href: '/projects' },
    { name: '归档', href: '/timeline' },
    { name: '照片墙', href: '/gallery' },
    { name: '音乐', href: '/music' },
    { name: '说说', href: '/chatter' },
    { name: '友链', href: '/friends' },
    { name: '关于', href: '/about' },
  ],
  icpConfig: {
    name: '京ICP备2026046382号',
    link: 'https://beian.miit.gov.cn/#/Integrated/index',
  },
  friendLinkApplyFormat:
    '名称：宸云の宝藏之地\n简介：今天我也要学习吗\n链接：https://www.xinghuisama.top\n头像：http://47.95.204.9/logo.png',
  enableLevelSystem: true,
  buildDate: '2026-07-23T20:30:00',
  danmakuList: [
    '欢迎来到宝藏之地！',
    '代码改变世界',
    '愿你历尽千帆，归来仍是少年',
    'Stay hungry, Stay foolish',
    '在代码与学术间穿梭',
    'GROMACS 模拟研究',
    '每一个bug都是成长的契机',
    'Hello World!',
  ],
}
