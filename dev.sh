#!/bin/bash

# EstateWise Development Script
# This script starts all MCP servers and the frontend

echo "🚀 Starting EstateWise Development Environment"
echo "=============================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking ports..."
check_port 3000 || exit 1
check_port 3001 || exit 1
check_port 3002 || exit 1
check_port 3003 || exit 1
echo "✅ All ports are available"

# Function to start MCP server
start_mcp_server() {
    local name=$1
    local port=$2
    local dir=$3
    
    echo "🔄 Starting $name MCP Server on port $port..."
    cd "$dir" || exit 1
    
    # Check if uv is available
    if ! command -v uv &> /dev/null; then
        echo "❌ uv is not installed. Please install uv first: https://docs.astral.sh/uv/getting-started/installation/"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d ".venv" ]; then
        echo "📦 Installing dependencies for $name..."
        uv sync
    fi
    
    # Start the server
    uv run python main.py &
    local pid=$!
    echo "✅ $name MCP Server started (PID: $pid)"
    echo $pid > ".pid"
}

# Function to start frontend
start_frontend() {
    echo "🔄 Starting Next.js Frontend..."
    cd "apps/frontend" || exit 1
    
    # Check if pnpm is available
    if ! command -v pnpm &> /dev/null; then
        echo "❌ pnpm is not installed. Please install pnpm first: npm install -g pnpm"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        pnpm install
    fi
    
    # Start the frontend
    pnpm dev &
    local pid=$!
    echo "✅ Next.js Frontend started (PID: $pid)"
    echo $pid > ".pid"
}

# Create logs directory
mkdir -p logs

# Start all servers
echo ""
echo "🔄 Starting MCP Servers..."

start_mcp_server "LeadGen" 3001 "mcp-servers/leadgen"
sleep 2

start_mcp_server "Paperwork" 3002 "mcp-servers/paperwork"
sleep 2

start_mcp_server "ClientSide" 3003 "mcp-servers/clientside"
sleep 2

echo ""
echo "🔄 Starting Frontend..."
start_frontend

echo ""
echo "🎉 EstateWise Development Environment Started!"
echo "=============================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 LeadGen MCP: http://localhost:3001"
echo "📄 Paperwork MCP: http://localhost:3002"
echo "👥 ClientSide MCP: http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
trap 'echo ""; echo "🛑 Stopping all servers..."; pkill -f "uv run python main.py"; pkill -f "next dev"; echo "✅ All servers stopped"; exit 0' INT

# Keep script running
wait 