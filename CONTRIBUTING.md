# Contributing to Uptime Kuma Status Panel

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/uptime-kuma-status-panel.git
   cd uptime-kuma-status-panel
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development environment**:
   ```bash
   docker-compose up -d  # Starts Grafana + Prometheus + Blackbox Exporter
   npm run dev           # Starts development build with watch
   ```
5. **Access Grafana** at http://localhost:3001 (admin/admin)

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes
```bash
npm run typecheck  # TypeScript checking
npm run lint       # Code linting
npm run test       # Run tests
npm run build      # Production build
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📋 Pull Request Guidelines

### Before Submitting
- ✅ All tests pass (`npm run test:ci`)
- ✅ TypeScript compiles without errors (`npm run typecheck`)
- ✅ Code passes linting (`npm run lint`)
- ✅ Plugin builds successfully (`npm run build`)
- ✅ Tested in actual Grafana environment

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in development environment
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors/warnings
```

## 🧪 Testing

### Running Tests
```bash
npm test                 # Interactive test mode
npm run test:ci          # CI mode (single run)
```

### Manual Testing
1. Start development environment: `docker-compose up -d`
2. Build plugin: `npm run build`
3. Access Grafana: http://localhost:3001
4. Create dashboard with Uptime Kuma Status Panel
5. Test different configurations and scenarios

### Test Coverage
- Aim for high test coverage on new features
- Test both happy path and error scenarios
- Include integration tests for complex features

## 🏗️ Architecture

### Project Structure
```
src/
├── components/
│   ├── StatusPanel.tsx      # Main panel component
│   └── StatusIndicator.tsx  # Individual service cards
├── utils/
│   └── dataUtils.ts         # Data parsing utilities
├── types.ts                 # TypeScript interfaces
├── plugin.ts                # Panel options configuration
└── module.ts                # Plugin entry point
```

### Key Concepts
- **StatusPanel**: Main component that receives Grafana data
- **StatusIndicator**: Individual service status card
- **dataUtils**: Parses Prometheus/Grafana data frames
- **Panel Options**: Configurable settings in Grafana UI

## 🎨 Code Style

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all data structures
- Avoid `any` types where possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### CSS/Styling
- Use Emotion CSS-in-JS for styling
- Follow Grafana theme patterns
- Ensure responsive design
- Support both light and dark themes

## 🐛 Reporting Issues

### Bug Reports
Include:
- **Environment**: Grafana version, browser, OS
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Console errors** (if any)

### Feature Requests
Include:
- **Problem description**
- **Proposed solution**
- **Use case examples**
- **Mockups** (if applicable)

## 📖 Documentation

### Code Documentation
- Comment complex algorithms
- Document public APIs
- Include JSDoc for functions
- Update README for new features

### User Documentation
- Update README.md for user-facing changes
- Include screenshots for UI changes
- Update CHANGELOG.md for releases
- Provide configuration examples

## 🔧 Development Environment

### Requirements
- Node.js 18+
- npm 8+
- Docker & Docker Compose
- Git

### VS Code Setup (Recommended)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Useful Commands
```bash
npm run dev         # Development build with watch
npm run build       # Production build
npm run typecheck   # TypeScript checking
npm run lint        # Lint code
npm run lint:fix    # Fix linting issues
npm test            # Run tests
docker-compose up   # Start development environment
docker-compose down # Stop development environment
```

## 🎯 Contribution Ideas

### Good First Issues
- Fix typos in documentation
- Add new service name parsing rules
- Improve error handling
- Add unit tests for existing functions

### Advanced Features
- Support for additional metrics
- Custom theming options
- Performance optimizations
- New display modes

### Infrastructure
- Improve CI/CD workflows
- Add more comprehensive tests
- Documentation improvements
- Performance benchmarking

## 📞 Getting Help

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check README.md and code comments

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to make this plugin better! 🙏