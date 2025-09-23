# [1.2.0-beta.1](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.1.3...v1.2.0-beta.1) (2025-09-23)


### Bug Fixes

* version changes in plugin info via semantic release ([ca467e7](https://github.com/Perseus985/Minimal-Status-Panel/commit/ca467e780a422567578628b11a1b8c181895a9e6))


### Features

* add super-minimal interface for many many services ([3f2531e](https://github.com/Perseus985/Minimal-Status-Panel/commit/3f2531ebd1990fe3221f47488fddd3b874a93815))

## [1.1.3](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.1.2...v1.1.3) (2025-09-23)


### Bug Fixes

* del plugin signing for private instance use ([49595f6](https://github.com/Perseus985/Minimal-Status-Panel/commit/49595f67e5485f1f6cbfd7c15079301ff4aceddf))

## [1.1.2](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.1.1...v1.1.2) (2025-09-22)


### Bug Fixes

* proper logo handling in grafana for plugin ([18b1721](https://github.com/Perseus985/Minimal-Status-Panel/commit/18b1721ba08cb5b75e71169b3165a518ecbb5b21))

## [1.1.1](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.1.0...v1.1.1) (2025-09-22)


### Bug Fixes

* linting errors ([6402e45](https://github.com/Perseus985/Minimal-Status-Panel/commit/6402e4528cedcd371cfff5390b4e4f914f11e41a))
* linting problems and change renovate conf to develop branch and not main ([605be00](https://github.com/Perseus985/Minimal-Status-Panel/commit/605be00607e71be9d592bc5529cfa37a97e1af96))
* testing ([ab8efad](https://github.com/Perseus985/Minimal-Status-Panel/commit/ab8efad4ef3ffe86bfc75d1c38c778272a1b38bd))

# [1.1.0](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.0.3...v1.1.0) (2025-09-22)


### Bug Fixes

* private plugin signing ([f70369b](https://github.com/Perseus985/Minimal-Status-Panel/commit/f70369b8b5fa5937ef34983b973c818f7a90b78d))


### Features

* add plugin signing ([14ef836](https://github.com/Perseus985/Minimal-Status-Panel/commit/14ef83611fcdd170672a7a3f5a3276dddbd3a3cb))

## [1.0.3](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.0.2...v1.0.3) (2025-09-22)


### Bug Fixes

* constrain React to v18 and Grafana to v10 for compatibility ([ec7ad25](https://github.com/Perseus985/Minimal-Status-Panel/commit/ec7ad25b50a44b674de9b905fdeb5f075bb60e60))

## [1.0.2](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.0.1...v1.0.2) (2025-09-22)


### Bug Fixes

* rebranding ([0950e40](https://github.com/Perseus985/Minimal-Status-Panel/commit/0950e4085791e12fc11d57f3fd1764b6352c905d))

## [1.0.1](https://github.com/Perseus985/Minimal-Status-Panel/compare/v1.0.0...v1.0.1) (2025-09-22)


### Bug Fixes

* update node version ([0da38e8](https://github.com/Perseus985/Minimal-Status-Panel/commit/0da38e853825523754127460dc6882cd312704e4))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-22

### Added
- 🎉 Initial release of Minimal Status Panel
- ✨ Beautiful, clean service status cards
- 📊 Two display modes: Minimal and Full view
- 💫 Interactive heartbeat bars with hover timestamps
- 🔍 Prometheus instance filtering support
- 📈 Real-time data integration with Blackbox Exporter
- 🎨 Support for Grafana light/dark themes
- ⚙️ Comprehensive panel options:
  - Display mode selection (List/Grid/Compact)
  - Display level toggle (Minimal/Full)
  - Service filtering and limits
  - Customizable refresh intervals
- 🐳 Docker development environment with Prometheus and Blackbox Exporter
- 📚 Complete documentation and setup guides

### Features
- **Service Status Cards**: Clean, modern cards showing service health
- **Heartbeat Visualization**: 50-bar timeline showing service status history
- **Responsive Design**: Adapts to different panel sizes and layouts
- **Smart Service Names**: Automatically extracts readable names from URLs
- **SSL Certificate Info**: Shows certificate expiration dates
- **Performance Metrics**: Displays response times and uptime statistics
- **Query Filtering**: Filter services using Prometheus label queries

### Technical
- Built with React 18 and TypeScript
- Uses Grafana UI components and theming
- Webpack-based build system
- Comprehensive ESLint and Prettier configuration
- Jest testing framework setup
- Docker Compose development environment
