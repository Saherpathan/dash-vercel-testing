import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, Zap, MessageSquare, Loader2 } from 'lucide-react';
import { cn, formatCompactNumber, formatCurrency } from '../lib/utils';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { fetchAgentData } from '../services/apiService';

export const FinOpsSummary: React.FC = () => {
  const { filters } = useDashboardFilters();
  const [stats, setStats] = useState<any>(null);
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinOps = async () => {
      setLoading(true);
      try {
        // Fetching live metrics from your BigQuery API
        const data = await fetchAgentData(filters.orgId);
        setStats(data.summary);
        setConsumptionData(data.consumptionTrend);
      } catch (err) {
        console.error("FinOps Load Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFinOps();
  }, [filters.orgId, filters.timespan]);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-12 gap-6 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-span-12 md:col-span-3 h-32 animate-pulse bg-zinc-900/50 rounded-xl border border-zinc-800" />
        ))}
        <div className="col-span-12 h-80 animate-pulse bg-zinc-900/20 rounded-xl border border-zinc-800" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Sparkline Cards */}
      <StatCard 
        label="Total Sessions" 
        value={stats.totalSessions} 
        trend={stats.sessionTrend} 
        icon={<TrendingUp size={16} />}
      />
      <StatCard 
        label="Total User Questions" 
        value={stats.totalQuestions} 
        trend={stats.questionTrend} 
        icon={<MessageSquare size={16} />}
      />
      <StatCard 
        label="Total Tokens (Mil)" 
        value={stats.totalTokens} 
        unit="Mil"
        trend={stats.tokenTrend} 
        icon={<Zap size={16} />}
        color="text-brand-primary"
      />
      <StatCard 
        label="Total Cost (USD)" 
        value={formatCurrency(stats.totalCost)} 
        trend={stats.costTrend} 
        icon={<Wallet size={16} />}
        color="text-emerald-500"
      />

      {/* Main Consumption Chart */}
      <div className="col-span-12 rounded-xl border border-brand-border bg-brand-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap size={14} className="text-brand-primary" /> Daily Token Consumption
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1 font-medium">Aggregated Input vs Output tokens across selected timespan</p>
          </div>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" /> Input
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Output
            </div>
          </div>
        </div>
        
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData}>
              <defs>
                <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={12}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => formatCompactNumber(val)}
                fontFamily="JetBrains Mono"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#27272a', strokeWidth: 1 }} />
              <Area 
                type="monotone" 
                dataKey="input" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorInput)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="output" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOutput)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* Reusable Stat Card with Skeleton-ready design */
const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  trend: string; 
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}> = ({ label, value, trend, icon, unit, color = "text-white" }) => (
  <div className="col-span-12 md:col-span-3 rounded-xl border border-brand-border bg-brand-card p-5 transition-all hover:border-zinc-700 group">
    <div className="flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</span>
      <div className="text-zinc-500">{icon}</div>
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className={cn("text-3xl font-mono font-bold tracking-tighter", color)}>
        {value}
      </span>
      {unit && <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">{unit}</span>}
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className={cn("h-1 w-1 rounded-full", trend.includes('+') ? "bg-emerald-500" : "bg-red-500")} />
      <span className={cn("text-[9px] font-black uppercase tracking-widest", trend.includes('+') ? "text-emerald-500" : "text-red-500")}>
        {trend} vs prev
      </span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-black/90 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800 pb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-12">
            <span className="text-[10px] font-bold uppercase text-zinc-400">Input</span>
            <span className="font-mono text-xs font-bold text-red-500">{formatCompactNumber(payload[0].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-12">
            <span className="text-[10px] font-bold uppercase text-zinc-400">Output</span>
            <span className="font-mono text-xs font-bold text-blue-500">{formatCompactNumber(payload[1].value)}</span>
          </div>
          <div className="mt-3 border-t border-zinc-800 pt-2 flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Total Usage</span>
            <span className="font-mono text-xs font-black text-white">{formatCompactNumber(payload[0].value + payload[1].value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
