# EstateWise Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.11+ with `uv` package manager
- Node.js 18+ with `pnpm` package manager
- Claude Desktop (optional, for MCP integration)

### 1. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys (optional for initial testing)
# CLAUDE_API_KEY=your_key_here
```

### 2. Start Everything
```bash
# Run the development script
./dev.sh
```

This will:
- ✅ Install dependencies for all MCP servers
- ✅ Install frontend dependencies  
- ✅ Start all 3 MCP servers (ports 3001, 3002, 3003)
- ✅ Start Next.js frontend (port 3000)

### 3. Access the System
- **Frontend**: http://localhost:3000
- **LeadGen MCP**: http://localhost:3001
- **Paperwork MCP**: http://localhost:3002  
- **ClientSide MCP**: http://localhost:3003

### 4. Test MCP Servers
```bash
# Test all MCP servers are responding
python test-mcp-servers.py
```

## 🏗️ What's Built

### MCP Servers
Each server has a `ping()` tool for testing:

- **LeadGenMCP** (Port 3001)
  - `ping()` - Test connection
  - `generate_lead()` - Create new leads
  - `follow_up()` - Send follow-up messages

- **PaperworkMCP** (Port 3002)
  - `ping()` - Test connection
  - `fill_contract()` - Fill contract documents
  - `track_document()` - Track document status
  - `send_document()` - Send documents to clients

- **ClientSideMCP** (Port 3003)
  - `ping()` - Test connection
  - `generate_comps()` - Find comparable properties
  - `send_disclosure()` - Send disclosure documents
  - `compare_offers()` - Compare multiple offers

### Frontend Components
- **CommandPalette** - AI-powered command interface (⌘+K)
- **TimelineView** - Transaction workflow timeline
- **SmartCards** - Contextual action cards

### Shared Utilities
- **ClaudeClient** - API wrapper for Claude interactions
- **SchemaValidators** - Data validation for transactions

## 🔧 Development

### Adding New Tools
1. Add tool function to appropriate MCP server's tools file
2. Register tool in `main.py`
3. Update frontend components to use new tool

### Adding New MCP Servers
1. Create new directory in `mcp-servers/`
2. Copy structure from existing server
3. Add to `ClaudeConfig.json`
4. Update `dev.sh` script

### Frontend Development
```bash
cd apps/frontend
pnpm dev
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### MCP Server Not Starting
```bash
# Check dependencies
cd mcp-servers/leadgen
uv sync

# Check logs
tail -f logs/leadgen.log
```

### Frontend Not Loading
```bash
# Clear Next.js cache
cd apps/frontend
rm -rf .next
pnpm dev
```

## 📚 Next Steps

1. **Add Real API Keys** - Update `.env` with actual Claude API key
2. **Connect to Database** - Add PostgreSQL connection
3. **Add Authentication** - Implement user login
4. **Enhance Tools** - Add real functionality to MCP tools
5. **Deploy** - Deploy to Vercel/Heroku

## 🎯 Architecture Highlights

- **Modular Design** - Each MCP server is independent
- **FastMCP** - Lightweight MCP server implementation
- **Next.js 14** - Modern React with App Router
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety throughout
- **Framer Motion** - Smooth animations

The system is designed to be **clarity > cleverness** - easy to understand, extend, and maintain. 