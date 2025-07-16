'use client'

import { useState } from 'react'
import { 
  UserPlusIcon, 
  DocumentTextIcon, 
  HomeIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon
} from 'lucide-react'
import { motion } from 'framer-motion'

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
    icon: UserPlusIcon,
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
    icon: DocumentTextIcon,
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
    icon: ChartBarIcon,
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
    icon: DocumentTextIcon,
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
    icon: ClockIcon,
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
    icon: HomeIcon,
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

  const filteredCards = sampleCards.filter(card => {
    const categoryMatch = filter === 'all' || card.category === filter
    const priorityMatch = priorityFilter === 'all' || card.priority === priorityFilter
    return categoryMatch && priorityMatch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Cards</h2>
          <p className="text-gray-600 mt-1">Contextual actions and insights</p>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-estate-500"
          >
            <option value="all">All Categories</option>
            <option value="leadgen">Lead Generation</option>
            <option value="paperwork">Paperwork</option>
            <option value="clientside">Client Side</option>
          </select>
          
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-estate-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => {
          const Icon = card.icon
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-estate-300"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-estate-100 rounded-lg">
                    <Icon className="w-5 h-5 text-estate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[card.category]}`}>
                        {card.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[card.priority]}`}>
                        {card.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[card.status]}`}>
                  {card.status.replace('_', ' ')}
                </div>
              </div>
              
              {/* Card Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {card.description}
              </p>
              
              {/* Card Data */}
              {card.data && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="space-y-1 text-xs text-gray-600">
                    {Object.entries(card.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key.replace('_', ' ')}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <button className="w-full flex items-center justify-center space-x-2 bg-estate-600 text-white py-2 px-4 rounded-lg hover:bg-estate-700 transition-colors">
                <span>{card.action}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending actions match your current filters.</p>
        </div>
      )}
    </div>
  )
} 