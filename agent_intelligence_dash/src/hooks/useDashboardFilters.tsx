import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DashboardFilters {
  // BQ Configuration Parameters
  projectId: string;
  datasetId: string;
  tableId: string;
  
  // Date Filters (Replacing timespan for partitioning)
  startDate: string;
  endDate: string;

  // Analysis Filters
  agentId: string;
  userId: string;
  traceId: string;
}

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    // BQ Config
    projectId: searchParams.get('project_id') || '',
    datasetId: searchParams.get('dataset_id') || '',
    tableId: searchParams.get('table_id') || '',
    
    // Dates (Defaulting to today and 7 days ago)
    startDate: searchParams.get('start_date') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: searchParams.get('end_date') || new Date().toISOString().split('T')[0],

    // Original Filters
    agentId: searchParams.get('agent_id') || 'all',
    userId: searchParams.get('user_id') || 'all',
    traceId: searchParams.get('trace_id') || '',
  }), [searchParams]);

  const updateFilters = useCallback((updates: Partial<DashboardFilters>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      // Convert camelCase to snake_case for URL cleanliness
      const urlKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      if (value === null || value === 'all' || value === '') {
        newParams.delete(urlKey);
      } else {
        newParams.set(urlKey, value);
      }
    });

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return { filters, updateFilters };
}
