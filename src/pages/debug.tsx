'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'

export default function Debug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [socketStatus, setSocketStatus] = useState('Not connected')
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  useEffect(() => {
    try {
      // Get token
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setTokenInfo(payload)
          addLog('Token found and parsed successfully')
        } catch (e) {
          addLog(`Error parsing token: ${e}`)
          setError('Invalid token format')
        }
      } else {
        addLog('No token found in localStorage')
        setError('No token found')
      }

      // Get user
      const user = localStorage.getItem('user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          setUserInfo(userData)
          addLog('User data found and parsed successfully')
        } catch (e) {
          addLog(`Error parsing user data: ${e}`)
        }
      } else {
        addLog('No user data found in localStorage')
      }

      // Check socket connection
      addLog('Attempting to connect to socket...')
      const socket = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        timeout: 5000
      })

      socket.on('connect', () => {
        addLog(`Socket connected with ID: ${socket.id}`)
        setSocketStatus(`Connected (ID: ${socket.id})`)
      })

      socket.on('connect_error', (err: Error) => {
        addLog(`Socket connection error: ${err.message}`)
        setSocketStatus(`Error: ${err.message}`)
      })

      socket.on('disconnect', () => {
        addLog('Socket disconnected')
        setSocketStatus('Disconnected')
      })

      return () => {
        socket.disconnect()
      }
    } catch (e) {
      addLog(`General error: ${e}`)
      setError(`${e}`)
    }
  }, [])

  const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    addLog('Auth data cleared')
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Token Information</h2>
          {tokenInfo ? (
            <div>
              <p><strong>User ID:</strong> {tokenInfo.userId}</p>
              <p><strong>Email:</strong> {tokenInfo.email}</p>
              <p><strong>Subscription:</strong> {tokenInfo.subscriptionStatus}</p>
              <p><strong>Expires:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-red-600">No token information available</p>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">User Information</h2>
          {userInfo ? (
            <div>
              <p><strong>ID:</strong> {userInfo.id}</p>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Subscription:</strong> {userInfo.subscription?.status}</p>
            </div>
          ) : (
            <p className="text-red-600">No user information available</p>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Socket Status</h2>
          <p><strong>Status:</strong> {socketStatus}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Actions</h2>
          <div className="space-y-2">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={clearAuth}
            >
              Clear Auth Data
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
              onClick={() => router.push('/chatroom')}
            >
              Go to Chat
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Debug Logs</h2>
        <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
} 