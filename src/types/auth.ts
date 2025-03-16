export interface User {
    id: string
    email: string
    name: string | null
    hasActiveSubscription: boolean
    subscriptionStatus?: 'active' | 'canceled' | 'past_due' | null
    subscriptionId?: string | null
  }
  
  export interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
  }
  
  