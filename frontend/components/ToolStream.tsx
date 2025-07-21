'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw, AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import ToolOutputCard, { ToolOutput } from './ToolOutputCard'

interface ToolStreamProps {
  isOpen: boolean
  onClose: () => void
  toolExecutions: ToolOutput[]
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
  onReportIssue: (output: ToolOutput) => void
  onRetry?: () => void
}

export default function ToolStream({ 
  isOpen, 
  onClose, 
  toolExecutions, 
  connectionStatus,
  onReportIssue,
  onRetry 
}: ToolStreamProps) {
  const [autoScroll, setAutoScroll] = useState(true)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10
    setAutoScroll(isAtBottom)
  }, [])

  // Auto-scroll to bottom when new outputs arrive
  useEffect(() => {
    if (autoScroll && isOpen) {
      const streamContainer = document.getElementById('tool-stream-container')
      if (streamContainer) {
        streamContainer.scrollTop = streamContainer.scrollHeight
      }
    }
  }, [toolExecutions, autoScroll, isOpen])

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />
      case 'reconnecting':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4 text-orange-500" />
          </motion.div>
        )
    }
  }

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to MCP servers'
      case 'disconnected':
        return 'Disconnected from servers'
      case 'reconnecting':
        return 'Reconnecting...'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Tool Output Stream</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    {getConnectionIcon()}
                    <span className="text-sm text-gray-600">{getConnectionText()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connectionStatus === 'disconnected' && onRetry && (
                    <motion.button
                      onClick={onRetry}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="w-4 h-4 mr-1 inline" />
                      Retry
                    </motion.button>
                  )}
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Connection Warning */}
            {connectionStatus !== 'connected' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-orange-50 border-b border-orange-200"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 text-sm">
                    {connectionStatus === 'disconnected' 
                      ? 'Unable to connect to MCP servers. Some features may not work.' 
                      : 'Attempting to reconnect to servers...'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Tool Output Stream */}
            <div 
              id="tool-stream-container"
              className="flex-1 overflow-y-auto p-6 space-y-4"
              onScroll={handleScroll}
            >
              <AnimatePresence>
                {toolExecutions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-lg mb-2">🚀</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for action</h3>
                    <p className="text-gray-600">Tool outputs will appear here as they execute</p>
                  </motion.div>
                ) : (
                  toolExecutions.map((output) => (
                    <ToolOutputCard
                      key={output.id}
                      output={output}
                      onReportIssue={onReportIssue}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Auto-scroll indicator */}
            {!autoScroll && toolExecutions.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 right-6 bg-estate-600 text-white px-3 py-2 rounded-full text-sm hover:bg-estate-700 transition-colors shadow-lg"
                onClick={() => {
                  setAutoScroll(true)
                  const container = document.getElementById('tool-stream-container')
                  if (container) {
                    container.scrollTop = container.scrollHeight
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ↓ Scroll to bottom
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
