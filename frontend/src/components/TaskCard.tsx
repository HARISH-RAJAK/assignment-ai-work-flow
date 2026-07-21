import React, { useState } from 'react';
import { Task } from '../types/task';
import { StatusBadge } from './StatusBadge';
import { LogViewer } from './LogViewer';
import { ResultViewer } from './ResultViewer';
import { ExecutionHistory } from './ExecutionHistory';
import { RedisWarningModal } from './RedisWarningModal';
import { Zap, Cpu, Trash2, ChevronDown, ChevronUp, Clock, FileText, Loader2, History } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onRun: (id: string, mode: 'direct' | 'redis') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isRunning?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onRun,
  onDelete,
  isRunning = false,
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRedisModalOpen, setIsRedisModalOpen] = useState(false);

  const handleQueueRedisClick = () => {
    setIsRedisModalOpen(true);
  };

  const handleConfirmDirect = async () => {
    await onRun(task._id, 'direct');
  };

  return (
    <div className="rounded-3xl framer-card p-4 sm:p-6 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] sm:text-[11px] font-mono font-bold uppercase border border-indigo-200/80">
              {task.operationType}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h3 className="font-extrabold text-base sm:text-lg text-zinc-950 tracking-tight break-words">{task.title}</h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={task.status} />

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 sm:p-2 rounded-2xl bg-zinc-100 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-zinc-200/80 hover:border-rose-200 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Preview */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-800 font-mono flex items-start gap-2.5 overflow-hidden">
        <FileText className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <p className="line-clamp-2 leading-relaxed break-all">{task.inputText}</p>
      </div>

      {/* Mobile-Friendly Execution Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 pt-1">
        <button
          onClick={() => onRun(task._id, 'direct')}
          disabled={task.status === 'Running' || isRunning}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40 w-full sm:w-auto"
          title="Run directly in backend (No Redis required)"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Run Direct (Without Redis)</span>
        </button>

        <button
          onClick={handleQueueRedisClick}
          disabled={task.status === 'Running' || isRunning}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 w-full sm:w-auto"
          title="Queue to Redis Worker"
        >
          {isRunning ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Cpu className="w-3.5 h-3.5" />
          )}
          <span>Queue with Redis</span>
        </button>
      </div>

      {/* Result Display */}
      {task.result && <ResultViewer result={task.result} />}

      {/* Accordion Toggles for Logs & History */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-200/80">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-600 transition-colors"
        >
          {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showLogs ? 'Hide Logs' : `Logs (${task.logs?.length || 0})`}</span>
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <History className="w-3.5 h-3.5 text-indigo-600" />
          <span>{showHistory ? 'Hide History' : `Run History (${task.executionHistory?.length || 0})`}</span>
        </button>
      </div>

      {showLogs && (
        <div className="mt-2">
          <LogViewer logs={task.logs || []} />
        </div>
      )}

      {showHistory && (
        <div className="mt-3 pt-2 border-t border-zinc-200/80">
          <ExecutionHistory history={task.executionHistory || []} />
        </div>
      )}

      {/* Redis Warning Confirmation Modal */}
      <RedisWarningModal
        isOpen={isRedisModalOpen}
        onClose={() => setIsRedisModalOpen(false)}
        onConfirmDirect={handleConfirmDirect}
      />
    </div>
  );
};
