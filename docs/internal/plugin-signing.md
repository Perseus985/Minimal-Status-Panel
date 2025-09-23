---
layout: default
title: Plugin Signing Guide - Internal Documentation
---

# Plugin Signing Guide

## 🔧 **Fixed Issues**

### **1. Missing rootUrls Field**
✅ **Added to `plugin.json`:**
```json
{
  "rootUrls": [
    "https://github.com/Perseus985/Minimal-Status-Panel"
  ],
  "backend": false,
  "executable": "",
  "state": "stable",
  "signature": "community"
}
```

### **2. Deprecated API Key Warning**
⚠️ **GRAFANA_API_KEY is deprecated**
✅ **New method: GRAFANA_ACCESS_POLICY_TOKEN**

## 🚀 **How to Get New Access Policy Token**

### **Step 1: Create Access Policy**
1. Go to: https://grafana.com/orgs/YOUR_ORG/access-policies
2. Click **"Create access policy"**
3. **Name**: `Plugin Publishing Policy`
4. **Scopes**: Select `plugins:write` and `plugins:read`
5. **Resources**: All or specific plugins
6. Click **"Create"**

### **Step 2: Create Token**
1. In the access policy, click **"Add token"**
2. **Name**: `Plugin Signing Token`
3. **Expiration**: Set appropriate duration
4. Click **"Create token"**
5. **Copy the token** (you'll only see it once!)

### **Step 3: Use New Token**
```bash
# Set the new token (replaces GRAFANA_API_KEY)
export GRAFANA_ACCESS_POLICY_TOKEN="your-new-token-here"

# Build and sign
npm run build
npm run sign
```

## 🔄 **For GitHub Actions**

Update your repository secrets:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Delete old `GRAFANA_API_KEY` secret
3. Add new secret: `GRAFANA_ACCESS_POLICY_TOKEN`

## ⚠️ **Important Notes**

- Private plugins don't need signing
- Community plugins require signing for distribution
- Keep your access token secure and rotated regularly
- Test signing locally before deploying