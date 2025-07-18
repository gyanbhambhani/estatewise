import React from "react";

export interface ToolOutputCardProps {
  toolName: string;
  data: any;
}

const ToolOutputCard: React.FC<ToolOutputCardProps> = ({ toolName, data }: ToolOutputCardProps) => {
  // Render for generate_comps
  if (toolName === "generate_comps" && data?.data?.comparable_properties) {
    const comps = data.data.comparable_properties;
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-lg font-semibold mb-2">Comparable Properties</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Sq Ft</th>
              </tr>
            </thead>
            <tbody>
              {comps.map((comp: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{comp.address}</td>
                  <td className="px-4 py-2">${comp.price?.toLocaleString?.() ?? comp.price}</td>
                  <td className="px-4 py-2">{comp.sqft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render for draft_contract
  if (toolName === "draft_contract" && data?.contract_text) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-lg font-semibold mb-2">Drafted Contract</h2>
        <div className="overflow-auto max-h-64 border rounded bg-gray-50 p-4">
          <pre className="whitespace-pre-wrap text-gray-800 text-sm">{data.contract_text}</pre>
        </div>
      </div>
    );
  }

  // Default: dump JSON
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h2 className="text-lg font-semibold mb-2">Tool Output</h2>
      <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ToolOutputCard; 