"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('') // ✅ объявлено
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }), // ✅ используется
    })

    const data = await res.json()
    if (data.success) {
      localStorage.setItem('adminToken', data.token)
      router.push('/admin/newsletter')
    } else {
      alert('❌ Wrong password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-accent/20 p-8 rounded-xl border border-border max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded mb-4"
          placeholder="Enter password"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-neon text-background font-bold py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  )
}