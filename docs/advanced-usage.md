# Advanced Usage

Master the advanced features of the Minimal Status Panel to create sophisticated monitoring dashboards.

## 🏷️ Service Renaming and Custom Names

Transform cryptic URLs and instance names into user-friendly display names.

### Basic Service Renaming

Use the **Custom Service Names** field in panel options:

```json
{
  "https://google.com": "Google Search",
  "https://api.github.com": "GitHub API",
  "https://my-internal-api-server-01.company.com:8080/health": "Internal API",
  "10.0.1.100": "Database Server",
  "monitoring.company.com": "Monitoring Stack"
}
```

### Advanced Naming Strategies

#### Strategy 1: Environment-based naming
```json
{
  "https://api-prod.company.com": "API (Production)",
  "https://api-staging.company.com": "API (Staging)",
  "https://api-dev.company.com": "API (Development)"
}
```

#### Strategy 2: Service-type grouping
```json
{
  "https://app.company.com": "Web App",
  "https://api.company.com": "REST API",
  "https://cdn.company.com": "CDN",
  "https://auth.company.com": "Authentication"
}
```

#### Strategy 3: Business-friendly names
```json
{
  "https://checkout.shop.com": "Checkout System",
  "https://payments.shop.com": "Payment Gateway",
  "https://inventory.shop.com": "Inventory Management",
  "https://notifications.shop.com": "Email Service"
}
```

### Dynamic Naming Tips

1. **Keep it concise**: 15-25 characters work best for most display modes
2. **Use consistent patterns**: "Service (Environment)" or "Team - Service"
3. **Avoid special characters**: Stick to alphanumeric and basic punctuation
4. **Consider your audience**: Technical names for ops teams, business names for executives

## 🔍 Advanced Prometheus Queries

### Multi-metric queries for richer data

#### Complete monitoring setup
```promql
# Query multiple metrics at once
{__name__=~"probe_success|probe_duration_seconds|probe_http_status_code|probe_ssl_earliest_cert_expiry"}
```

#### Service-specific filtering
```promql
# Monitor only critical services
probe_success{priority="critical"}

# Monitor by team ownership
probe_success{team=~"platform|infrastructure"}

# Monitor by service type
probe_success{type=~"api|web|database"}
```

#### Environment-based monitoring
```promql
# Production services only
probe_success{environment="production"}

# Multi-environment view
probe_success{environment=~"production|staging"}

# Exclude development environments
probe_success{environment!="development"}
```

### Custom metric integration

#### Using custom health check endpoints
```promql
# If you have custom health metrics
up{job="my-service"} or probe_success{job="blackbox"}
```

#### Combining different probe types
```promql
# HTTP, TCP, and ICMP monitoring
probe_success{module=~"http_2xx|tcp_connect|icmp"}
```

## 📊 Multiple Panel Strategies

### Strategy 1: Environment Separation

Create separate panels for different environments:

**Production Panel**
- Query: `probe_success{environment="production"}`
- Display: Full mode with all details
- Refresh: 15 seconds
- Max items: 20

**Staging Panel**
- Query: `probe_success{environment="staging"}`
- Display: Minimal mode
- Refresh: 60 seconds
- Max items: 30

### Strategy 2: Service Type Grouping

**Critical Services Panel**
- Query: `probe_success{priority="critical"}`
- Display: Full mode with alerts
- Refresh: 10 seconds

**Infrastructure Panel**
- Query: `probe_success{type="infrastructure"}`
- Display: Grid mode for overview

**Applications Panel**
- Query: `probe_success{type="application"}`
- Display: List mode for details

### Strategy 3: Team-based Monitoring

```promql
# Platform team services
probe_success{team="platform"}

# Frontend team services
probe_success{team="frontend"}

# Backend team services
probe_success{team="backend"}
```

## 🎯 Use Case Examples

### Executive Dashboard
Perfect for management overview displays.

**Configuration:**
- Display Mode: Grid
- Display Level: Minimal
- Show URLs: False (cleaner look)
- Custom Names: Business-friendly service names
- Max Items: 20
- Auto-refresh: 60 seconds

**Query:**
```promql
probe_success{customer_facing="true"}
```

