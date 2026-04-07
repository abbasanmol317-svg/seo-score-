import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface CoreWebVitalsUIProps {
  content: string;
}

export const CoreWebVitalsUI: React.FC<CoreWebVitalsUIProps> = ({ content }) => {
  // Parse content to find LCP, FID, CLS
  // Format: - LCP: (Value) [GOOD/AVERAGE/POOR]
  const parseMetric = (name: string) => {
    // Improved regex to handle various spacing and formats
    const regex = new RegExp(`[-*]\\s*${name}:?\\s*([^\\s\\[]+)\\s*\\[(GOOD|AVERAGE|POOR)\\]`, 'i');
    const match = content.match(regex);
    if (match) {
      return {
        value: match[1],
        status: match[2].toUpperCase() as 'GOOD' | 'AVERAGE' | 'POOR'
      };
    }
    return null;
  };

  const metrics = [
    { name: 'LCP', label: 'Largest Contentful Paint', ...parseMetric('LCP') },
    { name: 'FID', label: 'First Input Delay', ...parseMetric('FID') },
    { name: 'CLS', label: 'Cumulative Layout Shift', ...parseMetric('CLS') },
  ];

  const getStatusColor = (status?: string) => {
    if (status === 'GOOD') return 'bg-emerald-500';
    if (status === 'AVERAGE') return 'bg-amber-500';
    if (status === 'POOR') return 'bg-rose-500';
    return 'bg-slate-300';
  };

  const getStatusBg = (status?: string) => {
    if (status === 'GOOD') return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
    if (status === 'AVERAGE') return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800';
    if (status === 'POOR') return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700';
  };

  const getProgressWidth = (status?: string) => {
    if (status === 'GOOD') return '100%';
    if (status === 'AVERAGE') return '60%';
    if (status === 'POOR') return '30%';
    return '0%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group/metric"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover/metric:text-indigo-500 transition-colors">{metric.name}</h4>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">{metric.label}</p>
            </div>
            {metric.status && (
              <span className={cn(
                "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
                getStatusBg(metric.status)
              )}>
                {metric.status}
              </span>
            )}
          </div>

          <div className="mb-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{metric.value || 'N/A'}</span>
          </div>

          <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: getProgressWidth(metric.status) }}
              transition={{ duration: 1.2, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
              className={cn("absolute inset-y-0 left-0 rounded-full shadow-lg", getStatusColor(metric.status))}
            />
          </div>
          
          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <Icons.Activity size={12} className="text-indigo-500" />
            <span>AI Simulated Performance</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
