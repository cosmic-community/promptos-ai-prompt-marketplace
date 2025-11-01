<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPrompt } from '@/lib/api'
import type { Prompt } from '@/types'

const route = useRoute()
const router = useRouter()
const prompt = ref<Prompt | null>(null)
const loading = ref(true)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const parseTags = computed(() => {
  if (!prompt.value?.metadata.tags) return []
  return prompt.value.metadata.tags.split(',').map(tag => tag.trim())
})

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const data = await getPrompt(slug)
    
    if (!data) {
      router.push('/')
      return
    }
    
    prompt.value = data
  } catch (error) {
    console.error('Error loading prompt:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pt-24 pb-12">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div class="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-600 dark:text-gray-400 mt-4">Loading prompt...</p>
    </div>
    
    <!-- Prompt Detail -->
    <div v-else-if="prompt" class="container mx-auto px-4 py-12">
      <div class="max-w-5xl mx-auto">
        <!-- Back Button -->
        <button 
          @click="router.push('/')"
          class="glass hover:bg-white/30 dark:hover:bg-black/30 px-4 py-2 rounded-xl mb-6 inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Prompts
        </button>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column: Image & Info -->
          <div class="space-y-6">
            <!-- Preview Image -->
            <div class="glass-card">
              <div class="relative w-full h-96 rounded-xl overflow-hidden">
                <img
                  v-if="prompt.metadata.preview_image"
                  :src="`${prompt.metadata.preview_image.imgix_url}?w=1200&h=800&fit=crop&auto=format,compress`"
                  :alt="prompt.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white text-6xl">✨</span>
                </div>
              </div>
            </div>
            
            <!-- Metadata -->
            <div class="glass-card space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">AI Tool</span>
                <span class="font-medium">{{ prompt.metadata.ai_tool?.value || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between border-t border-white/30 dark:border-white/10 pt-4">
                <span class="text-gray-600 dark:text-gray-400">Difficulty</span>
                <span class="font-medium">{{ prompt.metadata.difficulty_level?.value || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between border-t border-white/30 dark:border-white/10 pt-4">
                <span class="text-gray-600 dark:text-gray-400">Category</span>
                <span class="font-medium">
                  {{ prompt.metadata.category?.metadata?.icon_emoji }} {{ prompt.metadata.category?.title }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Details -->
          <div class="space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ prompt.title }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ prompt.metadata.description }}
              </p>
            </div>
            
            <!-- Price -->
            <div class="glass-card">
              <div class="text-center py-6">
                <p class="text-gray-600 dark:text-gray-400 mb-2">Price</p>
                <p class="text-5xl font-bold text-gradient">
                  {{ formatPrice(prompt.metadata.price) }}
                </p>
              </div>
              <button class="btn-primary w-full">
                Purchase Prompt
              </button>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Or subscribe to access all prompts
              </p>
              <router-link to="/pricing" class="btn-secondary w-full mt-2 block text-center">
                View Plans
              </router-link>
            </div>
            
            <!-- Tags -->
            <div v-if="parseTags.length > 0" class="glass-card">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in parseTags"
                  :key="tag"
                  class="px-3 py-1 text-sm rounded-lg glass"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <!-- Example Output -->
            <div v-if="prompt.metadata.example_output" class="glass-card">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Example Output</h3>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ prompt.metadata.example_output }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>