<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Prompt, SubscriptionPlan, PaymentMethod } from '@/types'

interface Props {
  prompt: Prompt
  subscriptionPlan?: SubscriptionPlan | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Mock wallet balance - in production, this would come from a user store/API
const walletBalance = ref(500000)
const selectedPaymentMethod = ref<PaymentMethod>('wallet')
const isProcessing = ref(false)

const purchaseAmount = computed(() => {
  return props.subscriptionPlan 
    ? props.subscriptionPlan.metadata.price 
    : props.prompt.metadata.price
})

const hasEnoughBalance = computed(() => {
  return walletBalance.value >= purchaseAmount.value
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const handlePurchase = async () => {
  isProcessing.value = true
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // In production, this would call an API endpoint
  console.log('Processing purchase:', {
    promptId: props.prompt.id,
    subscriptionPlanId: props.subscriptionPlan?.id,
    amount: purchaseAmount.value,
    paymentMethod: selectedPaymentMethod.value
  })
  
  isProcessing.value = false
  
  // Show success message (in production, use a toast/notification system)
  alert('Purchase successful! 🎉')
  emit('close')
}

const goToWallet = () => {
  emit('close')
  // In production, this would navigate to wallet page
  alert('Redirecting to wallet page...')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Complete Purchase
        </h2>
        <button 
          @click="emit('close')"
          class="p-2 rounded-xl glass hover:bg-white/30 dark:hover:bg-black/30 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Purchase Details -->
      <div class="glass p-4 rounded-xl mb-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
          {{ prompt.title }}
        </h3>
        <div v-if="subscriptionPlan" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <p class="font-medium text-primary-600 dark:text-primary-400">
            {{ subscriptionPlan.title }}
          </p>
          <p class="text-xs">
            {{ subscriptionPlan.metadata.duration_months }} month{{ subscriptionPlan.metadata.duration_months > 1 ? 's' : '' }} unlimited access
          </p>
        </div>
        <div v-else class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <p class="font-medium">One-time purchase</p>
          <p class="text-xs">Lifetime access to this prompt</p>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-white/30 dark:border-white/10">
          <span class="text-gray-600 dark:text-gray-400">Total Amount</span>
          <span class="text-2xl font-bold text-gradient">
            {{ formatPrice(purchaseAmount) }}
          </span>
        </div>
      </div>

      <!-- Wallet Balance -->
      <div class="glass p-4 rounded-xl mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-400">Wallet Balance</span>
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            {{ formatPrice(walletBalance) }}
          </span>
        </div>
        <button 
          @click="goToWallet"
          class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Top up wallet →
        </button>
      </div>

      <!-- Payment Method Selection -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
          Select Payment Method
        </h3>
        
        <div class="space-y-3">
          <!-- Wallet Payment -->
          <div 
            :class="[
              'glass p-4 rounded-xl cursor-pointer transition-all border-2',
              selectedPaymentMethod === 'wallet' 
                ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-900/10' 
                : 'border-transparent hover:bg-white/30 dark:hover:bg-black/30'
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
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      💳 Wallet Balance
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Fast and secure payment
                    </p>
                  </div>
                  <div v-if="!hasEnoughBalance" class="text-xs text-red-600 dark:text-red-400">
                    Insufficient balance
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bank Transfer -->
          <div 
            :class="[
              'glass p-4 rounded-xl cursor-pointer transition-all border-2',
              selectedPaymentMethod === 'bank_transfer' 
                ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-900/10' 
                : 'border-transparent hover:bg-white/30 dark:hover:bg-black/30'
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
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Direct payment via bank
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning for insufficient balance -->
      <div 
        v-if="selectedPaymentMethod === 'wallet' && !hasEnoughBalance"
        class="glass p-4 rounded-xl mb-6 border-2 border-yellow-500 bg-yellow-50/10 dark:bg-yellow-900/10"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-medium text-gray-900 dark:text-white mb-1">
              Insufficient Wallet Balance
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              You need {{ formatPrice(purchaseAmount - walletBalance) }} more to complete this purchase.
            </p>
            <button 
              @click="goToWallet"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Top up your wallet →
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          @click="emit('close')"
          class="btn-secondary flex-1"
          :disabled="isProcessing"
        >
          Cancel
        </button>
        <button 
          @click="handlePurchase"
          :disabled="isProcessing || (selectedPaymentMethod === 'wallet' && !hasEnoughBalance)"
          :class="[
            'flex-1 py-3 rounded-xl font-medium transition-all',
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
            Confirm Purchase
          </span>
        </button>
      </div>

      <!-- Security Notice -->
      <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        🔒 Secure payment • Your data is protected
      </p>
    </div>
  </div>
</template>