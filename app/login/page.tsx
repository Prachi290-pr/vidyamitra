// Location: app/login/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient' // Make sure this path is correct!
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true)
    
    // THE FIX: .trim() removes spaces so you don't get errors
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
      : await supabase.auth.signUp({ email: cleanEmail, password: cleanPassword })

    if (error) {
      alert(error.message)
    } else {
      if (type === 'SIGNUP') alert('Account created! Now log in.')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Student Login 📚</h1>
        <input 
          className="w-full border p-2 mb-2 rounded" 
          placeholder="Email" 
          value={email} // Controlled input
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="w-full border p-2 mb-4 rounded" 
          type="password" 
          placeholder="Password" 
          value={password} // Controlled input
          onChange={e => setPassword(e.target.value)} 
        />
        <button onClick={() => handleAuth('LOGIN')} disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded mb-2">
          {loading ? '...' : 'Log In'}
        </button>
        <button onClick={() => handleAuth('SIGNUP')} disabled={loading} className="w-full bg-gray-200 text-black p-2 rounded">
          Sign Up
        </button>
      </div>
    </div>
  )
}