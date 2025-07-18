'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const filteredTimeline = filter === 'all' 
    ? sampleTimeline 
    : sampleTimeline.filter(item => item.category === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction Timeline</h2>
          <p className="text-gray-600 mt-1">Track your real estate transaction progress</p>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          {(['all', 'leadgen', 'paperwork', 'clientside'] as const).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-estate-100 text-estate-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredTimeline.map((item, index) => {
            const config = statusConfig[item.status]
            const Icon = config.icon
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Status Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.date}</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.mcp_server}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button className="ml-4 px-3 py-1 text-sm bg-estate-600 text-white rounded-lg hover:bg-estate-700 transition-colors">
                        {item.status === 'completed' ? 'View' : 'Action'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredTimeline.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline items</h3>
          <p className="text-gray-600">No items match your current filter.</p>
        </div>
      )}
    </div>
  )
} 