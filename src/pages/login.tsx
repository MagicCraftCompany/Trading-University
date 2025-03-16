'use client'

import { SignIn } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn afterSignInUrl="/" routing="hash" />
    </div>
  )
}