import Link from 'next/link'
import { BookOpen, Mic, BrainCircuit, CheckCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800">SmartScholastic</span>
        </div>
        <Link href="/login" className="px-6 py-2 bg-white text-blue-600 border border-blue-200 rounded-full font-semibold hover:shadow-md transition">
          Log In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 mt-16 text-center">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-6">
          New: AI Oral Practice 🎤
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Your Personal School <br/> <span className="text-blue-600">Superpower.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Manage your homework, ace your oral exams with AI, and track your school events. All in one place.
        </p>
        
        <Link href="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Get Started Now <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Planner</h3>
            <p className="text-gray-600">Never forget your geometry box or homework again with daily checklists.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
              <Mic className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Oral Tutor</h3>
            <p className="text-gray-600">Practice speaking Hindi, Marathi, & English with real-time AI feedback.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-xl mb-6">
              <BrainCircuit className="text-orange-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Test Generator</h3>
            <p className="text-gray-600">Turn your textbooks into instant MCQ quizzes to prepare for exams.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-24 py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        © 2025 SmartScholastic. Built for students.
      </footer>
    </div>
  )
}