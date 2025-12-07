


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './utils/supabaseClient'
import { 
  Sparkles, 
  Target, 
  Zap, 
  CheckCircle, 
  BrainCircuit,
  Users,
  Award,
  Clock,
  Shield,
  ArrowRight,
  BarChart,
  BookOpen,
  MessageSquare,
  Star
} from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-secondary rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Your Personal{' '}
            <span className="text-gradient">School</span>
            <br />
            <span className="text-foreground">Superpower</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage homework, ace oral exams with AI, and track school events. 
            All in one powerful platform designed for student success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="btn-gradient px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="glass-panel px-8 py-4 rounded-xl text-lg font-semibold hover:glow-effect transition-all inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Explore Features
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "10K+", label: "Active Students", icon: Users },
              { value: "95%", label: "Success Rate", icon: Award },
              { value: "24/7", label: "AI Support", icon: Clock },
              { value: "12+", label: "Subjects", icon: BookOpen }
            ].map((stat, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background via-card/30 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From homework management to AI-powered oral practice, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Smart Planner Card */}
            <Link href={user ? "/dashboard" : "/login"} className="group">
              <div className="glass-panel p-8 rounded-2xl border border-border hover:border-primary/30 hover:glow-effect transition-all duration-300 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Smart Planner</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Never forget assignments or deadlines. Automated checklists and reminders keep you perfectly organized.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Start Planning <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* AI Oral Tutor Card */}
            <Link href={user ? "/oral-practice" : "/login"} className="group">
              <div className="glass-panel p-8 rounded-2xl border border-border hover:border-secondary/30 hover:glow-effect transition-all duration-300 h-full relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7 text-secondary" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">AI Oral Tutor</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Practice Hindi, Marathi & English with real-time AI feedback. Perfect your pronunciation and fluency.
                </p>
                <div className="flex items-center text-secondary font-semibold text-sm">
                  Start Practicing <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Test Generator Card */}
            <div className="glass-panel p-8 rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 h-full relative">
              <div className="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full">
                COMING SOON
              </div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 mb-6">
                <BrainCircuit className="w-7 h-7 text-accent" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Test Generator</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Turn your textbooks into instant MCQ quizzes. Automated test generation powered by advanced AI.
              </p>
              <div className="flex items-center text-accent font-semibold text-sm">
                Notify Me <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why{' '}
                <span className="text-gradient">Students</span>
                {' '}Trust Us
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Trust comes from experience. Thousands of satisfied students have transformed their learning journey with us.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared with third parties." },
                  { icon: Award, title: "Proven Results", desc: "95% of students report improved grades within 30 days." },
                  { icon: Clock, title: "Always Available", desc: "24/7 AI support means help is always there when you need it." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-primary font-semibold mt-8 hover:gap-3 transition-all"
              >
                Read Student Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Buy Learning Time</h3>
                <p className="text-muted-foreground">
                  Get premium access to all features with flexible subscription plans tailored for students.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { plan: "Basic", price: "Free", features: "3 AI sessions/week" },
                  { plan: "Pro", price: "$9.99/month", features: "Unlimited AI sessions" },
                  { plan: "Family", price: "$24.99/month", features: "Up to 4 students" }
                ].map((plan, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-bold">{plan.plan}</div>
                      <div className="text-sm text-muted-foreground">{plan.features}</div>
                    </div>
                    <div className="text-lg font-bold gradient-text">{plan.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-20 bg-gradient-to-b from-background via-card/30 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How to{' '}
              <span className="text-gradient">Get Started</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below and we'll guide you through your personalized learning journey
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Start Your Journey</h3>
                <p className="text-muted-foreground mb-8">
                  Join thousands of students who have transformed their learning experience with AI-powered tools.
                </p>
                
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Sign Up", desc: "Create your free account in 30 seconds" },
                    { step: "2", title: "Choose Plan", desc: "Select the perfect plan for your needs" },
                    { step: "3", title: "Start Learning", desc: "Access all features immediately" }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Grade Level</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Select your grade</option>
                    <option>6th - 8th Grade</option>
                    <option>9th - 10th Grade</option>
                    <option>11th - 12th Grade</option>
                    <option>College/University</option>
                  </select>
                </div>
                <button className="btn-gradient w-full py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition-transform">
                  Start Learning Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Competitive Pricing",
                desc: "Affordable plans designed specifically for students and families.",
                icon: BarChart,
                color: "from-primary/20 to-primary/5"
              },
              {
                title: "24/7 Support",
                desc: "Round-the-clock assistance from our team and AI tutors.",
                icon: Users,
                color: "from-secondary/20 to-secondary/5"
              },
              {
                title: "Fast & Easy Setup",
                desc: "Get started in minutes with our intuitive interface.",
                icon: Zap,
                color: "from-accent/20 to-accent/5"
              },
              {
                title: "Bank-Level Security",
                desc: "Your data is protected with enterprise-grade encryption.",
                icon: Shield,
                color: "from-primary/20 to-secondary/5"
              },
              {
                title: "Instant Access",
                desc: "Start learning immediately after signing up.",
                icon: Clock,
                color: "from-secondary/20 to-accent/5"
              },
              {
                title: "Regular Updates",
                desc: "We continuously add new features and improvements.",
                icon: Sparkles,
                color: "from-accent/20 to-primary/5"
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-2xl hover:glow-effect transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-panel rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to{' '}
              <span className="text-gradient">Transform</span>
              {' '}Your Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of successful students who have aced their exams with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="btn-gradient px-10 py-5 rounded-xl text-lg font-bold hover:scale-105 transition-transform inline-flex items-center justify-center gap-3"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                href="/demo"
                className="glass-panel px-10 py-5 rounded-xl text-lg font-semibold hover:glow-effect transition-all inline-flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}