'use client'

import React from "react";
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Clock, Loader2, Bug, Copy, ExternalLink } from 'lucide-react'

export interface ToolOutput {
  id: string
  toolName: string
  status: 'pending' | 'running' | 'complete' | 'error' | 'timeout'
  data?: any
  error?: string
  timestamp: string
  duration?: number
  server?: string
}

export interface ToolOutputCardProps {
  output: ToolOutput
  onReportIssue?: (output: ToolOutput) => void
}

const ToolOutputCard: React.FC<ToolOutputCardProps> = ({ output, onReportIssue }) => {
  const { toolName, status, data, error, timestamp, duration, server } = output

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    running: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    complete: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    timeout: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const handleCopyError = () => {
    navigator.clipboard.writeText(error || 'Unknown error')
  }

  const handleReportIssue = () => {
    if (onReportIssue) {
      onReportIssue(output)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`bg-white rounded-xl border-2 ${config.borderColor} p-6 mb-4 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`p-2 rounded-lg ${config.bgColor}`}
            animate={status === 'running' ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: status === 'running' ? Infinity : 0, ease: "linear" }}
          >
            <Icon className={`w-5 h-5 ${config.color}`} />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {toolName.replace(/_/g, ' ')}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{new Date(timestamp).toLocaleTimeString()}</span>
              {server && <span>• {server}</span>}
              {duration && <span>• {duration}ms</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {(status === 'error' || status === 'timeout') && (
            <>
              <motion.button
                onClick={handleCopyError}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Copy error details"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleReportIssue}
                className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Report issue"
              >
                <Bug className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-600 text-sm mb-2"
          >
            Waiting to execute...
          </motion.div>
        )}

        {status === 'running' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-blue-600 text-sm mb-2"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🤖 AI is thinking...
            </motion.span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2"
          >
            <div className="text-red-800 text-sm font-medium mb-1">Error occurred</div>
            <div className="text-red-600 text-sm">{error || 'Unknown error'}</div>
          </motion.div>
        )}

        {status === 'timeout' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2"
          >
            <div className="text-orange-800 text-sm font-medium mb-1">Request timed out</div>
            <div className="text-orange-600 text-sm">The request took too long to complete. Please try again.</div>
          </motion.div>
        )}

        {status === 'complete' && data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
          >
            {renderToolOutput(toolName, data)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Helper function to render specific tool outputs
function renderToolOutput(toolName: string, data: any) {
  switch (toolName) {
    case 'generate_comps':
      if (data?.data?.comparable_properties) {
        const comps = data.data.comparable_properties;
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Comparable Properties</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sq Ft</th>
                  </tr>
                </thead>
                <tbody>
                  {comps.map((comp: any, idx: number) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{comp.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${comp.price?.toLocaleString?.() ?? comp.price}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{comp.sqft}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      break;

    case 'draft_contract':
      if (data?.contract_text) {
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Drafted Contract</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-auto">
              <pre className="whitespace-pre-wrap text-gray-800 text-sm">{data.contract_text}</pre>
            </div>
          </div>
        );
      }
      break;

    case 'generate_lead':
      if (data?.lead_id) {
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Lead Generated</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-800">
                <div><strong>Lead ID:</strong> {data.lead_id}</div>
                {data.client_name && <div><strong>Client:</strong> {data.client_name}</div>}
                {data.property_address && <div><strong>Property:</strong> {data.property_address}</div>}
              </div>
            </div>
          </div>
        );
      }
      break;

    default:
      // Generic JSON display for unknown tools
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Result</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-auto">
            <pre className="text-sm text-gray-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      );
  }

  return null;
}

export default ToolOutputCard 