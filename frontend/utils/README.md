# Frontend Utils

## fetchFromMCP.ts

A shared utility for making requests to MCP (Model Context Protocol) servers with comprehensive error handling and logging.

### Features

- **Unified Error Handling**: Consistent error responses across all MCP requests
- **Timeout Support**: Configurable request timeouts with automatic cancellation
- **Comprehensive Logging**: Detailed request/response logging for debugging
- **TypeScript Support**: Full type safety with interfaces for requests and responses
- **Flexible Configuration**: Support for custom headers, methods, and options

### Usage

#### Basic Usage

```typescript
import { fetchFromMCP, fetchFromMCPPost, fetchFromMCPGet } from '@/utils/fetchFromMCP';

// Make a POST request to an MCP server
const response = await fetchFromMCPPost('clientside', {
  action: 'generate_offer',
  propertyData: { /* ... */ }
});

if (response.success) {
  console.log('Success:', response.data);
} else {
  console.error('Error:', response.error);
}
```

#### Advanced Usage

```typescript
import { fetchFromMCP } from '@/utils/fetchFromMCP';

// Custom configuration
const response = await fetchFromMCP('leadgen', payload, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Custom-Header': 'value'
  },
  timeout: 60000 // 60 seconds
});
```

#### Direct Frontend Usage

```typescript
// In a React component
const handleSubmit = async (formData: any) => {
  try {
    const result = await fetchFromMCPPost('paperwork', {
      documentType: 'contract',
      data: formData
    });
    
    if (result.success) {
      setDocument(result.data);
    } else {
      setError(result.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
```

### API Reference

#### `fetchFromMCP(endpoint, payload?, options?)`

Main utility function for making requests to MCP servers.

**Parameters:**
- `endpoint` (string): The MCP endpoint (e.g., 'clientside', 'leadgen', 'paperwork')
- `payload` (MCPRequestPayload, optional): Request payload
- `options` (FetchFromMCPOptions, optional): Request configuration

**Returns:** Promise<MCPResponse>

#### `fetchFromMCPPost(endpoint, payload, options?)`

Convenience function for POST requests.

#### `fetchFromMCPGet(endpoint, options?)`

Convenience function for GET requests.

### Response Format

All functions return a standardized response object:

```typescript
interface MCPResponse {
  success?: boolean;    // Whether the request was successful
  data?: any;          // Response data (if successful)
  error?: string;      // Error message (if failed)
  status?: number;     // HTTP status code
  errorType?: string;  // Type of error (TIMEOUT, NETWORK, UNKNOWN)
  endpoint?: string;   // The endpoint that was called
}
```

### Error Types

- **TIMEOUT**: Request timed out
- **NETWORK**: Network connectivity issues
- **UNKNOWN**: Other unexpected errors

### Configuration

The MCP base URL is currently hardcoded as `http://localhost:3001`. This should be moved to environment variables in production.

### Logging

The utility provides comprehensive logging:
- Request details (URL, method, payload)
- Success responses
- Error details with context
- Network and timeout errors

All logs are prefixed with `[fetchFromMCP]` for easy filtering. 