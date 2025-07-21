'use client'

import { useState, useEffect } from 'react'
import CommandPalette from '@/components/CommandPalette'
import TimelineView from '@/components/TimelineView'
import SmartCards from '@/components/SmartCards'
import ToolStream from '@/components/ToolStream'
import FloatingActionButton from '@/components/FloatingActionButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useToolStream } from '@/hooks/useToolStream'

export default function Home() {
  const [activeView, setActiveView] = useState<'timeline' | 'cards' | 'tools'>('timeline')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showToolStream, setShowToolStream] = useState(false)
  
  const { 
    toolOutputs, 
    connectionStatus, 
    isStreamOpen,
    submitIssueReport 
  } = useToolStream()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // When tools view is selected, show the tool stream
  useEffect(() => {
    if (activeView === 'tools') {
      setShowToolStream(true)
      // Reset to timeline so the button isn't stuck in "active" state
      setActiveView('timeline')
    }
  }, [activeView])

  const handleCloseToolStream = () => {
    setShowToolStream(false)
    setActiveView('timeline') // Go back to timeline when closed
  }

  const handleReportIssue = (output: any) => {
    // For now, let's create a simple issue report
    const issueReport = {
      toolOutput: output,
      category: 'bug' as const,
      description: `Issue with tool execution: ${output.toolName}`,
      email: '',
      additionalInfo: ''
    }
    submitIssueReport(issueReport)
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-estate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-estate-200 to-blue-200 rounded-full opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-estate-300 to-cyan-300 rounded-full opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      {/* Header */}
      <motion.header 
        className="bg-white/80 shadow-sm border-b border-gray-200/50 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h1 
                className="text-2xl font-bold text-estate-900"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                EstateWise
              </motion.h1>
              <motion.span 
                className="ml-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                AI-Powered Real Estate Assistant
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setActiveView('timeline')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'timeline'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Timeline
              </motion.button>
              <motion.button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'cards'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Smart Cards
              </motion.button>
              <motion.button
                onClick={() => setActiveView('tools')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'tools'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Tool Streaming
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Command Palette */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <CommandPalette />
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="bg-white/80 rounded-xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            layout
            whileHover={{ 
              boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
              y: -2
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: activeView === 'timeline' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeView === 'timeline' ? 20 : -20 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth transitions
                }}
              >
                {activeView === 'timeline' ? (
                  <TimelineView />
                ) : (
                  <SmartCards />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* Status Bar */}
      <motion.footer 
        className="bg-white/80 border-t border-gray-200/50 mt-auto backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <span>LeadGen MCP: Online</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                ></motion.div>
                <span>Paperwork MCP: Online</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                ></motion.div>
                <span>ClientSide MCP: Online</span>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              EstateWise v0.1.0
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Tool Stream Modal */}
      <ToolStream 
        isOpen={showToolStream}
        onClose={handleCloseToolStream}
        toolExecutions={toolOutputs}
        connectionStatus={connectionStatus}
        onReportIssue={handleReportIssue}
      />
    </motion.div>
  )
} 