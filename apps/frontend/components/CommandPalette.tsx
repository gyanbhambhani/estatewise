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
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-500 hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5" />
            <span>Search commands or type your request...</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Command className="w-4 h-4" />
            <span>K</span>
          </div>
        </div>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Command List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      onClick={() => handleSelect(command)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">
                              {command.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[command.category]}`}>
                              {command.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {command.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No commands found for "{query}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>↑↓ to navigate</span>
                    <span>Enter to select</span>
                    <span>Esc to close</span>
                  </div>
                  <span>{filteredCommands.length} commands</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 