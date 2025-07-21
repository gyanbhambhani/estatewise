'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  variant: 'card' | 'timeline' | 'command'
  count?: number
}

export default function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  const skeletons = Array(count).fill(0)

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Header skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-gray-200 rounded-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div>
                  <motion.div 
                    className="h-4 bg-gray-200 rounded w-24 mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  />
                  <div className="flex space-x-2">
                    <motion.div 
                      className="h-3 bg-gray-200 rounded w-16"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="h-3 bg-gray-200 rounded w-12"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              <motion.div 
                className="h-5 bg-gray-200 rounded w-16"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>

            {/* Description skeleton */}
            <motion.div 
              className="space-y-2 mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </motion.div>

            {/* Data skeleton */}
            <motion.div 
              className="bg-gray-50 rounded-lg p-3 mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded w-full" />
                <div className="h-2 bg-gray-200 rounded w-2/3" />
                <div className="h-2 bg-gray-200 rounded w-4/5" />
              </div>
            </motion.div>

            {/* Button skeleton */}
            <motion.div 
              className="h-10 bg-gray-200 rounded-lg w-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  if (variant === 'timeline') {
    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-6">
          {skeletons.map((_, index) => (
            <motion.div
              key={index}
              className="relative flex items-start space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon skeleton */}
              <motion.div 
                className="relative z-10 w-12 h-12 bg-gray-200 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Content skeleton */}
              <div className="flex-1 min-w-0">
                <motion.div 
                  className="bg-white rounded-lg border border-gray-200 p-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-20" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16 ml-4" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'command') {
    return (
      <div className="space-y-2">
        {skeletons.map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4 p-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div 
              className="h-10 bg-gray-200 rounded w-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return null
}
