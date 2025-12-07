// 'use client'

// import { useEffect, useState } from 'react'
// import { supabase } from '../utils/supabaseClient'
// import { useRouter } from 'next/navigation'
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from "@fullcalendar/interaction"
// import listPlugin from '@fullcalendar/list' // Added for better mobile view
// import { 
//   CheckCircle2, 
//   Calendar as CalendarIcon, 
//   LogOut, 
//   ListTodo,
//   Trophy,
//   Menu,
//   Bell,
//   Search
// } from 'lucide-react'

// // Types
// type Event = {
//   id: number
//   title: string
//   event_date: string
//   type: 'test' | 'holiday' | 'homework'
//   items_to_carry: string[] | null
// }

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<'CALENDAR' | 'CHECKLIST'>('CALENDAR')
//   const [events, setEvents] = useState<Event[]>([])
//   const [loading, setLoading] = useState(true)
//   const [completedCount, setCompletedCount] = useState(0)
//   const [isMobile, setIsMobile] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     // Check screen size for responsive calendar view
//     const handleResize = () => setIsMobile(window.innerWidth < 768)
//     handleResize() // Initial check
//     window.addEventListener('resize', handleResize)

//     const fetchData = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         router.push('/login')
//         return
//       }

//       const { data } = await supabase
//         .from('events')
//         .select('*')
//         .eq('class_id', '9-A')
//         .order('event_date', { ascending: true })
      
//       if (data) {
//         setEvents(data)
//         setCompletedCount(Math.floor(data.length * 0.2)) 
//       }
//       setLoading(false)
//     }

//     fetchData()
//     return () => window.removeEventListener('resize', handleResize)
//   }, [router])

//   // UI Helper: Toggle Checkbox
//   const toggleTask = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) setCompletedCount(prev => prev + 1)
//     else setCompletedCount(prev => prev - 1)
//   }

//   // --- PASTEL COLOR LOGIC ---
//   const getEventColor = (type: string) => {
//     switch(type) {
//       case 'test': return '#f87171' // Pastel Red
//       case 'holiday': return '#34d399' // Pastel Emerald
//       default: return '#818cf8' // Pastel Indigo
//     }
//   }

//   const calendarEvents = events.map(event => ({
//     title: event.title,
//     date: event.event_date,
//     backgroundColor: getEventColor(event.type),
//     borderColor: 'transparent',
//     textColor: '#ffffff',
//     className: 'text-xs font-medium px-1 rounded shadow-sm' 
//   }))

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <div className="animate-pulse flex flex-col items-center">
//         <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
//         <div className="h-2 w-24 bg-slate-200 rounded"></div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
   
//       {/* 2. OVERLAPPING TABS CONTAINER */}
//       <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 -mt-10 relative z-20 pb-10 mt-5">
        
//         {/* Tab Buttons */}
//         <div className="flex items-end space-x-1 sm:space-x-2 ml-2 sm:ml-4 overflow-x-auto no-scrollbar">
//             <button
//               onClick={() => setActiveTab('CALENDAR')}
//               className={`
//                 relative px-6 sm:px-8 py-3 rounded-t-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
//                 ${activeTab === 'CALENDAR' 
//                   ? 'bg-white text-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 translate-y-[1px]' 
//                   : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm'
//                 }
//               `}
//             >
//               <CalendarIcon className="w-4 h-4" />
//               Schedule
//             </button>

//             <button
//               onClick={() => setActiveTab('CHECKLIST')}
//               className={`
//                 relative px-6 sm:px-8 py-3 rounded-t-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
//                 ${activeTab === 'CHECKLIST' 
//                   ? 'bg-white text-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 translate-y-[1px]' 
//                   : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm'
//                 }
//               `}
//             >
//               <ListTodo className="w-4 h-4" />
//               Checklist
//             </button>
//         </div>

//         {/* 3. MAIN WHITE CARD CONTENT */}
//         <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl min-h-[500px] border border-slate-100 overflow-hidden">
           
//            {/* === VIEW: CALENDAR === */}
//            {activeTab === 'CALENDAR' && (
//              <div className="p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
               
