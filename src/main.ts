import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import PromptDetail from './views/PromptDetail.vue'
import Pricing from './views/Pricing.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/prompts/:slug',
      name: 'prompt-detail',
      component: PromptDetail
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: Pricing
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')