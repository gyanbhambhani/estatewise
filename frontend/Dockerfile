# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=base /app/next.config.js ./
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Expose the port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"] 