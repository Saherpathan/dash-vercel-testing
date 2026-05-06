import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Edge, Node, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MOCK_TRACE_DATA, TraceNode } from '../services/mockData';
import { cn } from '../lib/utils';
import { Activity, Wrench, Bot, AlertCircle } from 'lucide-react';

const nodeTypes = {
  customNode: CustomNode,
};

function CustomNode({ data }: any) {
  const node = data.node as TraceNode;
  const isError = node.status === 'error';

  return (
    <div className={cn(
      "relative min-w-[200px] rounded-lg border-2 bg-brand-card p-3 transition-all",
      isError ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-zinc-800 hover:border-zinc-700"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-700" />
      
      <div className="flex items-center justify-between gap-3">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          node.type === 'orchestrator' ? "bg-amber-500/10 text-amber-500" :
          node.type === 'agent' ? "bg-blue-500/10 text-blue-500" :
          "bg-emerald-500/10 text-emerald-500"
        )}>
          {node.type === 'orchestrator' && <Activity size={16} />}
          {node.type === 'agent' && <Bot size={16} />}
          {node.type === 'tool' && <Wrench size={16} />}
        </div>
        
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{node.type}</p>
          <p className="text-sm font-semibold">{node.label}</p>
        </div>

        {isError && <AlertCircle size={16} className="text-red-500 animate-pulse" />}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-2 text-[10px] font-mono text-zinc-500">
        <span>{node.latency}ms</span>
        <span>{node.tokens} tokens</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700" />
    </div>
  );
}

export const TraceTree: React.FC = () => {
  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = MOCK_TRACE_DATA.map((node, i) => ({
      id: node.id,
      type: 'customNode',
      position: { x: i * 250, y: (node.parentId ? 200 : 0) + (node.type === 'tool' ? 200 : 0) },
      data: { node },
    }));

    const flowEdges: Edge[] = MOCK_TRACE_DATA
      .filter(n => n.parentId)
      .map(node => ({
        id: `e${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        animated: node.status === 'success',
        style: { 
          stroke: node.status === 'error' ? '#ef4444' : '#27272a',
          strokeWidth: 2 
        },
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, []);

  return (
    <div className="h-[600px] w-full rounded-xl border border-brand-border bg-brand-bg/50 p-6 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Activity size={14} className="text-zinc-500" /> Reasoning Trace Execution
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Hierarchical visualization of agent handoffs and tool calls</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
          <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /> Orchestrator</div>
          <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /> Agent</div>
          <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Tool</div>
        </div>
      </div>
      
      <div className="h-full w-full overflow-hidden rounded-lg bg-brand-bg relative border border-brand-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background color="#27272a" gap={20} />
          <Controls className="bg-brand-card border-brand-border fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
};
