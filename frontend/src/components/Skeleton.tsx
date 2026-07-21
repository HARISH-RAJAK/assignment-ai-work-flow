import React from 'react';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white border border-zinc-200 animate-pulse space-y-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-zinc-200 rounded-lg w-1/3"></div>
        <div className="h-6 bg-zinc-200 rounded-full w-20"></div>
      </div>
      <div className="h-16 bg-zinc-100 rounded-2xl w-full"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
        <div className="h-9 bg-zinc-200 rounded-2xl w-28"></div>
      </div>
    </div>
  );
};
