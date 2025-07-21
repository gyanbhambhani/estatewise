'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ToolOutput } from '../components/ToolOutputCard'
import { IssueReport } from '../components/IssueReportModal'

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

interface UseToolStreamOptions {
  maxOutputs?: number
  timeoutMs?: number
  retryAttempts?: number
  retryDelayMs?: number
}

interface ToolExecutionRequest {
  toolName: string
  server: string
  params?: Record<string, any>
}

export function useToolStream(options: UseToolStreamOptions = {}) {
  const {
    maxOutputs = 50,
    timeoutMs = 30000, // 30 seconds
    retryAttempts = 3,
    retryDelayMs = 1000
  } = options

  const [toolOutputs, setToolOutputs] = useState<ToolOutput[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [isStreamOpen, setIsStreamOpen] = useState(false)
  
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const retryCounters = useRef<Map<string, number>>(new Map())

  // Generate unique ID for tool execution
  const generateId = useCallback(() => {
    return `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Add a new tool output
  const addToolOutput = useCallback((output: Omit<ToolOutput, 'id'>) => {
    const newOutput: ToolOutput = {
      ...output,
      id: generateId()
    }

    setToolOutputs(prev => {
      const updated = [newOutput, ...prev].slice(0, maxOutputs)
      return updated
    })

    return newOutput.id
  }, [generateId, maxOutputs])

  // Update existing tool output
  const updateToolOutput = useCallback((id: string, updates: Partial<ToolOutput>) => {
    setToolOutputs(prev => 
      prev.map(output => 
        output.id === id ? { ...output, ...updates } : output
      )
    )
  }, [])

  // Simulate server connection check
  const checkServerConnection = useCallback(async () => {
    try {
      // Try to ping all three MCP servers
      const servers = [
        { name: 'LeadGen', port: 3001 },
        { name: 'Paperwork', port: 3002 },
        { name: 'ClientSide', port: 3003 }
      ]

      const promises = servers.map(async (server) => {
        try {
          const response = await fetch(`http://localhost:${server.port}/ping`, {
            method: 'GET',
            timeout: 5000,
          } as any)
          return response.ok
        } catch {
          return false
        }
      })

      const results = await Promise.all(promises)
      const allConnected = results.every(result => result)
      
      setConnectionStatus(allConnected ? 'connected' : 'disconnected')
      return allConnected
    } catch {
      setConnectionStatus('disconnected')
      return false
    }
  }, [])

  // Execute a tool with proper error handling and retries
  const executeTool = useCallback(async (request: ToolExecutionRequest) => {
    const outputId = addToolOutput({
      toolName: request.toolName,
      status: 'pending',
      timestamp: new Date().toISOString(),
      server: request.server
    })

    // Clear any existing timeout for this output
    const existingTimeout = timeoutRefs.current.get(outputId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set up timeout
    const timeout = setTimeout(() => {
      updateToolOutput(outputId, {
        status: 'timeout',
        error: `Tool execution timed out after ${timeoutMs}ms`
      })
      timeoutRefs.current.delete(outputId)
    }, timeoutMs)
    
    timeoutRefs.current.set(outputId, timeout)

    try {
      // Update to running status
      updateToolOutput(outputId, { status: 'running' })
      
      const startTime = Date.now()
      
      // Make the actual API call
      const response = await fetch(`/api/toolProxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: request.server,
          tool: request.toolName,
          params: request.params || {}
        })
      })

      const duration = Date.now() - startTime
      
      // Clear timeout
      clearTimeout(timeout)
      timeoutRefs.current.delete(outputId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      updateToolOutput(outputId, {
        status: 'complete',
        data,
        duration
      })

      // Reset retry counter on success
      retryCounters.current.delete(outputId)

      return { success: true, data, outputId }
    } catch (error) {
      // Clear timeout
      clearTimeout(timeout)
      timeoutRefs.current.delete(outputId)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Check if we should retry
      const currentRetries = retryCounters.current.get(outputId) || 0
      
      if (currentRetries < retryAttempts) {
        retryCounters.current.set(outputId, currentRetries + 1)
        
        updateToolOutput(outputId, {
          status: 'running',
          error: `Retry ${currentRetries + 1}/${retryAttempts}: ${errorMessage}`
        })

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelayMs * (currentRetries + 1)))
        
        // Recursive retry
        return executeTool(request)
      } else {
        // Final failure
        updateToolOutput(outputId, {
          status: 'error',
          error: errorMessage
        })

        retryCounters.current.delete(outputId)
        return { success: false, error: errorMessage, outputId }
      }
    }
  }, [addToolOutput, updateToolOutput, timeoutMs, retryAttempts, retryDelayMs])

  // Submit issue report
  const submitIssueReport = useCallback(async (report: IssueReport) => {
    try {
      const response = await fetch('/api/issue-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...report,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit issue report')
      }

      // Show success notification
      addToolOutput({
        toolName: 'issue_report',
        status: 'complete',
        timestamp: new Date().toISOString(),
        data: { message: 'Issue report submitted successfully' },
        server: 'system'
      })

      return true
    } catch (error) {
      console.error('Failed to submit issue report:', error)
      
      // Show error notification
      addToolOutput({
        toolName: 'issue_report',
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to submit issue report',
        server: 'system'
      })
      
      return false
    }
  }, [addToolOutput])

  // Clear all outputs
  const clearOutputs = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current.clear()
    retryCounters.current.clear()
    
    setToolOutputs([])
  }, [])

  // Retry connection
  const retryConnection = useCallback(async () => {
    setConnectionStatus('reconnecting')
    await new Promise(resolve => setTimeout(resolve, 1000)) // Brief delay for UX
    await checkServerConnection()
  }, [checkServerConnection])

  // Check connection on mount and periodically
  useEffect(() => {
    checkServerConnection()
    
    const interval = setInterval(checkServerConnection, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [checkServerConnection])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current.clear()
      retryCounters.current.clear()
    }
  }, [])

  return {
    // State
    toolOutputs,
    connectionStatus,
    isStreamOpen,
    
    // Actions
    executeTool,
    submitIssueReport,
    clearOutputs,
    retryConnection,
    setIsStreamOpen,
    
    // Helper functions
    addToolOutput,
    updateToolOutput
  }
}
