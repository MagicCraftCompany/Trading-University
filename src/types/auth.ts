export type AuthProvider = 'EMAIL' | 'GOOGLE';

export interface User {
    id: string
    email: string
    name: string | null
    image: string | null
    authProvider: AuthProvider
    subscription?: {
        status: 'FREE' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
        currentPeriodEnd: string | null
    }
}

export interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
    name?: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface GoogleAuthResponse {
    credential: string
}
  
  