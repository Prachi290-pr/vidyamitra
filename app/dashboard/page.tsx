'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  LogOut, 
  Flame, 
  Trophy, 
  Backpack, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react'

// Define our data types
type Event = {
  id: number
  title: string
  event_date: string
  type: string
  items_to_carry: string[] | null
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'TASKS' | 'BACKPACK'>('TASKS')
  const [completedCount, setCompletedCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch Class 9-A events
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('class_id', '9-A')
        .order('event_date', { ascending: true })
      
      if (data) setEvents(data)
      setLoading(false)
    }

    fetchData()
  }, [router])

  // Simple logic to count checked items (simulated for UI)
  const toggleItem = (e: any) => {
    if (e.target.checked) setCompletedCount(prev => prev + 1)
    else setCompletedCount(prev => prev - 1)
  }

  // Calculate total tasks for the Progress Bar
  const totalTasks = events.filter(e => e.type !== 'holiday').length

  const calendarEvents = events.map(event => ({
    title: event.title,
    date: event.event_date,
    color: event.type === 'test' ? '#ef4444' : event.type === 'holiday' ? '#10b981' : '#3b82f6'
  }))

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-blue-600 font-semibold animate-pulse">Loading your planner...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-blue-200 shadow-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">SmartScholastic</h1>
              <p className="text-xs text-gray-500 font-medium">Class 9-A • Student Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification Badge: Streak */}
            <div className="hidden md:flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span className="text-sm font-bold">5 Days</span>
            </div>

            {/* Gamification Badge: Level */}
            <div className="hidden md:flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-100 shadow-sm">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold">Lvl 2</span>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="group flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <span className="text-sm font-medium hidden md:block group-hover:translate-x-1 transition-transform">Log Out</span>
              <LogOut className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Calendar (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">School Schedule</h2>
                  <p className="text-gray-500 text-sm mt-1">Upcoming tests and holidays</p>
                </div>
                
                {/* Legend */}
                <div className="flex gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Test
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg border border-green-100">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Holiday
                    </span>
                </div>
             </div>

            {/* FullCalendar Component */}
            <div className="calendar-modern-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    height="auto"
                    headerToolbar={{
                      left: 'title',
                      center: '',
                      right: 'prev,next today'
                    }}
                    dayCellClassNames="hover:bg-blue-50 transition-colors cursor-pointer"
                />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The "Smart List" (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            
            {/* Header with Progress */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">Daily Plan</h2>
                  <p className="text-blue-100 text-sm">You've completed {completedCount} tasks today!</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-500 ease-out"
                  style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* TABS SWITCHER */}
            <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
              <button 
                onClick={() => setActiveTab('TASKS')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'TASKS' 
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <CheckSquare className="w-4 h-4"/> Homework
              </button>
              <button 
                onClick={() => setActiveTab('BACKPACK')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'BACKPACK' 
                    ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Backpack className="w-4 h-4"/> To Pack
              </button>
            </div>

            {/* SCROLLABLE LIST AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              
              {/* === TAB 1: HOMEWORK TASKS === */}
              {activeTab === 'TASKS' && (
                <div className="space-y-3">
                  {events.filter(e => e.type !== 'holiday').length === 0 && (
                     <div className="text-center py-10 opacity-50">
                       <p>No homework assigned!</p>
                     </div>
                  )}

                  {events.map((event) => (
                    event.type !== 'holiday' && (
                      <label key={event.id} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            onChange={toggleItem}
                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400"
                          />
                          <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.type.toUpperCase()} • Due {new Date(event.event_date).toLocaleDateString()}</p>
                        </div>
                      </label>
                    )
                  ))}
                </div>
              )}

              {/* === TAB 2: BACKPACK (THINGS TO CARRY) === */}
              {activeTab === 'BACKPACK' && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl mb-4">
                    <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Teacher's Note</p>
                    <p className="text-sm text-yellow-800">"Please ensure all geometry instruments are sharp."</p>
                  </div>

                  {events.map((event) => (
                    event.items_to_carry && event.items_to_carry.length > 0 && (
                      <div key={event.id} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                         <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3">For {event.title}</h4>
                         <div className="space-y-2">
                           {event.items_to_carry.map((item, i) => (
                             <label key={i} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm cursor-pointer hover:bg-indigo-50 transition">
                                <input type="checkbox" className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
                                <span className="text-sm font-medium text-gray-700">{item}</span>
                             </label>
                           ))}
                         </div>
                      </div>
                    )
                  ))}
                  
                   {/* Fallback if list is empty */}
                   {events.every(e => !e.items_to_carry) && (
                      <div className="text-center py-10 opacity-50">
                        <Backpack className="w-12 h-12 mx-auto mb-2 text-gray-300"/>
                        <p>Bag is light today! Nothing extra to carry.</p>
                      </div>
                   )}
                </div>
              )}

            </div>
          </div>

          {/* Leaderboard Mini Widget */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2.5 rounded-full text-yellow-700">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Class Rank</p>
                  <p className="text-xs text-gray-500">Top 10%</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-xl font-black text-gray-800">#4</p>
                <p className="text-[10px] text-green-500 font-bold">▲ 2 spots</p>
             </div>
          </div>

        </div>

      </main>
    </div>
  )
}