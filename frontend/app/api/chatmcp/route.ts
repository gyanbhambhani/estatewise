import { NextRequest, NextResponse } from 'next/server';

// MCP server configuration - matching our backend setup
const MCP_SERVER_URLS: Record<string, string> = {
  clientside: process.env.MCP_CLIENTSIDE_URL || 'http://localhost:3003',
  leadgen: process.env.MCP_LEADGEN_URL || 'http://localhost:3001',
  paperwork: process.env.MCP_PAPERWORK_URL || 'http://localhost:3002',
};

export async function POST(req: NextRequest) {
  try {
    const { server, message } = await req.json();
    
    // Validate required fields
    if (!server || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'Both server and message are required' 
      }, { status: 400 });
    }

    const backendUrl = MCP_SERVER_URLS[server];
    if (!backendUrl) {
      return NextResponse.json({ 
        error: 'Unknown MCP server', 
        details: `Valid servers: ${Object.keys(MCP_SERVER_URLS).join(', ')}` 
      }, { status: 400 });
    }

    console.log(`Sending message to ${server} at ${backendUrl}:`, message);

    // Try multiple endpoint patterns for different MCP server implementations
    const endpoints = [
      '/chat',
      '/api/chat', 
      '/message',
      '/api/message',
      '/query',
      '/api/query'
    ];

    let lastError = '';
    let response: Response | null = null;

    for (const endpoint of endpoints) {
      try {
        const fullUrl = `${backendUrl}${endpoint}`;
        console.log(`Trying endpoint: ${fullUrl}`);

        response = await fetch(fullUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            message,
            prompt: message,
            query: message,
            text: message,
            input: message
          }),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Success from ${server}:`, data);
          
          // Handle different response formats
          let responseText = '';
          if (data.response) {
            responseText = data.response;
          } else if (data.message) {
            responseText = data.message;
          } else if (data.text) {
            responseText = data.text;
          } else if (data.content) {
            responseText = data.content;
          } else if (data.result) {
            responseText = typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2);
          } else if (data.data) {
            responseText = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
          } else if (typeof data === 'string') {
            responseText = data;
          } else {
            responseText = JSON.stringify(data, null, 2);
          }

          return NextResponse.json({
            response: responseText,
            server,
            endpoint: fullUrl,
            success: true,
            rawData: data
          });
        } else {
          lastError = `HTTP ${response.status} from ${fullUrl}: ${response.statusText}`;
          console.warn(lastError);
          
          // If 404, try next endpoint; otherwise break
          if (response.status !== 404) {
            break;
          }
        }
      } catch (error) {
        lastError = `Error connecting to ${backendUrl}${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(lastError);
        continue;
      }
    }

    // All endpoints failed
    console.error(`All endpoints failed for ${server}. Last error:`, lastError);
    
    // Provide helpful error message
    let userFriendlyError = `Unable to connect to ${server} server`;
    if (lastError.includes('ECONNREFUSED')) {
      userFriendlyError = `${server} server is not running. Please check if the MCP server is started.`;
    } else if (lastError.includes('timeout')) {
      userFriendlyError = `${server} server is not responding. Request timed out.`;
    } else if (response && response.status >= 500) {
      userFriendlyError = `${server} server encountered an internal error.`;
    }

    return NextResponse.json({ 
      error: userFriendlyError,
      details: lastError,
      server,
      triedEndpoints: endpoints.map(ep => `${backendUrl}${ep}`)
    }, { status: response?.status || 503 });

  } catch (err: any) {
    console.error('ChatMCP API error:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: err.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  const results: Record<string, any> = {};
  
  for (const [serverName, serverUrl] of Object.entries(MCP_SERVER_URLS)) {
    try {
      const response = await fetch(`${serverUrl}/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      results[serverName] = {
        status: response.ok ? 'online' : 'error',
        statusCode: response.status,
        url: serverUrl
      };
    } catch (error) {
      results[serverName] = {
        status: 'offline',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: serverUrl
      };
    }
  }
  
  return NextResponse.json({
    servers: results,
    timestamp: new Date().toISOString()
  });
} 