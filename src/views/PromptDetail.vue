<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPrompt, getSubscriptionPlans } from '@/lib/api'
import type { Prompt, SubscriptionPlan, PaymentMethod } from '@/types'
import PurchaseModal from '@/components/PurchaseModal.vue'

const route = useRoute()
const router = useRouter()
const prompt = ref<Prompt | null>(null)
const subscriptionPlans = ref<SubscriptionPlan[]>([])
const loading = ref(true)
const showPurchaseModal = ref(false)
const selectedPlan = ref<SubscriptionPlan | null>(null)

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

const openPurchaseModal = (plan?: SubscriptionPlan) => {
  selectedPlan.value = plan || null
  showPurchaseModal.value = true
}

const closePurchaseModal = () => {
  showPurchaseModal.value = false
  selectedPlan.value = null
}

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const [promptData, plansData] = await Promise.all([
      getPrompt(slug),
      getSubscriptionPlans()
    ])
    
    if (!promptData) {
      router.push('/')
      return
    }
    
    prompt.value = promptData
    subscriptionPlans.value = plansData
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

            <!-- Prompt Content Preview -->
            <div v-if="prompt.metadata.prompt_content" class="glass-card">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Prompt Template</h3>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">{{ prompt.metadata.prompt_content }}</pre>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                🔒 Purchase to unlock the full prompt template
              </p>
            </div>
          </div>
          
          <!-- Right Column: Purchase Options -->
          <div class="space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {{ prompt.title }}
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                {{ prompt.metadata.description }}
              </p>
            </div>
            
            <!-- One-Time Purchase -->
            <div class="glass-card border-2 border-primary-500">
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">One-Time Purchase</h3>
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
                  @click="openPurchaseModal()"
                  class="btn-primary w-full"
                >
                  Purchase Now
                </button>
              </div>
            </div>

            <!-- Subscription Plans -->
            <div class="glass-card">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Or Subscribe for Unlimited Access
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Get access to this prompt and all others in our library
              </p>
              
              <div class="space-y-3">
                <div 
                  v-for="plan in subscriptionPlans"
                  :key="plan.id"
                  :class="[
                    'glass p-4 rounded-xl hover:bg-white/30 dark:hover:bg-black/30 transition-all cursor-pointer border-2',
                    plan.metadata.is_popular ? 'border-primary-500' : 'border-transparent'
                  ]"
                  @click="openPurchaseModal(plan)"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <h4 class="font-bold text-gray-900 dark:text-white">
                          {{ plan.title }}
                        </h4>
                        <span 
                          v-if="plan.metadata.is_popular"
                          class="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium"
                        >
                          Popular
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {{ plan.metadata.duration_months }} month{{ plan.metadata.duration_months > 1 ? 's' : '' }} access
                        <span v-if="plan.metadata.discount_percentage && plan.metadata.discount_percentage > 0" class="text-green-600 dark:text-green-400 font-medium">
                          • Save {{ plan.metadata.discount_percentage }}%
                        </span>
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-gradient">
                        {{ formatPrice(plan.metadata.price) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <router-link 
                to="/pricing" 
                class="btn-secondary w-full mt-4 block text-center"
              >
                Compare All Plans
              </router-link>
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

    <!-- Purchase Modal -->
    <PurchaseModal 
      v-if="showPurchaseModal && prompt"
      :prompt="prompt"
      :subscription-plan="selectedPlan"
      @close="closePurchaseModal"
    />
  </div>
</template>