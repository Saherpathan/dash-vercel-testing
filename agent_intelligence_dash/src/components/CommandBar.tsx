import React from 'react';
import { Database, Table, Calendar, Activity, Search } from 'lucide-react';
import { DashboardFilters } from '../hooks/useDashboardFilters';

interface CommandBarProps {
  filters: DashboardFilters;
  onUpdate: (filters: Partial<DashboardFilters>) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ filters, onUpdate }) => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        
        {/* Left Side: Brand & Identity */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-brand-primary rounded-full" />
            <h1 className="text-sm font-semibold tracking-tight text-white uppercase">
              Agent Analytics <span className="text-zinc-500 font-normal">/ BigQuery SDK</span>
            </h1>
          </div>
        </div>

        {/* Center: BQ Configuration Parameters */}
        <div className="hidden md:flex items-center gap-4 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2 px-2 border-r border-zinc-800">
            <Activity className="h-4 w-4 text-zinc-500" />
            <input 
              placeholder="Project ID"
              className="bg-transparent text-xs text-white focus:outline-none w-32"
              value={filters.projectId || ''}
              onChange={(e) => onUpdate({ projectId: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 px-2 border-r border-zinc-800">
            <Database className="h-4 w-4 text-zinc-500" />
            <input 
              placeholder="Dataset ID"
              className="bg-transparent text-xs text-white focus:outline-none w-24"
              value={filters.datasetId || ''}
              onChange={(e) => onUpdate({ datasetId: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 px-2">
            <Table className="h-4 w-4 text-zinc-500" />
            <input 
              placeholder="Table ID"
              className="bg-transparent text-xs text-white focus:outline-none w-24"
              value={filters.tableId || ''}
              onChange={(e) => onUpdate({ tableId: e.target.value })}
            />
          </div>
        </div>

        {/* Right Side: Date Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-md border border-zinc-800">
            <Calendar className="h-4 w-4 text-brand-primary" />
            <input 
              type="date"
              className="bg-transparent text-xs text-white focus:outline-none color-scheme-dark"
              value={filters.startDate || ''}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
            />
            <span className="text-zinc-600 text-xs">—</span>
            <input 
              type="date"
              className="bg-transparent text-xs text-white focus:outline-none color-scheme-dark"
              value={filters.endDate || ''}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
            />
          </div>
          
          <button className="flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-md border border-brand-primary/30 transition-all text-xs font-medium">
            <Search className="h-3.5 w-3.5" />
            Sync Logs
          </button>
        </div>

      </div>
    </div>
  );
};
