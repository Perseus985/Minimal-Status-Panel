---
layout: default
title: GitHub Repository Setup - Internal Documentation
---

# GitHub Repository Setup for Semantic Release

## 🔧 Required Repository Settings

To enable semantic-release to work properly, you need to configure the following GitHub repository settings:

### 1. Actions Permissions
Go to **Settings** > **Actions** > **General** in your repository:

- **Actions permissions**: Set to "Allow all actions and reusable workflows"
- **Workflow permissions**: Set to "Read and write permissions"
- ✅ Check "Allow GitHub Actions to create and approve pull requests"

### 2. Branch Protection (Optional but Recommended)
Go to **Settings** > **Branches**:

- Add protection rule for `main` branch
- ✅ Check "Restrict pushes that create files"
- ✅ Check "Require status checks to pass before merging"
- Add status check: `Test & Lint`

### 3. Issues Settings
Go to **Settings** > **General**:

- ✅ Ensure "Issues" are enabled (for semantic-release failure notifications)

## 🚀 What the Updated Workflow Does

The workflow now has these permissions:
- `contents: write` - Push tags and update files
- `issues: write` - Create failure notification issues
- `pull-requests: write` - Comment on PRs if needed
- `id-token: write` - For secure token handling

## 🔄 Next Steps

1. **Update these repository settings** as described above
2. **Push any commit** with conventional message to `main`:
   ```bash
   git add .
   git commit -m "fix: update repository permissions for semantic-release"
   git push origin main
   ```

3. **Watch the Actions tab** - semantic-release should now work!

## 🎯 Test Commit Examples

```bash
# Patch release (1.0.0 → 1.0.1)
git commit -m "fix: resolve issue with status indicators"

# Minor release (1.0.0 → 1.1.0)
git commit -m "feat: add new display mode"

# Major release (1.0.0 → 2.0.0)
git commit -m "feat!: breaking change to API structure"
```

## 📋 Troubleshooting

### Issue: "Resource not accessible by integration"
**Solution**: Check workflow permissions are set to "Read and write"

### Issue: "Cannot create tag/release"
**Solution**: Ensure `contents: write` permission is granted

### Issue: "Plugin signing fails"
**Solution**: Check secrets are properly configured (see Plugin Signing Guide)