import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTasks, useTaskDetails } from '../hooks/useTasks';
import { StatusBadge } from '../components/StatusBadge';
import { LogViewer } from '../components/LogViewer';
import { ResultViewer } from '../components/ResultViewer';
import { ExecutionHistory } from '../components/ExecutionHistory';
import { TaskSidebar } from '../components/TaskSidebar';
import { ArrowLeft, Clock, Calendar, FileText, Cpu } from 'lucide-react';
import { TaskCardSkeleton } from '../components/Skeleton';

export const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks } = useTasks();
  const { data: task, isLoading, isError } = useTaskDetails(id || '');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TaskCardSkeleton />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-600">Task Not Found</h2>
        <p className="text-zinc-500 text-sm font-medium">The requested task does not exist or you lack permission to view it.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#fafafa]">
      {/* ChatGPT Style Task History Sidebar */}
      <TaskSidebar
        tasks={tasks}
        selectedTaskId={task._id}
        onNewTaskClick={() => {}}
      />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-6 min-w-0">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Task Dashboard
        </Link>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 space-y-6 shadow-xl shadow-zinc-200/40">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase border border-indigo-200/80">
                  {task.operationType}
                </span>
                <StatusBadge status={task.status} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">{task.title}</h1>
              <p className="text-xs text-zinc-400 mt-1 font-mono">ID: {task._id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-zinc-500 font-semibold">Created At</div>
                <div className="text-zinc-900 font-bold mt-0.5">{new Date(task.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-zinc-500 font-semibold">Finished At</div>
                <div className="text-zinc-900 font-bold mt-0.5">
                  {task.finishedAt ? new Date(task.finishedAt).toLocaleString() : 'In Progress / Pending'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Input Text Payload
            </h3>
            <pre className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {task.inputText}
            </pre>
          </div>

          {task.result && (
            <div className="space-y-2">
              <ResultViewer result={task.result} />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" /> Latest Execution Logs Stream
            </h3>
            <LogViewer logs={task.logs || []} />
          </div>

          {/* Execution History & Past Runs Timeline */}
          <div className="pt-4 border-t border-zinc-100">
            <ExecutionHistory history={task.executionHistory || []} />
          </div>
        </div>
      </div>
    </div>
  );
};
