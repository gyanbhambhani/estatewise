import { NextRequest, NextResponse } from 'next/server';

const MCP_SERVER_URLS: Record<string, string> = {
  clientside: process.env.MCP_CLIENTSIDE_URL || 'http://localhost:8001',
  leadgen: process.env.MCP_LEADGEN_URL || 'http://localhost:8002',
  paperwork: process.env.MCP_PAPERWORK_URL || 'http://localhost:8003',
};

export async function POST(req: NextRequest) {
  try {
    const { server, message } = await req.json();
    if (!server || !message) {
      return NextResponse.json({ error: 'Missing server or message' }, { status: 400 });
    }
    const backendUrl = MCP_SERVER_URLS[server];
    if (!backendUrl) {
      return NextResponse.json({ error: 'Unknown MCP server' }, { status: 400 });
    }
    // Forward the message to the backend MCP server
    const backendRes = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
} 