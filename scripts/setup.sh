#!/bin/bash

# Uptime Kuma Status Panel - Development Setup Script
# This script sets up the development environment for the plugin

set -e

echo "🚀 Setting up Uptime Kuma Status Panel development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the plugin
echo "🔨 Building plugin..."
npm run build

# Start development environment
echo "🐳 Starting development environment..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check if Grafana is ready
echo "🔍 Checking if Grafana is ready..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ Grafana is ready!"
        break
    fi
    echo "⏳ Waiting for Grafana... ($i/30)"
    sleep 2
done

# Check if Prometheus is ready
echo "🔍 Checking if Prometheus is ready..."
for i in {1..30}; do
    if curl -s http://localhost:9090/-/ready | grep -q "Prometheus is Ready"; then
        echo "✅ Prometheus is ready!"
        break
    fi
    echo "⏳ Waiting for Prometheus... ($i/30)"
    sleep 2
done

# Success message
echo ""
echo "🎉 Setup complete! Your development environment is ready."
echo ""
echo "📋 What's available:"
echo "  🌐 Grafana:         http://localhost:3001 (admin/admin)"
echo "  📊 Prometheus:      http://localhost:9090"
echo "  🔍 Blackbox:        http://localhost:9115"
echo ""
echo "🚀 Next steps:"
echo "  1. Open Grafana at http://localhost:3001"
echo "  2. Login with admin/admin"
echo "  3. Create a new dashboard"
echo "  4. Add the 'Uptime Kuma Status Panel' visualization"
echo "  5. Use query: probe_success"
echo ""
echo "🔧 Development commands:"
echo "  npm run dev         # Start development build with watch"
echo "  npm run build       # Production build"
echo "  npm run typecheck   # TypeScript checking"
echo "  npm run lint        # Code linting"
echo "  npm test           # Run tests"
echo ""
echo "📖 Documentation:"
echo "  README.md           # Main documentation"
echo "  CONTRIBUTING.md     # Contribution guidelines"
echo ""
echo "Happy coding! 🎯"