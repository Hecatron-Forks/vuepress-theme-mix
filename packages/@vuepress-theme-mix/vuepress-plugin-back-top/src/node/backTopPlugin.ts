import type { Plugin } from '@vuepress/core'
import { path } from '@vuepress/utils'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const backTopPlugin = (): Plugin => ({
  name: '@vuepress-theme-mix/plugin-back-top',

  clientConfigFile: path.resolve(__dirname, '../client/config.js'),
})
