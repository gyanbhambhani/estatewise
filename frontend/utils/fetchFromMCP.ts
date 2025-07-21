// TODO: Move MCP base URL into .env.local
const MCP_BASE_URL = 'http://localhost:3001';

export interface MCPRequestPayload {
  [key: string]: any;
}

export interface MCPResponse {
  success?: boolean;
  data?: any;
  error?: string;
  [key: string]: any;
}

export interface FetchFromMCPOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Shared utility for fetching data from MCP servers
 * @param endpoint - The MCP endpoint to call (e.g., 'clientside', 'leadgen', 'paperwork')
 * @param payload - The payload to send to the MCP server
 * @param options - Optional configuration for the request
 * @returns Promise<MCPResponse> - The response from the MCP server
 */
export async function fetchFromMCP(
  endpoint: string,
  payload?: MCPRequestPayload,
  options: FetchFromMCPOptions = {}
): Promise<MCPResponse> {
  const {
    method = 'POST',
    headers = {},
    timeout = 30000 // 30 second default timeout
  } = options;

  const url = `${MCP_BASE_URL}/api/${endpoint}`;
  
  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Prepare request configuration
    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    };

    // Add body for non-GET requests
    if (method !== 'GET' && payload) {
      requestConfig.body = JSON.stringify(payload);
    }

    console.log(`[fetchFromMCP] Making ${method} request to: ${url}`);
    if (payload) {
      console.log(`[fetchFromMCP] Payload:`, payload);
    }

    // Make the request
    const response = await fetch(url, requestConfig);
    
    // Clear timeout since request completed
    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `MCP server error (${response.status}): ${errorText}`;
      
      console.error(`[fetchFromMCP] Error response from ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    // Parse response
    const responseData = await response.json();
    
    console.log(`[fetchFromMCP] Success response from ${url}:`, responseData);
    
    return {
      success: true,
      data: responseData,
      status: response.status
    };

  } catch (error) {
    // Handle different types of errors
    let errorMessage: string;
    let errorType: string;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Request timeout after ${timeout}ms`;
        errorType = 'TIMEOUT';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - unable to connect to MCP server';
        errorType = 'NETWORK';
      } else {
        errorMessage = error.message;
        errorType = 'UNKNOWN';
      }
    } else {
      errorMessage = 'Unknown error occurred';
      errorType = 'UNKNOWN';
    }

    console.error(`[fetchFromMCP] Error calling ${url}:`, {
      error: errorMessage,
      type: errorType,
      endpoint,
      payload
    });

    return {
      success: false,
      error: errorMessage,
      errorType,
      endpoint
    };
  }
}

/**
 * Convenience function for making GET requests to MCP servers
 */
export async function fetchFromMCPGet(
  endpoint: string,
  options?: Omit<FetchFromMCPOptions, 'method'>
): Promise<MCPResponse> {
  return fetchFromMCP(endpoint, undefined, { ...options, method: 'GET' });
}

/**
 * Convenience function for making POST requests to MCP servers
 */
export async function fetchFromMCPPost(
  endpoint: string,
  payload: MCPRequestPayload,
  options?: Omit<FetchFromMCPOptions, 'method'>
): Promise<MCPResponse> {
  return fetchFromMCP(endpoint, payload, { ...options, method: 'POST' });
} 