'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import Link from 'next/link'
import { Inter } from 'next/font/google'

// Load a lighter, more inviting font
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter' })

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const heroInView = useInView(heroRef, { once: true })

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 })
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 })

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const features = [
    {
      title: "AI-Powered Lead Generation",
      description: "Revolutionary lead capture with predictive analytics and intelligent follow-up sequences",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: ["Predictive Analytics", "Auto-Followup", "Smart Scoring"]
    },
    {
      title: "Intelligent Document Management",
      description: "Next-generation contract automation with AI-powered legal analysis",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      features: ["AI Legal Review", "Real-time Collaboration", "Smart Templates"]
    },
    {
      title: "Hyper-Personalized Client Experience",
      description: "Advanced client interaction system with behavioral analysis",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: ["Behavioral Analysis", "Personalized Comms", "Smart Scheduling"]
    }
  ]

  const mcpServers = [
    {
      name: "LeadGen MCP",
      port: "3001",
      description: "Advanced lead generation with predictive analytics",
      status: "Online",
      metrics: { leads: "2.4k", conversion: "23%", response: "1.2s" }
    },
    {
      name: "Paperwork MCP", 
      port: "3002",
      description: "Intelligent document processing and automation",
      status: "Online",
      metrics: { docs: "1.8k", accuracy: "99.7%", time: "45s" }
    },
    {
      name: "ClientSide MCP",
      port: "3003", 
      description: "Hyper-personalized client interaction system",
      status: "Online",
      metrics: { clients: "892", satisfaction: "4.9/5", engagement: "87%" }
    }
  ]

  const stats = [
    { number: "10,000+", label: "Properties Analyzed" },
    { number: "2,500+", label: "Happy Agents" },
    { number: "99.7%", label: "Accuracy Rate" },
    { number: "3.2x", label: "Faster Closings" }
  ]

  return (
    <div
      ref={containerRef}
      className={`${inter.variable} font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden`}
    >
      {/* Navigation */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-blue-100/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-semibold text-blue-600 tracking-tight">
                EstateWise
              </h1>
              <span className="ml-4 text-sm text-gray-600 font-normal">AI-Powered Real Estate Platform</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <Link href="/signin">
                <button className="px-6 py-3 text-gray-600 hover:text-blue-600 transition-colors font-normal">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Video background overlay in hero */}
      <section ref={heroRef} className="relative z-10 pt-32 pb-20">
        <video
          src="https://framerusercontent.com/assets/0XdgVMtWLrsKeVdX6gcE37AvI.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-md"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-6xl md:text-7xl font-light text-gray-900 mb-6"
            style={{ y: springY1 }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            Transform
            <br />
            <span className="text-blue-600 font-semibold">Real Estate</span>
            <br />
            <span className="text-blue-500 font-semibold">with AI</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto font-normal"
            style={{ y: springY2 }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            EstateWise is the <span className="text-blue-600 font-medium">revolutionary AI platform</span> that automates every aspect of real estate transactions.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link href="/signup">
              <button className="px-10 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Start Free Trial
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                View Demo
              </button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-3xl font-semibold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-normal">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Unified Design */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Powered by <span className="text-blue-600 font-semibold">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-normal">
              Our cutting-edge MCP (Model Context Protocol) servers work in perfect harmony to revolutionize your real estate business.
            </p>
          </motion.div>

          {/* Unified Features Layout */}
          <div className="space-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-semibold text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed font-normal">{feature.description}</p>
                  
                  {/* Feature List */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-center lg:justify-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 font-normal">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Servers Section - Unified */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Live <span className="text-blue-600 font-semibold">AI Servers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-normal">
              Our AI servers are running 24/7, processing thousands of real estate transactions with lightning speed.
            </p>
          </motion.div>

          {/* Unified Server Layout */}
          <div className="grid md:grid-cols-3 gap-8">
            {mcpServers.map((server, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-blue-100/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{server.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 font-medium">{server.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed font-normal">{server.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    {Object.entries(server.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm capitalize font-normal">{key}</span>
                        <span className="text-gray-900 font-semibold text-lg">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-400 font-mono">Port: {server.port}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Ready to <span className="text-blue-600 font-semibold">Revolutionize</span> Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-normal">
              Join thousands of real estate professionals who are already using EstateWise to automate their workflows and close deals faster than ever.
            </p>
            <Link href="/signup">
              <button className="px-12 py-5 bg-blue-600 text-white rounded-lg text-xl font-medium hover:bg-blue-700 transition-colors shadow-lg">
                Get Started Today
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-md border-t border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-blue-600">EstateWise</h3>
              <span className="ml-4 text-gray-600 font-normal">AI-Powered Real Estate Platform</span>
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <Link href="/signin" className="text-gray-600 hover:text-blue-600 transition-colors font-normal">Sign In</Link>
              <Link href="/signup" className="text-gray-600 hover:text-blue-600 transition-colors font-normal">Sign Up</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-normal">Demo</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-100/50 text-center text-sm text-gray-500">
            © 2024 EstateWise. All rights reserved. | Built with ❤️ for the future of real estate
          </div>
        </div>
      </footer>
    </div>
  )
} 