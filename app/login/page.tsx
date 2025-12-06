'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import { Smartphone, ArrowRight, Loader2, KeyRound, ShieldCheck } from 'lucide-react'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Auto-format: Add +91 if missing (Common for Indian numbers)
    let formattedPhone = phone.trim()
    // Remove any spaces or dashes user might have typed
    formattedPhone = formattedPhone.replace(/\s+/g, '').replace(/-/g, '')
    
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    })

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
    } else {
      setStep('OTP') // Move to next screen
      setLoading(false)
    }
  }

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let formattedPhone = phone.trim().replace(/\s+/g, '').replace(/-/g, '')
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms',
    })

    if (error) {
      alert('Invalid OTP. Please try again.')
      setLoading(false)
    } else {
      router.push('/dashboard') // Login Success!
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header Visual */}
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            {step === 'PHONE' ? <Smartphone className="text-white w-7 h-7" /> : <ShieldCheck className="text-white w-7 h-7" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {step === 'PHONE' ? 'Student Login' : 'Verify Identity'}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {step === 'PHONE' 
              ? 'Enter your mobile number to access your dashboard' 
              : `We sent a 6-digit code to +91 ${phone}`
            }
          </p>
        </div>

        {/* STEP 1: PHONE INPUT */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-slate-400 font-medium group-focus-within:text-indigo-500 transition-colors">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium text-lg text-slate-800 placeholder:text-slate-300 transition-all"
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get OTP <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        )}

        {/* STEP 2: OTP INPUT */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">One-Time Password</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-bold text-2xl text-center tracking-[0.5em] text-slate-800 transition-all"
                placeholder="••••••"
                maxLength={6}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('PHONE'); setOtp(''); }}
              className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 transition flex items-center justify-center gap-1"
            >
              Wrong number? <span className="underline">Go back</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">Powered by SmartScholastic Secure Auth</p>
        </div>

      </div>
    </div>
  )
}