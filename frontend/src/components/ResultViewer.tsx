import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface ResultViewerProps {
  result?: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-4 relative overflow-hidden shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-indigo-800 font-extrabold text-xs tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Processing Output Result</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-zinc-100 text-indigo-700 border border-indigo-200/80 text-[11px] font-bold shadow-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Result'}</span>
        </button>
      </div>
      <pre className="p-3.5 rounded-xl bg-white border border-indigo-100 text-zinc-900 font-mono text-xs font-semibold overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-xs">
        {result}
      </pre>
    </div>
  );
};
