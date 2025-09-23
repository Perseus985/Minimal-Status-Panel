---
layout: default
title: Testing Guide - Internal Documentation
---

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
├── plugin.json    # Plugin metadata
└── img/           # Assets
```

### **Step 2: Start Test Environment**
```bash
# Stop any existing containers
docker compose down

# Start fresh environment
docker compose up -d

# Check all services are running
docker compose ps
```

**Expected services:**
- ✅ grafana (port 3001)
- ✅ prometheus (port 9090)
- ✅ blackbox-exporter (port 9115)

### **Step 3: Verify Services**
```bash
# Test Prometheus
curl http://localhost:9090/-/healthy
# Expected: Prometheus is Healthy.

# Test Blackbox Exporter
curl http://localhost:9115/
# Expected: HTML page loads

# Test Grafana
curl http://localhost:3001/api/health
# Expected: {"database":"ok","version":"..."}
```

### **Step 4: Plugin Testing in Grafana**

#### **4.1 Login to Grafana**
- Open: http://localhost:3001
- Login: admin/admin
- Change password if prompted

#### **4.2 Verify Plugin Installation**
- Go to: **Configuration** → **Plugins**
- Find: "Minimal Status Panel"
- Status: Should be "Enabled"

#### **4.3 Create Test Dashboard**
- Click: **+** → **Dashboard**
- Click: **Add visualization**
- Select: **Prometheus** data source
- Select: **Minimal Status Panel** visualization

#### **4.4 Test Basic Query**
```promql
probe_success
```

**Expected Results:**
- ✅ Panel loads without errors
- ✅ Shows service status data
- ✅ Displays google.com, github.com, prometheus
- ✅ Heartbeat bars are visible and interactive

### **Step 5: Advanced Testing**

#### **5.1 Test All Display Modes**
```bash
# In panel options, test:
- Display Mode: List, Grid, Compact
- Display Level: Ultra-minimal, Minimal, Full
```

#### **5.2 Test Custom Names**
```json
{
  "https://google.com": "Google Search",
  "https://github.com": "GitHub",
  "http://prometheus:9090": "Prometheus"
}
```

#### **5.3 Test Different Queries**
```promql
# Specific services
probe_success{instance="https://google.com"}

# With response time
{__name__=~"probe_success|probe_duration_seconds"}

# Filtered by job
probe_success{job="blackbox"}
```

### **Step 6: Performance Testing**

#### **6.1 Load Testing**
- Set Max Items to 100
- Set Refresh Interval to 5 seconds
- Monitor browser performance
- Check for memory leaks

#### **6.2 Error Handling**
```promql
# Test invalid query
invalid_metric_name

# Test no results
probe_success{instance="nonexistent"}
```

## 🔍 **Troubleshooting**

### **Plugin Not Loading**
```bash
# Check Grafana logs
docker compose logs grafana

# Common issues:
- plugin.json syntax errors
- Missing module.js
- Permission issues with mounted volume
```

### **No Data Showing**
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check if blackbox exporter is working
curl "http://localhost:9115/probe?target=https://google.com&module=http_2xx"
```

### **Services Not Responding**
```bash
# Restart all services
docker compose restart

# Check service health
docker compose ps
docker compose logs [service-name]
```

## 🧽 **Testing Checklist**

### **Build Quality**
- ✅ TypeScript compiles without errors
- ✅ ESLint passes without warnings
- ✅ Unit tests pass
- ✅ Build produces expected artifacts

### **Container Environment**
- ✅ All services start successfully
- ✅ Prometheus scrapes targets
- ✅ Blackbox exporter probes work
- ✅ Grafana connects to Prometheus

### **Plugin Functionality**
- ✅ Plugin appears in visualization list
- ✅ Panel loads with basic query
- ✅ All display modes work
- ✅ All display levels work
- ✅ Custom names work
- ✅ Error handling works

### **User Experience**
- ✅ Interface is responsive
- ✅ Animations are smooth
- ✅ No console errors
- ✅ Performance is acceptable

## 🔄 **Cleanup**

```bash
# Stop and remove containers
docker compose down

# Remove volumes (if needed)
docker compose down -v

# Clean build artifacts
npm run clean
```

## 🎆 **Success Criteria**

Your plugin is ready for release when:

1. ✅ All automated tests pass
2. ✅ Plugin loads in Grafana without errors
3. ✅ Basic functionality works with real data
4. ✅ All display modes render correctly
5. ✅ Configuration options work as expected
6. ✅ Error scenarios are handled gracefully
7. ✅ Performance is acceptable under load
8. ✅ No memory leaks detected

**Ready to release!** 🚀