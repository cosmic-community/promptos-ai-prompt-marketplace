<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CosmicBadge from './components/CosmicBadge.vue'

const isDark = ref(false)

onMounted(() => {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header :is-dark="isDark" @toggle-theme="toggleTheme" />
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <Footer />
    <CosmicBadge />
  </div>
</template>