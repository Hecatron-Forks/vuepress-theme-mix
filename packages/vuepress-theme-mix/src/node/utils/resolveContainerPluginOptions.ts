import type { ContainerPluginOptions } from '@vuepress/plugin-container'
import type { MixThemeData } from '../../shared/index.js'

/**
 * Resolve options for @vuepress/plugin-container
 *
 * For custom containers default title
 */
export const resolveContainerPluginOptions = (
  localeOptions: MixThemeData,
  type: 'tip' | 'warning' | 'danger' | 'reference'
): ContainerPluginOptions => {
  const locales = Object.entries(localeOptions.locales || {}).reduce(
    (result, [key, value]) => {
      const defaultInfo = value?.[type]
      if (defaultInfo) {
        result[key] = {
          defaultInfo,
        }
      }
      return result
    },
    {}
  )

  return {
    type,
    locales,
  }
}
