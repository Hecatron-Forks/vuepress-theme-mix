import type { Page, Theme } from '@vuepress/core'
import { containerPlugin } from '@vuepress/plugin-container'
import { path } from '@vuepress/utils'
import { gitPlugin } from '@vuepress/plugin-git'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { palettePlugin } from '@vuepress/plugin-palette'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import type {
  MixThemePageData,
  MixThemeData,
  MixThemePluginConfig,
} from '../shared/index.js'
import { assignThemeData, resolveContainerPluginOptions } from './utils/index.js'
import { backTopPlugin } from '@vuepress-theme-mix/vuepress-plugin-back-top'
import { fileURLToPath } from 'url'
import * as mdImplicitFiguresPlugin from 'markdown-it-implicit-figures'
import * as mdSubPlugin from 'markdown-it-sub'
import * as mdSupPlugin from 'markdown-it-sup'
import * as mdFootnotePlugin from 'markdown-it-footnote'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface MixThemeConfig extends MixThemeData {
  /**
   * To avoid confusion with the root `plugins` option,
   * we use `themePlugins`
   */
  themePlugins?: MixThemePluginConfig
}

export const mixTheme = ({
  themePlugins = {},
  ...localeOptions
}: MixThemeConfig = {}): Theme => {
  assignThemeData(localeOptions)

  return {
    name: 'vuepress-theme-mix',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),

    extendsPage: (page: Page<Partial<MixThemePageData>>) => {
      // save relative file path into page data to generate edit link
      page.data.filePathRelative = page.filePathRelative
      // save title into route meta to generate navbar and sidebar
      page.routeMeta.title = page.title
    },

    // buit-in plugins
    plugins: [
      // ['@vuepress-theme-mix/back-top', themePlugins.backTop !== false],

      // @vuepress-theme-mix/back-top
      themePlugins.backTop !== false ? backTopPlugin() : [],

      // @vuepress/plugin-theme-data
      themeDataPlugin({ themeData: localeOptions }),

      // @vuepress/plugin-palette
      palettePlugin({ preset: 'sass' }),

      // @vuepress/plugin-medium-zoom
      themePlugins.mediumZoom !== false
        ? mediumZoomPlugin({
          selector:
              '.theme-mix-content > img:not(.no-zoom), .theme-mix-content :not(a) > img:not(.no-zoom)',
          zoomOptions: {},
          delay: 300,
        })
        : [],

      // @vuepress/plugin-container
      themePlugins.container?.tip !== false
        ? containerPlugin(resolveContainerPluginOptions(localeOptions, 'tip'))
        : [],
      themePlugins.container?.warning !== false
        ? containerPlugin(
          resolveContainerPluginOptions(localeOptions, 'warning')
        )
        : [],
      themePlugins.container?.danger !== false
        ? containerPlugin(
          resolveContainerPluginOptions(localeOptions, 'danger')
        )
        : [],
      themePlugins.container?.reference !== false
        ? containerPlugin(
          resolveContainerPluginOptions(localeOptions, 'reference')
        )
        : [],
      themePlugins.container?.details !== false
        ? containerPlugin({
          type: 'details',
          before: (info) =>
              `<details class="custom-container details">${
                info ? `<summary>${info}</summary>` : ''
              }\n`,
          after: () => '</details>\n',
        })
        : [],
      themePlugins.container?.codeGroup !== false
        ? containerPlugin({
          type: 'code-group',
          before: () => '<CodeGroup>\n',
          after: () => '</CodeGroup>\n',
        })
        : [],
      themePlugins.container?.codeGroupItem !== false
        ? containerPlugin({
          type: 'code-group-item',
          before: (info) => `<CodeGroupItem title="${info}">\n`,
          after: () => '</CodeGroupItem>\n',
        })
        : [],

      // @vuepress/plugin-shiki
      themePlugins?.shiki !== false
        ? shikiPlugin({
          theme: themePlugins.shiki?.theme ?? 'github-dark-dimmed',
          langs: themePlugins.shiki?.langs ?? [],
        })
        : [],

      // @vuepress/plugin-nprogress
      themePlugins?.nprogress !== false ? nprogressPlugin() : [],

      // @vuepress/plugin-git
      themePlugins?.git !== false
        ? gitPlugin({
          createdTime: false,
          updatedTime: localeOptions.lastUpdated !== false,
        })
        : [],
    ],

    extendsMarkdown: (md): void => {
      if (localeOptions.figcaption !== false) {
        md.use(mdImplicitFiguresPlugin.default, {
          figcaption: true,
        })
      }
      if (localeOptions.sub !== false) md.use(mdSubPlugin.default)
      if (localeOptions.sup !== false) md.use(mdSupPlugin.default)
      if (localeOptions.footnote !== false) {
        md.use(mdFootnotePlugin.default)
      }
    },
  }
}
