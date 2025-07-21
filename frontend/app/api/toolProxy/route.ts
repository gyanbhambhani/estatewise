import { NextRequest, NextResponse } from 'next/server';

// MCP server configuration
const MCP_SERVERS = {
  leadgen: 'http://localhost:3001',
  paperwork: 'http://localhost:3002',
  clientside: 'http://localhost:3003'
} as const;

type ServerName = keyof typeof MCP_SERVERS;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { server, tool, params } = body;

    // Validate required fields
    if (!server || !tool) {
      return NextResponse.json(
        { error: 'server and tool are required' },
        { status: 400 }
      );
    }

    // Validate server exists
    if (!(server in MCP_SERVERS)) {
      return NextResponse.json(
        { error: `Invalid server: ${server}. Valid servers: ${Object.keys(MCP_SERVERS).join(', ')}` },
        { status: 400 }
      );
    }

    const serverUrl = MCP_SERVERS[server as ServerName];
    
    // Try common endpoint patterns
    const endpoints = [
      `${serverUrl}/tools/${tool}`,
      `${serverUrl}/api/${tool}`,
      `${serverUrl}/${tool}`
    ];

    let response: Response | null = null;
    let lastError: string | null = null;

    // Try each endpoint pattern
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params || {}),
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        const duration = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          
          return NextResponse.json({
            success: true,
            data,
            server,
            tool,
            duration,
            endpoint
          });
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          // If we get a 404, try the next endpoint
          if (response.status === 404) {
            continue;
          } else {
            // For other errors, return immediately
            break;
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        // Continue to try next endpoint
        continue;
      }
    }

    // If we get here, all endpoints failed
    const errorMessage = lastError || 'All endpoints failed';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      server,
      tool,
      triedEndpoints: endpoints
    }, { status: response?.status || 500 });

  } catch (error) {
    console.error('Tool proxy error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  const results: Record<string, any> = {};
  
  for (const [serverName, serverUrl] of Object.entries(MCP_SERVERS)) {
    try {
      const response = await fetch(`${serverUrl}/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health checks
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
  
  const allOnline = Object.values(results).every(r => r.status === 'online');
  
  return NextResponse.json({
    status: allOnline ? 'healthy' : 'partial',
    servers: results,
    timestamp: new Date().toISOString()
  });
} 