//                {/* Calendar Header/Legend */}
//                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                  <div>
//                     <h2 className="text-2xl font-bold text-slate-800">Academic Calendar</h2>
//                     <p className="text-slate-500 text-sm">Tap on events to see details</p>
//                  </div>
//                  <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
//                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span> Holiday</span>
//                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span> Test</span>
//                     <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]"></span> Class</span>
//                  </div>
//                </div>

//                {/* CSS Overrides for nicer FullCalendar styling */}
//                <style jsx global>{`
//                  .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
//                  .fc-col-header-cell-cushion { padding: 12px 0; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; }
//                  .fc-daygrid-day-number { color: #475569; font-weight: 500; margin: 4px 8px; }
//                  .fc-day-today { background-color: #f8fafc !important; }
//                  .fc-event { border: none; padding: 2px 4px; transition: transform 0.1s; }
//                  .fc-event:hover { transform: scale(1.02); }
//                  .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 700; color: #334155; }
//                  .fc-button-primary { background-color: #fff !important; color: #475569 !important; border: 1px solid #e2e8f0 !important; font-weight: 600; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
//                  .fc-button-primary:hover { background-color: #f8fafc !important; color: #1e293b !important; }
//                  .fc-button-active { background-color: #f1f5f9 !important; color: #3b82f6 !important; border-color: #cbd5e1 !important; }
//                `}</style>
               
//                <div className="calendar-container">
//                  <FullCalendar
//                    plugins={[dayGridPlugin, interactionPlugin, listPlugin]} // listPlugin helps on mobile
//                    initialView={isMobile ? "listWeek" : "dayGridMonth"} // Switch view based on screen size
//                    events={calendarEvents}
//                    height="auto"
//                    headerToolbar={{
//                      left: 'title',
//                      center: '',
//                      right: 'prev,next' // Simplified toolbar for mobile
//                    }}
//                  />
//                </div>
//              </div>
//            )}

//            {/* === VIEW: CHECKLIST === */}
//            {activeTab === 'CHECKLIST' && (
//              <div className="flex flex-col md:flex-row h-full min-h-[600px] animate-in fade-in slide-in-from-left-4 duration-300">
                
//                 {/* Sidebar (Progress) - Stacks on top on mobile */}
//                 <div className="w-full md:w-80 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 p-6">
//                    <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
//                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Daily Progress</p>
                      
//                       <div className="flex items-end gap-2 mb-2">
//                         <span className="text-3xl font-black text-slate-800">{completedCount}</span>
//                         <span className="text-sm text-slate-500 font-medium mb-1.5">/ {events.length} Tasks</span>
//                       </div>

//                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
//                         <div 
//                           className="bg-indigo-500 h-full transition-all duration-700 ease-out rounded-full" 
//                           style={{ width: `${(completedCount / events.length) * 100}%` }}
//                         ></div>
//                       </div>
//                    </div>

//                    <div className="hidden md:block space-y-2">
//                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Quick Filters</p>
//                       <button className="w-full text-left px-4 py-2.5 rounded-xl bg-white text-indigo-600 font-bold text-sm shadow-sm border border-slate-100 ring-1 ring-indigo-50">All Tasks</button>
//                       <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white text-slate-500 font-medium text-sm transition">Homework Only</button>
//                       <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white text-slate-500 font-medium text-sm transition">To Pack</button>
//                    </div>
//                 </div>

//                 {/* Main List */}
//                 <div className="flex-1 p-4 sm:p-8 bg-white">
//                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
//                       <div className="bg-indigo-100 p-2 rounded-lg">
//                         <ListTodo className="w-5 h-5 text-indigo-600"/>
//                       </div>
//                       To-Do List
//                    </h2>

//                    <div className="space-y-3">
//                       {events.length === 0 && (
//                         <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-100">
//                            <p>No tasks found. Enjoy your day! 🌟</p>
//                         </div>
//                       )}

