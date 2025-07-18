# EstateWise 🏠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **Modular AI Employee System for Real Estate Transaction Automation**

EstateWise is a comprehensive AI-powered platform that automates real estate transactions through specialized Model Context Protocol (MCP) servers. Each server handles a specific domain, creating a modular, scalable system for real estate professionals.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

#### Prerequisites
- **Docker** and **Docker Compose** installed
- **Claude Desktop** (optional, for MCP integration)

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gyanbhambhani/estatewise.git
cd estatewise

# 2. Setup environment
cp env.example .env
# Edit .env with your API keys (optional for initial testing)

# 3. Start everything with Docker
./docker-start.sh
```

### Option 2: Local Development

#### Prerequisites
- **Python 3.11+** with [uv](https://docs.astral.sh/uv/getting-started/installation/) package manager
- **Node.js 18+** with [pnpm](https://pnpm.io/installation) package manager
- **Claude Desktop** (optional, for MCP integration)

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gyanbhambhani/estatewise.git
cd estatewise

# 2. Setup environment
cp env.example .env
# Edit .env with your API keys (optional for initial testing)

# 3. Start everything
./dev.sh
```

### Access Points
- **Frontend Dashboard**: http://localhost:3000
- **LeadGen MCP Server**: http://localhost:3001
- **Paperwork MCP Server**: http://localhost:3002
- **ClientSide MCP Server**: http://localhost:3003

## 🏗️ Architecture

EstateWise follows a **modular microservices architecture** with three specialized MCP servers:

### Core Components

| Component | Purpose | Port | Key Features |
|-----------|---------|------|--------------|
| **LeadGenMCP** | Lead generation & follow-up | 3001 | Lead creation, automated follow-ups |
| **PaperworkMCP** | Document management | 3002 | Contract filling, document tracking |
| **ClientSideMCP** | Client interactions | 3003 | Comps generation, disclosures |

### Frontend Interface
- **Command Palette** - AI-powered command interface (⌘+K)
- **Timeline View** - Transaction workflow visualization
- **Smart Cards** - Contextual action recommendations

## 📁 Project Structure

```
estatewise/
├── frontend/                        # Next.js + Tailwind UI
│   ├── app/                         # App Router pages
│   ├── components/                  # React components
│   └── [config files]               # Next.js, Tailwind, TypeScript
├── backend/                         # Backend services and utilities
│   ├── mcp-servers/                 # MCP servers
│   │   ├── leadgen/                 # Lead generation server
│   │   │   ├── main.py              # Server entry point
│   │   │   └── tools/               # Lead generation tools
│   │   ├── paperwork/               # Document management server
│   │   │   ├── main.py              # Server entry point
│   │   │   └── tools/               # Document tools
│   │   └── clientside/              # Client interaction server
│   │       ├── main.py              # Server entry point
│   │       └── tools/               # Client tools
│   ├── shared/                      # Common utilities
│   │   └── utils/                   # Shared utilities
│   │       ├── claude_client.py     # Claude API wrapper
│   │       └── schema_validators.py # Data validation
│   ├── test-mcp-servers.py          # Server testing utility
│   └── test_generate_comps.py       # Component testing utility
├── .env.example                     # Environment template
├── ClaudeConfig.json               # Claude Desktop config
└── dev.sh                          # Development startup script
```

## 🔧 Development

### Manual Setup (Alternative to dev.sh)

```bash
# Frontend Setup
cd frontend
pnpm install
pnpm dev

# MCP Servers Setup (in separate terminals)
cd backend/mcp-servers/leadgen
uv sync
uv run python main.py

cd backend/mcp-servers/paperwork
uv sync
uv run python main.py

cd backend/mcp-servers/clientside
uv sync
uv run python main.py
```

### Testing

```bash
# Test all MCP servers
cd backend
python test-mcp-servers.py

# Test individual servers
curl http://localhost:3001/ping  # LeadGen
curl http://localhost:3002/ping  # Paperwork
curl http://localhost:3003/ping  # ClientSide
```

## 🛠️ MCP Server Tools

### LeadGenMCP (Port 3001)
```python
# Available Tools
ping()                    # Test server connection
generate_lead()           # Create new lead from property/client data
follow_up()              # Send follow-up messages to leads
```

### PaperworkMCP (Port 3002)
```python
# Available Tools
ping()                    # Test server connection
fill_contract()           # Fill contract templates with data
track_document()          # Track document status and progress
send_document()           # Send documents to recipients
```

### ClientSideMCP (Port 3003)
```python
# Available Tools
ping()                    # Test server connection
generate_comps()          # Find comparable properties
send_disclosure()         # Send disclosure documents
compare_offers()          # Compare multiple offers
```

## 🎨 Frontend Components

### Command Palette
- **Keyboard Shortcut**: ⌘+K (Cmd+K)
- **Features**: AI-powered search, command filtering, keyboard navigation
- **Categories**: LeadGen, Paperwork, ClientSide

### Timeline View
- **Purpose**: Visual transaction workflow
- **Features**: Status tracking, filtering, action buttons
- **Status Types**: Completed, Pending, Overdue, Upcoming

### Smart Cards
- **Purpose**: Contextual action recommendations
- **Features**: Priority levels, status indicators, data display
- **Filters**: Category, Priority, Status

## 🔐 Environment Configuration

Create `.env` from `.env.example`:

```bash
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# MCP Server Configuration
LEADGEN_MCP_PORT=3001
PAPERWORK_MCP_PORT=3002
CLIENTSIDE_MCP_PORT=3003

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MCP_SERVERS=http://localhost:3001,http://localhost:3002,http://localhost:3003
```

## 🐳 Docker

### Quick Start with Docker

```bash
# Start all services
./docker-start.sh

# Or manually with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Commands

```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# Start services with logs
docker-compose up

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Rebuild and restart
docker-compose up --build -d
```

### Docker Architecture

- **Frontend Container**: Next.js application on port 3000
- **Backend Container**: All MCP servers (ports 3001-3003)
- **Network**: Internal communication between services
- **Volumes**: Persistent data storage (if needed)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Docker)
```bash
# Build and push to registry
docker build -t estatewise-backend ./backend
docker push your-registry/estatewise-backend

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** your changes: `python test-mcp-servers.py`
5. **Commit** your changes: `git commit -m 'Add amazing feature'`
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Development Guidelines

- **Code Style**: Follow existing patterns in each MCP server
- **Testing**: Add tests for new MCP tools
- **Documentation**: Update README for new features
- **Commits**: Use conventional commit messages

### Pull Request Process

```bash
# Create feature branch
git checkout -b "feature-name"

# Make your edits
# ... edit files ...

# Push to your remote branch
git push origin feature-name

# Go to GitHub, create your PR
# Wait for approval
# Squash and merge to main
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | `lsof -i :3000 && kill -9 <PID>` |
| MCP server not starting | `cd mcp-servers/leadgen && uv sync` |
| Frontend not loading | `cd apps/frontend && rm -rf .next && pnpm dev` |
| Dependencies missing | Run `./dev.sh` to install all dependencies |

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
./dev.sh
```

## 📚 Resources

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [FastMCP Documentation](https://github.com/fastmcp/fastmcp)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/gyanbhambhani/estatewise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gyanbhambhani/estatewise/discussions)
- **Email**: Open an issue for contact information

---

**Built with ❤️ for the real estate industry**

*EstateWise - Automating real estate transactions with AI* 