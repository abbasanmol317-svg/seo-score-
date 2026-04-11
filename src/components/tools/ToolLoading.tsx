import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolLoadingProps {
  loadingMessage: string;
  progress: number;
  currentTip: string;
}

export const ToolLoading: React.FC<ToolLoadingProps> = ({
  loadingMessage,
  progress,
  currentTip,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[350px] sm:min-h-[400px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 dark:from-indigo-900/20 via-white dark:via-slate-900 to-purple-50/50 dark:to-purple-900/20" />
      <div className="relative z-10 w-full max-w-lg">
        <div className="relative mb-8 sm:mb-12 inline-block">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-full shadow-2xl border border-indigo-100 dark:border-indigo-900 animate-bounce-slow">
            <Icons.Zap size={48} className="sm:w-16 sm:h-16 text-indigo-600 dark:text-indigo-400" fill="currentColor" />
          </div>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-purple-500 p-2 sm:p-3 rounded-full text-white shadow-lg animate-spin-slow">
            <Icons.Sparkles size={16} className="sm:w-5 sm:h-5" />
          </div>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
          {loadingMessage}
        </h2>
        <div className="w-full max-w-md mx-auto mb-8 sm:mb-12">
          <div className="relative h-3 sm:h-4 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 blur-sm bg-inherit opacity-50" />
              {/* Moving Highlight */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>

          {/* Dynamic Milestones */}
          <div className="grid grid-cols-4 mt-6 gap-2">
            {[
              { label: 'Fetching', threshold: 20, icon: Icons.Database },
              { label: 'Analyzing', threshold: 45, icon: Icons.Search },
              { label: 'Processing', threshold: 70, icon: Icons.Cpu },
              { label: 'Finalizing', threshold: 90, icon: Icons.FileCheck }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-500",
                  progress >= m.threshold 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 scale-110" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                )}>
                  <m.icon size={14} className="sm:w-4 sm:h-4" />
                </div>
                <span className={cn(
                  "text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest transition-colors duration-500",
                  progress >= m.threshold ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"
                )}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6 px-1">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Status</span>
            <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8">
          Our AI is deep-diving into your request to provide the most accurate SEO insights possible.
        </p>

        <div className="h-24 sm:h-28 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-indigo-50 dark:bg-indigo-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-indigo-100 dark:border-indigo-900/50 max-w-md mx-auto w-full"
            >
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2 justify-center">
                <Icons.Lightbulb size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">SEO Pro Tip</span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 italic">
                "{currentTip}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
