'use client'

import { useState, useEffect, useRef } from 'react'
import CommandPalette from '@/components/CommandPalette'
import TimelineView from '@/components/TimelineView'
import SmartCards from '@/components/SmartCards'
import ToolStream from '@/components/ToolStream'
import FloatingActionButton from '@/components/FloatingActionButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useToolStream } from '@/hooks/useToolStream'

const MCP_CHAT_SERVERS = [
  { key: "clientside", label: "Clientside" },
  { key: "leadgen", label: "Leadgen" },
  { key: "paperwork", label: "Paperwork" },
];

export default function Home() {
  const [activeView, setActiveView] = useState<'timeline' | 'cards' | 'tools' | 'chatmcp'>('timeline')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showToolStream, setShowToolStream] = useState(false)
  
  const { 
    toolOutputs, 
    connectionStatus, 
    isStreamOpen,
    submitIssueReport 
  } = useToolStream()

  // Chat MCP state
  const [activeChatTab, setActiveChatTab] = useState("clientside");
  const [chatHistories, setChatHistories] = useState<Record<string, { sender: string; text: string }[]>>({
    clientside: [],
    leadgen: [],
    paperwork: [],
  });
  const [messageInput, setMessageInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // When tools view is selected, show the tool stream
  useEffect(() => {
    if (activeView === 'tools') {
      setShowToolStream(true)
      // Reset to timeline so the button isn't stuck in "active" state
      setActiveView('timeline')
    }
  }, [activeView])

  const handleCloseToolStream = () => {
    setShowToolStream(false)
    setActiveView('timeline') // Go back to timeline when closed
  }

  const handleReportIssue = (output: any) => {
    // For now, let's create a simple issue report
    const issueReport = {
      toolOutput: output,
      category: 'bug' as const,
      description: `Issue with tool execution: ${output.toolName}`,
      email: '',
      additionalInfo: ''
    }
    submitIssueReport(issueReport)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatLoading(true);
    setChatError(null);
    const userMsg = { sender: "You", text: messageInput };
    setChatHistories(prev => ({
      ...prev,
      [activeChatTab]: [...prev[activeChatTab], userMsg],
    }));
    setMessageInput("");
    try {
      const res = await fetch("/api/chatmcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: activeChatTab, message: userMsg.text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChatHistories(prev => ({
        ...prev,
        [activeChatTab]: [...prev[activeChatTab], { sender: MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label || activeChatTab, text: data.response || JSON.stringify(data) }],
      }));
    } catch (err: any) {
      setChatError(err.message || "Unknown error");
    } finally {
      setChatLoading(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-estate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-estate-200 to-blue-200 rounded-full opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-estate-300 to-cyan-300 rounded-full opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      {/* Header */}
      <motion.header 
        className="bg-white/80 shadow-sm border-b border-gray-200/50 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h1 
                className="text-2xl font-bold text-estate-900"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                EstateWise
              </motion.h1>
              <motion.span 
                className="ml-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                AI-Powered Real Estate Assistant
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setActiveView('timeline')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'timeline'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Timeline
              </motion.button>
              <motion.button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'cards'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Smart Cards
              </motion.button>
              <motion.button
                onClick={() => setActiveView('tools')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'tools'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Tool Streaming
              </motion.button>
              <motion.button
                onClick={() => setActiveView('chatmcp')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'chatmcp'
                    ? 'bg-estate-100 text-estate-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Chat MCP
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Chat MCP Section */}
          {activeView === 'chatmcp' && (
            <div className="mb-8 p-4 border rounded-lg bg-white/90 shadow">
              <h2 className="font-semibold mb-2">Chat MCP Servers</h2>
              <div className="flex gap-2 mb-4">
                {MCP_CHAT_SERVERS.map(tab => (
                  <button
                    key={tab.key}
                    className={`px-4 py-1 rounded-t ${activeChatTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveChatTab(tab.key)}
                    disabled={chatLoading}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded border mb-2">
                {chatHistories[activeChatTab].length === 0 && (
                  <div className="text-gray-400 text-sm">No messages yet. Start the conversation!</div>
                )}
                {chatHistories[activeChatTab].map((msg, idx) => (
                  <div key={idx} className={`mb-2 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-1 rounded-lg max-w-xs break-words ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <span className="block text-xs font-semibold mb-0.5">{msg.sender}</span>
                      <span>{msg.text}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border px-2 py-1 rounded"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  disabled={chatLoading}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={chatLoading || !messageInput.trim()}
                >
                  {chatLoading ? "Sending..." : "Send"}
                </button>
              </form>
              {chatError && <div className="text-red-600 text-sm mt-2">{chatError}</div>}
            </div>
          )}

          {/* Command Palette */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <CommandPalette />
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="bg-white/80 rounded-xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            layout
            whileHover={{ 
              boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
              y: -2
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: activeView === 'timeline' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeView === 'timeline' ? 20 : -20 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth transitions
                }}
              >
                {activeView === 'timeline' ? (
                  <TimelineView />
                ) : (
                  <SmartCards />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* Status Bar */}
      <motion.footer 
        className="bg-white/80 border-t border-gray-200/50 mt-auto backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <span>LeadGen MCP: Online</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                ></motion.div>
                <span>Paperwork MCP: Online</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                ></motion.div>
                <span>ClientSide MCP: Online</span>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              EstateWise v0.1.0
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Tool Stream Modal */}
      <ToolStream 
        isOpen={showToolStream}
        onClose={handleCloseToolStream}
        toolExecutions={toolOutputs}
        connectionStatus={connectionStatus}
        onReportIssue={handleReportIssue}
      />
    </motion.div>
  )
} 