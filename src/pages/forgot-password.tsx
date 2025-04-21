'use client'

import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    setDebugInfo(null)

    console.log('Submitting forgot password form with email:', email)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      console.log('Response status:', response.status)
      
      let data
      try {
        data = await response.json()
        console.log('Response data:', data)
        
        // Store debug info if available
        if (data.debug) {
          setDebugInfo(data.debug)
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        setError('Failed to parse server response. Please try again.')
        setIsLoading(false)
        return
      }

      if (response.ok && data.success) {
        setSuccessMessage('If an account with that email exists, a password reset link has been sent.')
        setEmail('') // Clear the form
      } else {
        setError(data.message || 'An error occurred. Please try again.')
      }
    } catch (err) {
      console.error('Forgot password error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  return (
    <>
      <Head>
        <title>Trading Academy | Forgot Password</title>
        <meta name="description" content="Reset your Trading Academy password" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-black relative rounded-xl p-8 border border-white/[0.2] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Reset your password
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB9006] focus:border-transparent transition-all duration-200"
                  placeholder="Email Address"
                />
              </div>

              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 rounded-lg text-base font-medium text-white bg-[#CB9006] hover:bg-[#B07D05] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CB9006] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>

            {/* Debug section - only for development */}
            {debugInfo && (
              <div className="mt-8 border-t border-white/10 pt-4">
                <button 
                  onClick={toggleDebug}
                  className="text-xs text-gray-400 hover:text-[#CB9006] transition-colors"
                >
                  {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                </button>
                
                {showDebug && (
                  <div className="mt-4 p-4 bg-gray-900 rounded-lg text-xs font-mono">
                    <div className="text-[#CB9006] mb-2">DEBUG INFO - REMOVE IN PRODUCTION</div>
                    {debugInfo.resetUrl && (
                      <div>
                        <div className="text-green-400 mb-1">Reset URL:</div>
                        <div className="text-white break-all mb-3">
                          <a 
                            href={debugInfo.resetUrl} 
                            className="text-blue-400 hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {debugInfo.resetUrl}
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="text-green-400 mb-1">Raw Debug Data:</div>
                    <pre className="text-white overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
                  </div>
                )}
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