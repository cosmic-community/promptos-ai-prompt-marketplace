<script setup lang="ts">
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  selectedCategory: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  selectCategory: [categoryId: string | null]
}>()
</script>

<template>
  <div class="flex items-center gap-3 flex-wrap">
    <button
      @click="emit('selectCategory', null)"
      :class="[
        'px-4 py-2 rounded-xl font-medium transition-all',
        selectedCategory === null
          ? 'bg-primary-600 text-white shadow-lg'
          : 'glass hover:bg-white/30 dark:hover:bg-black/30'
      ]"
    >
      All Categories
    </button>
    
    <button
      v-for="category in categories"
      :key="category.id"
      @click="emit('selectCategory', category.id)"
      :class="[
        'px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2',
        selectedCategory === category.id
          ? 'bg-primary-600 text-white shadow-lg'
          : 'glass hover:bg-white/30 dark:hover:bg-black/30'
      ]"
    >
      <span v-if="category.metadata?.icon_emoji">{{ category.metadata.icon_emoji }}</span>
      <span>{{ category.title }}</span>
    </button>
  </div>
</template>