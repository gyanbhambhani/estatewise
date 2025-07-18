# EstateWise Frontend

This is the Next.js frontend application for EstateWise, providing a modern web interface for real estate transaction automation.

## Structure

```
frontend/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Key Features

- **Command Palette** - AI-powered command interface (⌘+K)
- **Timeline View** - Transaction workflow visualization
- **Smart Cards** - Contextual action recommendations
- **Modern UI** - Built with Tailwind CSS and Headless UI

## Development

The frontend communicates with the backend MCP servers running on ports 3001-3003. Make sure the backend servers are running before testing frontend functionality.

## Deployment

This frontend can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform. 