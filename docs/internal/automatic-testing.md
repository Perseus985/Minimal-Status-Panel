---
layout: default
title: Automatic Testing - Internal Documentation
---

# Automatic Testing Information

## 🤖 **Automated Testing Pipeline**

This document outlines the automatic testing infrastructure for the Minimal Status Panel plugin.

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflows**

#### **1. Test & Lint Workflow** (`.github/workflows/ci.yml`)
```yaml
# Triggers on every push and PR
- TypeScript compilation check
- ESLint code quality check
- Jest unit tests
- Build verification
```

#### **2. Release Workflow** (`.github/workflows/release.yml`)
```yaml
# Triggers on main branch push
- Semantic version analysis
- Build and package plugin
- Create GitHub release
- Upload release artifacts
```

### **Testing Matrix**
- **Node.js versions**: 18.x, 20.x
- **Operating Systems**: ubuntu-latest
- **Grafana versions**: 9.0+, 10.0+

## 🧪 **Test Types**

### **1. Unit Tests** (`src/__tests__/`)
```bash
npm test
```
- Component rendering tests
- Data parsing logic tests
- Configuration validation tests
- Error handling tests

### **2. Integration Tests**
```bash
npm run test:integration
```
- Plugin loading in Grafana environment
- Data source connectivity tests
- Panel configuration tests

### **3. End-to-End Tests**
```bash
npm run test:e2e
```
- Full user workflow testing
- Visual regression testing
- Cross-browser compatibility

## 📊 **Test Coverage**

### **Current Coverage Targets**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

### **Coverage Report**
```bash
npm run test:coverage
```

## 🚀 **Automated Deployment**

### **Release Process**
1. **Code pushed to main**
2. **Tests run automatically**
3. **Semantic version calculated**
4. **Plugin built and packaged**
5. **GitHub release created**
6. **Artifacts uploaded**

### **Version Bumping**
```bash
# Patch: fix: commit message
# Minor: feat: commit message
# Major: feat!: commit message
```

## 📋 **Test Scripts**

### **Package.json Scripts**
```json
{
  "test": "jest",
  "test:ci": "jest --ci --coverage --watchAll=false",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix"
}
```

### **Docker Testing**
```bash
# Automated integration testing
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🔍 **Quality Gates**

### **Pre-commit Hooks**
- Prettier code formatting
- ESLint validation
- TypeScript compilation
- Unit test execution

### **PR Requirements**
- All tests must pass
- Code coverage maintained
- Linting passes
- Build succeeds

### **Branch Protection**
- Require status checks
- Require up-to-date branches
- Require review approval

## 📈 **Monitoring & Metrics**

### **Build Metrics**
- Build time tracking
- Test execution time
- Bundle size monitoring
- Performance benchmarks

### **Quality Metrics**
- Test coverage trends
- Code complexity scores
- Dependency vulnerability scans
- Performance regression detection

## 🚨 **Failure Handling**

### **Test Failures**
- Automatic issue creation
- Slack/email notifications
- Failed build artifacts retention
- Automatic retry on transient failures

### **Release Failures**
- Rollback procedures
- Error reporting
- Manual intervention triggers

## 🔧 **Local Testing Setup**

### **Prerequisites**
```bash
# Install dependencies
npm install

# Install testing tools
npm install -g jest @testing-library/react
```

### **Running Tests Locally**
```bash
# Run all tests
npm test

# Run specific test file
npm test StatusPanel.test.tsx

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 📝 **Test Configuration**

### **Jest Configuration** (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
```

### **ESLint Configuration** (`.eslintrc.js`)
```javascript
module.exports = {
  extends: [
    '@grafana/eslint-config',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Custom rules
  }
};
```

## 🎯 **Testing Best Practices**

### **Test Structure**
- Follow AAA pattern (Arrange, Act, Assert)
- Use descriptive test names
- Test one thing per test
- Mock external dependencies

### **Component Testing**
```typescript
// Example test structure
describe('StatusPanel', () => {
  const mockData = createMockPanelData();

  it('should render with valid data', () => {
    render(<StatusPanel {...mockProps} />);
    expect(screen.getByText('Service Name')).toBeInTheDocument();
  });
});
```

### **Data Testing**
```typescript
// Test data parsing
describe('parseDataFrames', () => {
  it('should parse prometheus metrics correctly', () => {
    const result = parseDataFrames(mockDataFrames);
    expect(result).toHaveLength(3);
    expect(result[0].status).toBe('up');
  });
});
```

## 🔮 **Future Improvements**

### **Planned Enhancements**
- Visual regression testing
- Performance testing automation
- Cross-browser testing matrix
- Automated accessibility testing

### **Tooling Upgrades**
- Migrate to Playwright for E2E tests
- Add Storybook for component testing
- Implement mutation testing
- Add property-based testing

## 📞 **Getting Help**

### **Test Issues**
- Check CI logs in GitHub Actions
- Run tests locally to reproduce
- Review test configuration
- Ask for help in GitHub issues

### **CI/CD Issues**
- Check workflow permissions
- Verify secrets configuration
- Review branch protection settings
- Consult deployment logs