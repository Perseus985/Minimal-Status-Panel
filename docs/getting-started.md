# Getting Started

Welcome to the Minimal Status Panel! This guide will walk you through installation, basic setup, and creating your first monitoring panel.

## 🎯 Prerequisites

Before installing the plugin, make sure you have:

- **Grafana 9.0.0 or later** (recommended: Grafana 10+)
- **Prometheus with Blackbox Exporter** for HTTP/HTTPS monitoring
- Basic knowledge of Grafana dashboard creation

## 📦 Installation

### Option 1: Download Pre-built Release (Recommended)

This is the easiest way to get started:

1. **Download the latest release**
   - Go to the [Releases page](https://github.com/Perseus985/Minimal-Status-Panel/releases/latest)
   - Download the `minimal-status-panel-x.x.x.zip` file

2. **Extract to Grafana plugins directory**
   ```bash
   # For Docker installations
   unzip minimal-status-panel-*.zip -d /var/lib/grafana/plugins/minimal-status-panel/

   # For standalone Grafana (Linux)
   sudo unzip minimal-status-panel-*.zip -d /var/lib/grafana/plugins/minimal-status-panel/

   # For macOS (Homebrew)
   unzip minimal-status-panel-*.zip -d /usr/local/var/lib/grafana/plugins/minimal-status-panel/
   ```

3. **Restart Grafana**
   ```bash
   # Docker
   docker restart your-grafana-container

   # Systemd (Linux)
   sudo systemctl restart grafana-server

   # macOS (Homebrew)
   brew services restart grafana
   ```

### Option 2: Build from Source

For developers or those who want the latest features:

1. **Clone and build**
   ```bash
   git clone https://github.com/Perseus985/Minimal-Status-Panel.git
   cd minimal-status-panel
   npm install
   npm run build
   ```

2. **Copy to Grafana plugins directory**
   ```bash
   sudo cp -r dist /var/lib/grafana/plugins/minimal-status-panel
   sudo chown -R grafana:grafana /var/lib/grafana/plugins/minimal-status-panel
   ```

3. **Restart Grafana**

## 🔧 Basic Setup

### Step 1: Configure Prometheus with Blackbox Exporter

First, set up monitoring for your services. Here's a basic Prometheus configuration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]  # Look for HTTP 200 response
    static_configs:
      - targets:
        - https://google.com
        - https://github.com
        - https://your-website.com
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115  # Blackbox exporter address
```

### Step 2: Create Your First Panel

1. **Create or edit a Grafana dashboard**

2. **Add a new panel**
   - Click "Add panel" → "Add a new panel"

3. **Select the Minimal Status Panel**
   - In the "Visualization" dropdown, select **"Minimal Status Panel"**

4. **Configure your data source**
   - Select your Prometheus data source
   - Add this basic query:
   ```promql
   probe_success
   ```

5. **Save your panel**
   - Click "Apply" to save the panel to your dashboard

## 🎨 Your First Status Panel

Congratulations! You should now see a status panel showing the health of your monitored services.

### What You'll See

- **Service names** extracted from the `instance` label
- **Status badges** (Up/Down) with color coding
- **Heartbeat bars** showing recent status history
- **Interactive tooltips** with timestamps when you hover over heartbeat bars

### Quick Customization

Try these immediate customizations in the panel options (right sidebar):

- **Display Mode**: Switch between List, Grid, or Compact
- **Display Level**: Try Minimal vs Full view
- **Max Items**: Limit how many services to show
- **Show URLs**: Toggle clickable service links

## 🔍 Common Queries

Here are some useful Prometheus queries to get you started:

### Basic Monitoring
```promql
# All services
probe_success

# Specific services only
probe_success{instance=~"https://google.com|https://github.com"}

# Filter by job
probe_success{job="blackbox"}
```

### With Response Time
```promql
# Service status with response time context
probe_success or probe_duration_seconds
```

### Advanced Filtering
```promql
# Production services only
probe_success{environment="production"}

# HTTP services (excluding ping)
probe_success{job="blackbox",module="http_2xx"}
```

## ⚡ Quick Tips

1. **Start Small**: Begin with 3-5 services to get familiar with the interface
2. **Use Meaningful Names**: Service URLs like `https://api.mysite.com` are more readable than IP addresses
3. **Group Related Services**: Use separate panels for different environments (staging, production)
4. **Experiment with Display Modes**: Grid mode works great for overview dashboards
5. **Check Query Inspector**: If data isn't showing, use Grafana's Query Inspector to debug

## 🚀 Next Steps

Now that you have a basic panel running:

- 📊 **[Explore Display Modes](display-modes.md)** - Learn about all visualization options
- 🔧 **[Configure Advanced Options](configuration.md)** - Customize colors, naming, and behavior
- 🏷️ **[Set Up Service Renaming](advanced-usage.md)** - Make service names more user-friendly
- 🎯 **[Create Multiple Panels](advanced-usage.md)** - Monitor different service groups

## ❓ Troubleshooting

### Plugin Not Appearing
- Check that Grafana was restarted after installation
- Verify the plugin files are in the correct directory
- Check Grafana logs for any plugin loading errors

### No Data Showing
- Verify your Prometheus query returns data in Query Inspector
- Check that your Blackbox Exporter is running and accessible
- Ensure the `instance` label exists in your metrics

### Services Show as "Unknown"
- Check that `probe_success` metric exists with values 0 or 1
- Verify that the `instance` label contains your service URLs
- Try the query `probe_success` directly in Grafana's Explore tab

Need more help? Check our [FAQ](faq.md) or [create an issue](https://github.com/Perseus985/Minimal-Status-Panel/issues) on GitHub!