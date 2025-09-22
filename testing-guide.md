# Docker Compose Testing Guide

## 🐳 **Complete Testing Workflow**

This guide shows you how to test your plugin build artifacts using the Docker Compose setup, ensuring everything works before deployment.

## 🎯 **Quick Start Testing**

### **1. Full Test Cycle**
```bash
# Clean build and test everything
npm run build
docker compose down
docker compose up -d
```

### **2. Access Testing Environment**
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Blackbox Exporter**: http://localhost:9115

## 🧪 **Detailed Testing Steps**

### **Step 1: Build and Prepare**
```bash
# 1. Clean previous builds
rm -rf dist/
rm -f *.zip

# 2. Install dependencies (if needed)
npm install

# 3. Run quality checks
npm run typecheck
npm run lint

# 4. Build the plugin
npm run build

# 5. Verify build output
ls -la dist/
```

**Expected output:**
```
dist/
├── CHANGELOG.md
├── LICENSE
├── README.md
├── module.js      # Main plugin file
├── module.js.map  # Source map
└── plugin.json    # Plugin metadata
```

### **Step 2: Validate Build Artifacts**
```bash
# Check plugin.json is valid
cat dist/plugin.json | jq '.'

# Verify module.js exists and has content
ls -lh dist/module.js

# Check for required plugin structure
grep -q "PanelPlugin" dist/module.js && echo "✅ PanelPlugin found" || echo "❌ PanelPlugin missing"
```

### **Step 3: Docker Environment Setup**
```bash
# Stop any running containers
docker compose down

# Clean up volumes (optional - removes data)
docker compose down -v

# Start fresh environment
docker compose up -d

# Check container status
docker compose ps

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10
```

### **Step 4: Verify Plugin Loading**
```bash
# Check Grafana logs for plugin loading
docker compose logs grafana | grep -i "minimal-status-panel"

# Should see something like:
# "Plugin loaded: minimal-status-panel"
# "Panel plugin minimal-status-panel loaded"
```

### **Step 5: Test Plugin in Grafana**

1. **Access Grafana**: http://localhost:3001
2. **Login**: admin/admin
3. **Create Test Dashboard**:
   - Click "+" → "Dashboard"
   - Click "Add visualization"
   - Select "Prometheus" as data source
   - Choose "Minimal Status Panel" as visualization

4. **Configure Panel**:
   ```promql
   # Test query
   probe_success
   ```

5. **Test Panel Options**:
   - Toggle "Display Level" (Minimal vs Full)
   - Toggle "Show URLs" (your new feature!)
   - Try "Custom Service Names" with:
   ```json
   {"https://google.com":"Google Test","https://github.com":"GitHub Test"}
   ```

## 🔍 **Advanced Testing Scenarios**

### **Test Different Data Sources**
```bash
# 1. Test with no data (fallback to mock data)
# Query: up{job="nonexistent"}

# 2. Test with real blackbox data
# Query: probe_success

# 3. Test with custom metrics
# Query: up{job="prometheus"}
```

### **Test Plugin Features**
1. **Display Modes**: List, Grid, Compact
2. **Display Levels**: Minimal vs Full
3. **URL Visibility**: Show/Hide URLs
4. **Custom Names**: JSON mapping functionality
5. **Heartbeat Visualization**: Hover tooltips
6. **Responsive Design**: Resize panel

### **Test Error Conditions**
```bash
# 1. Test with invalid Prometheus query
# Query: invalid_metric_name

# 2. Test with network issues
docker compose pause prometheus
# Refresh Grafana panel - should handle gracefully
docker compose unpause prometheus

# 3. Test with corrupted plugin file
# Temporarily modify dist/module.js
# Should see error in Grafana logs
```

## 🛠️ **Debugging Tools**

### **Browser Developer Tools**
```javascript
// Open browser console and check for errors
console.log('Plugin errors:', window.grafanaBootData?.user?.panels);

// Check network requests
// Look for failed API calls to Prometheus
```

### **Container Logs**
```bash
# Watch all logs
docker compose logs -f

# Watch specific service
docker compose logs -f grafana
docker compose logs -f prometheus
docker compose logs -f blackbox

# Search for errors
docker compose logs grafana | grep -i error
docker compose logs grafana | grep -i "minimal-status-panel"
```

### **Plugin File Inspection**
```bash
# Check if plugin files are mounted correctly
docker compose exec grafana ls -la /var/lib/grafana/plugins/minimal-status-panel/

# Compare with local dist folder
ls -la dist/

# Check plugin permissions
docker compose exec grafana ls -la /var/lib/grafana/plugins/
```

