# Frequently Asked Questions

Common questions and troubleshooting tips for the Minimal Status Panel plugin.

## 🚀 Installation & Setup

### Q: The plugin doesn't appear in my Grafana installation
**A:** Check these common issues:

1. **Plugin directory**: Ensure files are in the correct location:
   ```bash
   ls /var/lib/grafana/plugins/minimal-status-panel/
   # Should show: plugin.json, module.js, README.md, etc.
   ```

2. **Grafana restart**: Always restart Grafana after plugin installation:
   ```bash
   sudo systemctl restart grafana-server
   ```

3. **File permissions**: Ensure Grafana can read the plugin files:
   ```bash
   sudo chown -R grafana:grafana /var/lib/grafana/plugins/minimal-status-panel
   ```

4. **Grafana logs**: Check for plugin loading errors:
   ```bash
   sudo journalctl -u grafana-server -f
   ```

### Q: I get "Plugin not found" errors
**A:** This usually indicates:

- Plugin files are in the wrong directory
- `plugin.json` is missing or corrupted
- Grafana version compatibility issues
- Plugin signing issues (check Grafana's plugin security settings)

---

## 📊 Data & Queries

### Q: The panel shows "No status data available"
**A:** This is the most common issue. Check:

1. **Query returns data**: Use Query Inspector to verify your query returns results
2. **Required labels**: Ensure your metrics have an `instance` label
3. **Metric name**: The plugin looks for `probe_success` by default
4. **Data source**: Verify your Prometheus data source is working

**Debug steps:**
```promql
# Test this query in Grafana Explore:
probe_success
# Should return metrics with instance labels
```

### Q: Why do my services show as "Unknown"?
**A:** The plugin determines status from the `probe_success` metric value:
- Value `1` = Up (green)
- Value `0` = Down (red)
- Missing/invalid values = Unknown (gray)

Check your Blackbox Exporter configuration and ensure it's returning proper 1/0 values.

### Q: Heartbeat bars are not showing real data
**A:** The plugin uses time-series data from your query. If you see uniform patterns, it means:
- Not enough historical data in the selected time range
- Blackbox Exporter hasn't been running long enough
- Time range is too short (try "Last 24 hours")

### Q: How do I monitor non-HTTP services?
**A:** The plugin works with any Prometheus metric that has:
- An `instance` label for service identification
- Binary values (1 for up, 0 for down)

Examples:
```promql
# TCP port monitoring
probe_success{job="blackbox",module="tcp_connect"}

# Custom health checks
up{job="my-service"}

# Database connectivity
mysql_up{instance="db-server"}
```

---

## 🎨 Display & Configuration

### Q: Service names are too long/ugly
**A:** Use the **Custom Service Names** feature:

```json
{
  "https://very-long-api-endpoint.company.com:8080/health": "API Service",
  "10.0.1.100:3306": "Database",
  "monitoring-system.internal.company.com": "Monitoring"
}
```

### Q: How do I hide URLs from public displays?
**A:** In the panel options:
- Set **Show URLs** to `false`
- Use **Custom Service Names** for user-friendly names
- Consider **Ultra-minimal** display level

### Q: The panel takes up too much space
**A:** Try these space-saving options:
- **Display Mode**: Switch to `Grid` or `Compact`
- **Display Level**: Use `Ultra-minimal`
- **Max Items**: Reduce the number
- **Show Labels**: Disable for compact mode

### Q: Colors don't match my theme
**A:** The plugin automatically adapts to Grafana's light/dark themes. For custom colors:
- Use Grafana's custom theme features
- Check your organization's theme settings
- Consider dashboard-level styling options

---

## ⚡ Performance & Optimization

### Q: The panel is slow with many services
**A:** Optimize performance with:

1. **Reduce Max Items**: Lower to 10-20 services per panel
2. **Increase Refresh Interval**: Use 60+ seconds for overview dashboards
3. **Limit Time Range**: Shorter ranges load faster
4. **Split Panels**: Use multiple panels instead of one large panel
5. **Optimize Queries**: Use specific label selectors

### Q: Auto-refresh is too frequent/not working
**A:**
- **Panel refresh**: Set in panel options (5-300 seconds)
- **Dashboard refresh**: Set in dashboard settings
- **Browser performance**: Very short intervals may impact performance
- **Data source caching**: May affect refresh behavior

### Q: Memory usage is high
**A:** The plugin limits heartbeat data to 50 points per service. High memory usage usually indicates:
- Too many services in one panel
- Very frequent refresh intervals
- Large time ranges with high-resolution data

---

## 🔧 Advanced Configuration

### Q: Can I use custom metrics instead of probe_success?
**A:** Yes! The plugin works with any metric that:
- Has an `instance` label
- Contains binary values (1/0 or true/false)

Example with custom metrics:
```promql
my_service_healthy{instance="service-name"}
```

### Q: How do I group services by environment?
**A:** Use Prometheus label selectors:

```promql
# Production only
probe_success{environment="production"}

# Multiple environments
probe_success{environment=~"production|staging"}
```

Create separate panels for each environment group.

### Q: Can I change the heartbeat bar size/color?
**A:** The heartbeat bars automatically:
- Resize based on available space
- Use theme-appropriate colors
- Show 50 data points maximum

Currently, these are not user-configurable, but may be added in future versions.

### Q: How do I set up alerts with the status panel?
**A:** The panel is for visualization only. Set up Grafana alerts separately:

```promql
# Alert when service is down
probe_success == 0

# Alert on slow response
probe_duration_seconds > 5
```

The panel and alerts complement each other perfectly.

---

## 🔍 Troubleshooting

### Q: Data shows in Query Inspector but not in panel
**A:** Check:
1. **Instance labels**: Ensure metrics have `instance` labels
2. **Custom names JSON**: Verify JSON syntax is valid
3. **Max items setting**: You might have hit the limit
4. **Time range**: Ensure data exists in the selected range

### Q: Tooltips on heartbeat bars don't work
**A:** This usually indicates:
- Browser compatibility issues (try a different browser)
- Missing timestamp data
- CSS conflicts with dashboard themes

### Q: Panel shows old data after updates
**A:** Try:
1. **Manual refresh**: Click dashboard refresh button
2. **Clear browser cache**: Force refresh (Ctrl+F5)
3. **Check data source cache**: May need to be cleared
4. **Verify time range**: Ensure it includes recent data

### Q: Services appear and disappear randomly
**A:** This typically means:
- **Inconsistent metrics**: Services reporting intermittently
- **Label changes**: Instance labels changing over time
- **Query issues**: Query returning different results
- **Data retention**: Old data being pruned

---

## 🐛 Known Issues & Limitations

### Q: What are the current limitations?
**A:** Known limitations include:

1. **Maximum services**: Performance degrades with 100+ services
2. **Heartbeat resolution**: Limited to 50 data points
3. **Custom colors**: Limited theme customization options
4. **Mobile optimization**: Some display modes work better than others
5. **Historical data**: Depends on Prometheus retention settings

### Q: Are there any browser compatibility issues?
**A:** The plugin works best with:
- **Chrome/Edge**: Full feature support
- **Firefox**: Full feature support
- **Safari**: Full feature support
- **Mobile browsers**: Basic functionality

### Q: What about Grafana version compatibility?
**A:**
- **Minimum**: Grafana 9.0.0
- **Recommended**: Grafana 10.0+
- **Latest**: Tested with current Grafana versions

---

## 🆘 Getting Help

### Q: Where can I report bugs or request features?
**A:**
- **GitHub Issues**: [Report bugs](https://github.com/Perseus985/Minimal-Status-Panel/issues)
- **Feature Requests**: Use GitHub Issues with "enhancement" label
- **Documentation**: This documentation covers most use cases

### Q: How can I contribute?
**A:** Contributions welcome!
- **Code**: Submit pull requests on GitHub
- **Documentation**: Help improve these docs
- **Bug Reports**: Detailed bug reports help everyone
- **Testing**: Try new features and provide feedback

### Q: Is commercial support available?
**A:** This is an open-source project. Community support is available through:
- GitHub Issues
- Documentation
- Community forums

### Q: Can I modify the plugin for my needs?
**A:** Absolutely! The plugin is MIT licensed:
- Fork the repository
- Make your modifications
- Consider contributing improvements back

---

## 📚 Additional Resources

- **[Getting Started Guide](getting-started.md)** - Installation and setup
- **[Configuration Guide](configuration.md)** - Detailed option explanations
- **[Display Modes](display-modes.md)** - Visual examples and use cases
- **[Advanced Usage](advanced-usage.md)** - Complex configurations and tips
- **[API Reference](api-reference.md)** - Technical documentation
- **[GitHub Repository](https://github.com/Perseus985/Minimal-Status-Panel)** - Source code and issues

---

**Still need help?** Create an issue on [GitHub](https://github.com/Perseus985/Minimal-Status-Panel/issues) with:
- Grafana version
- Plugin version
- Your configuration (sanitized)
- Expected vs actual behavior
- Any error messages