//                       {events.map((event) => (
//                         <label 
//                           key={event.id} 
//                           className="group flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer bg-white active:scale-[0.99]"
//                         >
//                            <div className="flex items-start gap-3 w-full">
//                                <div className="relative pt-1">
//                                   <input 
//                                     type="checkbox" 
//                                     onChange={toggleTask}
//                                     className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 checked:bg-indigo-500 checked:border-indigo-500 transition-all"
//                                   />
//                                   <CheckCircle2 className="pointer-events-none absolute left-0 top-1 h-6 w-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" />
//                                </div>

//                                <div className="flex-1 min-w-0">
//                                   <div className="flex justify-between items-start gap-2">
//                                      <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate pr-2">
//                                         {event.title}
//                                      </p>
//                                      <span className={`flex-shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
//                                         event.type === 'test' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
//                                      }`}>
//                                         {event.type}
//                                      </span>
//                                   </div>
//                                   <p className="text-xs text-slate-400 mt-1 font-medium">Due: {new Date(event.event_date).toLocaleDateString()}</p>
                                  
//                                   {/* Mobile-Friendly "To Pack" Section */}
//                                   {event.items_to_carry && event.items_to_carry.length > 0 && (
//                                     <div className="mt-3 pt-3 border-t border-slate-50">
//                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
//                                           <BackpackIconSmall /> To Pack:
//                                        </p>
//                                        <div className="flex flex-wrap gap-2">
//                                           {event.items_to_carry.map((item, i) => (
//                                              <span key={i} className="text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-medium">
//                                                 {item}
//                                              </span>
//                                           ))}
//                                        </div>
//                                     </div>
//                                   )}
//                                </div>
//                            </div>
//                         </label>
//                       ))}
//                    </div>
//                 </div>

//              </div>
//            )}

//         </div>
//       </main>
//     </div>
//   )
// }

// // Small helper component for the backpack icon to keep code clean
// function BackpackIconSmall() {
//   return (
//     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//     </svg>
//   )
// }




'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from '@fullcalendar/list'
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ListTodo,
  Trophy,
  Bell,
  Search,
  CheckSquare,
  Target,
  TrendingUp,
  Package
} from 'lucide-react'

