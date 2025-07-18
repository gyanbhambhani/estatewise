# EstateWise Docker Guide

This guide covers how to run EstateWise using Docker and Docker Compose.

## 🐳 Quick Start

### Prerequisites
- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Install Docker Compose](https://docs.docker.com/compose/install/))

### One-Command Setup

```bash
# Clone and start EstateWise with Docker
git clone https://github.com/gyanbhambhani/estatewise.git
cd estatewise
./docker-start.sh
```

## 📁 Docker Files Structure

```
estatewise/
├── docker-compose.yml          # Development Docker Compose
├── docker-compose.prod.yml     # Production Docker Compose
├── docker-start.sh             # Docker startup script
├── nginx.conf                  # Nginx configuration
├── frontend/
│   ├── Dockerfile              # Frontend container
│   └── .dockerignore           # Frontend ignore rules
└── backend/
    ├── Dockerfile              # Backend container
    └── .dockerignore           # Backend ignore rules
```

## 🚀 Development with Docker

### Start All Services
```bash
# Using the startup script (recommended)
./docker-start.sh

# Or manually with docker-compose
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Stop Services
```bash
docker-compose down
```

### Rebuild and Restart
```bash
docker-compose up --build -d
```

## 🏭 Production Deployment

### Using Production Compose
```bash
# Start with production configuration
docker-compose -f docker-compose.prod.yml up -d

# With nginx reverse proxy
docker-compose -f docker-compose.prod.yml --profile production up -d
```

### Environment Variables
Create a `.env` file with production settings:

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

## 🔧 Docker Commands Reference

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

### Container Management
```bash
# Execute commands in running containers
docker-compose exec frontend sh
docker-compose exec backend sh

# View container resources
docker stats

# Clean up unused resources
docker system prune
```

## 🌐 Network Architecture

### Development
```
┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │
│   :3000     │◄──►│  :3001-3003 │
└─────────────┘    └─────────────┘
```

### Production (with Nginx)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Nginx    │    │   Frontend  │    │   Backend   │
│   :80/443   │◄──►│   :3000     │◄──►│  :3001-3003 │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🔒 Security Considerations

### Development
- Services run on localhost only
- No SSL/TLS encryption
- Debug mode enabled

### Production
- Use HTTPS with SSL certificates
- Configure firewall rules
- Set up proper environment variables
- Enable rate limiting (configured in nginx.conf)
- Use secrets management for API keys

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- Frontend: `http://localhost:3000/api/health`
- Backend: `http://localhost:3001/ping`
- Nginx: `http://localhost/health`

### Monitoring Commands
```bash
# Check service health
docker-compose ps

# View resource usage
docker stats

# Check logs for errors
docker-compose logs --tail=100 | grep ERROR
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild without cache
docker-compose build --no-cache

# Remove and recreate containers
docker-compose down
docker-compose up --force-recreate
```

#### Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
docker-compose exec frontend env | grep NEXT_PUBLIC
docker-compose exec backend env | grep CLAUDE
```

### Debug Mode
```bash
# Start with debug logging
DEBUG=true docker-compose up

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy with Docker Compose
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### Docker Registry
```bash
# Build and push images
docker build -t your-registry/estatewise-frontend ./frontend
docker build -t your-registry/estatewise-backend ./backend
docker push your-registry/estatewise-frontend
docker push your-registry/estatewise-backend
```

## 📈 Performance Optimization

### Resource Limits
The production compose file includes resource limits:
- Frontend: 512MB memory limit
- Backend: 1GB memory limit
- Nginx: Default limits

### Caching
- Docker layer caching for faster builds
- Next.js build cache
- Python package caching with uv

### Scaling
```bash
# Scale backend services (if needed)
docker-compose up --scale backend=3
```

## 🔧 Customization

### Adding New Services
1. Create Dockerfile for the service
2. Add service to docker-compose.yml
3. Update nginx.conf if needed
4. Add health checks

### Custom Build Arguments
```dockerfile
# In Dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
```

```yaml
# In docker-compose.yml
build:
  context: ./frontend
  args:
    NODE_ENV: production
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Nginx Documentation](https://nginx.org/en/docs/) 