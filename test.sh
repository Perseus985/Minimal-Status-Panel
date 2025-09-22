#!/bin/bash

echo "🧪 Starting plugin testing workflow..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Step 1: Run quality checks
print_status "📋 Running quality checks..."

if npm run typecheck; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript check failed"
    exit 1
fi

if npm run lint; then
    print_success "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# Step 2: Run tests
print_status "🧪 Running tests..."

if npm run test:ci; then
    print_success "Tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Step 3: Build plugin
print_status "📦 Building plugin..."

if npm run build; then
    print_success "Build completed"
else
    print_error "Build failed"
    exit 1
fi

# Step 4: Verify build artifacts
print_status "🔍 Verifying build artifacts..."

if [ ! -f "dist/plugin.json" ]; then
    print_error "plugin.json missing from build"
    exit 1
fi

if [ ! -f "dist/module.js" ]; then
    print_error "module.js missing from build"
    exit 1
fi

# Check plugin.json is valid JSON
if ! jq empty dist/plugin.json 2>/dev/null; then
    print_error "plugin.json is not valid JSON"
    exit 1
fi

# Check plugin ID matches package.json
PLUGIN_ID=$(jq -r '.id' dist/plugin.json)
PACKAGE_NAME=$(jq -r '.name' package.json)

if [ "$PLUGIN_ID" != "$PACKAGE_NAME" ]; then
    print_error "Plugin ID ($PLUGIN_ID) doesn't match package name ($PACKAGE_NAME)"
    exit 1
fi

# Check module.js is not empty
if [ ! -s "dist/module.js" ]; then
    print_error "module.js is empty"
    exit 1
fi

print_success "All build artifacts verified"

# Step 5: Start Docker environment
print_status "🐳 Starting Docker environment..."

docker compose down -v >/dev/null 2>&1
if docker compose up -d; then
    print_success "Docker containers started"
else
    print_error "Failed to start Docker containers"
    exit 1
fi

print_status "⏳ Waiting for services to be ready..."
sleep 15

# Step 6: Health checks
print_status "🔍 Checking service health..."

# Check Grafana
if curl -s http://localhost:3001/api/health | grep -q "ok" 2>/dev/null; then
    print_success "Grafana is healthy"
else
    print_warning "Grafana health check failed (might still be starting)"
fi

# Check Prometheus
if curl -s http://localhost:9090/-/healthy 2>/dev/null | grep -q "Prometheus" || \
   curl -s http://localhost:9090/api/v1/status/config 2>/dev/null | grep -q "status"; then
    print_success "Prometheus is healthy"
else
    print_warning "Prometheus health check failed (might still be starting)"
fi

# Check Blackbox Exporter
if curl -s http://localhost:9115/metrics 2>/dev/null | grep -q "blackbox" || \
   curl -s http://localhost:9115/ 2>/dev/null | grep -q "Blackbox"; then
    print_success "Blackbox Exporter is healthy"
else
    print_warning "Blackbox Exporter health check failed (might still be starting)"
fi

# Step 7: Check plugin loading
print_status "🔌 Checking plugin loading..."
sleep 5

# Check Grafana logs for plugin
if docker compose logs grafana 2>/dev/null | grep -q "minimal-status-panel"; then
    print_success "Plugin detected in Grafana logs"
else
    print_warning "Plugin not yet detected in logs (check manually)"
fi

# Final success message
echo ""
echo "🎉 Testing workflow completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "  🌐 Access Grafana: http://localhost:3001 (admin/admin)"
echo "  📊 Access Prometheus: http://localhost:9090"
echo "  🔍 Access Blackbox: http://localhost:9115"
echo ""
echo "🧪 Manual Testing:"
echo "  1. Create new dashboard in Grafana"
echo "  2. Add 'Minimal Status Panel' visualization"
echo "  3. Use query: probe_success"
echo "  4. Test all panel options"
echo ""
echo "📝 Check logs with: docker compose logs -f grafana"