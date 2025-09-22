# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-22

### Added
- 🎉 Initial release of Uptime Kuma Status Panel
- ✨ Beautiful Uptime Kuma-style service status cards
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