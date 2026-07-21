import React from 'react';
import { AlertTriangle, Zap, X } from 'lucide-react';

interface RedisWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDirect: () => void;
}

export const RedisWarningModal: React.FC<RedisWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirmDirect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-6 animate-modal-slide">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tight">Redis Credentials / Server Not Found</h3>
              <p className="text-xs text-amber-700 font-bold mt-0.5">No active Redis Queue connection detected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 space-y-2 leading-relaxed">
          <p>
            You requested to queue this task via Redis Worker, but local/cloud Redis credentials are not connected right now.
          </p>
          <p className="font-extrabold text-zinc-900">
            Would you like to continue executing this task using the <span className="text-emerald-600">Direct Backend Engine (Without Redis)</span> instead?
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onConfirmDirect();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Continue Without Redis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
