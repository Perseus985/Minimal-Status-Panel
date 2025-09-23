import { PanelData, TimeRange } from '@grafana/data';

export interface StatusPanelOptions {
  displayMode: 'list' | 'grid' | 'compact';
  displayLevel: 'minimal' | 'full' | 'ultra-minimal';
  showLabels: boolean;
  showLastCheck: boolean;
  showResponseTime: boolean;
  showUrls: boolean;
  maxItems: number;
  refreshInterval: number;
  customNames: string;
}

export interface HeartbeatData {
  timestamp: number;
  status: 'up' | 'down' | 'unknown';
  value: number;
}

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'maintenance' | 'warning' | 'unknown';
  lastCheck?: Date;
  responseTime?: number;
  url?: string;
  uptime?: number;
  message?: string;
  heartbeatData?: HeartbeatData[];
}

export interface StatusPanelProps {
  options: StatusPanelOptions;
  data: PanelData;
  width: number;
  height: number;
  timeRange: TimeRange;
  onOptionsChange: (options: StatusPanelOptions) => void;
}
