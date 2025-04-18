'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!router.isReady) return
    
    const { token } = router.query
    if (token && typeof token === 'string') {
      setToken(token)
    } else {
      setError('Invalid or missing reset token')
    }
  }, [router.isReady, router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage('Password has been reset successfully.')
        // Clear the form
        setPassword('')
        setConfirmPassword('')
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.message || 'An error occurred. Please try again.')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Trading Academy | Reset Password</title>
        <meta name="description" content="Reset your Trading Academy password" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-black relative rounded-xl p-8 border border-white/[0.2] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Set new password
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Enter your new password below.
            </p>
            
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            {token ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="w-full">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent transition-all duration-200"
                    placeholder="New Password"
                  />
                </div>
                
                <div className="w-full">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent transition-all duration-200"
                    placeholder="Confirm New Password"
                  />
                </div>

                <div className="w-full">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 rounded-lg text-base font-medium text-white bg-[#CB9006] hover:bg-[#B07D05] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB9006] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center text-gray-400">
                Invalid reset link. Please try requesting a new password reset.
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-[#CB9006] hover:text-[#B07D05] text-sm transition-colors">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 