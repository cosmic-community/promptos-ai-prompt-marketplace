<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')

const handleSubmit = () => {
  error.value = ''
  
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (isLogin.value) {
    // Login
    const success = userStore.login(email.value, password.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Invalid credentials'
    }
  } else {
    // Register
    if (!name.value) {
      error.value = 'Please enter your name'
      return
    }
    const success = userStore.register(email.value, password.value, name.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Registration failed'
    }
  }
}
</script>

<template>
  <div class="pt-24 pb-12 min-h-screen flex items-center justify-center">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        <div class="glass-card">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ isLogin ? 'Welcome Back' : 'Create Account' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ isLogin ? 'Sign in to access your prompts' : 'Join PromptOS today' }}
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name (Register only) -->
            <div v-if="!isLogin">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="John Doe"
                class="w-full px-4 py-3 rounded-xl glass border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl glass border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl glass border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-primary w-full">
              {{ isLogin ? 'Sign In' : 'Create Account' }}
            </button>
          </form>

          <!-- Toggle Mode -->
          <div class="mt-6 text-center">
            <button
              @click="isLogin = !isLogin"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>