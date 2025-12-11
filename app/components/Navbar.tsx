

// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { supabase } from '../utils/supabaseClient'
// import { 
//   BookOpen, 
//   Menu, 
//   X, 
//   LayoutDashboard, 
//   Mic, 
//   LogOut, 
//   User,
//   Home,
//   Sparkles,
//   ChevronDown
// } from 'lucide-react'

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [user, setUser] = useState<any>(null)
//   const [userMenuOpen, setUserMenuOpen] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setUser(user)
//     }
//     checkUser()

//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       if (event === 'SIGNED_OUT') {
//         setIsOpen(false)
//         setUserMenuOpen(false)
//         router.push('/')
//       }
//     })

//     return () => authListener.subscription.unsubscribe()
//   }, [router])

//   useEffect(() => {
//     setIsOpen(false)
//   }, [pathname])

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//   }

//   const navLinks = user 
//     ? [
//         { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//         { name: 'Oral Practice', href: '/oral-practice', icon: Mic },
//         { name: 'Planner', href: '/planner', icon: LayoutDashboard },
//       ]
//     : [
//         { name: 'Home', href: '/', icon: Home },
//         { name: 'Features', href: '/features', icon: Sparkles },
//         { name: 'Pricing', href: '/pricing', icon: BookOpen },
//       ]

//   return (
//     <nav className="sticky top-0 z-50 glass-panel border-b border-border/50 backdrop-blur-xl">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
          
//           {/* LOGO */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center gap-3 group">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
//                 <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-xl border border-white/10">
//                   <BookOpen className="w-6 h-6 text-primary" />
//                 </div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xl font-black text-gradient tracking-tight">SmartScholastic</span>
//                 <span className="text-xs text-muted-foreground font-medium">AI-Powered Learning</span>
//               </div>
//             </Link>
//           </div>

//           {/* DESKTOP MENU */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                   pathname === link.href 
//                     ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
//                     : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
//                 }`}
//               >
//                 <link.icon className="w-4 h-4" />
//                 {link.name}
//               </Link>
//             ))}

//             {user ? (
//               <div className="relative ml-4">
//                 <button
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-card to-card/80 border border-border hover:border-primary/30 transition-all group"
//                 >
//                   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
//                     <User className="w-4 h-4 text-primary" />
//                   </div>
//                   <div className="text-left">
//                     <div className="text-sm font-semibold text-foreground">Student</div>
//                     <div className="text-xs text-muted-foreground">{user.email?.split('@')[0]}</div>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {userMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl border border-border p-2 shadow-2xl">
//                     <div className="px-3 py-2 border-b border-border/50 mb-2">
//                       <div className="text-xs text-muted-foreground">Logged in as</div>
//                       <div className="text-sm font-medium truncate">{user.email}</div>
//                     </div>
                    
//                     <Link 
//                       href="/profile" 
//                       className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors"
//                     >
//                       <User className="w-4 h-4" />
//                       My Profile
//                     </Link>
                    
//                     <Link 
//                       href="/settings" 
//                       className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       Settings
//                     </Link>

//                     <div className="border-t border-border/50 mt-2 pt-2">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
//                       >
//                         <LogOut className="w-4 h-4" /> 
//                         Log Out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-3 ml-4">
//                 <Link
//                   href="/login"
//                   className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
//                 >
//                   Log In
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
//                 >
//                   Get Started
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* MOBILE HAMBURGER BUTTON */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
//             >
//               {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {isOpen && (
//         <div className="md:hidden glass-panel border-b border-border animate-in slide-in-from-top-2 duration-200">
//           <div className="container mx-auto px-4 pb-6">
//             {user && (
//               <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-border/50">
//                 <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
//                   <User className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-foreground">Student</p>
//                   <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
//                     pathname === link.href 
//                       ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
//                       : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
//                   }`}
//                 >
//                   <link.icon className="w-5 h-5" />
//                   {link.name}
//                 </Link>
//               ))}
//             </div>

//             <div className="pt-6 mt-6 border-t border-border/50">
//               {user ? (
//                 <div className="space-y-3">
//                   <Link
//                     href="/profile"
//                     className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     My Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-3 text-destructive bg-destructive/10 rounded-xl font-bold active:scale-95 transition-transform"
//                   >
//                     <LogOut className="w-5 h-5" /> 
//                     Log Out
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   <Link
//                     href="/login"
//                     className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors"
//                   >
//                     Log In
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="w-full btn-gradient py-3 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
//                   >
//                     <Sparkles className="w-5 h-5" />
//                     Get Started Free
//                   </Link>
//                 </div>
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
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
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

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }

    return () => authListener.subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

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
    <nav className="sticky top-0 z-50 glass-panel border-b border-border/50 backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-2 rounded-xl border border-white/10">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-transparent bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text tracking-tight">
                  SmartScholastic
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400 font-medium">AI-Powered Learning</span>
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
                    ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-500 border border-blue-500/20' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-300 transition-colors ml-2"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Student</div>
                    <div className="text-xs text-gray-600 dark:text-slate-400">{user.email?.split('@')[0]}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2 shadow-2xl">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-700/50 mb-2">
                      <div className="text-xs text-gray-500 dark:text-slate-400">Logged in as</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</div>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Settings
                    </Link>

                    <div className="border-t border-gray-200 dark:border-slate-700/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> 
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:scale-105 transition-transform"
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
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-blue-500/30 transition-all"
            >
              {isOpen ? <X className="w-6 h-6 text-gray-700 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 pb-6">
            {user && (
              <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Student</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 truncate max-w-[200px]">{user.email}</p>
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
                      ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-500 border border-blue-500/20' 
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700/50 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    Switch to Dark Mode
                  </>
                )}
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-slate-700/50">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700/50 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl font-bold active:scale-95 transition-transform"
                  >
                    <LogOut className="w-5 h-5" /> 
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700/50 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-500 py-3 rounded-xl font-bold text-white active:scale-95 transition-transform flex items-center justify-center gap-2"
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