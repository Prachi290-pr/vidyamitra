// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { supabase } from '../utils/supabaseClient' // Adjust path if needed
// import { 
//   BookOpen, 
//   Menu, 
//   X, 
//   LayoutDashboard, 
//   Mic, 
//   LogOut, 
//   User,
//   Home
// } from 'lucide-react'

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false) // Mobile menu state
//   const [user, setUser] = useState<any>(null)
//   const pathname = usePathname()
//   const router = useRouter()

//   // 1. Check Auth State on Load
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setUser(user)
//     }
//     checkUser()

//     // Listen for login/logout events automatically
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       if (event === 'SIGNED_OUT') {
//         setIsOpen(false)
//         router.push('/')
//       }
//     })

//     return () => authListener.subscription.unsubscribe()
//   }, [router])

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsOpen(false)
//   }, [pathname])

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//   }

//   // Define Links based on auth state
//   const navLinks = user 
//     ? [
//         { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//         { name: 'Oral Practice', href: '/oral-practice', icon: Mic },
//       ]
//     : [
//         { name: 'Home', href: '/', icon: Home },
//       ]

//   return (
//     <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
          
//           {/* LOGO */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="bg-indigo-600 p-1.5 rounded-lg">
//                 <BookOpen className="text-white w-6 h-6" />
//               </div>
//               <span className="text-xl font-bold text-slate-800 tracking-tight">SmartScholastic</span>
//             </Link>
//           </div>

//           {/* DESKTOP MENU (Hidden on Mobile) */}
//           <div className="hidden md:flex items-center space-x-4">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   pathname === link.href 
//                     ? 'bg-indigo-50 text-indigo-700' 
//                     : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//                 }`}
//               >
//                 <link.icon className="w-4 h-4" />
//                 {link.name}
//               </Link>
//             ))}

//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="ml-4 px-4 py-2 text-sm font-bold text-red-600 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
//               >
//                 <LogOut className="w-4 h-4" /> Log Out
//               </button>
//             ) : (
//               <Link
//                 href="/login"
//                 className="ml-4 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
//               >
//                 Log In
//               </Link>
//             )}
//           </div>

//           {/* MOBILE HAMBURGER BUTTON */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
//             >
//               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE MENU (Slide Down) */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top-2 duration-200">
//           <div className="px-4 pt-2 pb-6 space-y-2">
//             {user && (
//               <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-slate-100">
//                 <div className="bg-indigo-100 p-2 rounded-full">
//                   <User className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-800">Student</p>
//                   <p className="text-xs text-slate-500">{user.email}</p>
//                 </div>
//               </div>
//             )}

//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
//                   pathname === link.href 
//                     ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
//                     : 'text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 <link.icon className="w-5 h-5" />
//                 {link.name}
//               </Link>
//             ))}

//             <div className="pt-4 mt-4 border-t border-slate-100">
//               {user ? (
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-bold active:scale-95 transition"
//                 >
//                   <LogOut className="w-5 h-5" /> Log Out
//                 </button>
//               ) : (
//                 <Link
//                   href="/login"
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold shadow-lg active:scale-95 transition"
//                 >
//                   Log In Now
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }




'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import { 
  BookOpen, 
  Menu, 
  X, 
  LayoutDashboard, 
  Mic, 
  LogOut, 
  User,
  Home,
  Sparkles,
  ChevronDown
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') {
        setIsOpen(false)
        setUserMenuOpen(false)
        router.push('/')
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navLinks = user 
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Oral Practice', href: '/oral-practice', icon: Mic },
        { name: 'Planner', href: '/planner', icon: LayoutDashboard },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Features', href: '/features', icon: Sparkles },
        { name: 'Pricing', href: '/pricing', icon: BookOpen },
      ]

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-xl border border-white/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gradient tracking-tight">SmartScholastic</span>
                <span className="text-xs text-muted-foreground font-medium">AI-Powered Learning</span>
              </div>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  pathname === link.href 
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-card to-card/80 border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-foreground">Student</div>
                    <div className="text-xs text-muted-foreground">{user.email?.split('@')[0]}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl border border-border p-2 shadow-2xl">
                    <div className="px-3 py-2 border-b border-border/50 mb-2">
                      <div className="text-xs text-muted-foreground">Logged in as</div>
                      <div className="text-sm font-medium truncate">{user.email}</div>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="border-t border-border/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> 
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 pb-6">
            {user && (
              <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-border/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Student</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === link.href 
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-border/50">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-destructive bg-destructive/10 rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    <LogOut className="w-5 h-5" /> 
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full btn-gradient py-3 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}