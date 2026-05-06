import React, { useEffect, useState } from 'react';

import { formatCurrency, formatCompactNumber } from '../lib/utils';
import { ArrowUpRight, Clock, Hash, Coins, Loader2 } from 'lucide-react';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { fetchAgentData } from '../services/apiService';

export const AuditLog: React.FC = () => {
  const { filters } = useDashboardFilters();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetching live data from BigQuery via your API
        const data = await fetchAgentData(filters.orgId);
        setSessions(data.sessions || []); 
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters.orgId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64 text-zinc-500">
        <Loader2 className="animate-spin mr-2" size={20} />
        Streaming from BigQuery...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-xl border border-brand-border bg-brand-card overflow-hidden">
        <div className="border-b border-brand-border bg-zinc-900/50 p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            Audit Logs: Context Inflation Tracking
          </h3>
          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-400">
            TOTAL_SESSIONS: {sessions.length}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/30">
                <HeaderCell label="Internal Session ID" icon={<Hash size={12} />} />
                <HeaderCell label="User Identity" />
                <HeaderCell label="Start Time" icon={<Clock size={12} />} />
                <HeaderCell label="Turns" />
                <HeaderCell label="Tokens" icon={<Coins size={12} />} />
                <HeaderCell label="Cost (est)" />
                <HeaderCell label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-4 py-3 text-xs font-mono text-zinc-400 select-all underline decoration-zinc-800 underline-offset-4 decoration-dashed hover:text-brand-primary">
                    {session.id}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500/50" />
                      {session.userId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-500">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {session.totalTurns}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {formatCompactNumber(session.totalTokens)}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-emerald-500">
                    {formatCurrency(session.cost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded bg-zinc-800 hover:bg-brand-primary/20 hover:text-brand-primary transition-all">
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const HeaderCell: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
    <div className="flex items-center gap-1.5">
      {icon} {label}
    </div>
  </th>
);
