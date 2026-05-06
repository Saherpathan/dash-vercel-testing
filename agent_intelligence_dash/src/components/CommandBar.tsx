import React from 'react';
import { Search, Filter, Share2, Calendar, User, Cpu } from 'lucide-react';
import { DashboardFilters } from '../hooks/useDashboardFilters';

interface CommandBarProps {
  filters: DashboardFilters;
  onUpdate: (filters: Partial<DashboardFilters>) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ filters, onUpdate }) => {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 bg-brand-primary rounded-full" />
            <h1 className="text-sm font-semibold tracking-tight text-white uppercase">
              Agent Analytics <span className="text-zinc-500 font-normal">/ AOS-1.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <FilterItem 
              icon={<Cpu size={14} />} 
              label="Agent" 
              value={filters.agentId} 
              options={['all', 'billing_agent', 'knowledge_agent', 'orchestrator']}
              onChange={(v) => onUpdate({ agentId: v })}
            />
            <FilterItem 
              icon={<User size={14} />} 
              label="User" 
              value={filters.userId} 
              options={['all', 'user-admin', 'guest-123']}
              onChange={(v) => onUpdate({ userId: v })}
            />
            <FilterItem 
              icon={<Calendar size={14} />} 
              label="Timespan" 
              value={filters.timespan} 
              options={['24h', '7d', '30d', '90d']}
              onChange={(v) => onUpdate({ timespan: v })}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary" size={14} />
            <input 
              type="text" 
              placeholder="Search traces..." 
              className="h-8 w-64 rounded-md border border-brand-border bg-brand-card pl-9 pr-3 text-xs text-zinc-300 outline-none transition-all placeholder:text-zinc-600 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20"
            />
          </div>
          <button 
            className="flex h-8 items-center gap-2 rounded-md border border-brand-border bg-brand-card px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Copied shared link to clipboard');
            }}
          >
            <Share2 size={13} />
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  options: string[];
  onChange: (value: string) => void;
}> = ({ icon, label, value, options, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
      {icon} {label}
    </span>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 cursor-pointer appearance-none rounded border border-brand-border bg-transparent px-2 text-xs font-medium text-zinc-300 outline-none hover:bg-brand-card/50 transition-colors"
    >
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-brand-card text-white">
          {opt.replace('_', ' ').toUpperCase()}
        </option>
      ))}
    </select>
  </div>
);
