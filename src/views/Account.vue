<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { PurchasedProduct } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref<'profile' | 'purchased' | 'wallet'>('purchased')
const topUpAmount = ref<number>(100000)

// Check if user is logged in
if (!userStore.isLoggedIn) {
  router.push('/login')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const activePurchases = computed(() => {
  return userStore.purchasedProducts.value.filter((p: PurchasedProduct) => p.status === 'active' || p.type === 'one-time')
})

const handleTopUp = () => {
  if (topUpAmount.value <= 0) {
    window.alert('Please enter a valid amount')
    return
  }
  
  const success = userStore.topUpWallet(topUpAmount.value)
  if (success) {
    window.alert(`Successfully added ${formatPrice(topUpAmount.value)} to your wallet! 🎉`)
    topUpAmount.value = 100000
  }
}

const getTimeRemaining = (expiryDate?: string) => {
  if (!expiryDate) return null
  
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days} days ${hours} hours`
  return `${hours} hours`
}

const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  }
}

// Changed: Added helper function to handle renewal alerts
const handleRenewal = () => {
  window.alert('Renewal functionality coming soon!')
}
</script>

<template>
  <div class="pt-24 pb-12 min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Account
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Manage your profile, purchases, and wallet
          </p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-8 overflow-x-auto">
          <button
            @click="activeTab = 'profile'"
            :class="[
              'px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap',
              activeTab === 'profile'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'glass hover:bg-white/30 dark:hover:bg-black/30'
            ]"
          >
            👤 Profile
          </button>
          <button
            @click="activeTab = 'purchased'"
            :class="[
              'px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap',
              activeTab === 'purchased'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'glass hover:bg-white/30 dark:hover:bg-black/30'
            ]"
          >
            📦 Purchased Prompts
          </button>
          <button
            @click="activeTab = 'wallet'"
            :class="[
              'px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap',
              activeTab === 'wallet'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'glass hover:bg-white/30 dark:hover:bg-black/30'
            ]"
          >
            💳 Wallet
          </button>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <div class="glass-card">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Name</label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ userStore.currentUser.value?.name }}
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Email</label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ userStore.currentUser.value?.email }}
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Member Since</label>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatDate(userStore.currentUser.value?.createdAt || '') }}
                </p>
              </div>
            </div>
          </div>

          <div class="glass-card">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Account Statistics
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="glass p-4 rounded-xl text-center">
                <p class="text-3xl font-bold text-gradient mb-2">
                  {{ activePurchases.length }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Active Prompts
                </p>
              </div>
              <div class="glass p-4 rounded-xl text-center">
                <p class="text-3xl font-bold text-gradient mb-2">
                  {{ formatPrice(userStore.wallet.value?.balance ?? 0) }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Wallet Balance
                </p>
              </div>
              <div class="glass p-4 rounded-xl text-center">
                <p class="text-3xl font-bold text-gradient mb-2">
                  {{ userStore.wallet.value?.transactions?.length ?? 0 }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Purchased Tab -->
        <div v-if="activeTab === 'purchased'">
          <div v-if="activePurchases.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📦</div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No purchases yet
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
              Browse our prompt library and make your first purchase
            </p>
            <router-link to="/" class="btn-primary inline-block">
              Browse Prompts
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="purchase in activePurchases"
              :key="purchase.id"
              class="glass-card"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {{ purchase.promptTitle }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Purchased on {{ formatDate(purchase.purchaseDate) }}
                  </p>
                </div>
                <span :class="[
                  'text-xs px-3 py-1 rounded-full font-medium',
                  purchase.type === 'one-time' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : purchase.status === 'active'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                ]">
                  {{ purchase.type === 'one-time' ? 'Lifetime' : purchase.status }}
                </span>
              </div>

              <!-- Countdown Timer (for subscriptions) -->
              <div v-if="purchase.type === 'subscription' && purchase.expiryDate" class="mb-4">
                <div class="flex items-center justify-between text-sm glass p-3 rounded-lg">
                  <span class="text-gray-600 dark:text-gray-400">⏰ Time Remaining</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ getTimeRemaining(purchase.expiryDate) }}
                  </span>
                </div>
              </div>

              <!-- Access Details -->
              <div class="space-y-3 mb-4">
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Access Key</label>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono">
                      {{ purchase.accessKey }}
                    </code>
                    <button 
                      @click="copyToClipboard(purchase.accessKey)"
                      class="btn-secondary py-2 px-3 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">Access URL</label>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm font-mono truncate">
                      {{ purchase.accessUrl }}
                    </code>
                    <a 
                      :href="purchase.accessUrl"
                      target="_blank"
                      class="btn-secondary py-2 px-3 text-sm"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <router-link 
                  :to="`/prompts/${purchase.promptSlug}`"
                  class="btn-secondary flex-1 text-center"
                >
                  View Prompt
                </router-link>
                <button 
                  v-if="purchase.type === 'subscription'"
                  @click="handleRenewal"
                  class="btn-primary flex-1"
                >
                  Renew
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Wallet Tab -->
        <div v-if="activeTab === 'wallet'" class="space-y-6">
          <!-- Balance Card -->
          <div class="glass-card">
            <div class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400 mb-2">Current Balance</p>
              <p class="text-5xl font-bold text-gradient mb-6">
                {{ formatPrice(userStore.wallet.value?.balance ?? 0) }}
              </p>
              
              <!-- Top Up Form -->
              <div class="max-w-md mx-auto">
                <label class="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Top Up Amount
                </label>
                <div class="flex gap-2 mb-4">
                  <input
                    v-model.number="topUpAmount"
                    type="number"
                    min="10000"
                    step="10000"
                    class="flex-1 px-4 py-3 rounded-xl glass border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button @click="handleTopUp" class="btn-primary px-6">
                    Top Up
                  </button>
                </div>
                <div class="flex gap-2 justify-center flex-wrap">
                  <button 
                    @click="topUpAmount = 100000"
                    class="btn-secondary py-2 px-4 text-sm"
                  >
                    100K
                  </button>
                  <button 
                    @click="topUpAmount = 200000"
                    class="btn-secondary py-2 px-4 text-sm"
                  >
                    200K
                  </button>
                  <button 
                    @click="topUpAmount = 500000"
                    class="btn-secondary py-2 px-4 text-sm"
                  >
                    500K
                  </button>
                  <button 
                    @click="topUpAmount = 1000000"
                    class="btn-secondary py-2 px-4 text-sm"
                  >
                    1M
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction History -->
          <div class="glass-card">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Transaction History
            </h2>
            
            <div v-if="(userStore.wallet.value?.transactions?.length ?? 0) === 0" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">
                No transactions yet
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="transaction in (userStore.wallet.value?.transactions ?? []).slice().reverse()"
                :key="transaction.id"
                class="glass p-4 rounded-xl"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ transaction.description }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ formatDate(transaction.date) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p :class="[
                      'text-lg font-bold',
                      transaction.type === 'topup' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    ]">
                      {{ transaction.type === 'topup' ? '+' : '-' }}{{ formatPrice(Math.abs(transaction.amount)) }}
                    </p>
                    <span :class="[
                      'text-xs px-2 py-1 rounded-full',
                      transaction.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : transaction.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    ]">
                      {{ transaction.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>