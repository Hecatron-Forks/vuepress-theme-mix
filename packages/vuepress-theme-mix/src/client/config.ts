import { h, computed, onMounted, provide, ref } from 'vue'
import { defineClientConfig, usePageFrontmatter } from '@vuepress/client'
import CodeGroup from './components/global/CodeGroup.js'
import CodeGroupItem from './components/global/CodeGroupItem.vue'
import CodePenSnippet from './components/global/CodePenSnippet.vue'
import OutboundLink from './components/global/OutboundLink.vue'
import { path } from '@vuepress/utils'
import {
  resolveSidebarItems,
  sidebarItemsSymbol,
  themeModeSymbol,
  useThemeLocaleData,
  useScrollPromise,
} from './composables/index.js'
import type { MixThemeNormalPageFrontmatter } from '../shared/index.js'

import './styles/index.scss'

export default defineClientConfig({
  layouts: {
    Layout: path.resolve(__dirname, '../client/layouts/Layout.vue'),
    NotFound: path.resolve(__dirname, '../client/layouts/NotFound.vue'),
  },
  enhance({ app, router }) {
    app.component('CodeGroup', CodeGroup)
    app.component('CodeGroupItem', CodeGroupItem)
    app.component('CodePenSnippet', CodePenSnippet)

    // unregister the built-in `<OutboundLink>` to avoid warning
    delete app._context.components.OutboundLink
    // override the built-in `<OutboundLink>`
    app.component('OutboundLink', OutboundLink)

    // compat with @vuepress/plugin-docsearch and @vuepress/plugin-search
    app.component('NavbarSearch', () => {
      const SearchComponent =
        app.component('Docsearch') || app.component('SearchBox')
      if (SearchComponent) {
        return h(SearchComponent)
      }
      return null
    })

    // handle scrollBehavior with transition
    const scrollBehavior = router.options.scrollBehavior!
    router.options.scrollBehavior = async (...args) => {
      await useScrollPromise().wait()
      return scrollBehavior(...args)
    }
  },

  setup() {
    const themeLocale = useThemeLocaleData()

    // dark theme supported
    const themeMode = ref(themeLocale.value.mode ?? 'auto')

    onMounted(() => {
      if (themeMode.value === 'auto') {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        themeMode.value = localStorage.theme ?? (media.matches ? 'dark' : 'light')

        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', (e) => {
            if (e.matches) {
              themeMode.value = 'dark'
            } else {
              themeMode.value = 'light'
            }
            document.documentElement.dataset.theme = themeMode.value
            localStorage.setItem('theme', themeMode.value)
          })
      }

      document.documentElement.dataset.theme = themeMode.value
    })

    provide(themeModeSymbol, themeMode)

    // we need to access sidebar items in multiple components
    // so we make it global computed
    const frontmatter = usePageFrontmatter<MixThemeNormalPageFrontmatter>()
    const sidebarItems = computed(() =>
      resolveSidebarItems(frontmatter.value, themeLocale.value)
    )
    provide(sidebarItemsSymbol, sidebarItems)
  },
})
