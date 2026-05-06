import { subDays, format, startOfDay } from 'date-fns';

export interface TraceNode {
  id: string;
  type: 'orchestrator' | 'agent' | 'tool';
  label: string;
  status: 'success' | 'error';
  latency: number;
  tokens: number;
  data?: any;
  parentId?: string;
}

export interface Session {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalTurns: number;
  totalTokens: number;
  cost: number;
  status: 'completed' | 'ongoing';
}

export const MOCK_SESSIONS: Session[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `session-177${428014 + i * 123}`,
  userId: 'user-admin',
  startTime: format(subDays(new Date(), Math.floor(i / 2)), 'yyyy-MM-dd HH:mm:ss'),
  endTime: format(subDays(new Date(), Math.floor(i / 2)), 'yyyy-MM-dd HH:mm:ss'),
  totalTurns: Math.floor(Math.random() * 15) + 2,
  totalTokens: Math.floor(Math.random() * 1000000),
  cost: Number((Math.random() * 3.5).toFixed(4)),
  status: 'completed',
}));

export const generateDailyConsumptionData = () => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'MM/dd');
    const input = Math.floor(Math.random() * 5000000) + 1000000;
    const output = Math.floor(Math.random() * 1000000) + 200000;
    return {
      date,
      inputTokens: input,
      outputTokens: output,
      totalTokens: input + output,
    };
  });
};

export const MOCK_TRACE_DATA: TraceNode[] = [
  { id: '1', type: 'orchestrator', label: 'Root Orchestrator', status: 'success', latency: 450, tokens: 1200 },
  { id: '2', type: 'agent', label: 'Billing Agent', status: 'success', latency: 850, tokens: 2500, parentId: '1' },
  { id: '3', type: 'tool', label: 'get_invoice_items', status: 'success', latency: 1200, tokens: 400, parentId: '2' },
  { id: '4', type: 'agent', label: 'Metrics Agent', status: 'error', latency: 2100, tokens: 5000, parentId: '1' },
  { id: '5', type: 'tool', label: 'list_project_alerts', status: 'error', latency: 900, tokens: 0, parentId: '4' },
  { id: '6', type: 'agent', label: 'Knowledge Agent', status: 'success', latency: 150, tokens: 300, parentId: '2' },
];

export const MOCK_STATS = {
  totalSessions: 160,
  totalQuestions: 559,
  totalTokens: 44.9,
  totalCost: 4.61,
  successRate: 100,
  maxTTFT: 1.28,
};
