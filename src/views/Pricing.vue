<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSubscriptionPlans } from '@/lib/api'
import type { SubscriptionPlan } from '@/types'
import PricingCard from '@/components/PricingCard.vue'

const plans = ref<SubscriptionPlan[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getSubscriptionPlans()
    plans.value = data
  } catch (error) {
    console.error('Error loading plans:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pt-24 pb-12">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-5xl font-bold mb-6">
          Choose Your
          <span class="text-gradient block mt-2">Subscription Plan</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Get unlimited access to all premium AI prompts. Cancel anytime.
        </p>
      </div>
    </section>
    
    <!-- Pricing Cards -->
    <section class="container mx-auto px-4 py-16">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Loading plans...</p>
      </div>
      
      <!-- Plans Grid -->
      <div v-else-if="plans.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PricingCard 
          v-for="plan in plans"
          :key="plan.id"
          :plan="plan"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          No subscription plans available.
        </p>
      </div>
    </section>
    
    <!-- FAQ Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-4">
          <div class="glass-card">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          
          <div class="glass-card">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              Do you offer refunds?
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              We offer a 7-day money-back guarantee if you're not satisfied with your subscription.
            </p>
          </div>
          
          <div class="glass-card">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              Can I purchase individual prompts?
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Yes! Each prompt can be purchased individually if you prefer not to subscribe.
            </p>
          </div>
          
          <div class="glass-card">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              How often do you add new prompts?
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              We add new prompts every week, ensuring you always have fresh content to work with.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>