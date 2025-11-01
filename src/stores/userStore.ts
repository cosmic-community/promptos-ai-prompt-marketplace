import { ref, computed } from 'vue';
import type { User, CartItem, PurchasedProduct, Wallet, PaymentMethodData } from '@/types';

// Mock user data - in production, this would be fetched from an API
const currentUser = ref<User | null>(null);
const cartItems = ref<CartItem[]>([]);
const purchasedProducts = ref<PurchasedProduct[]>([]);
const wallet = ref<Wallet>({
  balance: 500000,
  currency: 'VND',
  transactions: []
});

// Load data from localStorage on initialization
const loadFromStorage = () => {
  const storedUser = localStorage.getItem('currentUser');
  const storedCart = localStorage.getItem('cartItems');
  const storedPurchases = localStorage.getItem('purchasedProducts');
  const storedWallet = localStorage.getItem('wallet');

  if (storedUser) currentUser.value = JSON.parse(storedUser);
  if (storedCart) cartItems.value = JSON.parse(storedCart);
  if (storedPurchases) purchasedProducts.value = JSON.parse(storedPurchases);
  if (storedWallet) wallet.value = JSON.parse(storedWallet);
};

// Save data to localStorage
const saveToStorage = () => {
  if (currentUser.value) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
  } else {
    localStorage.removeItem('currentUser');
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
  localStorage.setItem('purchasedProducts', JSON.stringify(purchasedProducts.value));
  localStorage.setItem('wallet', JSON.stringify(wallet.value));
};

// Initialize store
loadFromStorage();

export const useUserStore = () => {
  // Computed
  const isLoggedIn = computed(() => currentUser.value !== null);
  const cartCount = computed(() => cartItems.value.length);
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.subscriptionPlan?.metadata.price || item.prompt.metadata.price);
    }, 0);
  });

  // Auth methods
  const login = (email: string, password: string): boolean => {
    // Mock login - in production, this would call an API
    if (email && password) {
      currentUser.value = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      saveToStorage();
      return true;
    }
    return false;
  };

  const logout = () => {
    currentUser.value = null;
    cartItems.value = [];
    saveToStorage();
  };

  const register = (email: string, password: string, name: string): boolean => {
    // Mock registration - in production, this would call an API
    if (email && password && name) {
      currentUser.value = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString()
      };
      saveToStorage();
      return true;
    }
    return false;
  };

  // Cart methods
  const addToCart = (item: CartItem) => {
    // Check if item already exists
    const existingIndex = cartItems.value.findIndex(
      i => i.prompt.id === item.prompt.id && 
           i.subscriptionPlan?.id === item.subscriptionPlan?.id
    );
    
    if (existingIndex === -1) {
      cartItems.value.push(item);
      saveToStorage();
      return true;
    }
    return false;
  };

  const removeFromCart = (itemId: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId);
    saveToStorage();
  };

  const clearCart = () => {
    cartItems.value = [];
    saveToStorage();
  };

  // Purchase methods
  const completePurchase = (paymentMethodData: PaymentMethodData): boolean => {
    if (!isLoggedIn.value) return false;
    
    const total = cartTotal.value;
    
    // Check wallet balance if paying with wallet
    if (paymentMethodData.method === 'wallet' && wallet.value.balance < total) {
      return false;
    }

    // Deduct from wallet if paying with wallet
    if (paymentMethodData.method === 'wallet') {
      wallet.value.balance -= total;
      wallet.value.transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'purchase',
        amount: -total,
        description: 'Prompt purchase',
        date: new Date().toISOString(),
        status: 'completed'
      });
    }

    // Add purchased products
    cartItems.value.forEach(item => {
      const expiryDate = item.subscriptionPlan 
        ? new Date(Date.now() + item.subscriptionPlan.metadata.duration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

      purchasedProducts.value.push({
        id: Math.random().toString(36).substr(2, 9),
        promptId: item.prompt.id,
        promptTitle: item.prompt.title,
        promptSlug: item.prompt.slug,
        subscriptionPlanId: item.subscriptionPlan?.id,
        subscriptionPlanTitle: item.subscriptionPlan?.title,
        purchaseDate: new Date().toISOString(),
        expiryDate,
        accessKey: `KEY-${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
        accessUrl: `https://api.promptos.com/access/${Math.random().toString(36).substr(2, 9)}`,
        price: item.subscriptionPlan?.metadata.price || item.prompt.metadata.price,
        type: item.subscriptionPlan ? 'subscription' : 'one-time',
        status: 'active'
      });
    });

    clearCart();
    saveToStorage();
    return true;
  };

  const renewSubscription = (productId: string, price: number): boolean => {
    if (!isLoggedIn.value || wallet.value.balance < price) return false;

    const product = purchasedProducts.value.find(p => p.id === productId);
    if (!product) return false;

    // Deduct from wallet
    wallet.value.balance -= price;
    wallet.value.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'purchase',
      amount: -price,
      description: `Renewal: ${product.promptTitle}`,
      date: new Date().toISOString(),
      status: 'completed'
    });

    // Extend expiry date
    const currentExpiry = product.expiryDate ? new Date(product.expiryDate) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    product.expiryDate = newExpiry.toISOString();
    product.status = 'active';

    saveToStorage();
    return true;
  };

  // Wallet methods
  const topUpWallet = (amount: number): boolean => {
    if (amount <= 0) return false;

    wallet.value.balance += amount;
    wallet.value.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'topup',
      amount,
      description: 'Wallet top-up',
      date: new Date().toISOString(),
      status: 'completed'
    });

    saveToStorage();
    return true;
  };

  // Check if user has purchased a specific prompt
  const hasPurchased = (promptId: string): boolean => {
    return purchasedProducts.value.some(
      p => p.promptId === promptId && (p.type === 'one-time' || p.status === 'active')
    );
  };

  return {
    // State
    currentUser,
    cartItems,
    purchasedProducts,
    wallet,
    
    // Computed
    isLoggedIn,
    cartCount,
    cartTotal,
    
    // Methods
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    clearCart,
    completePurchase,
    renewSubscription,
    topUpWallet,
    hasPurchased
  };
};