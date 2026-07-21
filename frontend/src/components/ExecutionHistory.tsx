import React, { useState } from 'react';
import { ExecutionRun } from '../types/task';
import { StatusBadge } from './StatusBadge';
import { LogViewer } from './LogViewer';
import { ResultViewer } from './ResultViewer';
import { History, Zap, Cpu, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface ExecutionHistoryProps {
  history?: ExecutionRun[];
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ history = [] }) => {
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center text-xs text-zinc-500 italic">
        No execution history recorded yet. Run task to record execution attempts.
      </div>
    );
  }

  const toggleRun = (runId: string) => {
    setExpandedRunId(expandedRunId === runId ? null : runId);
  };

  // Sort history in reverse chronological order (newest runs first)
  const sortedHistory = [...history].reverse();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-700 mb-1">
        <History className="w-4 h-4 text-indigo-600" />
        <span>Execution History & Past Run Logs ({history.length} Runs)</span>
      </div>

      <div className="space-y-2">
        {sortedHistory.map((run) => {
          const isExpanded = expandedRunId === run.runId;

          return (
            <div
              key={run.runId || run.runNumber}
              className="rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleRun(run.runId)}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-50/80 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-200/80">
                    Run #{run.runNumber}
                  </span>

                  {run.mode === 'direct' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      <Zap className="w-3 h-3 fill-current text-emerald-600" />
                      Direct Engine
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
                      <Cpu className="w-3 h-3 text-indigo-600" />
                      Redis Queue Worker
                    </span>
                  )}

                  <StatusBadge status={run.status} />

                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 ml-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(run.executedAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-zinc-100 space-y-3 bg-zinc-50/50">
                  {run.result && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-indigo-700">Run #{run.runNumber} Output:</span>
                      <ResultViewer result={run.result} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-800">Run #{run.runNumber} Logs:</span>
                    <LogViewer logs={run.logs || []} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
