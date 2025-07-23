'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DebugConsoleProps {
  isOpen: boolean
  onClose: () => void
}

export default function DebugConsole({ isOpen, onClose }: DebugConsoleProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [command, setCommand] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Simulate system logs
      const systemLogs = [
        '🚀 EstateWise Debug Console v2.1.0',
        '📡 Connecting to MCP servers...',
        '✅ LeadGen MCP: Online (Port 3001)',
        '✅ Paperwork MCP: Online (Port 3002)', 
        '✅ ClientSide MCP: Online (Port 3003)',
        '🧠 AI Models: Loaded and ready',
        '📊 Analytics: Tracking enabled',
        '🔒 Security: All systems secure',
        'Type "help" for available commands'
      ]
      
      systemLogs.forEach((log, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, log])
        }, index * 200)
      })
    }
  }, [isOpen])

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && command.trim()) {
      const newLog = `> ${command}`
      setLogs(prev => [...prev, newLog])
      
      // Process commands
      const cmd = command.toLowerCase()
      if (cmd === 'help') {
        setTimeout(() => {
          setLogs(prev => [...prev, 'Available commands: status, servers, clear, exit'])
        }, 100)
      } else if (cmd === 'status') {
        setTimeout(() => {
          setLogs(prev => [...prev, 'All systems operational. Uptime: 99.9%'])
        }, 100)
      } else if (cmd === 'servers') {
        setTimeout(() => {
          setLogs(prev => [...prev, 'MCP Servers: 3/3 online', 'LeadGen: 2.4k leads processed', 'Paperwork: 1.8k docs reviewed', 'ClientSide: 892 clients managed'])
        }, 100)
      } else if (cmd === 'clear') {
        setLogs([])
      } else if (cmd === 'exit') {
        onClose()
      } else {
        setTimeout(() => {
          setLogs(prev => [...prev, `Command not found: ${command}`])
        }, 100)
      }
      
      setCommand('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 border border-purple-500/30 rounded-lg w-full max-w-2xl h-96 flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-mono text-sm">EstateWise Debug Console</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Console Output */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    className="text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Command Input */}
            <div className="p-4 border-t border-purple-500/30">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleCommand}
                  className="flex-1 bg-transparent text-white outline-none font-mono"
                  placeholder="Enter command..."
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 