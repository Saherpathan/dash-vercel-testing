const [apiKey, setApiKey] = useState(localStorage.getItem('user_gemini_key') || '');
const [projectId, setProjectId] = useState(localStorage.getItem('user_gcp_project') || '');

import React, { useEffect, useState } from 'react';
import { Search, Filter, Share2, Calendar, User, Cpu, Link, Check } from 'lucide-react';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { cn } from '../lib/utils';

// Types for our filters to ensure strict TS compliance
export interface DashboardFilters {
  agentId: string;
  userId: string;
  timespan: string;
}

export const CommandBar: React.FC = () => {
  const { filters, setFilters } = useDashboardFilters();
  const [copied, setCopied] = useState(false);

  // Function to handle sharing the specific config URL
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        
        {/* Left Section: Branding & Dynamic Filters */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-1 bg-brand-primary rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-white/40 animate-pulse" />
            </div>
            <h1 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
              AOS <span className="text-zinc-600">v1.0.4</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <FilterSelect 
              icon={<Cpu size={14} />} 
              label="Agent" 
              value={filters.agentId || 'all'} 
              options={['all', 'orchestrator', 'billing_agent', 'swot_analyzer', 'research_bot']}
              onChange={(v) => setFilters({ agentId: v })}
            />
            
            <FilterSelect 
              icon={<User size={14} />} 
              label="User" 
              value={filters.userId || 'all'} 
              options={['all', 'internal-admin', 'partner-01', 'guest-node']}
              onChange={(v) => setFilters({ userId: v })}
            />

            <FilterSelect 
              icon={<Calendar size={14} />} 
              label="Timespan" 
              value={filters.timespan || '24h'} 
              options={['1h', '24h', '7d', '30d']}
              onChange={(v) => setFilters({ timespan: v })}
            />
          </div>
        </div>

        {/* Right Section: Trace Search & Sharing */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Trace ID..." 
              className="h-8 w-48 lg:w-64 rounded-md border border-brand-border bg-zinc-900/50 pl-9 pr-3 text-[11px] font-mono text-zinc-300 outline-none transition-all placeholder:text-zinc-600 focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20"
            />
          </div>

          <button 
            onClick={handleShare}
            className={cn(
              "flex h-8 items-center gap-2 rounded-md border border-brand-border bg-brand-card px-3 text-[11px] font-bold uppercase tracking-tight transition-all",
              copied ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/5" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            {copied ? "Copied" : "Share Config"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Filter Component */
interface FilterSelectProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ icon, label, value, options, onChange }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-zinc-500">
      <span className="text-zinc-600">{icon}</span>
      {label}
    </div>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 min-w-[80px] cursor-pointer appearance-none rounded border border-brand-border bg-zinc-900/20 px-2 pr-6 text-[11px] font-mono font-medium text-zinc-300 outline-none hover:border-zinc-700 hover:bg-zinc-800/50 transition-all"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-zinc-900 text-white">
            {opt.toUpperCase()}
          </option>
        ))}
      </select>
      {/* Custom Chevron for the Select */}
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600">
        <Filter size={10} />
      </div>
    </div>
  </div>
);
<div className="flex items-center gap-2 px-4 border-l border-zinc-800">
  <input 
    type="password" 
    placeholder="Gemini API Key" 
    value={apiKey}
    onChange={(e) => {
      setApiKey(e.target.value);
      localStorage.setItem('user_gemini_key', e.target.value);
    }}
    className="h-8 w-32 bg-zinc-900 border border-zinc-800 rounded px-2 text-[10px] text-emerald-500"
  />
  <input 
    type="text" 
    placeholder="GCP Project ID" 
    value={projectId}
    onChange={(e) => {
      setProjectId(e.target.value);
      localStorage.setItem('user_gcp_project', e.target.value);
    }}
    className="h-8 w-32 bg-zinc-900 border border-zinc-800 rounded px-2 text-[10px] text-blue-400"
  />
</div>
