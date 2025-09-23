# API Reference

Technical documentation for developers working with the Minimal Status Panel plugin.

## 🏗️ Plugin Architecture

### Core Components

#### StatusPanel (`src/components/StatusPanel.tsx`)
Main panel component that orchestrates data parsing and rendering.

```typescript
interface StatusPanelProps {
  options: StatusPanelOptions;
  data: PanelData;
  width: number;
  height: number;
  timeRange: TimeRange;
  onOptionsChange: (options: StatusPanelOptions) => void;
}
```

#### StatusIndicator (`src/components/StatusIndicator.tsx`)
Individual service status display component.

```typescript
interface StatusIndicatorProps {
  service: ServiceStatus;
  options: StatusPanelOptions;
  displayMode: 'list' | 'grid' | 'compact';
}
```

## 📊 Data Interfaces

### StatusPanelOptions
Panel configuration interface defining all user-configurable options.

```typescript
interface StatusPanelOptions {
  displayMode: 'list' | 'grid' | 'compact';
  displayLevel: 'minimal' | 'full' | 'ultra-minimal';
  showLabels: boolean;
  showLastCheck: boolean;
  showResponseTime: boolean;
  showUrls: boolean;
  maxItems: number;
  refreshInterval: number;
  customNames: string; // JSON string
}
```

#### Option Details

| Property | Type | Default | Range/Options | Description |
|----------|------|---------|---------------|-------------|
| `displayMode` | string | `'list'` | `'list'`, `'grid'`, `'compact'` | Layout mode for status items |
| `displayLevel` | string | `'full'` | `'minimal'`, `'full'`, `'ultra-minimal'` | Information detail level |
| `showLabels` | boolean | `true` | - | Display service names |
| `showLastCheck` | boolean | `true` | - | Show last check timestamp |
| `showResponseTime` | boolean | `true` | - | Display response time metrics |
| `showUrls` | boolean | `true` | - | Show clickable service URLs |
| `maxItems` | number | `20` | `1-100` | Maximum services to display |
| `refreshInterval` | number | `30` | `5-300` | Refresh interval in seconds |
| `customNames` | string | `'{}'` | Valid JSON | Service name mappings |

### ServiceStatus
Core data structure representing a monitored service.

```typescript
interface ServiceStatus {
  name: string;                    // Service display name
  status: 'up' | 'down' | 'maintenance' | 'warning' | 'unknown';
  lastCheck?: Date;               // Last status check timestamp
  responseTime?: number;          // Current response time in ms
  url?: string;                   // Service URL (clickable)
  uptime?: number;               // Uptime percentage
  message?: string;              // Status message
  heartbeatData?: HeartbeatData[]; // Historical status data
}
```

### HeartbeatData
Time-series data points for heartbeat visualization.

```typescript
interface HeartbeatData {
  timestamp: number;              // Unix timestamp
  status: 'up' | 'down' | 'unknown';
  value: number;                 // 1 for up, 0 for down
}
```

## 🔌 Data Processing

### parseDataFrames Function
Core data parsing function that transforms Grafana data frames into ServiceStatus objects.

**Location**: `src/utils/dataUtils.ts`

```typescript
function parseDataFrames(
  series: DataFrame[],
  customNamesJson: string
): ServiceStatus[]
```

#### Expected Input Metrics

The plugin expects Prometheus-style metrics with the following structure:

##### probe_success
Primary health metric (required):
```promql
probe_success{instance="https://example.com", job="blackbox"} 1
```

**Labels:**
- `instance`: Service URL or identifier (required)
- `job`: Monitoring job name (optional)
- Additional labels: Available for filtering

**Values:**
- `1`: Service is up
- `0`: Service is down

##### probe_duration_seconds
Response time metric (optional):
```promql
probe_duration_seconds{instance="https://example.com"} 0.123
```

**Value**: Response time in seconds

##### probe_http_status_code
HTTP status code (optional):
```promql
probe_http_status_code{instance="https://example.com"} 200
```

##### probe_ssl_earliest_cert_expiry
SSL certificate expiry (optional):
```promql
probe_ssl_earliest_cert_expiry{instance="https://example.com"} 1703980800
```

**Value**: Unix timestamp of certificate expiration

### Custom Names Processing

The `customNames` option accepts a JSON string mapping instance URLs to display names:

```json
{
  "https://example.com": "Example Service",
  "10.0.1.100": "Database Server"
}
```

**Processing rules:**
1. Exact URL match takes precedence
2. If no custom name found, uses the `instance` label value
3. Invalid JSON is ignored silently
4. Empty or missing custom names use default behavior

## 🎨 Styling System

### Theme Integration

The plugin uses Grafana's theme system through `useStyles2` and `GrafanaTheme2`:

```typescript
const styles = useStyles2((theme: GrafanaTheme2) => getStyles(theme, displayMode));
```

### Color Mapping

Status colors are defined in `StatusIndicator.tsx`:

```typescript
const getStatusColor = (status: ServiceStatus['status'], theme: GrafanaTheme2) => {
  switch (status) {
    case 'up': return '#28a745';      // Green
    case 'down': return '#dc3545';    // Red
    case 'warning': return '#ffc107'; // Yellow
    case 'maintenance': return '#6c757d'; // Gray
    default: return theme.colors.text.secondary;
  }
};
```

