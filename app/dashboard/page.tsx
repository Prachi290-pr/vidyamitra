'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CheckSquare, Calendar as CalendarIcon, LogOut } from 'lucide-react'

// Define what an Event looks like
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
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 2. Get Events for Class 9-A
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('class_id', '9-A') // We are hardcoding Class 9-A for now
      
      if (error) console.error('Error fetching events:', error)
      if (data) setEvents(data)
      setLoading(false)
    }

    fetchData()
  }, [router])

  // Convert DB data to Calendar format
  const calendarEvents = events.map(event => ({
    title: event.title,
    date: event.event_date,
    color: event.type === 'test' ? '#ef4444' : event.type === 'holiday' ? '#22c55e' : '#3b82f6'
  }))

  if (loading) return <div className="p-10 text-center">Loading your planner...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-blue-600"/> 
            Student Planner
          </h1>
          <p className="text-gray-500 mt-1">Class 9-A • Welcome back!</p>
        </div>
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          <LogOut className="w-4 h-4"/> Log Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE: CALENDAR */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="auto"
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'today prev,next'
            }}
          />
        </div>

        {/* RIGHT SIDE: CHECKLIST */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <CheckSquare className="w-6 h-6 text-green-600"/>
            <h2 className="text-xl font-semibold">Things to Pack / Do</h2>
          </div>
          
          <div className="space-y-4">
            {events.filter(e => e.type !== 'holiday').length === 0 && (
              <p className="text-gray-400 italic">No tasks pending! 🎉</p>
            )}

            {events.map((event) => (
              event.type !== 'holiday' && (
                <div key={event.id} className="group border border-gray-100 rounded-lg p-3 hover:shadow-md transition bg-gray-50">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input type="checkbox" className="mt-1.5 w-5 h-5 cursor-pointer accent-blue-600" />
                    
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800">{event.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide
                          ${event.type === 'test' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {event.type}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {new Date(event.event_date).toDateString()}
                      </p>
                      
                      {/* Items to Carry Section */}
                      {event.items_to_carry && (
                        <div className="bg-white p-2 rounded border border-gray-200 text-sm text-gray-600">
                          <strong className="text-xs text-gray-400 uppercase block mb-1">🎒 Don't Forget:</strong>
                          <ul className="list-disc list-inside space-y-0.5 pl-1">
                            {event.items_to_carry.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}