# Use Python 3.11 slim image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy shared utilities first (for better caching)
COPY shared/ ./shared/

# Copy MCP servers
COPY mcp-servers/ ./mcp-servers/

# Copy test files
COPY test-*.py ./

# Install dependencies for each MCP server
RUN pip install -r mcp-servers/leadgen/requirements.txt
RUN pip install -r mcp-servers/paperwork/requirements.txt
RUN pip install -r mcp-servers/clientside/requirements.txt

# Create a startup script
RUN echo '#!/bin/bash\n\
echo "Starting EstateWise MCP Servers..."\n\
\n\
# Start LeadGen MCP Server\n\
cd /app/mcp-servers/leadgen\n\
python main.py &\n\
LEADGEN_PID=$!\n\
echo "LeadGen MCP Server started (PID: $LEADGEN_PID)"\n\
\n\
# Start Paperwork MCP Server\n\
cd /app/mcp-servers/paperwork\n\
python main.py &\n\
PAPERWORK_PID=$!\n\
echo "Paperwork MCP Server started (PID: $PAPERWORK_PID)"\n\
\n\
# Start ClientSide MCP Server\n\
cd /app/mcp-servers/clientside\n\
python main.py &\n\
CLIENTSIDE_PID=$!\n\
echo "ClientSide MCP Server started (PID: $CLIENTSIDE_PID)"\n\
\n\
echo "All MCP servers are running:"\n\
echo "- LeadGen MCP: http://localhost:3001"\n\
echo "- Paperwork MCP: http://localhost:3002"\n\
echo "- ClientSide MCP: http://localhost:3003"\n\
\n\
# Wait for all processes\n\
wait $LEADGEN_PID $PAPERWORK_PID $CLIENTSIDE_PID\n\
' > /app/start-servers.sh && chmod +x /app/start-servers.sh

# Expose ports for all MCP servers
EXPOSE 3001 3002 3003

# Start all servers
CMD ["/app/start-servers.sh"] 