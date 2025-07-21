'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, AlertTriangle, Copy, Check } from 'lucide-react'
import { ToolOutput } from './ToolOutputCard'

interface IssueReportModalProps {
  isOpen: boolean
  onClose: () => void
  toolOutput?: ToolOutput
  onSubmit: (report: IssueReport) => void
}

export interface IssueReport {
  toolOutput: ToolOutput
  category: 'bug' | 'performance' | 'data_quality' | 'timeout' | 'other'
  description: string
  userEmail?: string
  expectedBehavior?: string
  reproductionSteps?: string
}

export default function IssueReportModal({ 
  isOpen, 
  onClose, 
  toolOutput, 
  onSubmit 
}: IssueReportModalProps) {
  const [category, setCategory] = useState<IssueReport['category']>('bug')
  const [description, setDescription] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [expectedBehavior, setExpectedBehavior] = useState('')
  const [reproductionSteps, setReproductionSteps] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const categories = [
    { value: 'bug', label: 'Bug/Error', icon: '🐛' },
    { value: 'performance', label: 'Performance Issue', icon: '⚡' },
    { value: 'data_quality', label: 'Data Quality', icon: '📊' },
    { value: 'timeout', label: 'Timeout/Slow Response', icon: '⏱️' },
    { value: 'other', label: 'Other', icon: '❓' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!toolOutput || !description.trim()) return

    setIsSubmitting(true)
    try {
      const report: IssueReport = {
        toolOutput,
        category,
        description: description.trim(),
        userEmail: userEmail.trim() || undefined,
        expectedBehavior: expectedBehavior.trim() || undefined,
        reproductionSteps: reproductionSteps.trim() || undefined
      }
      
      await onSubmit(report)
      
      // Reset form
      setDescription('')
      setUserEmail('')
      setExpectedBehavior('')
      setReproductionSteps('')
      setCategory('bug')
      onClose()
    } catch (error) {
      console.error('Failed to submit issue report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyDetails = async () => {
    if (!toolOutput) return
    
    const details = `Tool: ${toolOutput.toolName}
Status: ${toolOutput.status}
Timestamp: ${toolOutput.timestamp}
Server: ${toolOutput.server || 'Unknown'}
Error: ${toolOutput.error || 'None'}
Duration: ${toolOutput.duration || 'Unknown'}ms

Data: ${JSON.stringify(toolOutput.data, null, 2)}`

    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy details:', error)
    }
  }

  if (!toolOutput) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Report Issue</h2>
                    <p className="text-sm text-gray-600">
                      Help us improve by reporting this issue
                    </p>
                  </div>
                </div>
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

            {/* Tool Details */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Tool Details</h3>
                <motion.button
                  onClick={handleCopyDetails}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 bg-white px-3 py-1 rounded-lg border hover:border-gray-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Details</span>
                    </>
                  )}
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tool:</span>
                  <div className="text-gray-900 capitalize">{toolOutput.toolName.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <div className={`capitalize ${
                    toolOutput.status === 'error' ? 'text-red-600' : 
                    toolOutput.status === 'timeout' ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {toolOutput.status}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Time:</span>
                  <div className="text-gray-900">{new Date(toolOutput.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <div className="text-gray-900">{toolOutput.duration || 'Unknown'}ms</div>
                </div>
              </div>
              {toolOutput.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="font-medium text-red-800">Error:</span>
                  <div className="text-red-700 text-sm mt-1">{toolOutput.error}</div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Issue Category *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value as IssueReport['category'])}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          category === cat.value
                            ? 'border-estate-500 bg-estate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-sm font-medium">{cat.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the issue *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-estate-500 focus:border-estate-500 resize-none"
                    rows={3}
                    placeholder="Please describe what went wrong..."
                    required
                  />
                </div>

                {/* Expected Behavior */}
                <div>
                  <label htmlFor="expected" className="block text-sm font-medium text-gray-700 mb-2">
                    What did you expect to happen?
                  </label>
                  <textarea
                    id="expected"
                    value={expectedBehavior}
                    onChange={(e) => setExpectedBehavior(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-estate-500 focus:border-estate-500 resize-none"
                    rows={2}
                    placeholder="Describe the expected behavior..."
                  />
                </div>

                {/* Reproduction Steps */}
                <div>
                  <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
                    Steps to reproduce
                  </label>
                  <textarea
                    id="steps"
                    value={reproductionSteps}
                    onChange={(e) => setReproductionSteps(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-estate-500 focus:border-estate-500 resize-none"
                    rows={2}
                    placeholder="1. First I...&#10;2. Then I...&#10;3. The error occurred..."
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your email (optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-estate-500 focus:border-estate-500"
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll contact you if we need more information
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!description.trim() || isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Report</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
