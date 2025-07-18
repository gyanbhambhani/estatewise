import { NextRequest, NextResponse } from 'next/server';

// TODO: Move MCP base URL into .env.local
const MCP_BASE_URL = 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { toolName, inputPayload } = body;

    // Validate required fields
    if (!toolName) {
      return NextResponse.json(
        { error: 'toolName is required' },
        { status: 400 }
      );
    }

    // Construct the MCP server URL
    const mcpUrl = `${MCP_BASE_URL}/api/${toolName}`;

    // Forward the request to the MCP server
    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputPayload),
    });

    // Check if the MCP server responded successfully
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `MCP server error: ${errorText}` },
        { status: 502 }
      );
    }

    // Get the response from the MCP server
    const mcpResponse = await response.json();

    // Return the MCP server response directly to the frontend
    return NextResponse.json(mcpResponse);

  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 