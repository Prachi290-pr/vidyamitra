import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using a clean Google Font
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartScholastic",
  description: "AI-Powered School Planner & Oral Tutor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Navbar sits at the top of every page */}
        <Navbar />
        
        {/* Main Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}