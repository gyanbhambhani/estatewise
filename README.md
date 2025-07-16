# EstateWise - Modular AI Employee System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A modular AI employee powered by Model Context Protocol (MCP) servers for real estate transaction automation.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gyanbhambhani/estatewise.git
cd estatewise

# Setup environment
cp env.example .env

# Start everything
./dev.sh
```

**Access the system:**
- Frontend: http://localhost:3000
- LeadGen MCP: http://localhost:3001
- Paperwork MCP: http://localhost:3002
- ClientSide MCP: http://localhost:3003

## Architecture

The system is composed of multiple independent MCP servers, each responsible for a specific domain:

- **LeadGenMCP** - Handles lead generation and follow-up automation
- **PaperworkMCP** - Fills, tracks, and sends contracts, disclosures, timelines
- **ClientSideMCP** - Manages client-facing tasks like sending disclosures, generating comps, offer comparison

The **Next.js frontend** acts as the interaction layer with a command palette, smart cards, and timeline-based workflow interface.

## Repository Structure

```
repo/
├── apps/
│   └── frontend/          # Next.js + Tailwind UI (Vercel-friendly)
├── mcp-servers/
│   ├── leadgen/           # MCP server for lead generation
│   ├── paperwork/         # MCP server for contract + escrow tools
│   └── clientside/        # MCP server for comps, disclosures, etc.
├── shared/
│   └── utils/             # Common scraping, Claude API wrappers, schema validators
├── .env.example           # Environment config
├── ClaudeConfig.json      # For Claude Desktop integration
└── README.md              # This file
```

## Development Setup

### Prerequisites

- Python 3.11+ with `uv` package manager
- Node.js 18+ with `pnpm` package manager
- Claude Desktop (for MCP integration)

### Quick Start

1. **Clone and setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd apps/frontend
   pnpm install
   
   # MCP Servers
   cd ../../mcp-servers/leadgen
   uv sync
   
   cd ../paperwork
   uv sync
   
   cd ../clientside
   uv sync
   ```

3. **Run development servers:**
   ```bash
   # Terminal 1: Frontend
   cd apps/frontend
   pnpm dev
   
   # Terminal 2: LeadGen MCP Server
   cd mcp-servers/leadgen
   uv run python main.py
   
   # Terminal 3: Paperwork MCP Server
   cd mcp-servers/paperwork
   uv run python main.py
   
   # Terminal 4: ClientSide MCP Server
   cd mcp-servers/clientside
   uv run python main.py
   ```

4. **Configure Claude Desktop:**
   - Copy `ClaudeConfig.json` to your Claude Desktop config directory
   - Restart Claude Desktop

## MCP Servers

Each MCP server is built with FastMCP and includes:
- Dummy `ping()` tool for testing
- Modular structure for easy tool addition
- Standard MCP protocol compliance

### Available Tools

- **LeadGenMCP**: `ping()` - Test connection
- **PaperworkMCP**: `ping()` - Test connection  
- **ClientSideMCP**: `ping()` - Test connection

## Frontend Components

- **CommandPalette**: AI-powered command interface
- **TimelineView**: Transaction workflow timeline
- **SmartCards**: Contextual action cards

## Environment Variables

See `.env.example` for required environment variables:
- Claude API keys
- Database connections
- External service credentials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

1. Add new tools to MCP servers in their respective `tools/` directories
2. Update frontend components in `apps/frontend/components/`
3. Add shared utilities in `shared/utils/`
4. Test with `uv run python main.py` for each MCP server

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ for the real estate industry** 