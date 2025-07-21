'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Command } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Command {
  id: string
  title: string
  description: string
  category: 'leadgen' | 'paperwork' | 'clientside'
  action: () => void
}

const sampleCommands: Command[] = [
  {
    id: '1',
    title: 'Generate Lead',
    description: 'Create a new lead from property and client information',
    category: 'leadgen',
    action: () => console.log('Generate lead')
  },
  {
    id: '2',
    title: 'Fill Contract',
    description: 'Fill out a contract with transaction data',
    category: 'paperwork',
    action: () => console.log('Fill contract')
  },
  {
    id: '3',
    title: 'Generate Comps',
    description: 'Find comparable properties for analysis',
    category: 'clientside',
    action: () => console.log('Generate comps')
  },
  {
    id: '4',
    title: 'Send Disclosure',
    description: 'Send disclosure document to client',
    category: 'clientside',
    action: () => console.log('Send disclosure')
  },
  {
    id: '5',
    title: 'Follow Up',
    description: 'Send follow-up message to lead',
    category: 'leadgen',
    action: () => console.log('Follow up')
  }
]

const categoryColors = {
  leadgen: 'bg-green-100 text-green-800',
  paperwork: 'bg-blue-100 text-blue-800',
  clientside: 'bg-purple-100 text-purple-800'
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = sampleCommands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (command: Command) => {
    command.action()
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      )
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      )
    }
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      handleSelect(filteredCommands[selectedIndex])
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-500 hover:border-gray-400 transition-all duration-200 hover:shadow-md hover:bg-gray-50/50 backdrop-blur-sm"
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
            <span>Search commands or type your request...</span>
          </div>
          <motion.div 
            className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Command className="w-4 h-4" />
            <span>K</span>
          </motion.div>
        </div>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.3 
              }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Search Input */}
              <motion.div 
                className="p-4 border-b border-gray-200 bg-gray-50/50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ 
                      scale: query ? [1, 1.1, 1] : 1,
                      rotate: query ? [0, 5, -5, 0] : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search className="w-5 h-5 text-gray-400" />
                  </motion.div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                  />
                  {query && (
                    <motion.button
                      onClick={() => setQuery('')}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Command List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {filteredCommands.map((command, index) => (
                      <motion.button
                        key={command.id}
                        onClick={() => handleSelect(command)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-150 border-l-4 ${
                          index === selectedIndex 
                            ? 'bg-gray-50 border-l-estate-500' 
                            : 'border-l-transparent hover:border-l-gray-200'
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: index === selectedIndex ? 1.01 : 1
                        }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        whileHover={{ 
                          x: 4,
                          transition: { type: "spring", stiffness: 400, damping: 17 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <motion.h3 
                                className="font-medium text-gray-900"
                                layoutId={`title-${command.id}`}
                              >
                                {command.title}
                              </motion.h3>
                              <motion.span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[command.category]}`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              >
                                {command.category}
                              </motion.span>
                            </div>
                            <motion.p 
                              className="text-sm text-gray-500 mt-1"
                              initial={{ opacity: 0.7 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 + 0.1 }}
                            >
                              {command.description}
                            </motion.p>
                          </div>
                          {index === selectedIndex && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-2 text-estate-500"
                            >
                              →
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="px-4 py-8 text-center text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      🔍
                    </motion.div>
                    <p className="mt-2">No commands found for "{query}"</p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <motion.div 
                className="p-4 border-t border-gray-200 bg-gray-50/50 rounded-b-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <motion.span 
                      whileHover={{ scale: 1.05, color: '#374151' }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      ↑↓ to navigate
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.05, color: '#374151' }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Enter to select
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.05, color: '#374151' }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Esc to close
                    </motion.span>
                  </div>
                  <motion.span
                    key={filteredCommands.length}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {filteredCommands.length} commands
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 