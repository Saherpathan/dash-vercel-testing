import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardFilters } from './hooks/useDashboardFilters';
import { CommandBar } from './components/CommandBar';
import { FinOpsSummary } from './components/FinOpsSummary';
import { TraceTree } from './components/TraceTree';
import { AuditLog } from './components/AuditLog';
import { LayoutPanelLeft, ShieldCheck, Activity } from 'lucide-react';

const queryClient = new QueryClient();

function Dashboard() {
  const { filters, updateFilters } = useDashboardFilters();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <CommandBar filters={filters} onUpdate={updateFilters} />
      
      <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.03)_0%,transparent_50%)]">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 text-zinc-500 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Secure Environment</span>
            </div>
            <h1 className="text-4xl font-medium tracking-tighter text-white">
              Agent Intelligence <span className="text-zinc-600">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-500 max-w-2xl">
              Monitor multi-agent systems with trace-level diagnostics. Analyze token economics, 
              orchestration latency, and cross-agent tool handoffs in real-time.
            </p>
          </div>

          {/* FinOps Section */}
          <FinOpsSummary />

          {/* Trace Tree Section */}
          <div className="px-6 mb-12">
            <div className="border-l-2 border-brand-primary pl-4 mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Technical Traces</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Forensic Reasoning Analysis</p>
            </div>
            <TraceTree />
          </div>

          {/* Forensic Logs Section */}
          <div className="px-6 mb-12">
            <div className="border-l-2 border-zinc-700 pl-4 mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Context Inflation Audit</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Session History & Forensic Analysis</p>
            </div>
            <AuditLog />
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="border-t border-brand-border bg-brand-card/30 px-6 py-3 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GATEWAY: ONLINE
          </div>
          <div>REGION: ASIA-SOUTH-1</div>
          <div>PROVIDER: GOOGLE CLOUD</div>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 42ms</span>
          <span>UPTIME: 99.99%</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

