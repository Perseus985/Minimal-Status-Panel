#!/bin/bash

echo "🔄 Quick plugin reload..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Build plugin
print_status "📦 Building plugin..."

if npm run build; then
    print_success "Build completed"
else
    print_error "Build failed"
    exit 1
fi

# Step 2: Restart Grafana container
print_status "🔄 Restarting Grafana..."

if docker compose restart grafana; then
    print_success "Grafana restarted"
else
    print_error "Failed to restart Grafana"
    exit 1
fi

print_status "⏳ Waiting for Grafana to be ready..."
sleep 8

# Step 3: Health check
print_status "🔍 Checking Grafana health..."

for i in {1..6}; do
    if curl -s http://localhost:3001/api/health | grep -q "ok" 2>/dev/null; then
        print_success "Grafana is ready!"
        break
    else
        if [ $i -eq 6 ]; then
            print_error "Grafana health check timeout"
            echo "Check with: docker compose logs grafana"
            exit 1
        fi
        echo "Waiting... ($i/6)"
        sleep 3
    fi
done

# Step 4: Check plugin logs
print_status "🔌 Checking plugin status..."
sleep 2

if docker compose logs grafana --since=30s 2>/dev/null | grep -q "minimal-status-panel"; then
    print_success "Plugin activity detected in logs"
else
    echo "No recent plugin logs (this might be normal)"
fi

echo ""
print_success "Plugin reload completed!"
echo ""
echo "🌐 Access Grafana: http://localhost:3001"
echo "📝 View logs: docker compose logs -f grafana"
echo "🔄 Refresh your browser if panel was already open"