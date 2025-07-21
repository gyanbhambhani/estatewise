'use client'

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineItem {
  id: string
  title: string
  description: string
  status: 'completed' | 'pending' | 'overdue' | 'upcoming'
  date: string
  category: 'leadgen' | 'paperwork' | 'clientside'
  mcp_server: string
}

const sampleTimeline: TimelineItem[] = [
  {
    id: '1',
    title: 'Lead Generated',
    description: 'New lead created for 123 Main St property',
    status: 'completed',
    date: '2024-01-15',
    category: 'leadgen',
    mcp_server: 'LeadGenMCP'
  },
  {
    id: '2',
    title: 'Initial Contact',
    description: 'Welcome email sent to client',
    status: 'completed',
    date: '2024-01-16',
    category: 'leadgen',
    mcp_server: 'LeadGenMCP'
  },
  {
    id: '3',
    title: 'Property Showings',
    description: 'Schedule property viewings with client',
    status: 'pending',
    date: '2024-01-20',
    category: 'clientside',
    mcp_server: 'ClientSideMCP'
  },
  {
    id: '4',
    title: 'Generate Comps',
    description: 'Find comparable properties for analysis',
    status: 'upcoming',
    date: '2024-01-22',
    category: 'clientside',
    mcp_server: 'ClientSideMCP'
  },
  {
    id: '5',
    title: 'Contract Preparation',
    description: 'Prepare purchase agreement',
    status: 'overdue',
    date: '2024-01-18',
    category: 'paperwork',
    mcp_server: 'PaperworkMCP'
  },
  {
    id: '6',
    title: 'Disclosure Documents',
    description: 'Send required disclosures to client',
    status: 'upcoming',
    date: '2024-01-25',
    category: 'clientside',
    mcp_server: 'ClientSideMCP'
  }
]

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  pending: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  overdue: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  },
  upcoming: {
    icon: Calendar,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
}

const categoryColors = {
  leadgen: 'bg-green-100 text-green-800',
  paperwork: 'bg-blue-100 text-blue-800',
  clientside: 'bg-purple-100 text-purple-800'
}

export default function TimelineView() {
  const [filter, setFilter] = useState<'all' | 'leadgen' | 'paperwork' | 'clientside'>('all')
  const [isVisible, setIsVisible] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    // Only animate heavily on initial load
    const timer = setTimeout(() => setIsInitialLoad(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredTimeline = filter === 'all' 
    ? sampleTimeline 
    : sampleTimeline.filter(item => item.category === filter)

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Transaction Timeline</h2>
          <p className="text-gray-600 mt-1">Track your real estate transaction progress</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          className="flex space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {(['all', 'leadgen', 'paperwork', 'clientside'] as const).map((filterType, index) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === filterType
                  ? 'bg-estate-100 text-estate-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: `${0.4 + index * 0.1}s` }}
            >
              {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Timeline Line */}
        <motion.div 
          className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{ transformOrigin: "top" }}
        ></motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={filter}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredTimeline.map((item, index) => {
              const config = statusConfig[item.status]
              const Icon = config.icon
              
              return (
                <motion.div
                  key={item.id}
                  initial={isInitialLoad ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={isInitialLoad ? { 
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  } : { duration: 0.2 }}
                  className="relative flex items-start space-x-4"
                  whileHover={{ x: 4 }}
                >
                  {/* Status Icon */}
                  <motion.div 
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2`}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      initial={isInitialLoad ? { scale: 0, rotate: -180 } : false}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={isInitialLoad ? { 
                        delay: 0.9 + index * 0.1,
                        type: "spring",
                        stiffness: 400,
                        damping: 17
                      } : { duration: 0.1 }}
                    >
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </motion.div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.div 
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                      whileHover={{ 
                        y: -2,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <motion.h3 
                              className="text-lg font-semibold text-gray-900"
                              layoutId={`title-${item.id}`}
                            >
                              {item.title}
                            </motion.h3>
                            <motion.span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              {item.category}
                            </motion.span>
                          </div>
                          <motion.p 
                            className="text-gray-600 mb-3"
                            initial={isInitialLoad ? { opacity: 0.7 } : false}
                            animate={{ opacity: 1 }}
                            transition={isInitialLoad ? { delay: 1 + index * 0.1 } : { duration: 0.1 }}
                          >
                            {item.description}
                          </motion.p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <motion.span
                              initial={isInitialLoad ? { opacity: 0, x: -10 } : false}
                              animate={{ opacity: 1, x: 0 }}
                              transition={isInitialLoad ? { delay: 1.1 + index * 0.1 } : { duration: 0.1 }}
                            >
                              {item.date}
                            </motion.span>
                            <motion.span 
                              className="font-mono text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                              initial={isInitialLoad ? { opacity: 0, x: 10 } : false}
                              animate={{ opacity: 1, x: 0 }}
                              transition={isInitialLoad ? { delay: 1.1 + index * 0.1 } : { duration: 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {item.mcp_server}
                            </motion.span>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <motion.button 
                          className="ml-4 px-3 py-1 text-sm bg-estate-600 text-white rounded-lg hover:bg-estate-700 transition-all duration-200 hover:shadow-md"
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          initial={isInitialLoad ? { opacity: 0, scale: 0.8 } : false}
                          animate={{ opacity: 1, scale: 1 }}
                          style={isInitialLoad ? { transitionDelay: `${1.2 + index * 0.1}s` } : undefined}
                        >
                          {item.status === 'completed' ? 'View' : 'Action'}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredTimeline.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline items</h3>
          <p className="text-gray-600">No items match your current filter.</p>
        </motion.div>
      )}
    </motion.div>
  )
} 