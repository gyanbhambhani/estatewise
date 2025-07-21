"use client";

import React, { useState } from "react";
import { useRef } from "react";

const MCP_ENDPOINTS = {
  generate_comps: "http://localhost:3003/generate_comps",
  draft_contract: "http://localhost:3002/draft_contract",
};

const MCP_CHAT_SERVERS = [
  { key: "clientside", label: "Clientside" },
  { key: "leadgen", label: "Leadgen" },
  { key: "paperwork", label: "Paperwork" },
];

export default function TestToolsPage() {
  // State for Generate Comps
  const [address, setAddress] = useState("");
  const [compsResult, setCompsResult] = useState<any>(null);
  const [compsLoading, setCompsLoading] = useState(false);
  const [compsError, setCompsError] = useState<string | null>(null);

  // State for Draft Contract
  const [buyerName, setBuyerName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [contractResult, setContractResult] = useState<any>(null);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);

  // Chat MCP state
  const [activeTab, setActiveTab] = useState("clientside");
  const [chatHistories, setChatHistories] = useState<Record<string, { sender: string; text: string }[]>>({
    clientside: [],
    leadgen: [],
    paperwork: [],
  });
  const [messageInput, setMessageInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleGenerateComps = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompsLoading(true);
    setCompsError(null);
    setCompsResult(null);
    try {
      const res = await fetch(MCP_ENDPOINTS.generate_comps, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCompsResult(data);
    } catch (err: any) {
      setCompsError(err.message || "Unknown error");
    } finally {
      setCompsLoading(false);
    }
  };

  const handleDraftContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setContractLoading(true);
    setContractError(null);
    setContractResult(null);
    try {
      const res = await fetch(MCP_ENDPOINTS.draft_contract, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyer_name: buyerName, property_address: propertyAddress }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setContractResult(data);
    } catch (err: any) {
      setContractError(err.message || "Unknown error");
    } finally {
      setContractLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatLoading(true);
    setChatError(null);
    const userMsg = { sender: "You", text: messageInput };
    setChatHistories(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg],
    }));
    setMessageInput("");
    try {
      const res = await fetch("/api/chatmcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: activeTab, message: userMsg.text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChatHistories(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { sender: MCP_CHAT_SERVERS.find(s => s.key === activeTab)?.label || activeTab, text: data.response || JSON.stringify(data) }],
      }));
    } catch (err: any) {
      setChatError(err.message || "Unknown error");
    } finally {
      setChatLoading(false);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🧪 MCP Test Tools</h1>

      {/* MCP Chat Section */}
      <div className="mb-10 p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-2">Chat MCP Servers</h2>
        <div className="flex gap-2 mb-4">
          {MCP_CHAT_SERVERS.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-1 rounded-t ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab(tab.key)}
              disabled={chatLoading}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded border mb-2">
          {chatHistories[activeTab].length === 0 && (
            <div className="text-gray-400 text-sm">No messages yet. Start the conversation!</div>
          )}
          {chatHistories[activeTab].map((msg, idx) => (
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

      {/* Generate Comps Section */}
      <form
        onSubmit={handleGenerateComps}
        className="mb-8 p-4 border rounded-lg bg-white shadow"
      >
        <h2 className="font-semibold mb-2">Generate Comps</h2>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="address" className="w-24">Address:</label>
          <input
            id="address"
            type="text"
            className="flex-1 border px-2 py-1 rounded"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={compsLoading}
          >
            {compsLoading ? "Loading..." : "Generate Comps"}
          </button>
        </div>
        {compsError && <div className="text-red-600 text-sm">{compsError}</div>}
        {compsResult && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
            {JSON.stringify(compsResult, null, 2)}
          </pre>
        )}
      </form>

      {/* Draft Contract Section */}
      <form
        onSubmit={handleDraftContract}
        className="mb-8 p-4 border rounded-lg bg-white shadow"
      >
        <h2 className="font-semibold mb-2">Draft Contract</h2>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="buyerName" className="w-24">Buyer Name:</label>
          <input
            id="buyerName"
            type="text"
            className="flex-1 border px-2 py-1 rounded"
            value={buyerName}
            onChange={e => setBuyerName(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="propertyAddress" className="w-24">Property Address:</label>
          <input
            id="propertyAddress"
            type="text"
            className="flex-1 border px-2 py-1 rounded"
            value={propertyAddress}
            onChange={e => setPropertyAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="ml-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={contractLoading}
          >
            {contractLoading ? "Loading..." : "Draft Contract"}
          </button>
        </div>
        {contractError && <div className="text-red-600 text-sm">{contractError}</div>}
        {contractResult && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
            {JSON.stringify(contractResult, null, 2)}
          </pre>
        )}
      </form>
    </div>
  );
} 