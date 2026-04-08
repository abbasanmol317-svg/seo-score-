import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { getErrorSolutions } from '../../lib/seo-utils';

interface ToolErrorProps {
  error: string;
  handleRun: () => void;
  handleClear: () => void;
}

export const ToolError: React.FC<ToolErrorProps> = ({
  error,
  handleRun,
  handleClear,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="relative group/error"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl blur opacity-20 group-hover/error:opacity-30 transition duration-500"></div>
      <div className="relative bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 sm:p-6 flex items-center justify-center md:w-24">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 animate-bounce-slow">
              <Icons.AlertTriangle size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
          </div>
          <div className="p-6 sm:p-8 flex-grow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">Analysis Failed</h3>
                <p className="text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Error Detected</p>
              </div>
              <button 
                onClick={handleClear}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
              >
                <Icons.X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {error}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] sm:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Icons.Lightbulb size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500" />
                Potential Solutions
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {getErrorSolutions(error).map((solution, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 sm:p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <motion.button 
                onClick={handleRun}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-grow sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all text-sm sm:text-base"
              >
                <Icons.RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                Try Again
              </motion.button>
              <motion.button 
                onClick={handleClear}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-grow sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-all text-sm sm:text-base"
              >
                Clear Input
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
