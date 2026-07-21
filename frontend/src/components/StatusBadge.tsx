import React from 'react';
import { TaskStatus } from '../types/task';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          Pending
        </span>
      );
    case 'Running':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs animate-pulse">
          <Play className="w-3.5 h-3.5 fill-blue-600 text-blue-600 animate-bounce" />
          Running
        </span>
      );
    case 'Success':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Success
        </span>
      );
    case 'Failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Failed
        </span>
      );
    default:
      return null;
  }
};
