import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { getErrorSolutions, getErrorMessage, getErrorCategory, ErrorCategory } from '../../lib/seo-utils';

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
  const [showTechnical, setShowTechnical] = useState(false);
  const friendlyMessage = getErrorMessage(error);
  const category = getErrorCategory(error);

  const getCategoryTheme = (cat: ErrorCategory) => {
    switch (cat) {
      case 'QUOTA':
        return { 
          icon: <Icons.Clock size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Direct Takeoff Limit',
          label: 'Rate Limit',
          bgColor: 'bg-rose-50 dark:bg-rose-900/20',
          iconBg: 'bg-rose-500 shadow-rose-500/20',
          textColor: 'text-rose-600 dark:text-rose-400',
          borderColor: 'border-rose-100 dark:border-rose-900/30',
          gradient: 'from-rose-500 to-orange-500'
        };
      case 'AUTH':
        return { 
          icon: <Icons.Lock size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Access Denied',
          label: 'Auth Error',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          iconBg: 'bg-amber-500 shadow-amber-500/20',
          textColor: 'text-amber-600 dark:text-amber-400',
          borderColor: 'border-amber-100 dark:border-amber-900/30',
          gradient: 'from-amber-500 to-orange-500'
        };
      case 'NETWORK':
        return { 
          icon: <Icons.WifiOff size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Network Timeout',
          label: 'Connection Error',
          bgColor: 'bg-slate-50 dark:bg-slate-800/50',
          iconBg: 'bg-slate-600 shadow-slate-600/20',
          textColor: 'text-slate-600 dark:text-slate-400',
          borderColor: 'border-slate-100 dark:border-slate-800',
          gradient: 'from-slate-500 to-indigo-500'
        };
      case 'INPUT':
        return { 
          icon: <Icons.FileWarning size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Analysis Blocked',
          label: 'Invalid Input',
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
          iconBg: 'bg-indigo-500 shadow-indigo-500/20',
          textColor: 'text-indigo-600 dark:text-indigo-400',
          borderColor: 'border-indigo-100 dark:border-indigo-900/30',
          gradient: 'from-indigo-500 to-purple-500'
        };
      case 'SAFETY':
        return { 
          icon: <Icons.ShieldAlert size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Policy Guard',
          label: 'Content Blocked',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          iconBg: 'bg-red-600 shadow-red-600/20',
          textColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-100 dark:border-red-900/30',
          gradient: 'from-red-600 to-indigo-600'
        };
      default:
        return { 
          icon: <Icons.TriangleAlert size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />,
          title: 'Analysis Failed',
          label: 'Error Detected',
          bgColor: 'bg-rose-50 dark:bg-rose-900/20',
          iconBg: 'bg-rose-500 shadow-rose-500/20',
          textColor: 'text-rose-600 dark:text-rose-400',
          borderColor: 'border-rose-100 dark:border-rose-900/30',
          gradient: 'from-rose-500 to-orange-500'
        };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="relative group/error"
    >
      <div className={cn("absolute -inset-1 bg-gradient-to-r rounded-3xl blur opacity-20 group-hover/error:opacity-30 transition duration-500", theme.gradient)}></div>
      <div className={cn("relative bg-white dark:bg-slate-900 border rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden", theme.borderColor)}>
        <div className="flex flex-col md:flex-row">
          <div className={cn("p-4 sm:p-6 flex items-center justify-center md:w-24", theme.bgColor)}>
            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow", theme.iconBg)}>
              {theme.icon}
            </div>
          </div>
          <div className="p-6 sm:p-8 flex-grow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">{theme.title}</h3>
                <p className={cn("font-bold text-xs sm:text-sm uppercase tracking-wider", theme.textColor)}>{theme.label}</p>
              </div>
              <button 
                onClick={handleClear}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
              >
                <Icons.X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-bold leading-relaxed mb-3">
                {friendlyMessage}
              </p>
              
              <button 
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1 uppercase tracking-widest"
              >
                {showTechnical ? 'Hide' : 'View'} Technical Logs
                <Icons.ChevronDown size={10} className={showTechnical ? 'rotate-180' : ''} />
              </button>

              <AnimatePresence>
                {showTechnical && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700 font-mono text-[10px] sm:text-xs text-rose-400 break-all">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] sm:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Icons.Lightbulb size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500" />
                How to fix this:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {getErrorSolutions(error).map((solution, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 sm:p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors group">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover:scale-125 transition-transform" />
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
