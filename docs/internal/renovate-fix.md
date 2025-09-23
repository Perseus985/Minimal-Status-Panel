---
layout: default
title: Renovate Configuration Fix - Internal Documentation
---

# Renovate Configuration Fix

## 🐛 Problem
Renovate updated dependencies that caused conflicts:
- React was updated to v19, but Grafana requires React v18
- Grafana packages were updated to v12, breaking React v18 compatibility

## 🔧 Solution
Updated `renovate.json` to:

### React Constraints:
- Block React v19 updates entirely
- Keep React ecosystem at v18.x only
- Prevent major version bumps for React packages

### Grafana Constraints:
- Keep Grafana packages at v10.x for React 18 compatibility
- Require manual review for Grafana updates

## 📋 Configuration Added:
```json
{
  "groupName": "React ecosystem",
  "allowedVersions": "^18.0.0",
  "description": "Keep React at v18 for Grafana compatibility"
},
{
  "groupName": "Grafana packages", 
  "allowedVersions": "^10.0.0",
  "description": "Keep Grafana packages at v10 for React 18 compatibility"
},
{
  "matchPackageNames": ["react", "react-dom"],
  "matchUpdateTypes": ["major"],
  "enabled": false,
  "description": "Block React 19 - incompatible with Grafana"
}
```

## ✅ Next Steps:
1. Commit this fix
2. Close/rebase the failing Renovate PR
3. Renovate will respect the new constraints going forward

## 🔍 Monitoring
- Check Renovate PRs don't propose React 19
- Ensure Grafana packages stay at v10.x
- Review dependency conflicts before merging