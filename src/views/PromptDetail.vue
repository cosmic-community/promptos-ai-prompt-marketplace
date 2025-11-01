<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPrompt } from '@/lib/api'
import { useUserStore } from '@/stores/userStore'
import type { Prompt } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const prompt = ref<Prompt | null>(null)
const loading = ref(true)
const showFullContent = ref(false)

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

const purchasedProduct = computed(() => {
  if (!prompt.value) return null
  return userStore.purchasedProducts.find(p => p.promptId === prompt.value!.id)
})

const hasPurchased = computed(() => !!purchasedProduct.value)

const timeRemaining = computed(() => {
  if (!purchasedProduct.value?.expiryDate) return null
  
  const now = new Date()
  const expiry = new Date(purchasedProduct.value.expiryDate)
  const diff = expiry.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days} days ${hours} hours remaining`
  return `${hours} hours remaining`
})

const handleAddToCart = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  if (!prompt.value) return

  const added = userStore.addToCart({
    id: Math.random().toString(36).substr(2, 9),
    prompt: prompt.value,
    addedAt: new Date().toISOString()
  })

  if (added) {
    alert('Added to cart! 🎉')
  } else {
    alert('This item is already in your cart')
  }
}

const handleRenew = () => {
  if (!purchasedProduct.value || !prompt.value) return
  
  // Mock renewal with 1 month extension
  const renewed = userStore.renewSubscription(
    purchasedProduct.value.id,
    'renewal',
    prompt.value.metadata.price
  )
  
  if (renewed) {
    alert('Subscription renewed! 🎉')
  } else {
    alert('Insufficient wallet balance. Please top up your wallet.')
  }
}

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const promptData = await getPrompt(slug)
    
    if (!promptData) {
      router.push('/')
      return
    }
    
    prompt.value = promptData
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
          
          <!-- Right Column: Details & Purchase -->
          <div class="space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ prompt.title }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ prompt.metadata.description }}
              </p>
            </div>

            <!-- Purchased Product Info -->
            <div v-if="hasPurchased && purchasedProduct" class="glass-card border-2 border-green-500">
              <div class="mb-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">✅ You Own This Prompt</h3>
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full font-medium',
                    purchasedProduct.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  ]">
                    {{ purchasedProduct.status === 'active' ? 'Active' : 'Expired' }}
                  </span>
                </div>
                
                <!-- Countdown Timer -->
                <div v-if="purchasedProduct.type === 'subscription' && timeRemaining" class="mb-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Time Remaining</span>
                    <span class="font-semibold text-gray-900 dark:text-white">⏰ {{ timeRemaining }}</span>
                  </div>
                </div>
                
                <!-- Access Key -->
                <div class="mb-3">
                  <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Access Key</label>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono">
                      {{ purchasedProduct.accessKey }}
                    </code>
                    <button 
                      @click="navigator.clipboard.writeText(purchasedProduct.accessKey)"
                      class="btn-secondary py-2 px-3 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <!-- Access URL -->
                <div class="mb-4">
                  <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Access URL</label>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono truncate">
                      {{ purchasedProduct.accessUrl }}
                    </code>
                    <a 
                      :href="purchasedProduct.accessUrl"
                      target="_blank"
                      class="btn-secondary py-2 px-3 text-sm"
                    >
                      Open
                    </a>
                  </div>
                </div>
                
                <!-- Renew Button -->
                <button 
                  v-if="purchasedProduct.type === 'subscription'"
                  @click="handleRenew"
                  class="btn-primary w-full"
                >
                  Renew Subscription
                </button>
              </div>
            </div>
            
            <!-- Purchase Option (if not purchased) -->
            <div v-else class="glass-card border-2 border-primary-500">
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">Purchase Now</h3>
                  <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                    Lifetime Access
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Buy this prompt once and own it forever
                </p>
              </div>
              <div class="text-center py-4">
                <p class="text-4xl font-bold text-gradient mb-4">
                  {{ formatPrice(prompt.metadata.price) }}
                </p>
                <button 
                  @click="handleAddToCart"
                  class="btn-primary w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            <!-- Detailed Description Section -->
            <div class="glass-card">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-gray-900 dark:text-white">Full Prompt Template</h3>
                <button 
                  @click="showFullContent = !showFullContent"
                  class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {{ showFullContent ? 'Show Less' : 'Show More' }}
                </button>
              </div>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <pre :class="[
                  'text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap',
                  showFullContent ? '' : 'line-clamp-6'
                ]">{{ prompt.metadata.prompt_content }}</pre>
              </div>
              <p v-if="!hasPurchased" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                🔒 Purchase to unlock full access and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>