### Responsive CSS

The plugin uses CSS-in-JS with responsive breakpoints:

```typescript
// Grid mode responsive columns
gridContainer: css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`
```

## 🔧 Plugin Registration

### Plugin Definition
**Location**: `src/plugin.ts`

```typescript
export const plugin = new PanelPlugin<StatusPanelOptions>(StatusPanel)
  .setPanelOptions((builder) => {
    return builder
      .addSelect({...})
      .addBooleanSwitch({...})
      .addNumberInput({...})
      .addTextInput({...});
  });
```

### Module Export
**Location**: `src/module.ts`

```typescript
export { plugin } from './plugin';
```

## 📈 Performance Considerations

### Data Processing Optimization

1. **Memoization**: `useMemo` for expensive data parsing
```typescript
const services = useMemo(() => {
  return parseDataFrames(data.series, options.customNames);
}, [data, options.customNames]);
```

2. **Item Limiting**: Respect `maxItems` to prevent rendering issues
```typescript
const limitedServices = services.slice(0, options.maxItems || 20);
```

3. **Efficient Updates**: Only re-render when necessary

### Memory Management

- Heartbeat data is limited to 50 points maximum
- Time-series data is processed incrementally
- Large datasets are truncated automatically

## 🐛 Error Handling

### Data Parsing Errors

```typescript
try {
  const parsed = parseDataFrames(data.series, options.customNames);
  return parsed;
} catch (error) {
  console.error('Error parsing data frames:', error);
  return [];
}
```

### Custom Names JSON Validation

```typescript
try {
  const customNames = JSON.parse(options.customNames || '{}');
  return customNames;
} catch {
  return {}; // Fallback to empty object
}
```

### Graceful Degradation

- Missing metrics default to "unknown" status
- Invalid configurations use sensible defaults
- Network errors don't crash the panel

## 🧪 Testing

### Test Structure
Tests are located in `src/__tests__/` directory.

```typescript
// Example test structure
describe('StatusPanel', () => {
  it('renders without data', () => {
    // Test rendering with no data
  });

  it('processes probe_success metrics', () => {
    // Test metric parsing
  });

  it('applies custom names', () => {
    // Test custom name mapping
  });
});
```

### Mock Data

```typescript
const mockDataFrame: DataFrame = {
  name: 'probe_success',
  fields: [
    {
      name: 'Time',
      type: FieldType.time,
      values: new ArrayVector([1640995200000])
    },
    {
      name: 'Value',
      type: FieldType.number,
      values: new ArrayVector([1]),
      labels: { instance: 'https://example.com' }
    }
  ],
  length: 1
};
```

## 🔌 Extension Points

### Custom Status Types

Extend the `ServiceStatus['status']` type for custom status indicators:

```typescript
// Add custom status types
type CustomStatus = 'up' | 'down' | 'warning' | 'maintenance' | 'degraded' | 'unknown';
```

### Custom Metrics

Add support for additional Prometheus metrics:

```typescript
// Example: Custom availability metric
interface ExtendedServiceStatus extends ServiceStatus {
  availability?: number;  // Custom availability percentage
  customMetric?: number;  // Application-specific metric
}
```

### Theme Customization

Override default colors through Grafana's theming system:

```typescript
// Custom theme colors
const customColors = {
  up: '#00ff00',
  down: '#ff0000',
  warning: '#ffaa00'
};
```

## 📦 Build System

### Webpack Configuration
**Location**: `.config/webpack/webpack.config.js`

Key features:
- TypeScript compilation
- CSS-in-JS processing
- Asset copying (images, metadata)
- Production optimization

### Build Outputs

```bash
dist/
├── module.js              # Main plugin code
├── module.js.map         # Source map
├── plugin.json           # Plugin metadata
├── README.md            # Documentation
├── img/                 # Asset images
└── LICENSE              # License file
```

## 🚀 Deployment

### Plugin Structure

Required files for Grafana plugin:
- `plugin.json`: Plugin metadata and configuration
- `module.js`: Main plugin code (webpack output)
- `README.md`: Plugin documentation

### Installation Paths

```bash
# Linux
/var/lib/grafana/plugins/minimal-status-panel/

# Docker
/var/lib/grafana/plugins/minimal-status-panel/

# macOS (Homebrew)
/usr/local/var/lib/grafana/plugins/minimal-status-panel/

# Windows
C:\Program Files\GrafanaLabs\grafana\data\plugins\minimal-status-panel\
```

## 🔍 Debugging

### Development Mode

```bash
npm run dev  # Watch mode for development
```

### Debug Information

The panel shows debug information when no data is available:
- Data series count
- Parsing status
- Suggested queries

### Browser DevTools

Use React DevTools and browser console for debugging:
- Component props inspection
- State management debugging
- Performance profiling

## 📚 Dependencies

### Core Dependencies
- `@grafana/data`: Data types and utilities
- `@grafana/ui`: UI components and theming
- `react`: Component framework
- `@emotion/css`: Styling system

### Development Dependencies
- `typescript`: Type system
- `webpack`: Build system
- `@testing-library/react`: Testing utilities
- `jest`: Test runner

Ready to customize or extend the plugin? Check out the [source code](https://github.com/Perseus985/Minimal-Status-Panel) on GitHub!