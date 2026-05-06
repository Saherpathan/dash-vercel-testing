import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DashboardFilters {
  agentId: string;
  userId: string;
  timespan: string;
  traceId: string;
}

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    agentId: searchParams.get('agent_id') || 'all',
    userId: searchParams.get('user_id') || 'all',
    timespan: searchParams.get('timespan') || '30d',
    traceId: searchParams.get('trace_id') || '',
  }), [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    const params = new URLSearchParams(searchParams);
    
    if (newFilters.agentId) params.set('agent_id', newFilters.agentId);
    if (newFilters.userId) params.set('user_id', newFilters.userId);
    if (newFilters.timespan) params.set('timespan', newFilters.timespan);
    if (newFilters.traceId !== undefined) {
      if (newFilters.traceId) params.set('trace_id', newFilters.traceId);
      else params.delete('trace_id');
    }
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return { filters, updateFilters };
}
