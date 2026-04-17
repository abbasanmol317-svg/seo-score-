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
                <motion.div 
                  animate={progress >= m.threshold && progress < (i < 3 ? [20, 45, 70, 90][i+1] : 101) ? {
                    scale: [1, 1.1, 1],
                    boxShadow: ["0px 0px 0px rgba(79, 70, 229, 0)", "0px 0px 15px rgba(79, 70, 229, 0.4)", "0px 0px 0px rgba(79, 70, 229, 0)"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-500",
                    progress >= m.threshold 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                  )}
                >
                  <m.icon size={14} className="sm:w-4 sm:h-4" />
                </motion.div>
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

        <div className="h-32 sm:h-36 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 max-w-lg mx-auto w-full shadow-xl shadow-indigo-100/20 dark:shadow-none relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 px-4 py-1 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Icons.Lightbulb size={12} className="text-white" fill="currentColor" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">SEO Pro Tip</span>
                </div>
              </div>
              <p className="text-xs sm:text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed mt-2 italic">
                "{currentTip}"
              </p>
              <div className="mt-3 flex justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={cn("w-1 h-1 rounded-full", i === 0 ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700")} />
                  ))}
                </div>
              </div>
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
