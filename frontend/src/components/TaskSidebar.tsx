import React, { useState } from 'react';
import { Task } from '../types/task';
import { Plus, PanelLeftClose, PanelLeft, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TaskSidebarProps {
  tasks: Task[];
  onNewTaskClick: () => void;
  selectedTaskId?: string;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  tasks,
  onNewTaskClick,
  selectedTaskId,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Default closed on mobile, toggleable on desktop
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const navigate = useNavigate();

  const groupTasksByDate = (taskList: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups: { [key: string]: Task[] } = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    };

    taskList.forEach((task) => {
      const taskDate = new Date(task.createdAt);
      if (taskDate >= today) {
        groups['Today'].push(task);
      } else if (taskDate >= yesterday) {
        groups['Yesterday'].push(task);
      } else if (taskDate >= sevenDaysAgo) {
        groups['Previous 7 Days'].push(task);
      } else {
        groups['Older'].push(task);
      }
    });

    return groups;
  };

  const grouped = groupTasksByDate(tasks);

  const renderStatusDot = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />;
      case 'Running':
        return <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce shrink-0" />;
      case 'Success':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
      case 'Failed':
        return <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />;
      default:
        return null;
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
    setIsOpen(false); // Auto close mobile drawer on task selection
  };

  return (
    <>
      {/* Mobile Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 left-5 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-950 text-white shadow-2xl border border-zinc-800 transition-transform active:scale-95"
        title="Open Task History Sidebar"
      >
        <PanelLeft className="w-4.5 h-4.5 text-indigo-400" />
        <span className="text-xs font-extrabold tracking-wide">Tasks ({tasks.length})</span>
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      {/* Sidebar Drawer (Mobile Overlay Drawer + Desktop Sidebar) */}
      <aside
        className={`
          fixed md:sticky top-0 md:top-16 inset-y-0 left-0 z-50 md:z-20
          h-screen md:h-[calc(100vh-4rem)] bg-white border-r border-zinc-200/90
          flex flex-col shrink-0 shadow-2xl md:shadow-xs transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${isDesktopOpen ? 'md:w-72 md:block' : 'md:w-0 md:hidden md:border-r-0'}
        `}
      >
        <div className="p-4 space-y-3 w-72 shrink-0 border-b md:border-b-0 border-zinc-100">
          {/* Top Header: ChatGPT Style "+ New Task" */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onNewTaskClick();
                setIsOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>New Task</span>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsDesktopOpen(false)}
              className="hidden md:block p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400 px-1 pt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Task History Stream</span>
          </div>
        </div>

        {/* Scrollable Grouped Task List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 w-72 no-scrollbar">
          {Object.entries(grouped).map(([groupName, groupTasks]) => {
            if (groupTasks.length === 0) return null;

            return (
              <div key={groupName} className="space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-2 py-1 flex items-center justify-between">
                  <span>{groupName}</span>
                  <span className="text-zinc-400 font-mono text-[9px]">{groupTasks.length}</span>
                </div>

                <div className="space-y-1">
                  {groupTasks.map((task) => {
                    const isSelected = selectedTaskId === task._id;

                    return (
                      <button
                        key={task._id}
                        onClick={() => handleTaskClick(task._id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-left text-xs font-semibold transition-all group ${
                          isSelected
                            ? 'bg-indigo-50 border border-indigo-200/90 text-indigo-950 shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-100/90 hover:text-zinc-950 border border-transparent'
                        }`}
                      >
                        {renderStatusDot(task.status)}
                        <span className="truncate flex-1 font-medium">{task.title}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200">
                          {task.operationType.substring(0, 3)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="p-4 text-center text-xs text-zinc-400 font-medium italic">
              No tasks created yet. Click "+ New Task" to start.
            </div>
          )}
        </div>
      </aside>

      {/* Desktop Expand Button when Collapsed */}
      {!isDesktopOpen && (
        <button
          onClick={() => setIsDesktopOpen(true)}
          className="hidden md:flex fixed top-20 left-4 z-30 p-2.5 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 shadow-md transition-all"
          title="Expand Task Sidebar"
        >
          <PanelLeft className="w-4 h-4 text-indigo-600" />
        </button>
      )}
    </>
  );
};
