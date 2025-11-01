<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { CartItem } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const selectedPaymentMethod = ref<'wallet' | 'bank_transfer'>('wallet')
const isProcessing = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const hasEnoughBalance = computed(() => {
  return userStore.wallet.balance >= userStore.cartTotal.value
})

const handleCheckout = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  if (selectedPaymentMethod.value === 'wallet' && !hasEnoughBalance.value) {
    alert('Insufficient wallet balance. Please top up your wallet.')
    return
  }

  isProcessing.value = true
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const success = userStore.completePurchase({ method: selectedPaymentMethod.value })
  
  isProcessing.value = false
  
  if (success) {
    alert('Purchase successful! 🎉 Check your account for purchased prompts.')
    router.push('/account')
  } else {
    alert('Purchase failed. Please try again.')
  }
}
</script>

<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        <!-- Empty Cart -->
        <div v-if="userStore.cartCount.value === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🛒</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            Browse our prompt library and add items to your cart
          </p>
          <router-link to="/" class="btn-primary inline-block">
            Browse Prompts
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="space-y-8">
          <!-- Items List -->
          <div class="space-y-4">
            <div
              v-for="item in userStore.cartItems.value"
              :key="item.id"
              class="glass-card"
            >
              <div class="flex items-start gap-4">
                <!-- Image -->
                <div class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    v-if="item.prompt.metadata.preview_image"
                    :src="`${item.prompt.metadata.preview_image.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`"
                    :alt="item.prompt.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                    <span class="text-white text-2xl">✨</span>
                  </div>
                </div>

                <!-- Details -->
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    {{ item.prompt.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ item.subscriptionPlan ? item.subscriptionPlan.title : 'One-time purchase' }}
                  </p>
                  <p class="text-lg font-bold text-gradient">
                    {{ formatPrice(item.subscriptionPlan?.metadata.price || item.prompt.metadata.price) }}
                  </p>
                </div>

                <!-- Remove Button -->
                <button
                  @click="userStore.removeFromCart(item.id)"
                  class="p-2 rounded-xl glass hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Checkout Section -->
          <div class="glass-card">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Checkout
            </h2>

            <!-- Wallet Balance -->
            <div class="glass p-4 rounded-xl mb-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Wallet Balance</span>
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ formatPrice(userStore.wallet.balance) }}
                </span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
                Payment Method
              </h3>
              
              <div class="space-y-3">
                <!-- Wallet Payment -->
                <div 
                  :class="[
                    'glass p-4 rounded-xl cursor-pointer transition-all border-2',
                    selectedPaymentMethod === 'wallet' 
                      ? 'border-primary-500' 
                      : 'border-transparent'
                  ]"
                  @click="selectedPaymentMethod = 'wallet'"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <div 
                        :class="[
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          selectedPaymentMethod === 'wallet' 
                            ? 'border-primary-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        ]"
                      >
                        <div 
                          v-if="selectedPaymentMethod === 'wallet'"
                          class="w-3 h-3 rounded-full bg-primary-500"
                        ></div>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">
                        💳 Wallet Balance
                      </p>
                      <p v-if="!hasEnoughBalance" class="text-xs text-red-600 dark:text-red-400">
                        Insufficient balance
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Bank Transfer -->
                <div 
                  :class="[
                    'glass p-4 rounded-xl cursor-pointer transition-all border-2',
                    selectedPaymentMethod === 'bank_transfer' 
                      ? 'border-primary-500' 
                      : 'border-transparent'
                  ]"
                  @click="selectedPaymentMethod = 'bank_transfer'"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <div 
                        :class="[
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          selectedPaymentMethod === 'bank_transfer' 
                            ? 'border-primary-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        ]"
                      >
                        <div 
                          v-if="selectedPaymentMethod === 'bank_transfer'"
                          class="w-3 h-3 rounded-full bg-primary-500"
                        ></div>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">
                        🏦 Bank Transfer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-white/30 dark:border-white/10 pt-6 mb-6">
              <div class="flex items-center justify-between text-xl">
                <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                <span class="font-bold text-gradient">
                  {{ formatPrice(userStore.cartTotal.value) }}
                </span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="handleCheckout"
              :disabled="isProcessing || (selectedPaymentMethod === 'wallet' && !hasEnoughBalance)"
              :class="[
                'w-full py-3 rounded-xl font-medium transition-all',
                isProcessing || (selectedPaymentMethod === 'wallet' && !hasEnoughBalance)
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'btn-primary'
              ]"
            >
              <span v-if="isProcessing" class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
              <span v-else>
                Complete Purchase
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>