import { NextRequest, NextResponse } from 'next/server';
import { fetchFromMCPPost } from '../../../utils/fetchFromMCP';

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

    // Use the shared utility to make the MCP request
    const mcpResponse = await fetchFromMCPPost(toolName, inputPayload || {});

    // Check if the MCP request was successful
    if (!mcpResponse.success) {
      return NextResponse.json(
        { error: mcpResponse.error },
        { status: 502 }
      );
    }

    // Return the MCP server response directly to the frontend
    return NextResponse.json(mcpResponse.data);

  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 