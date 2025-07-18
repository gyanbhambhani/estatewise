'use client'

import { useState } from 'react'
import CommandPalette from '@/components/CommandPalette'
import TimelineView from '@/components/TimelineView'
import SmartCards from '@/components/SmartCards'
import { motion } from 'framer-motion'

export default function Home() {
  const [activeView, setActiveView] = useState<'timeline' | 'cards'>('timeline')

  return (
    <div className="min-h-screen bg-gradient-to-br from-estate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-estate-900">
                EstateWise
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                AI-Powered Real Estate Assistant
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('timeline')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'timeline'
                    ? 'bg-estate-100 text-estate-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'cards'
                    ? 'bg-estate-100 text-estate-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Smart Cards
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Command Palette */}
          <div className="mb-8">
            <CommandPalette />
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeView === 'timeline' ? (
              <TimelineView />
            ) : (
              <SmartCards />
            )}
          </div>
        </motion.div>
      </main>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>LeadGen MCP: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Paperwork MCP: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ClientSide MCP: Online</span>
              </div>
            </div>
            <div>
              EstateWise v0.1.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 