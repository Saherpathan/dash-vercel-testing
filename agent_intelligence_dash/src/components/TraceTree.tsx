import React, { useMemo, useEffect, useState } from 'react';
import { ReactFlow, Background, Controls, Edge, Node, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '../lib/utils';
import { Activity, Wrench, Bot, AlertCircle, Loader2 } from 'lucide-react';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { fetchAgentData } from '../services/apiService';

// Define the Node UI
function CustomNode({ data }: any) {
  const node = data.node;
  const isError = node.status === 'error';

  return (
    <div className={cn(
      "relative min-w-[220px] rounded-lg border-2 bg-brand-card p-3 transition-all",
      isError ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-zinc-800 hover:border-zinc-700"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !w-2 !h-2" />
      
      <div className="flex items-center justify-between gap-3">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border",
          node.type === 'orchestrator' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
          node.type === 'agent' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          {node.type === 'orchestrator' && <Activity size={18} />}
          {node.type === 'agent' && <Bot size={18} />}
          {node.type === 'tool' && <Wrench size={18} />}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-tighter opacity-40 mb-0.5">{node.type}</p>
          <p className="text-xs font-bold truncate text-zinc-200">{node.label}</p>
        </div>

        {isError && <AlertCircle size={16} className="text-red-500 animate-pulse shrink-0" />}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/50 pt-2 text-[10px] font-mono font-medium">
        <span className="text-zinc-500">{node.latency}ms</span>
        <span className="text-brand-primary">{node.tokens.toLocaleString()} <span className="opacity-50">TKN</span></span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

export const TraceTree: React.FC = () => {
  const { filters } = useDashboardFilters();
  const [traceData, setTraceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrace = async () => {
      setLoading(true);
      try {
        // Fetching live trace logs from BigQuery
        const data = await fetchAgentData(filters.orgId);
        setTraceData(data.traces || []);
      } catch (err) {
        console.error("Trace load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrace();
  }, [filters.orgId, filters.agentId]);

  // Transform flat BigQuery logs into React Flow format
  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = traceData.map((node, i) => {
      // Basic vertical layout logic: Orchestrator (Top) -> Agents (Mid) -> Tools (Bottom)
      const depth = node.type === 'orchestrator' ? 0 : node.type === 'agent' ? 1 : 2;
      
      return {
        id: node.id,
        type: 'customNode',
        position: { x: i * 260, y: depth * 180 },
        data: { node },
      };
    });

    const flowEdges: Edge[] = traceData
      .filter(n => n.parentId)
      .map(node => ({
        id: `e${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        animated: node.status === 'success',
        type: 'smoothstep',
        style: { 
          stroke: node.status === 'error' ? '#ef4444' : '#3f3f46',
          strokeWidth: 2,
        },
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [traceData]);

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-brand-bg/50 rounded-xl border border-brand-border">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={32} />
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Reconstructing Trace Tree...</p>
      </div>
    );
  }

  return (
    <div className="h-[650px] w-full rounded-xl border border-brand-border bg-brand-bg/30 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-ping" />
            Reasoning Trace Execution
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium">Real-time sequence of agentic reasoning and dependency resolution</p>
        </div>
        
        <div className="flex items-center gap-5 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <LegendItem color="bg-amber-500" label="Orchestrator" />
          <LegendItem color="bg-blue-500" label="Agent" />
          <LegendItem color="bg-emerald-500" label="Tool" />
        </div>
      </div>
      
      <div className="h-[500px] w-full overflow-hidden rounded-lg bg-zinc-950/50 border border-zinc-800/50 shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
          maxZoom={1.5}
          minZoom={0.2}
        >
          <Background color="#18181b" gap={25} size={1} />
          <Controls className="!bg-zinc-900 !border-zinc-700 !fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
    <div className={cn("h-1.5 w-1.5 rounded-full", color)} /> {label}
  </div>
);