### Operations Center
Detailed monitoring for technical teams.

**Configuration:**
- Display Mode: List
- Display Level: Full
- Show all options: True
- Max Items: 15
- Auto-refresh: 15 seconds

**Query:**
```promql
probe_success{environment="production"}
```

### Public Status Page
Customer-facing status information.

**Configuration:**
- Display Mode: List
- Display Level: Minimal
- Show URLs: False
- Custom Names: Customer-friendly names
- Max Items: 10

**Example Custom Names:**
```json
{
  "https://api.company.com": "API Service",
  "https://app.company.com": "Web Application",
  "https://payments.company.com": "Payment System",
  "https://auth.company.com": "User Authentication"
}
```

### Status Wall Display
Large screen displays in offices or NOCs.

**Configuration:**
- Display Mode: Compact or Grid
- Display Level: Ultra-minimal
- Show Labels: Context-dependent
- Max Items: 50-100
- Auto-refresh: 30 seconds

## 🔧 Integration Patterns

### With Grafana Alerting

Create alerts that complement your status panels:

1. **Alert on service down**
```promql
probe_success == 0
```

2. **Alert on slow response times**
```promql
probe_duration_seconds > 5
```

3. **Alert on certificate expiry**
```promql
(probe_ssl_earliest_cert_expiry - time()) / 86400 < 30
```

### With Grafana Variables

Use dashboard variables for dynamic filtering:

1. **Create environment variable**
   - Name: `environment`
   - Type: Query
   - Query: `label_values(probe_success, environment)`

2. **Use in panel query**
```promql
probe_success{environment="$environment"}
```

### With Grafana Annotations

Add context to your status panels:

1. **Deployment annotations**: Mark when deployments occur
2. **Maintenance annotations**: Show planned maintenance windows
3. **Incident annotations**: Track incident resolution

## 📱 Mobile and Responsive Considerations

### Mobile-optimized configurations

**Phone Screens:**
- Display Mode: List (most readable)
- Display Level: Minimal (space efficient)
- Max Items: 5-10 (prevent scrolling)

**Tablet Screens:**
- Display Mode: Grid (good balance)
- Display Level: Minimal or Full
- Max Items: 15-20

### Touch-friendly settings

- Ensure clickable URLs are easily tappable
- Use Compact mode sparingly on touch devices
- Consider larger text in custom CSS if needed

## ⚡ Performance Optimization

### Query optimization

1. **Limit time range** for better performance
2. **Use specific label selectors** instead of broad queries
3. **Limit metrics** to only what you need

### Panel optimization

1. **Reduce Max Items** for faster rendering
2. **Increase refresh interval** for less frequent updates
3. **Use appropriate display modes** for your data volume

### Dashboard optimization

1. **Group related panels** on the same row
2. **Use consistent time ranges** across panels
3. **Consider panel caching** for heavily loaded dashboards

## 🎨 Custom Styling (Advanced)

While the plugin adapts to Grafana themes automatically, you can create custom CSS for specific needs:

### Dashboard-level customizations
Add custom CSS through dashboard settings or custom themes.

### Organization-level branding
Use Grafana's custom styling features to match your brand colors.

## 🔒 Security Considerations

### Sensitive information handling

1. **Avoid exposing internal URLs** in public dashboards
2. **Use custom names** to obscure internal infrastructure details
3. **Consider separate dashboards** for internal vs external views

### Access control

1. **Use Grafana's RBAC** to control panel access
2. **Create different dashboards** for different security levels
3. **Consider data source permissions** for sensitive metrics

## 📈 Monitoring Best Practices

### Service selection

1. **Monitor user-facing services** first
2. **Include critical dependencies** (databases, auth services)
3. **Add internal services** that affect user experience

### Alert integration

1. **Complement panels with alerts**, don't replace them
2. **Use different thresholds** for alerts vs visual indicators
3. **Consider alert fatigue** when setting up notifications

### Documentation

1. **Document your naming conventions**
2. **Maintain service inventory** with panel configurations
3. **Create runbooks** linked to your status panels

Ready to see all the visual options? Check out [Display Modes](display-modes.md) or explore the [API Reference](api-reference.md) for technical details!