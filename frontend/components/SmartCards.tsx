'use client'

import { useState, useEffect } from 'react'
import { 
  UserPlus, 
  FileText, 
  Home, 
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SmartCard {
  id: string
  title: string
  description: string
  category: 'leadgen' | 'paperwork' | 'clientside'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  action: string
  icon: any
  data?: any
}

const sampleCards: SmartCard[] = [
  {
    id: '1',
    title: 'New Lead Opportunity',
    description: 'Potential buyer interested in 123 Main St. Ready for initial contact.',
    category: 'leadgen',
    priority: 'high',
    status: 'pending',
    action: 'Generate Lead',
    icon: UserPlus,
    data: {
      property: '123 Main St, City, State',
      client: 'John Smith',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    title: 'Contract Due Today',
    description: 'Purchase agreement for 456 Oak Ave needs to be completed and sent.',
    category: 'paperwork',
    priority: 'high',
    status: 'in_progress',
    action: 'Fill Contract',
    icon: FileText,
    data: {
      property: '456 Oak Ave, City, State',
      client: 'Jane Doe',
      contract_type: 'purchase'
    }
  },
  {
    id: '3',
    title: 'Property Comps Ready',
    description: 'Comparable properties analysis completed for 789 Pine St listing.',
    category: 'clientside',
    priority: 'medium',
    status: 'completed',
    action: 'View Report',
    icon: BarChart3,
    data: {
      property: '789 Pine St, City, State',
      comps_count: 5,
      avg_price: '$425,000'
    }
  },
  {
    id: '4',
    title: 'Disclosure Reminder',
    description: 'Agency disclosure needs to be sent to client within 48 hours.',
    category: 'clientside',
    priority: 'medium',
    status: 'pending',
    action: 'Send Disclosure',
    icon: FileText,
    data: {
      client: 'Mike Johnson',
      disclosure_type: 'agency',
      deadline: '2024-01-20'
    }
  },
  {
    id: '5',
    title: 'Follow-up Required',
    description: 'Lead from 3 days ago hasn\'t responded. Time for follow-up.',
    category: 'leadgen',
    priority: 'low',
    status: 'pending',
    action: 'Follow Up',
    icon: Clock,
    data: {
      lead_id: 'lead_20240115_143022',
      last_contact: '2024-01-15',
      follow_up_count: 1
    }
  },
  {
    id: '6',
    title: 'Property Showing Scheduled',
    description: 'Showing confirmed for tomorrow at 2 PM. Client needs property details.',
    category: 'clientside',
    priority: 'medium',
    status: 'in_progress',
    action: 'Send Details',
    icon: Home,
    data: {
      property: '321 Elm St, City, State',
      showing_time: '2024-01-20 14:00',
      client: 'Sarah Wilson'
    }
  }
]

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
}

const categoryColors = {
  leadgen: 'bg-green-100 text-green-800',
  paperwork: 'bg-blue-100 text-blue-800',
  clientside: 'bg-purple-100 text-purple-800'
}

export default function SmartCards() {
  const [filter, setFilter] = useState<'all' | 'leadgen' | 'paperwork' | 'clientside'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Only animate on initial load, not on filter changes
    if (isInitialLoad) {
      const timer = setTimeout(() => setIsInitialLoad(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isInitialLoad])

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const filteredCards = sampleCards.filter(card => {
    const categoryMatch = filter === 'all' || card.category === filter
    const priorityMatch = priorityFilter === 'all' || card.priority === priorityFilter
    return categoryMatch && priorityMatch
  })

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
          <h2 className="text-2xl font-bold text-gray-900">Smart Cards</h2>
          <p className="text-gray-600 mt-1">Contextual actions and insights</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div 
          className="flex space-x-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Category Filter */}
          <motion.select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-estate-500 transition-all duration-200 hover:border-gray-400"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <option value="all">All Categories</option>
            <option value="leadgen">Lead Generation</option>
            <option value="paperwork">Paperwork</option>
            <option value="clientside">Client Side</option>
          </motion.select>
          
          {/* Priority Filter */}
          <motion.select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-estate-500 transition-all duration-200 hover:border-gray-400"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </motion.select>
        </motion.div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => {
          const Icon = card.icon
          const isExpanded = expandedCards.has(card.id)
          
          return (
            <motion.div
              key={card.id}
              initial={isInitialLoad ? { opacity: 0, y: 20, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={isInitialLoad ? { 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 25
              } : { duration: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-estate-300 group"
              whileHover={{ 
                y: -4,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
            >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="p-2 bg-estate-100 rounded-lg group-hover:bg-estate-200 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Icon className="w-5 h-5 text-estate-600" />
                    </motion.div>
                    <div>
                      <motion.h3 
                        className="font-semibold text-gray-900"
                        layoutId={`title-${card.id}`}
                      >
                        {card.title}
                      </motion.h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <motion.span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[card.category]}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {card.category}
                        </motion.span>
                        <motion.span 
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[card.priority]}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          animate={card.priority === 'high' && isInitialLoad ? {
                            scale: [1, 1.05, 1],
                            opacity: [1, 0.8, 1]
                          } : {}}
                          style={{
                            animationDuration: card.priority === 'high' && isInitialLoad ? '2s' : undefined,
                            animationIterationCount: card.priority === 'high' && isInitialLoad ? 'infinite' : undefined
                          }}
                        >
                          {card.priority}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[card.status]}`}
                    initial={isInitialLoad ? { opacity: 0, scale: 0 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={isInitialLoad ? { delay: 0.5 + index * 0.05 } : { duration: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {card.status.replace('_', ' ')}
                  </motion.div>
                </div>
                
                {/* Card Description */}
                <motion.p 
                  className="text-gray-600 text-sm mb-4"
                  initial={isInitialLoad ? { opacity: 0.7 } : false}
                  animate={{ opacity: 1 }}
                  transition={isInitialLoad ? { delay: 0.6 + index * 0.05 } : { duration: 0.1 }}
                >
                  {card.description}
                </motion.p>
                
                {/* Card Data */}
                {card.data && (
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-3 mb-4 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.button
                      onClick={() => toggleCardExpansion(card.id)}
                      className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="font-medium">Details</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 pt-2 border-t border-gray-200"
                        >
                          <div className="space-y-1 text-xs text-gray-600">
                            {Object.entries(card.data).map(([key, value], idx) => (
                              <motion.div 
                                key={key} 
                                className="flex justify-between"
                                initial={isInitialLoad ? { opacity: 0, x: -10 } : false}
                                animate={{ opacity: 1, x: 0 }}
                                transition={isInitialLoad ? { delay: idx * 0.05 } : { duration: 0.1 }}
                              >
                                <span className="font-medium">{key.replace('_', ' ')}:</span>
                                <span>{String(value)}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
                
                {/* Action Button */}
                <motion.button 
                  className="w-full flex items-center justify-center space-x-2 bg-estate-600 text-white py-2 px-4 rounded-lg hover:bg-estate-700 transition-all duration-200 hover:shadow-md group-hover:shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  initial={isInitialLoad ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  style={isInitialLoad ? { transitionDelay: `${0.7 + index * 0.05}s` } : undefined}
                >
                  <span>{card.action}</span>
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending actions match your current filters.</p>
        </motion.div>
      )}
    </motion.div>
  )
} 