import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

import Components from 'unplugin-vue-components/vite'

import AutoImport from 'unplugin-auto-import/vite'

import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

import UnoCSS from 'unocss/vite'

import defaultUnoCssPreset from 'unocss/preset-uno'
import presetIcons from 'unocss/preset-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    Layouts(),
    Components({ dirs: ['src/{pages,components}/**'], extensions: ['vue'], dts: true }),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        'vue/macros',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        },
        {
          from: 'naive-ui',
          imports: [
            {
              name: 'DataTableColumns',
              type: true
            }
          ]
        }
      ],
      dirs: ['src/composables/**'],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    ReactivityTransform(),
    UnoCSS({
      presets: [
        defaultUnoCssPreset(),
        presetIcons({
          cdn: 'https://esm.sh/',
        })
      ],
      theme: {
        colors: {
          app: {
            dark: '#435058',
            white: '#F1F2EE'
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
