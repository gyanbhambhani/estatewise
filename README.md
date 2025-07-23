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
- **Claude Desktop** (optional, for MCP integration with OpenAI)

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
- **Claude Desktop** (optional, for MCP integration with OpenAI)

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
- **Landing Page**: http://localhost:3000
- **Sign In**: http://localhost:3000/signin
- **Sign Up**: http://localhost:3000/signup
- **Dashboard**: http://localhost:3000/dashboard
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
- **Landing Page** - Showcase EstateWise features and benefits
- **Authentication** - Sign in/Sign up with modern UI
- **Dashboard** - AI-powered command interface (⌘+K)
- **Timeline View** - Transaction workflow visualization
- **Smart Cards** - Contextual action recommendations

## 📁 Project Structure

```
estatewise/
├── frontend/                        # Next.js + Tailwind UI
│   ├── app/                         # App Router pages
│   │   ├── page.tsx                 # Landing page
│   │   ├── signin/                  # Sign in page
│   │   ├── signup/                  # Sign up page
│   │   └── dashboard/               # Main dashboard
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
```

## 🎯 Features

### Landing Page
- **Modern Design** - Beautiful, responsive landing page showcasing EstateWise
- **Feature Highlights** - Overview of AI-powered real estate tools
- **Call-to-Action** - Easy sign-up and demo access

### Authentication
- **Sign In/Sign Up** - Modern authentication forms with social login options
- **User Onboarding** - Role-based registration for real estate professionals
- **Secure Access** - Protected dashboard access

### Dashboard
- **Command Palette** - AI-powered command interface (⌘+K)
- **Timeline View** - Transaction workflow visualization
- **Smart Cards** - Contextual action recommendations
- **Chat MCP** - Direct communication with AI servers
- **Tool Streaming** - Real-time tool execution monitoring

## 🔧 Development

### Frontend Development
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Development
```bash
cd backend
uv sync
uv run python -m mcp-servers.leadgen.main
uv run python -m mcp-servers.paperwork.main
uv run python -m mcp-servers.clientside.main
```

## 📊 API Endpoints

### MCP Servers
- **LeadGen MCP**: `http://localhost:3001/mcp/`
- **Paperwork MCP**: `http://localhost:3002/mcp/`
- **ClientSide MCP**: `http://localhost:3003/mcp/`

### Frontend API Routes
- **Chat MCP**: `/api/chatmcp` - Chat with MCP servers
- **Tool Proxy**: `/api/toolProxy` - Tool execution proxy
- **Issue Report**: `/api/issue-report` - Report issues

## 🚀 Deployment

### Production with Docker
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# With nginx reverse proxy
docker-compose -f docker-compose.prod.yml --profile production up -d
```

### Environment Variables
Create a `.env` file with your production settings:

```bash
# Claude API Configuration
CLAUDE_API_KEY=your_production_api_key
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_MCP_SERVERS=https://your-domain.com/3001,https://your-domain.com/3002,https://your-domain.com/3003

# Backend Configuration
LOG_LEVEL=INFO
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [DOCKER.md](DOCKER.md) for Docker setup
- **Issues**: [GitHub Issues](https://github.com/gyanbhambhani/estatewise/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gyanbhambhani/estatewise/discussions)

---

**EstateWise** - Transforming real estate with AI-powered automation 🏠✨ 