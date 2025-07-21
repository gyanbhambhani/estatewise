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
  const [chatHistories, setChatHistories] = useState<Record<string, { sender: string; text: string; isError?: boolean }[]>>({
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
      
      if (!res.ok) {
        let errorMessage = "Failed to communicate with the server";
        
        switch (res.status) {
          case 400:
            errorMessage = "Invalid request. Please check your message and try again.";
            break;
          case 401:
            errorMessage = "Authentication failed. Please refresh the page and try again.";
            break;
          case 403:
            errorMessage = "Access denied. You don't have permission to access this server.";
            break;
          case 404:
            errorMessage = `The ${MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label} server is not available.`;
            break;
          case 429:
            errorMessage = "Too many requests. Please wait a moment before sending another message.";
            break;
          case 500:
            errorMessage = "Internal server error. The AI service is temporarily unavailable.";
            break;
          case 502:
          case 503:
            errorMessage = `The ${MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label} server is currently offline. Please try again later.`;
            break;
          case 504:
            errorMessage = "Request timeout. The server took too long to respond.";
            break;
          default:
            errorMessage = `Server error (${res.status}). Please try again or contact support.`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      
      if (!data.success && data.error) {
        throw new Error(data.details || data.error);
      }
      
      if (!data.response && !data.data && !data.message) {
        throw new Error("Received empty response from the AI server.");
      }
      
      // Extract the response text
      let responseText = data.response || data.message || data.text || data.content;
      
      if (!responseText) {
        responseText = typeof data.data === 'string' ? data.data : JSON.stringify(data, null, 2);
      }
      
      // Add the AI response to chat history
      setChatHistories(prev => ({
        ...prev,
        [activeChatTab]: [...prev[activeChatTab], { 
          sender: MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label || activeChatTab, 
          text: responseText
        }],
      }));
    } catch (err: any) {
      console.error('Chat error:', err);
      
      let userFriendlyError = "Unable to send message";
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        userFriendlyError = "Network error. Please check your internet connection and try again.";
      } else if (err.message.includes('timeout')) {
        userFriendlyError = "Request timed out. The server is taking too long to respond.";
      } else if (err.message) {
        userFriendlyError = err.message;
      }
      
      setChatError(userFriendlyError);
      
      // Remove the user message if there was an error
      setChatHistories(prev => ({
        ...prev,
        [activeChatTab]: prev[activeChatTab].slice(0, -1),
      }));
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
        
        {/* Additional chat-mode specific elements */}
        {activeView === 'chatmcp' && (
          <>
            <motion.div
              className="absolute top-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15"
              animate={{
                x: [0, -40, 0],
                y: [0, 20, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-15"
              animate={{
                x: [0, 25, 0],
                y: [0, -25, 0],
                rotate: [0, -180, -360]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </>
        )}
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
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden relative"
                whileHover={{ 
                  boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
                  y: -4
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-estate-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
                {/* Header */}
                <motion.div 
                  className="bg-gradient-to-r from-estate-600 via-blue-600 to-indigo-600 p-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-white"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Chat with MCP Servers
                      </motion.h2>
                      <motion.p 
                        className="text-blue-100 text-sm mt-1"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Connect directly with your AI-powered real estate assistants
                      </motion.p>
                    </div>
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-white to-blue-100 rounded-full opacity-80"></div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Server Tabs */}
                <motion.div 
                  className="px-6 pt-4 bg-gray-50/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex gap-1">
                    {MCP_CHAT_SERVERS.map((tab, index) => (
                                              <motion.button
                        key={tab.key}
                        className={`px-6 py-3 rounded-t-xl font-medium text-sm transition-all duration-300 relative overflow-hidden ${
                          activeChatTab === tab.key 
                            ? 'bg-white text-estate-700 shadow-lg border-t-2 border-estate-500' 
                            : 'bg-gray-100/50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                        onClick={() => setActiveChatTab(tab.key)}
                        disabled={chatLoading}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2">
                          <motion.div 
                            className={`w-2 h-2 rounded-full ${
                              activeChatTab === tab.key ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-400'
                            }`}
                            animate={activeChatTab === tab.key ? {
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.7, 1]
                            } : {}}
                            transition={{
                              duration: 2,
                              repeat: activeChatTab === tab.key ? Infinity : 0,
                              ease: "easeInOut"
                            }}
                          />
                          <span>{tab.label}</span>
                        </div>
                        {activeChatTab === tab.key && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-estate-500/10 to-blue-500/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Chat Messages Area */}
                <motion.div 
                  className="h-96 overflow-y-auto bg-gradient-to-br from-gray-50/30 via-white/50 to-blue-50/30 p-6 space-y-4 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-estate-500 to-blue-500" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)`
                  }}></div>
                  <AnimatePresence mode="popLayout">
                    {chatHistories[activeChatTab].length === 0 ? (
                      <motion.div 
                        className="flex flex-col items-center justify-center h-full text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-estate-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                        </motion.div>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                          Ready to chat with {MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                          Start a conversation by typing your question or request below. Your AI assistant is ready to help.
                        </p>
                      </motion.div>
                    ) : (
                      chatHistories[activeChatTab].map((msg, idx) => (
                        <motion.div 
                          key={idx} 
                          className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 25,
                            delay: idx * 0.05
                          }}
                        >
                          <div className={`max-w-sm lg:max-w-md xl:max-w-lg break-words ${
                            msg.sender === 'You' ? 'order-2' : 'order-1'
                          }`}>
                            <motion.div
                              className={`px-4 py-3 rounded-2xl shadow-sm relative overflow-hidden ${
                                msg.isError
                                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 mr-4'
                                  : msg.sender === 'You' 
                                    ? 'bg-gradient-to-r from-estate-500 to-blue-500 text-white ml-4' 
                                    : 'bg-white border border-gray-200 text-gray-800 mr-4'
                              }`}
                              whileHover={{ scale: msg.isError ? 1.01 : 1.02 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              {msg.sender === 'You' && !msg.isError && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '100%' }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                              )}
                              {msg.isError && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-red-100/30 to-transparent"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 0.3, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />
                              )}
                              <div className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                                msg.isError ? 'text-red-600' :
                                msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {msg.isError && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                  >
                                    ⚠️
                                  </motion.div>
                                )}
                                {msg.sender}
                              </div>
                              <div className="text-sm leading-relaxed relative z-10">{msg.text}</div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                  <div ref={chatBottomRef} />
                </motion.div>

                {/* Input Area */}
                <motion.div 
                  className="p-6 bg-white border-t border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <motion.div 
                      className="flex-1 relative"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300/50 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-estate-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder={`Ask ${MCP_CHAT_SERVERS.find(s => s.key === activeChatTab)?.label} anything...`}
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        disabled={chatLoading}
                        required
                      />
                    </motion.div>
                    <motion.button
                      type="submit"
                      className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative overflow-hidden ${
                        chatLoading || !messageInput.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-estate-500 to-blue-500 text-white hover:from-estate-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                      }`}
                      disabled={chatLoading || !messageInput.trim()}
                      whileHover={chatLoading || !messageInput.trim() ? {} : { scale: 1.05 }}
                      whileTap={chatLoading || !messageInput.trim() ? {} : { scale: 0.95 }}
                    >
                      {!chatLoading && !messageInput.trim() && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                      )}
                      {chatLoading ? (
                        <motion.div className="flex items-center space-x-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Sending...</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center space-x-2 relative z-10">
                          <span>Send Message</span>
                        </div>
                      )}
                    </motion.button>
                  </form>
                  
                  {chatError && (
                    <motion.div 
                      className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="flex items-start space-x-3">
                        <motion.div
                          className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mt-0.5"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-800 mb-1">
                            Message Failed
                          </h4>
                          <p className="text-red-700 text-sm leading-relaxed">
                            {chatError}
                          </p>
                          <motion.button
                            onClick={() => setChatError(null)}
                            className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Dismiss
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Command Palette - Hide in chat mode */}
          {activeView !== 'chatmcp' && (
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <CommandPalette />
            </motion.div>
          )}

          {/* Content Area - Hide in chat mode */}
          {activeView !== 'chatmcp' && (
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
          )}
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