## 📋 **Testing Checklist**

### **Before Testing:**
- [ ] Code passes `npm run typecheck`
- [ ] Code passes `npm run lint`  
- [ ] Build completes successfully
- [ ] All required files in `dist/` folder
- [ ] `plugin.json` is valid JSON

### **During Testing:**
- [ ] Plugin loads without errors in Grafana logs
- [ ] Panel appears in visualization options
- [ ] Test data displays correctly
- [ ] All panel options work
- [ ] No console errors in browser
- [ ] Responsive design works
- [ ] Custom service names work

### **Feature-Specific Tests:**
- [ ] **URLs**: Toggle show/hide works
- [ ] **Display modes**: List, Grid, Compact all render
- [ ] **Display levels**: Minimal vs Full difference
- [ ] **Heartbeat bars**: Hover tooltips appear
- [ ] **Custom names**: JSON mapping applies
- [ ] **Theme support**: Works in light/dark mode

## 🚀 **Testing Automation Scripts**

### **Create Test Script**
```bash
# Create test.sh
cat > test.sh << 'EOF'
#!/bin/bash

echo "🧪 Starting plugin testing workflow..."

# Build
echo "📦 Building plugin..."
npm run build

# Verify build
echo "🔍 Verifying build artifacts..."
if [ ! -f "dist/plugin.json" ]; then
  echo "❌ plugin.json missing"
  exit 1
fi

if [ ! -f "dist/module.js" ]; then
  echo "❌ module.js missing"
  exit 1
fi

echo "✅ Build artifacts verified"

# Start Docker
echo "🐳 Starting Docker environment..."
docker compose down
docker compose up -d

echo "⏳ Waiting for services..."
sleep 15

# Check services
echo "🔍 Checking service health..."
if curl -s http://localhost:3001/api/health | grep -q "ok"; then
  echo "✅ Grafana is healthy"
else
  echo "❌ Grafana health check failed"
fi

if curl -s http://localhost:9090/-/healthy | grep -q "Prometheus"; then
  echo "✅ Prometheus is healthy"
else
  echo "❌ Prometheus health check failed"
fi

echo "✅ Testing environment ready!"
echo "🌐 Access Grafana at: http://localhost:3001 (admin/admin)"

EOF

chmod +x test.sh
```

### **Quick Plugin Reload Script**
```bash
# Create reload.sh
cat > reload.sh << 'EOF'
#!/bin/bash

echo "🔄 Quick plugin reload..."

# Build
npm run build

# Restart just Grafana (keeps data)
docker compose restart grafana

echo "⏳ Waiting for Grafana..."
sleep 5

echo "✅ Plugin reloaded!"

EOF

chmod +x reload.sh
```

## 🎯 **Usage Examples**

### **Daily Development:**
```bash
# Quick iteration cycle
./reload.sh
# Test in browser
# Make changes
# Repeat
```

### **Pre-commit Testing:**
```bash
# Full test before committing
./test.sh
# Verify everything works
# Commit changes
```

### **CI/CD Validation:**
```bash
# Same process as CI
npm run typecheck
npm run lint
npm run test:ci
npm run build
# Manual verification in Docker
```

## 🔧 **Troubleshooting**

### **Plugin Not Loading:**
```bash
# Check Grafana logs
docker compose logs grafana | grep -E "(error|fail|minimal-status-panel)"

# Verify plugin files
docker compose exec grafana ls -la /var/lib/grafana/plugins/minimal-status-panel/

# Check Grafana plugins config
docker compose exec grafana cat /etc/grafana/grafana.ini | grep -A5 -B5 plugins
```

### **Build Issues:**
```bash
# Clean build
rm -rf dist/ node_modules/
npm install
npm run build

# Check for TypeScript errors
npm run typecheck

# Check for lint errors
npm run lint
```

### **Docker Issues:**
```bash
# Full cleanup
docker compose down -v
docker system prune -f

# Rebuild and restart
docker compose up -d --build
```

## ✅ **Success Indicators**

### **Plugin Working Correctly:**
- ✅ No errors in Grafana logs
- ✅ Panel appears in visualization list
- ✅ Data displays correctly
- ✅ All options functional
- ✅ No browser console errors
- ✅ Responsive design works

### **Ready for Production:**
- ✅ All tests pass
- ✅ Manual testing complete
- ✅ No performance issues
- ✅ Plugin signed (optional)
- ✅ Documentation updated

**You now have a complete testing workflow for validating your plugin before deployment!** 🎉