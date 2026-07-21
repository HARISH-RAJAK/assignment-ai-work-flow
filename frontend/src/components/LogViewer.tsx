import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface LogViewerProps {
  logs: string[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-900 overflow-hidden shadow-sm font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="font-sans font-bold text-xs text-zinc-200">Execution Logs Stream</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Logs'}</span>
        </button>
      </div>
      <div className="p-4 max-h-60 overflow-y-auto space-y-1 text-zinc-300">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="leading-relaxed hover:bg-zinc-800/50 rounded px-1.5 py-0.5">
              <span className="text-zinc-500 mr-2 font-semibold">{index + 1}</span>
              <span className={log.includes('ERROR') ? 'text-rose-400 font-semibold' : 'text-zinc-200'}>
                {log}
              </span>
            </div>
          ))
        ) : (
          <div className="text-zinc-500 italic">No logs recorded yet.</div>
        )}
      </div>
    </div>
  );
};