// Types
type Event = {
  id: number
  title: string
  event_date: string
  type: 'test' | 'holiday' | 'homework'
  items_to_carry: string[] | null
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'CALENDAR' | 'CHECKLIST'>('CALENDAR')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('class_id', '9-A')
        .order('event_date', { ascending: true })
      
      if (data) {
        setEvents(data)
        setCompletedCount(Math.floor(data.length * 0.2)) 
      }
      setLoading(false)
    }

    fetchData()
    return () => window.removeEventListener('resize', handleResize)
  }, [router])

  const toggleTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setCompletedCount(prev => prev + 1)
    else setCompletedCount(prev => prev - 1)
  }

  // Theme-based event colors
  const getEventColor = (type: string) => {
    switch(type) {
      case 'test': return 'var(--color-destructive)' // Red for tests
      case 'holiday': return 'var(--color-success)' // Green for holidays
      default: return 'var(--color-primary)' // Primary for homework
    }
  }

  const calendarEvents = events.map(event => ({
    title: event.title,
    date: event.event_date,
    backgroundColor: getEventColor(event.type),
    borderColor: 'transparent',
    textColor: '#ffffff',
    className: 'text-xs font-medium px-1 rounded shadow-sm' 
  }))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/30 to-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-48 bg-muted rounded mb-2"></div>
          <div className="h-2 w-32 bg-muted rounded"></div>
        </div>
        <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card/30 to-background">
      
      {/* Header Section */}
      <div className="relative overflow-hidden pt-6 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                Welcome back,{' '}
                <span className="text-gradient">Student</span>
              </h1>
              <p className="text-muted-foreground">
                Track your schedule and manage your tasks in one place
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Progress:</span>
                <span className="text-gradient font-bold">
                  {Math.round((completedCount / events.length) * 100)}%
                </span>
              </div>
              
              <div className="glass-panel px-4 py-2 rounded-xl border border-border">
                <div className="text-sm font-semibold">Class 9-A</div>
                <div className="text-xs text-muted-foreground">Academic Year 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 -mt-10 relative z-20 pb-10">
        
        {/* Tab Buttons */}
        <div className="flex items-end space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('CALENDAR')}
            className={`
              relative px-6 sm:px-8 py-3 rounded-t-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'CALENDAR' 
                ? 'glass-panel text-foreground shadow-xl z-10 translate-y-[1px] border-b-0' 
                : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card/80 backdrop-blur-sm border border-border/50'
              }
            `}
          >
            <CalendarIcon className="w-4 h-4" />
            Schedule
          </button>

          <button
            onClick={() => setActiveTab('CHECKLIST')}
            className={`
              relative px-6 sm:px-8 py-3 rounded-t-2xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
              ${activeTab === 'CHECKLIST' 
                ? 'glass-panel text-foreground shadow-xl z-10 translate-y-[1px] border-b-0' 
                : 'bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card/80 backdrop-blur-sm border border-border/50'
              }
            `}
          >
            <ListTodo className="w-4 h-4" />
            Checklist
          </button>
        </div>

        {/* Main Card Content */}
        <div className="glass-panel rounded-b-2xl rounded-tr-2xl min-h-[500px] overflow-hidden">
           
           {/* CALENDAR VIEW */}
           {activeTab === 'CALENDAR' && (
             <div className="p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
               
               {/* Calendar Header/Legend */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <div>
                    <h2 className="text-2xl font-bold mb-1">Academic Calendar</h2>
                    <p className="text-muted-foreground text-sm">Tap on events to see details</p>
                 </div>
                 <div className="flex flex-wrap gap-3 text-xs font-medium glass-panel px-4 py-2 rounded-xl border border-border">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-success"></span> Holiday
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-destructive"></span> Test
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Class
                    </span>
                 </div>
               </div>

               {/* Calendar CSS Overrides */}
               <style jsx global>{`
                 .fc-theme-standard td, .fc-theme-standard th { border-color: var(--color-border); }
                 .fc-col-header-cell-cushion { 
                   padding: 12px 0; 
                   color: var(--color-muted-foreground); 
                   font-weight: 600; 
                   text-transform: uppercase; 
                   font-size: 0.7rem; 
                   letter-spacing: 0.05em; 
                 }
                 .fc-daygrid-day-number { 
                   color: var(--color-foreground); 
                   font-weight: 500; 
                   margin: 4px 8px; 
                 }
                 .fc-day-today { 
                   background-color: var(--color-primary)/10 !important; 
                 }
                 .fc-event { 
                   border: none; 
                   padding: 2px 4px; 
                   transition: transform 0.1s; 
                 }
                 .fc-event:hover { 
                   transform: scale(1.02); 
                   box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                 }
                 .fc-toolbar-title { 
                   font-size: 1.1rem !important; 
                   font-weight: 700; 
                   color: var(--color-foreground); 
                 }
                 .fc-button-primary { 
                   background-color: var(--color-card) !important; 
                   color: var(--color-foreground) !important; 
                   border: 1px solid var(--color-border) !important; 
                   font-weight: 600; 
                 }
                 .fc-button-primary:hover { 
                   background-color: var(--color-muted) !important; 
                 }
                 .fc-button-active { 
                   background-color: var(--color-primary)/20 !important; 
                   color: var(--color-primary) !important; 
                   border-color: var(--color-primary)/30 !important; 
                 }
                 .fc-view { 
                   background: var(--color-card); 
                   border-radius: 12px; 
                   padding: 16px; 
                 }
               `}</style>
               
               <div className="calendar-container">
                 <FullCalendar
                   plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                   initialView={isMobile ? "listWeek" : "dayGridMonth"}
                   events={calendarEvents}
                   height="auto"
                   headerToolbar={{
                     left: 'title',
                     center: '',
                     right: 'prev,next'
                   }}
                 />
               </div>
             </div>
           )}

           {/* CHECKLIST VIEW */}
           {activeTab === 'CHECKLIST' && (
             <div className="flex flex-col md:flex-row h-full min-h-[600px] animate-in fade-in slide-in-from-left-4 duration-300">
                
                {/* Sidebar - Progress */}
                <div className="w-full md:w-80 bg-card/50 border-b md:border-b-0 md:border-r border-border/50 p-6">
                   <div className="glass-panel p-6 rounded-xl border border-border mb-6">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Daily Progress</p>
                      
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-3xl font-black gradient-text">{completedCount}</span>
                        <span className="text-sm text-muted-foreground font-medium mb-1.5">/ {events.length} Tasks</span>
                      </div>

                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-700 ease-out rounded-full" 
                          style={{ width: `${(completedCount / events.length) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {Math.round((completedCount / events.length) * 100)}% complete
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Quick Filters</p>
                      <button className="w-full text-left px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold text-sm border border-primary/20">
                        <CheckSquare className="inline w-4 h-4 mr-2" />
                        All Tasks
                      </button>
                      <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-all">
                        <Target className="inline w-4 h-4 mr-2" />
                        Homework Only
                      </button>
                      <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-all">
                        <Package className="inline w-4 h-4 mr-2" />
                        To Pack
                      </button>
                   </div>
                </div>

                {/* Main List */}
                <div className="flex-1 p-4 sm:p-8">
                   <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-xl border border-primary/20">
                        <ListTodo className="w-6 h-6 text-primary"/>
                      </div>
                      To-Do List
                   </h2>

                   <div className="space-y-3">
                      {events.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground glass-panel rounded-2xl border-dashed border-2 border-border/50">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No tasks found. Enjoy your day! 🌟</p>
                        </div>
                      )}

                      {events.map((event) => (
                        <label 
                          key={event.id} 
                          className="group glass-panel p-4 rounded-xl border border-border hover:border-primary/30 hover:glow-effect transition-all cursor-pointer active:scale-[0.99]"
                        >
                           <div className="flex items-start gap-4">
                               <div className="relative pt-1">
                                  <input 
                                    type="checkbox" 
                                    onChange={toggleTask}
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-muted-foreground/30 checked:bg-gradient-to-r checked:from-primary checked:to-secondary checked:border-transparent transition-all"
                                  />
                                  <CheckCircle2 className="pointer-events-none absolute left-0 top-1 h-6 w-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" />
                               </div>

                               <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                     <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                        {event.title}
                                     </p>
                                     <span className={`flex-shrink-0 text-xs uppercase font-bold px-3 py-1 rounded-lg ${
                                        event.type === 'test' 
                                          ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                                          : event.type === 'holiday'
                                          ? 'bg-success/10 text-success border border-success/20'
                                          : 'bg-primary/10 text-primary border border-primary/20'
                                     }`}>
                                        {event.type}
                                     </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                                    Due: {new Date(event.event_date).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                  
                                  {event.items_to_carry && event.items_to_carry.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-border/30">
                                       <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-2">
                                          <Package className="w-4 h-4" />
                                          Items to Pack:
                                       </p>
                                       <div className="flex flex-wrap gap-2">
                                          {event.items_to_carry.map((item, i) => (
                                             <span key={i} className="text-sm bg-muted/50 px-3 py-2 rounded-lg border border-border text-foreground font-medium">
                                                {item}
                                             </span>
                                          ))}
                                       </div>
                                    </div>
                                  )}
                               </div>
                           </div>
                        </label>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
      </main>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: "Tasks Completed", 
              value: completedCount, 
              icon: CheckCircle2,
              color: "from-green-500 to-emerald-500"
            },
            { 
              label: "Upcoming Tests", 
              value: events.filter(e => e.type === 'test').length,
              icon: Target,
              color: "from-red-500 to-rose-500"
            },
            { 
              label: "Holidays", 
              value: events.filter(e => e.type === 'holiday').length,
              icon: Trophy,
              color: "from-blue-500 to-cyan-500"
            },
            { 
              label: "Active Streak", 
              value: "7 days",
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500"
            }
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-border">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}