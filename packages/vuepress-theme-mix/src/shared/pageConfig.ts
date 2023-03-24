import type { GitPluginPageData } from '@vuepress/plugin-git'
import type { NavLink } from './navbarConfig.js'
import type { SidebarConfig } from './sidebarConfig.js'

export interface MixThemePageData extends GitPluginPageData {
  filePathRelative: string | null
}

export interface MixThemePageFrontmatter {
  home?: boolean
  navbar?: boolean
}

export interface MixThemeHomePageFrontmatter extends MixThemePageFrontmatter {
  home: true
  heroImage?: string
  heroAlt?: string
  heroText?: string | null
  tagline?: string | null
  actions?: {
    text: string
    link: string
    type?: 'primary' | 'secondary'
  }[]
  features?: {
    title: string
    details: string
  }[]
  footer?: string
  footerHtml?: boolean
}

export interface MixThemeNormalPageFrontmatter extends MixThemePageFrontmatter {
  home?: false
  sidebar?: false | SidebarConfig
  toc?: boolean
  editLink?: boolean
  lastUpdated?: boolean
  prev?: string | NavLink
  next?: string | NavLink
}
