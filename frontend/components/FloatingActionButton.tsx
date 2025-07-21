'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Zap, Users, FileText, Home } from 'lucide-react'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      id: 'generate-lead',
      label: 'Generate Lead',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Generate lead')
    },
    {
      id: 'create-document',
      label: 'Create Document',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Create document')
    },
    {
      id: 'add-property',
      label: 'Add Property',
      icon: Home,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Add property')
    }
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0,
                    transition: { delay: (actions.length - index - 1) * 0.05 }
                  }}
                  onClick={action.action}
                  className={`flex items-center space-x-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group`}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-estate-600 hover:bg-estate-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? (
          <Plus className="w-6 h-6" />
        ) : (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-6 h-6" />
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
