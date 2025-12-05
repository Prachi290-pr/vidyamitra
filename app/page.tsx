// Location: app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to School Planner 🎒</h1>
      <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Go to Login
      </Link>
    </div>
  )
}