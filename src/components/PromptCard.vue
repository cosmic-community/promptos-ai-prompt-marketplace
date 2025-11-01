<script setup lang="ts">
import type { Prompt } from '@/types'

interface Props {
  prompt: Prompt
}

defineProps<Props>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
</script>

<template>
  <router-link 
    :to="`/prompts/${prompt.slug}`"
    class="glass-card block h-full"
  >
    <!-- Preview Image -->
    <div class="relative w-full h-48 rounded-xl overflow-hidden mb-4">
      <img
        v-if="prompt.metadata.preview_image"
        :src="`${prompt.metadata.preview_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`"
        :alt="prompt.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
        <span class="text-white text-4xl">✨</span>
      </div>
      
      <!-- AI Tool Badge -->
      <div v-if="prompt.metadata.ai_tool" class="absolute top-3 right-3 px-3 py-1 rounded-lg glass text-xs font-medium">
        {{ prompt.metadata.ai_tool.value }}
      </div>
    </div>
    
    <!-- Content -->
    <div class="space-y-3">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {{ prompt.title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {{ prompt.metadata.description }}
        </p>
      </div>
      
      <!-- Category & Difficulty -->
      <div class="flex items-center gap-2 flex-wrap">
        <span v-if="prompt.metadata.category" class="text-xs px-2 py-1 rounded-lg glass">
          {{ prompt.metadata.category.metadata?.icon_emoji }} {{ prompt.metadata.category.title }}
        </span>
        <span v-if="prompt.metadata.difficulty_level" class="text-xs px-2 py-1 rounded-lg glass">
          {{ prompt.metadata.difficulty_level.value }}
        </span>
      </div>
      
      <!-- Price -->
      <div class="pt-3 border-t border-white/30 dark:border-white/10">
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-gradient">
            {{ formatPrice(prompt.metadata.price) }}
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            View Details →
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>