<script setup lang="ts">
import type { SubscriptionPlan } from '@/types'

interface Props {
  plan: SubscriptionPlan
}

defineProps<Props>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const parseFeatures = (features: string) => {
  return features.split('\n').filter(f => f.trim())
}
</script>

<template>
  <div 
    :class="[
      'glass-card h-full relative',
      plan.metadata.is_popular ? 'border-2 border-primary-500' : ''
    ]"
  >
    <!-- Popular Badge -->
    <div 
      v-if="plan.metadata.is_popular"
      class="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg"
    >
      ⭐ Most Popular
    </div>
    
    <!-- Content -->
    <div class="space-y-6 pt-4">
      <!-- Header -->
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ plan.title }}
        </h3>
        <div class="flex items-baseline justify-center gap-2">
          <span class="text-4xl font-bold text-gradient">
            {{ formatPrice(plan.metadata.price) }}
          </span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          For {{ plan.metadata.duration_months }} month{{ plan.metadata.duration_months > 1 ? 's' : '' }}
        </p>
        
        <!-- Discount Badge -->
        <div v-if="plan.metadata.discount_percentage && plan.metadata.discount_percentage > 0" class="mt-3">
          <span class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
            Save {{ plan.metadata.discount_percentage }}%
          </span>
        </div>
      </div>
      
      <!-- Features -->
      <ul class="space-y-3">
        <li 
          v-for="(feature, index) in parseFeatures(plan.metadata.features)"
          :key="index"
          class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
        >
          <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">{{ feature }}</span>
        </li>
      </ul>
      
      <!-- CTA Button -->
      <button 
        :class="[
          'w-full py-3 rounded-xl font-medium transition-all',
          plan.metadata.is_popular
            ? 'btn-primary'
            : 'glass hover:bg-white/30 dark:hover:bg-black/30'
        ]"
      >
        Choose Plan
      </button>
    </div>
  </div>
</template>