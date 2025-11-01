import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import PromptDetail from './views/PromptDetail.vue'
import Login from './views/Login.vue'
import Cart from './views/Cart.vue'
import Account from './views/Account.vue'
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
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')