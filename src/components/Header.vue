<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isDark: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  toggleTheme: []
}>()

const isMenuOpen = ref(false)
// Mock wallet balance - in production, this would come from a user store/API
const walletBalance = ref(500000)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact'
  }).format(price)
}

const goToWallet = () => {
  // In production, this would navigate to wallet page
  alert('Redirecting to wallet page...')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30 dark:border-white/10">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">P</span>
          </div>
          <span class="text-xl font-bold text-gradient">PromptOS</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
            Home
          </router-link>
          <router-link to="/#prompts" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
            Prompts
          </router-link>
          <router-link to="/pricing" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
            Pricing
          </router-link>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Wallet Balance -->
          <button 
            @click="goToWallet"
            class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/30 dark:hover:bg-black/30 transition-all"
          >
            <span class="text-xl">💳</span>
            <span class="font-semibold text-gradient">
              {{ formatPrice(walletBalance) }}
            </span>
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="emit('toggleTheme')"
            class="p-2 rounded-xl glass hover:bg-white/30 dark:hover:bg-black/30 transition-all"
            aria-label="Toggle theme"
          >
            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <!-- Mobile Menu Toggle -->
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 rounded-xl glass hover:bg-white/30 dark:hover:bg-black/30 transition-all"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 pt-4 border-t border-white/30 dark:border-white/10">
        <div class="flex flex-col space-y-3">
          <!-- Wallet Balance Mobile -->
          <button 
            @click="goToWallet"
            class="flex items-center justify-between glass hover:bg-white/30 dark:hover:bg-black/30 px-4 py-3 rounded-xl"
          >
            <span class="text-gray-700 dark:text-gray-300 font-medium">Wallet Balance</span>
            <span class="font-semibold text-gradient flex items-center gap-2">
              <span class="text-xl">💳</span>
              {{ formatPrice(walletBalance) }}
            </span>
          </button>

          <router-link to="/" @click="isMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2">
            Home
          </router-link>
          <router-link to="/#prompts" @click="isMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2">
            Prompts
          </router-link>
          <router-link to="/pricing" @click="isMenuOpen = false" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors py-2">
            Pricing
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>