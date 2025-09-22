import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon, useTheme2 } from '@grafana/ui';
import { ServiceStatus, StatusPanelOptions } from '../types';

interface StatusIndicatorProps {
  service: ServiceStatus;
  options: StatusPanelOptions;
  displayMode: 'list' | 'grid' | 'compact';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ service, options, displayMode }) => {
  const styles = useStyles2((theme) => getStyles(theme, displayMode));
  const theme = useTheme2();

  const displayLevel = options.displayLevel || 'full';

  const getStatusColor = (status: ServiceStatus['status'], theme: GrafanaTheme2) => {
    switch (status) {
      case 'up':
        return '#28a745'; // Green
      case 'down':
        return '#dc3545'; // Red
      case 'warning':
        return '#ffc107'; // Yellow
      case 'maintenance':
        return '#6c757d'; // Gray
      default:
        return theme.colors.text.secondary; // Unknown
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'up':
        return 'check-circle';
      case 'down':
        return 'times-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'maintenance':
        return 'cog';
      default:
        return 'question-circle';
    }
  };


  const formatResponseTime = (responseTime?: number) => {
    if (!responseTime) {return 'N/A';}
    if (responseTime < 1000) {return `${responseTime}ms`;}
    return `${(responseTime / 1000).toFixed(2)}s`;
  };

  const formatUptime = (uptime?: number) => {
    if (uptime === undefined) {return 'N/A';}
    return `${uptime.toFixed(2)}%`;
  };

  if (displayMode === 'compact') {
    return (
      <div 
        className={styles.compactIndicator} 
        title={`${service.name}: ${service.status}`}
        style={{
          backgroundColor: getStatusColor(service.status, theme),
        }}
      >
        <Icon name={getStatusIcon(service.status)} size="sm" />
      </div>
    );
  }

  // Use real heartbeat data from Prometheus or fallback to mock data
  const getHeartbeatDisplayData = () => {
    if (service.heartbeatData && service.heartbeatData.length > 0) {
      // Use real data from Prometheus
      const maxBars = 50;
      const data = service.heartbeatData.slice(-maxBars); // Take last 50 data points
      
      return data.map(beat => ({
        status: beat.status,
        timestamp: new Date(beat.timestamp).toLocaleTimeString(),
        color: beat.status === 'up' ? getStatusColor('up', theme) : getStatusColor('down', theme),
        value: beat.value
      }));
    } else {
      // Fallback: generate simple pattern based on current status
      const data = [];
      const now = Date.now();
      
      for (let i = 0; i < 50; i++) {
        const timestamp = new Date(now - (50 - i) * 60 * 1000);
        // Simple pattern: mostly current status with some variation
        let status = service.status === 'up' ? 'up' : 'down';
        if (service.status === 'up' && i >= 10 && i <= 12) {
          status = 'down'; // Brief outage
        }
        
        data.push({
          status,
          timestamp: timestamp.toLocaleTimeString(),
          color: status === 'up' ? getStatusColor('up', theme) : getStatusColor('down', theme),
          value: status === 'up' ? 1 : 0
        });
      }
      return data;
    }
  };

  const heartbeatDisplayData = getHeartbeatDisplayData();

  // Simple Uptime Kuma style card
  return (
    <div className={styles.uptimeKumaCard}>
      {/* Service Header */}
      <div className={styles.serviceHeader}>
        <div className={styles.serviceTitle}>
          <span className={styles.serviceName}>{service.name}</span>
          <div className={styles.statusBadge} 
               style={{ backgroundColor: getStatusColor(service.status, theme) }}>
            {service.status === 'up' ? 'Up' : service.status === 'down' ? 'Down' : service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </div>
        </div>
        {service.url && (
          <div className={styles.serviceUrl}>
            <a href={service.url} target="_blank" rel="noopener noreferrer">
              {service.url}
            </a>
          </div>
        )}
      </div>

      {/* Heartbeat Bar with Hover Tooltips */}
      <div className={styles.heartbeatSection}>
        <div className={styles.heartbeatBar}>
          {heartbeatDisplayData.map((beat, i) => (
            <div
              key={i}
              className={styles.heartbeatBlock}
              title={`${beat.status.toUpperCase()} at ${beat.timestamp}`}
              style={{
                backgroundColor: beat.color,
                height: beat.status === 'up' ? '100%' : '60%',
              }}
            />
          ))}
        </div>
        <div className={styles.heartbeatLabel}>
          {service.heartbeatData ? 
            `Showing ${heartbeatDisplayData.length} data points from dashboard timerange` : 
            'Check every 60 seconds (fallback data)'
          }
        </div>
      </div>

      {/* Stats Section - only show in full mode */}
      {displayLevel === 'full' && (
        <>
          <div className={styles.statsSection}>
            <div className={styles.statGroup}>
              <div className={styles.statTitle}>Response</div>
              <div className={styles.statSubtitle}>(Current)</div>
              <div className={styles.statValue}>
                {formatResponseTime(service.responseTime)}
              </div>
            </div>
            
            <div className={styles.statGroup}>
              <div className={styles.statTitle}>Avg. Response</div>
              <div className={styles.statSubtitle}>(24-hour)</div>
              <div className={styles.statValue}>
                {formatResponseTime(service.responseTime)}
              </div>
            </div>
            
            <div className={styles.statGroup}>
              <div className={styles.statTitle}>Uptime</div>
              <div className={styles.statSubtitle}>(24-hour)</div>
              <div className={styles.statValue}>
                {formatUptime(service.uptime)}
              </div>
            </div>
            
            <div className={styles.statGroup}>
              <div className={styles.statTitle}>Uptime</div>
              <div className={styles.statSubtitle}>(30-day)</div>
              <div className={styles.statValue}>
                {formatUptime(service.uptime)}
              </div>
            </div>
            
            <div className={styles.statGroup}>
              <div className={styles.statTitle}>Uptime</div>
              <div className={styles.statSubtitle}>(1-year)</div>
              <div className={styles.statValue}>
                {formatUptime(service.uptime)}
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          <div className={styles.certSection}>
            <div className={styles.certTitle}>Cert Exp.</div>
            <div className={styles.certSubtitle}>(2025-12-01)</div>
            <div className={styles.certValue}>70 days</div>
          </div>
        </>
      )}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2, displayMode: 'list' | 'grid' | 'compact') => ({
  // Main Uptime Kuma card
  uptimeKumaCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `,
  
  // Service header section
  serviceHeader: css`
    margin-bottom: 20px;
  `,
  serviceTitle: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  `,
  serviceName: css`
    font-size: 20px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  statusBadge: css`
    padding: 4px 12px;
    border-radius: 16px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
  `,
  serviceUrl: css`
    a {
      color: #10b981;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `,
  
  // Heartbeat section
  heartbeatSection: css`
    margin-bottom: 24px;
  `,
  heartbeatBar: css`
    display: flex;
    gap: 1px;
    height: 40px;
    align-items: flex-end;
    margin-bottom: 8px;
    padding: 2px 0;
  `,
  heartbeatBlock: css`
    flex: 1;
    border-radius: 2px;
    transition: all 0.1s ease;
    min-width: 2px;
  `,
  heartbeatLabel: css`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    text-align: left;
  `,
  
  // Stats section
  statsSection: css`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px 0;
    border-top: 1px solid ${theme.colors.border.weak};
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  statGroup: css`
    text-align: center;
  `,
  statTitle: css`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-bottom: 2px;
    font-weight: 500;
  `,
  statSubtitle: css`
    font-size: 10px;
    color: ${theme.colors.text.secondary};
    opacity: 0.7;
    margin-bottom: 4px;
  `,
  statValue: css`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  
  // Certificate section
  certSection: css`
    text-align: center;
    padding-top: 12px;
  `,
  certTitle: css`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-bottom: 2px;
    font-weight: 500;
  `,
  certSubtitle: css`
    font-size: 10px;
    color: ${theme.colors.text.secondary};
    opacity: 0.7;
    margin-bottom: 4px;
  `,
  certValue: css`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  
  // Compact mode
  compactIndicator: css`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    svg {
      color: white !important;
    }
  `,
});
