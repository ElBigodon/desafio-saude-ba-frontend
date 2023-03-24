import { createApp } from 'vue'

import { createPinia } from 'pinia'

import { createRouter, createWebHistory } from 'vue-router'

import { createHead } from "@vueuse/head"

import { setupLayouts } from 'virtual:generated-layouts'

import generatedRoutes from 'virtual:generated-pages'

import naive from 'naive-ui'

import App from './App.vue'

import '@unocss/reset/normalize.css'

import 'uno.css'

const head = createHead()

const routes = setupLayouts(generatedRoutes)

const router = createRouter({ routes, history: createWebHistory() })

const app = createApp(App)

app.use(createPinia())

app.use(naive)

app.use(head)

app.use(router)

app.mount('#app')
