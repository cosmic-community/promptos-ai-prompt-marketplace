import { cosmic, hasStatus } from './cosmic'
import type { Prompt, Category, SubscriptionPlan, CosmicResponse } from '@/types'

// Fetch all prompts with category data
export async function getPrompts(): Promise<Prompt[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'prompts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Prompt[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch prompts')
  }
}

// Fetch prompts by category
export async function getPromptsByCategory(categoryId: string): Promise<Prompt[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'prompts',
        'metadata.category': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Prompt[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch prompts by category')
  }
}

// Fetch single prompt by slug
export async function getPrompt(slug: string): Promise<Prompt | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'prompts',
        slug
      })
      .props(['id', 'title', 'slug', 'metadata', 'content'])
      .depth(1)
    
    return response.object as Prompt
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch prompt')
  }
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    const categories = response.objects as Category[]
    
    // Sort by display_order
    return categories.sort((a, b) => {
      const orderA = a.metadata?.display_order || 999
      const orderB = b.metadata?.display_order || 999
      return orderA - orderB
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

// Fetch subscription plans
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'subscription-plans' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    const plans = response.objects as SubscriptionPlan[]
    
    // Sort by duration (shortest to longest)
    return plans.sort((a, b) => a.metadata.duration_months - b.metadata.duration_months)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch subscription plans')
  }
}

// Fetch featured prompts
export async function getFeaturedPrompts(): Promise<Prompt[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'prompts',
        'metadata.is_featured': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Prompt[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured prompts')
  }
}