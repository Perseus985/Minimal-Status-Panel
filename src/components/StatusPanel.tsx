import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { StatusPanelProps } from '../types';
import { StatusIndicator } from './StatusIndicator';
import { parseDataFrames } from '../utils/dataUtils';

export const StatusPanel: React.FC<StatusPanelProps> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  
  const services = useMemo(() => {
    try {
      if (!data || !data.series || data.series.length === 0) {
        console.log('No data series available');
        return [];
      }
      console.log('Data series:', data.series);
      const parsed = parseDataFrames(data.series, options.customNames);
      console.log('Parsed services:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing data frames:', error);
      return [];
    }
  }, [data]);

  const limitedServices = services.slice(0, options.maxItems || 20);

  const getContainerClass = () => {
    switch (options.displayMode) {
      case 'grid':
        return styles.gridContainer;
      case 'compact':
        return styles.compactContainer;
      default:
        return styles.listContainer;
    }
  };

  // Debug information
  if (!services.length) {
    return (
      <div className={styles.noData}>
        <div className={styles.noDataText}>No status data available</div>
        <div className={styles.noDataSubtext}>
          {data && data.series ? `Found ${data.series.length} data series, but no parseable status data` : 'No data series found'}
        </div>
        <div className={styles.noDataSubtext}>
          Query: probe_success (check if data is returning in Query Inspector)
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={{ width, height }}>
      <div className={getContainerClass()}>
        {limitedServices.map((service, index) => (
          <StatusIndicator
            key={`${service.name}-${index}`}
            service={service}
            options={options}
            displayMode={options.displayMode}
          />
        ))}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    padding: 8px;
    overflow: auto;
    background: ${theme.colors.background.primary};
  `,
  listContainer: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  gridContainer: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  `,
  compactContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  `,
  noData: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${theme.colors.text.secondary};
  `,
  noDataText: css`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  `,
  noDataSubtext: css`
    font-size: 14px;
    opacity: 0.7;
  `,
});
