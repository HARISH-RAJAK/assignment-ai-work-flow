import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskCardSkeleton } from '../components/Skeleton';
import { Toast } from '../components/Toast';
import { TaskSidebar } from '../components/TaskSidebar';
import { Plus, RefreshCw, Layers, CheckCircle2, Clock, Play, AlertCircle, Sparkles, Cpu } from 'lucide-react';
import { CreateTaskPayload } from '../types/task';

export const DashboardPage: React.FC = () => {
  const {
    tasks,
    isLoading,
    refetch,
    createTask,
    isCreating,
    runTask,
    deleteTask,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  const handleCreateTask = async (data: CreateTaskPayload) => {
    try {
      await createTask(data);
      setToast({ message: 'Task created successfully in Pending status', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Failed to create task', type: 'error' });
    }
  };

  const handleRunTask = async (id: string, mode: 'direct' | 'redis') => {
    setRunningTaskId(id);
    try {
      const res = await runTask({ id, mode });
      const msg =
        mode === 'direct'
          ? 'Task executed instantly via Direct Engine (No Redis required)'
          : 'Task enqueued to Redis Queue & Python Worker';
      setToast({ message: msg, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Failed to execute task', type: 'error' });
    } finally {
      setRunningTaskId(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setToast({ message: 'Task removed successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Failed to delete task', type: 'error' });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status.toUpperCase() === filterStatus;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    running: tasks.filter((t) => t.status === 'Running').length,
    success: tasks.filter((t) => t.status === 'Success').length,
    failed: tasks.filter((t) => t.status === 'Failed').length,
  };

  const tabOptions = [
    { key: 'ALL', label: 'All Tasks', count: counts.all },
    { key: 'PENDING', label: 'Pending', count: counts.pending },
    { key: 'RUNNING', label: 'Running', count: counts.running },
    { key: 'SUCCESS', label: 'Success', count: counts.success },
    { key: 'FAILED', label: 'Failed', count: counts.failed },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#fafafa]">
      {/* ChatGPT-Style Date-Grouped Sidebar */}
      <TaskSidebar
        tasks={tasks}
        onNewTaskClick={() => setIsModalOpen(true)}
      />

      {/* Main Dashboard Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 min-w-0">
        {/* Framer-Inspired Responsive Hero Banner matching card design system */}
        <div className="relative overflow-hidden p-5 sm:p-10 rounded-3xl framer-card">
          <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Next-Gen Task Orchestration Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 leading-tight">
                AI Task Orchestration Platform
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-medium">
                Process complex asynchronous workloads with dual execution engines — Direct Backend Processing & Distributed Redis Python Worker Pools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => refetch()}
                className="flex items-center justify-center p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 hover:text-zinc-900 border border-zinc-200 transition-all shadow-xs"
                title="Refresh task stream"
              >
                <RefreshCw className="w-4 h-4 mr-2 sm:mr-0" />
                <span className="sm:hidden text-xs font-bold">Refresh Tasks</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 transition-all framer-button-primary w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl framer-card flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 shrink-0">
              <Layers className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider truncate">Total</div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 mt-0.5">{counts.all}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl framer-card flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 shrink-0">
              <Clock className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider truncate">Pending</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{counts.pending}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl framer-card flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 shrink-0">
              <Play className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider truncate">Running</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">{counts.running}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl framer-card flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate">Success</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{counts.success}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl framer-card flex items-center gap-3 sm:gap-4 col-span-2 sm:col-span-1">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 shrink-0">
              <AlertCircle className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider truncate">Failed</div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5">{counts.failed}</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-3 overflow-x-auto no-scrollbar scroll-smooth">
          {tabOptions.map((tab) => {
            const isActive = filterStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/20'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 border border-zinc-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onRun={handleRunTask}
                onDelete={handleDeleteTask}
                isRunning={runningTaskId === task._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 framer-card rounded-3xl space-y-4 shadow-sm p-6">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Cpu className="w-7 sm:w-8 h-7 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-zinc-950">No tasks found</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed font-medium">
              Create your first task to experience real-time execution logs and output processing.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        )}

        {/* Modal */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          isLoading={isCreating}
        />

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};
