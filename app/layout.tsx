// import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Using a clean Google Font
// import "./globals.css";
// import Navbar from "./components/Navbar";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "SmartScholastic",
//   description: "AI-Powered School Planner & Oral Tutor",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-slate-50 text-slate-900`}>
//         {/* Navbar sits at the top of every page */}
//         <Navbar />
        
//         {/* Main Content */}
//         <main className="min-h-[calc(100vh-64px)]">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }




// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodePath - Learn to Code',
  description: 'Master programming through interactive challenges and real-world projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}