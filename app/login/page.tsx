'use client'
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true)
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
        alert('Please fill in all fields')
        setLoading(false)
        return
    }

    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
      : await supabase.auth.signUp({ email: cleanEmail, password: cleanPassword })

    if (error) {
      alert(error.message)
    } else {
      if (type === 'SIGNUP') alert('Account created! Please Log In.')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold text-gray-800">SmartScholastic</span>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome Back 👋</h2>
        <p className="text-center text-gray-500 mb-8">Enter your details to access your planner.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              placeholder="student@school.com" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button 
            onClick={() => handleAuth('LOGIN')} 
            disabled={loading} 
            className="w-full bg-blue-600 text-white font-bold p-3 rounded-xl hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing...' : 'Log In'}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            onClick={() => handleAuth('SIGNUP')} 
            disabled={loading} 
            className="w-full bg-white text-gray-700 border border-gray-200 font-bold p-3 rounded-xl hover:bg-gray-50 transition"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  )
}