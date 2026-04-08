import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tool } from '../../services/gemini';

interface ToolInputProps {
  tool: Tool;
  input: string;
  setInput: (value: string) => void;
  handleRun: () => void;
  handleClear: () => void;
  loading: boolean;
}

export const ToolInput: React.FC<ToolInputProps> = ({
  tool,
  input,
  setInput,
  handleRun,
  handleClear,
  loading,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group max-w-4xl mx-auto"
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
      <div className="relative bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4 p-1 sm:p-2">
            <div className="relative w-full">
              <div className="absolute left-4 sm:left-6 top-6 sm:top-8 -translate-y-1/2 text-indigo-500 dark:text-indigo-400 pointer-events-none transition-transform group-hover:scale-110 duration-300">
                <Icons.Search size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleRun();
                  }
                }}
                placeholder={tool.placeholder}
                aria-label={`${tool.name} input`}
                className="w-full min-h-[80px] sm:min-h-[120px] max-h-[500px] py-4 sm:py-8 pl-10 sm:pl-18 pr-4 sm:pr-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl sm:rounded-3xl border-2 border-transparent focus:border-indigo-200 dark:focus:border-indigo-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 text-base sm:text-2xl font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all resize-none shadow-inner"
                rows={1}
              />
            </div>
            <div className="flex items-center justify-between gap-3 sm:gap-4 px-1 sm:px-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClear}
                  className="p-3 sm:p-4 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl sm:rounded-2xl transition-all active:scale-90 flex items-center gap-2 font-bold text-xs sm:text-sm"
                  title="Clear Input"
                >
                  <Icons.Trash2 size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Clear</span>
                </button>
              </div>
              <motion.button
                onClick={handleRun}
                disabled={loading || !input.trim()}
                whileHover={!loading && input.trim() ? { scale: 1.02, y: -4 } : {}}
                whileTap={!loading && input.trim() ? { scale: 0.98, y: 0 } : {}}
                className={cn(
                  "flex-grow sm:flex-none py-3 sm:py-6 px-6 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-xl flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-2xl relative overflow-hidden group/btn",
                  loading || !input.trim() 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40 dark:shadow-indigo-900/60"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                {loading ? (
                  <Icons.Loader2 className="animate-spin sm:w-7 sm:h-7" size={20} />
                ) : (
                  <Icons.Zap size={20} className="sm:w-7 sm:h-7 animate-pulse" fill="currentColor" />
                )}
                <span className="whitespace-nowrap tracking-tight">
                  {loading ? 'Analyzing...' : 'Run Analysis'}
                </span>
                {!loading && input.trim() && (
                  <Icons.ChevronRight size={16} className="sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                )}
              </motion.button>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30 rounded-b-xl sm:rounded-b-[1.5rem]">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-[9px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1 sm:gap-2">
                <div className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">CMD</div>
                <Icons.Plus size={8} className="sm:w-2.5 sm:h-2.5" />
                <div className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">ENTER</div>
                <span className="ml-1 hidden xs:inline">TO RUN</span>
              </span>
            </div>
            {input.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-1 w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300" 
                    style={{ width: `${Math.min(100, (input.length / 500) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {input.length} <span className="hidden xs:inline">chars</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
