// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    description?: string;
    icon_emoji?: string;
    display_order?: number;
  };
}

// AI Tool and Difficulty Level types
export interface SelectOption {
  key: string;
  value: string;
}

// Prompt interface
export interface Prompt extends CosmicObject {
  type: 'prompts';
  metadata: {
    description: string;
    category?: Category;
    ai_tool?: SelectOption;
    difficulty_level?: SelectOption;
    price: number;
    preview_image?: {
      url: string;
      imgix_url: string;
    };
    example_output?: string;
    tags?: string;
    is_featured?: boolean;
    prompt_content: string;
  };
}

// Subscription Plan interface
export interface SubscriptionPlan extends CosmicObject {
  type: 'subscription-plans';
  metadata: {
    duration_months: number;
    price: number;
    discount_percentage?: number;
    features: string;
    is_popular?: boolean;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guards
export function isPrompt(obj: CosmicObject): obj is Prompt {
  return obj.type === 'prompts';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

export function isSubscriptionPlan(obj: CosmicObject): obj is SubscriptionPlan {
  return obj.type === 'subscription-plans';
}

// Utility types
export type PromptWithCategory = Prompt & {
  metadata: Prompt['metadata'] & {
    category: Category;
  };
};