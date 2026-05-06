import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Wallet, Zap, MessageSquare } from 'lucide-react';
import { cn, formatCompactNumber, formatCurrency } from '../lib/utils';
import { MOCK_STATS, generateDailyConsumptionData } from '../services/mockData';

const consumptionData = generateDailyConsumptionData();

export const FinOpsSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Sparkline Cards */}
      <StatCard 
        label="Total Sessions" 
        value={MOCK_STATS.totalSessions} 
        trend="+12%" 
        icon={<TrendingUp size={16} />}
      />
      <StatCard 
        label="Total User Questions" 
        value={MOCK_STATS.totalQuestions} 
        trend="+8%" 
        icon={<MessageSquare size={16} />}
      />
      <StatCard 
        label="Total Tokens (Mil)" 
        value={MOCK_STATS.totalTokens.toString()} 
        unit="Mil"
        trend="+15%" 
        icon={<Zap size={16} />}
        color="text-brand-primary"
      />
      <StatCard 
        label="Total Cost (USD)" 
        value={formatCurrency(MOCK_STATS.totalCost)} 
        trend="+4%" 
        icon={<Wallet size={16} />}
        color="text-emerald-500"
      />

      {/* Main Consumption Chart */}
      <div className="col-span-12 rounded-xl border border-brand-border bg-brand-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} className="text-brand-primary" /> Daily Token Consumption
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Input vs Output tokens distributed across timespan</p>
          </div>
          <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-brand-primary" /> Input</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /> Output</div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData}>
              <defs>
                <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10}
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => formatCompactNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="inputTokens" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorInput)" 
              />
              <Area 
                type="monotone" 
                dataKey="outputTokens" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOutput)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  trend: string; 
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}> = ({ label, value, trend, icon, unit, color = "text-white" }) => (
  <div className="col-span-12 md:col-span-3 rounded-xl border border-brand-border bg-brand-card p-5 transition-all hover:border-zinc-700">
    <div className="flex items-center justify-between opacity-50">
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {icon}
    </div>
    <div className="mt-2 flex items-baseline gap-2">
      <span className={cn("text-4xl font-mono font-medium tracking-tighter", color)}>
        {value}
      </span>
      {unit && <span className="text-xs font-semibold opacity-30 uppercase">{unit}</span>}
    </div>
    <div className="mt-3 flex items-center gap-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{trend} vs last month</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-brand-border bg-brand-bg/95 p-3 shadow-xl backdrop-blur-sm">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-zinc-400">Input Tokens</span>
            <span className="font-mono text-xs text-brand-primary">{formatCompactNumber(payload[0].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-zinc-400">Output Tokens</span>
            <span className="font-mono text-xs text-blue-500">{formatCompactNumber(payload[1].value)}</span>
          </div>
          <div className="mt-2 border-t border-brand-border pt-2 flex items-center justify-between gap-8">
            <span className="text-xs font-bold text-white uppercase">Total</span>
            <span className="font-mono text-xs font-bold text-white">{formatCompactNumber(payload[0].value + payload[1].value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
