---
layout: default
title: Validation Checklist - Internal Documentation
---

# Plugin Validation Checklist

## 🎯 **Pre-Release Validation Workflow**

Use this checklist to validate your plugin before releases or after major changes.

## 🚀 **Quick Validation (5 minutes)**

```bash
# Run the automated test script
./test.sh
```

**This script automatically:**
- ✅ Runs TypeScript checks
- ✅ Runs linting
- ✅ Runs unit tests
- ✅ Builds the plugin
- ✅ Validates build artifacts
- ✅ Starts Docker environment
- ✅ Performs health checks

## 📋 **Manual Validation Steps**

### **1. Access Grafana**
- 🌐 **URL**: http://localhost:3001
- 👤 **Login**: admin/admin
- 🎯 **Goal**: Verify Grafana loads without errors

### **2. Create Test Dashboard**
- ➕ Click "+" → "Dashboard" 
- ➕ Click "Add visualization"
- 🎯 **Goal**: Panel creation works

### **3. Select Data Source**
- 📊 Choose "Prometheus" 
- 🎯 **Goal**: Data source connectivity

### **4. Add Plugin Panel**
- 🔍 Find "Minimal Status Panel" in visualization list
- ✅ Should appear without errors
- 🎯 **Goal**: Plugin loads correctly

### **5. Test with Different Queries**

#### **Basic Query:**
```promql
probe_success
```
**Expected**: Shows real service status data

#### **Filtered Query:**
```promql
probe_success{job="blackbox"}
```
**Expected**: Shows only blackbox exporter results

#### **Multiple Metrics:**
```promql
{__name__=~"probe_success|probe_duration_seconds"}
```
**Expected**: Shows status and response time data

### **6. Test Display Modes**

#### **List Mode:**
- Switch to "List" display mode
- ✅ Services appear in vertical layout
- ✅ All information visible

#### **Grid Mode:**
- Switch to "Grid" display mode
- ✅ Services appear in responsive grid
- ✅ Cards resize appropriately

#### **Compact Mode:**
- Switch to "Compact" display mode
- ✅ Shows colored status dots only
- ✅ Tooltips work on hover

### **7. Test Display Levels**

#### **Ultra-Minimal:**
- Switch to "Ultra-minimal" level
- ✅ Shows only name and status
- ✅ Clean, minimal appearance

#### **Minimal:**
- Switch to "Minimal" level
- ✅ Shows name, status, and heartbeat
- ✅ Heartbeat bars are interactive

#### **Full:**
- Switch to "Full" level
- ✅ Shows all statistics and metrics
- ✅ Response times and uptime displayed

### **8. Test Custom Names**

```json
{
  "https://google.com": "Google Search",
  "https://github.com": "GitHub"
}
```

- Add custom names JSON
- ✅ Service names update correctly
- ✅ Invalid JSON doesn't crash plugin

### **9. Test Configuration Options**

#### **Toggle Options:**
- ✅ Show/Hide Labels works
- ✅ Show/Hide URLs works
- ✅ Show/Hide Response Time works
- ✅ Show/Hide Last Check works

#### **Limits and Refresh:**
- Set Max Items to 5
- ✅ Only 5 services shown
- Set Refresh Interval to 10s
- ✅ Panel refreshes automatically

### **10. Test Error Handling**

#### **No Data Scenario:**
- Use query with no results: `probe_success{instance="nonexistent"}`
- ✅ Shows "No status data available" message
- ✅ Provides helpful debug information

#### **Invalid Query:**
- Use malformed PromQL query
- ✅ Grafana shows query error
- ✅ Plugin handles gracefully

### **11. Browser Compatibility**

#### **Chrome/Edge:**
- ✅ All features work
- ✅ Animations smooth
- ✅ No console errors

#### **Firefox:**
- ✅ All features work
- ✅ Styling consistent
- ✅ No console errors

#### **Safari:**
- ✅ All features work
- ✅ Backdrop blur works
- ✅ No console errors

### **12. Mobile Testing**

#### **Phone Screen:**
- Resize browser to mobile width
- ✅ Navigation collapses to hamburger menu
- ✅ Content remains readable
- ✅ Buttons remain clickable

#### **Tablet Screen:**
- Resize browser to tablet width
- ✅ Grid adjusts column count
- ✅ Interface remains usable

## 🚨 **Critical Issues Checklist**

If any of these fail, **DO NOT RELEASE**:

- ❌ Plugin doesn't load in Grafana
- ❌ Console errors on plugin initialization
- ❌ Data not displaying with valid queries
- ❌ Configuration changes don't take effect
- ❌ Crashes browser or Grafana
- ❌ Memory leaks during prolonged use

## ✅ **Sign-off**

When all tests pass:

```bash
# Clean up test environment
docker compose down

# Tag release (if ready)
git tag v1.x.x
git push origin v1.x.x
```

**Validation completed by**: [Your Name]  
**Date**: [Date]  
**Version tested**: [Version]  
**Notes**: [Any additional notes]