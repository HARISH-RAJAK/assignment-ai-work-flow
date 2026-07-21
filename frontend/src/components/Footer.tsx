import React from 'react';
import { Cpu, Mail, Heart, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white/80 backdrop-blur-md mt-auto py-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          {/* Brand Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base text-zinc-950 tracking-tight">AI Flow Platform</span>
              <p className="text-[11px] text-zinc-500 font-medium">Asynchronous AI Task Orchestration Engine</p>
            </div>
          </div>

          {/* Developer Details Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200/90 text-xs font-bold text-zinc-800 shadow-2xs">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Developer:</span>
              <span className="text-zinc-950 font-extrabold">Harish Rajak</span>
            </div>

            <a
              href="mailto:rajakharish027@gmail.com"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-extrabold shadow-2xs transition-all"
              title="Send Mail to Harish Rajak"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>rajakharish027@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AI Flow. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>by Harish Rajak</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-zinc-700 transition-colors">TypeScript</span>
            <span>•</span>
            <span className="hover:text-zinc-700 transition-colors">React & Vite</span>
            <span>•</span>
            <span className="hover:text-zinc-700 transition-colors">Node.js Express</span>
            <span>•</span>
            <span className="hover:text-zinc-700 transition-colors">Python BullMQ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
