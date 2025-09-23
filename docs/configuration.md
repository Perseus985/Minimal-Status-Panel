# Configuration Guide

This guide covers all panel configuration options and how to customize your Minimal Status Panel for different use cases.

## 🎛️ Panel Options Overview

Access these options from the panel editor's right sidebar under "Panel options".

### Display Mode
Controls the layout of your status items.

| Option | Description | Best For |
|--------|-------------|----------|
| **List** | Traditional vertical layout | Detailed monitoring, fewer services |
| **Grid** | Card-based responsive grid | Dashboard overviews, many services |
| **Compact** | Minimal colored status dots | Space-constrained views, status walls |

```promql
# Example query for any display mode
probe_success
```

### Display Level
Controls how much information is shown for each service.

| Level | What's Shown | Use Case |
|-------|--------------|----------|
| **Ultra-Minimal** | Service name + status text only | Maximum density, overview dashboards |
| **Minimal** | Name + status + heartbeat bar | Balance of info and space |
| **Full** | All info + response times + uptime stats | Detailed monitoring, dedicated status pages |

## ⚙️ Detailed Configuration Options

### Basic Display Options

#### Show Labels
- **Default**: `true`
- **Description**: Display service names
- **When to disable**: In compact mode where space is limited

#### Show Last Check
- **Default**: `true`
- **Description**: Display timestamp of last status check
- **Note**: Only visible in Full display level

#### Show Response Time
- **Default**: `true`
- **Description**: Show current response time metrics
- **Requires**: `probe_duration_seconds` metric in your query

#### Show URLs
- **Default**: `true`
- **Description**: Display clickable service URLs
- **Behavior**: Opens links in new tab

### Performance Options

#### Max Items
- **Default**: `20`
- **Range**: `1-100`
- **Description**: Limit number of services displayed
- **Tip**: Use lower values (5-10) for detailed views, higher (50+) for overview dashboards

#### Refresh Interval
- **Default**: `30` seconds
- **Range**: `5-300` seconds
- **Description**: How often to refresh data automatically
- **Recommendation**:
  - `5-15s` for critical systems
  - `30-60s` for general monitoring
  - `120s+` for overview dashboards

### Service Naming

#### Custom Service Names
- **Default**: `{}`
- **Format**: JSON object mapping URLs to display names
- **Example**:
```json
{
  "https://google.com": "Google Search",
  "https://github.com": "GitHub",
  "https://api.mysite.com/health": "My API"
}
```

## 🎨 Visual Configuration Examples

### Example 1: Executive Dashboard
**Goal**: High-level overview for management

```json
{
  "displayMode": "grid",
  "displayLevel": "minimal",
  "showLabels": true,
  "showUrls": false,
  "maxItems": 20,
  "refreshInterval": 60
}
```

### Example 2: Operations Center
**Goal**: Detailed monitoring for ops team

```json
{
  "displayMode": "list",
  "displayLevel": "full",
  "showLabels": true,
  "showLastCheck": true,
  "showResponseTime": true,
  "showUrls": true,
  "maxItems": 10,
  "refreshInterval": 15
}
```

### Example 3: Status Wall Display
**Goal**: Large TV display showing many services

```json
{
  "displayMode": "compact",
  "displayLevel": "ultra-minimal",
  "showLabels": false,
  "maxItems": 100,
  "refreshInterval": 30
}
```

### Example 4: Customer Status Page
**Goal**: Public-facing status information

```json
{
  "displayMode": "list",
  "displayLevel": "minimal",
  "showLabels": true,
  "showUrls": false,
  "showLastCheck": true,
  "maxItems": 15,
  "refreshInterval": 30,
  "customNames": {
    "https://api.mysite.com": "API Service",
    "https://app.mysite.com": "Web Application",
    "https://cdn.mysite.com": "CDN"
  }
}
```

## 🔧 Advanced Configuration

### Data Source Configuration

For optimal results, configure your Prometheus query to include relevant metrics:

```promql
# Basic status only
probe_success

# Status with response time
probe_success or probe_duration_seconds

# Multiple metrics for full information
{__name__=~"probe_success|probe_duration_seconds|probe_http_status_code"}
```

### Label-based Filtering

Use Prometheus label selectors to filter services:

```promql
# Environment-based filtering
probe_success{environment="production"}

# Service type filtering
probe_success{service_type="api"}

# Multiple conditions
probe_success{environment="production",team="platform"}
```

### Time Range Considerations

The plugin uses Grafana's time range for:
- **Heartbeat bars**: Shows status history over the selected time range
- **Response time averages**: Calculates averages within the time range
- **Uptime calculations**: Computes uptime percentage for the period

**Recommended time ranges**:
- **Real-time monitoring**: Last 1-6 hours
- **Daily overview**: Last 24 hours
- **Weekly summary**: Last 7 days

## 🎭 Theme Integration

The plugin automatically adapts to your Grafana theme:

### Light Theme
- Clean white backgrounds
- Subtle borders and shadows
- High contrast text

### Dark Theme
- Dark card backgrounds
- Muted borders
- Theme-appropriate text colors

## 📱 Responsive Behavior

### Grid Mode Responsive Breakpoints
- **Large screens**: 3-4 columns
- **Medium screens**: 2 columns
- **Small screens**: 1 column

### List Mode
- Maintains consistent width across all screen sizes
- Automatically adjusts font sizes for readability

### Compact Mode
- Dynamically adjusts dot sizes based on available space
- Maintains minimum touch targets for mobile devices

## 🔍 Debugging Configuration

### Query Inspector Usage
1. Open panel in edit mode
2. Click "Query Inspector" tab
3. Check "Data" tab for raw metrics
4. Verify `instance` labels are present

### Common Issues and Solutions

**Issue**: Services not showing
**Solution**: Check query returns data with `instance` labels

**Issue**: Names too long
**Solution**: Use `customNames` to provide shorter alternatives

**Issue**: Too much/little information
**Solution**: Adjust `displayLevel` and individual show/hide options

**Issue**: Performance problems
**Solution**: Reduce `maxItems` and increase `refreshInterval`

## 💡 Best Practices

1. **Start with defaults** and adjust based on your specific needs
2. **Use meaningful service names** in your monitoring setup
3. **Group related services** in separate panels
4. **Consider your audience** when choosing display modes
5. **Test on different screen sizes** if used on various devices
6. **Document your configurations** for team consistency

## 📋 Configuration Templates

### Quick Start Template
```json
{
  "displayMode": "list",
  "displayLevel": "full",
  "maxItems": 10,
  "refreshInterval": 30
}
```

### Minimal Overview Template
```json
{
  "displayMode": "grid",
  "displayLevel": "minimal",
  "maxItems": 25,
  "showUrls": false
}
```

### Status Wall Template
```json
{
  "displayMode": "compact",
  "displayLevel": "ultra-minimal",
  "maxItems": 50,
  "showLabels": false,
  "refreshInterval": 15
}
```

Ready to explore more? Check out [Display Modes](display-modes.md) for visual examples or [Advanced Usage](advanced-usage.md) for complex scenarios!