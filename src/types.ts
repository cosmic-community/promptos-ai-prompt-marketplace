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

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Cart Item interface
export interface CartItem {
  id: string;
  prompt: Prompt;
  subscriptionPlan?: SubscriptionPlan;
  addedAt: string;
}

// Purchased Product interface
export interface PurchasedProduct {
  id: string;
  promptId: string;
  promptTitle: string;
  promptSlug: string;
  subscriptionPlanId?: string;
  subscriptionPlanTitle?: string;
  purchaseDate: string;
  expiryDate?: string;
  accessKey: string;
  accessUrl: string;
  price: number;
  type: 'one-time' | 'subscription';
  status: 'active' | 'expired';
}

// Wallet interface
export interface Wallet {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

// Wallet transaction interface
export interface WalletTransaction {
  id: string;
  type: 'topup' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

// Payment method type
export type PaymentMethod = 'wallet' | 'bank_transfer';

// Purchase interface
export interface Purchase {
  id: string;
  promptId: string;
  promptTitle: string;
  subscriptionPlanId?: string;
  subscriptionPlanTitle?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  date: string;
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