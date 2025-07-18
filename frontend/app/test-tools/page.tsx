"use client";

import React, { useState } from "react";

const MCP_ENDPOINTS = {
  generate_comps: "http://localhost:3003/generate_comps",
  draft_contract: "http://localhost:3002/draft_contract",
};

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

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🧪 MCP Test Tools</h1>

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