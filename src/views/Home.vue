<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getPrompts, getCategories } from '@/lib/api'
import type { Prompt, Category } from '@/types'
import PromptCard from '@/components/PromptCard.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'

const prompts = ref<Prompt[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<string | null>(null)
const loading = ref(true)

const filteredPrompts = computed(() => {
  if (!selectedCategory.value) {
    return prompts.value
  }
  
  return prompts.value.filter(prompt => 
    prompt.metadata.category?.id === selectedCategory.value
  )
})

onMounted(async () => {
  try {
    const [promptsData, categoriesData] = await Promise.all([
      getPrompts(),
      getCategories()
    ])
    
    prompts.value = promptsData
    categories.value = categoriesData
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pt-24 pb-12">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          Explore, Buy, and Master
          <span class="text-gradient block mt-2">AI Prompts</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Your all-in-one store for ChatGPT, Midjourney, and Gemini prompts. Browse premium prompts or subscribe for unlimited access.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#prompts" class="btn-primary">
            Browse Prompts
          </a>
          <router-link to="/pricing" class="btn-secondary">
            View Pricing
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Prompts Section -->
    <section id="prompts" class="container mx-auto px-4 py-16">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Browse AI Prompts
        </h2>
        
        <!-- Category Filter -->
        <div class="flex justify-center mb-8">
          <CategoryFilter 
            :categories="categories"
            :selected-category="selectedCategory"
            @select-category="selectedCategory = $event"
          />
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Loading prompts...</p>
      </div>
      
      <!-- Prompts Grid -->
      <div v-else-if="filteredPrompts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PromptCard 
          v-for="prompt in filteredPrompts"
          :key="prompt.id"
          :prompt="prompt"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          No prompts found in this category.
        </p>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="glass-card text-center max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Join thousands of users creating amazing content with AI prompts
        </p>
        <router-link to="/pricing" class="btn-primary inline-block">
          View Subscription Plans
        </router-link>
      </div>
    </section>
  </div>
</template>