#!/bin/bash

# EstateWise Docker Startup Script
echo "🐳 Starting EstateWise with Docker"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys before continuing."
    echo "   Press Enter when ready to continue..."
    read
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting EstateWise services..."
docker-compose up -d

echo ""
echo "🎉 EstateWise is starting up!"
echo "=================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 LeadGen MCP: http://localhost:3001"
echo "📄 Paperwork MCP: http://localhost:3002"
echo "👥 ClientSide MCP: http://localhost:3003"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo "🔄 Restart services: docker-compose restart"
echo ""

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ EstateWise is ready!" 