import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface CoreWebVitalsUIProps {
  content: string;
}

export const CoreWebVitalsUI = React.memo(({ content }: CoreWebVitalsUIProps) => {
  // Parse content to find LCP, FID, CLS
  const parseMetric = (name: string) => {
    // Robust regex to handle labels like "**LCP**:", "LCP:", "- LCP:", etc.
    const regex = new RegExp(`${name}:?\\s*([^\\s\\[]+)\\s*\\[(GOOD|AVERAGE|POOR)\\]`, 'i');
    const match = content.match(regex);
    if (match) {
      return {
        value: match[1].replace(/[\[\]]/g, ''),
        status: match[2].toUpperCase() as 'GOOD' | 'AVERAGE' | 'POOR'
      };
    }
    return null;
  };

  const metrics = [
    { name: 'LCP', label: 'Largest Contentful Paint', desc: 'Measures loading performance.', icon: Icons.Timer, ...parseMetric('LCP') },
    { name: 'FID', label: 'First Input Delay', desc: 'Measures interactivity.', icon: Icons.MousePointerClick, ...parseMetric('FID') },
    { name: 'CLS', label: 'Cumulative Layout Shift', desc: 'Measures visual stability.', icon: Icons.Layout, ...parseMetric('CLS') },
  ];

  const getStatusColor = (status?: string) => {
    if (status === 'GOOD') return 'bg-emerald-500 shadow-emerald-200';
    if (status === 'AVERAGE') return 'bg-amber-500 shadow-amber-200';
    if (status === 'POOR') return 'bg-rose-500 shadow-rose-200';
    return 'bg-slate-300';
  };

  const getProgressWidth = (status?: string) => {
    if (status === 'GOOD') return '95%';
    if (status === 'AVERAGE') return '60%';
    if (status === 'POOR') return '30%';
    return '0%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group/metric"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <metric.icon size={18} className="text-indigo-500" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{metric.name}</h4>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{metric.label}</p>
              </div>
            </div>
            {metric.status && (
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                metric.status === 'GOOD' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                metric.status === 'AVERAGE' && "bg-amber-50 text-amber-600 border-amber-100",
                metric.status === 'POOR' && "bg-rose-50 text-rose-600 border-rose-100"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", 
                  metric.status === 'GOOD' ? "bg-emerald-500" : 
                  metric.status === 'AVERAGE' ? "bg-amber-500" : "bg-rose-500"
                )} />
                {metric.status}
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-col items-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{metric.value || 'N/A'}</span>
            <p className="text-[10px] text-slate-400 font-medium text-center px-4">{metric.desc}</p>
          </div>

          <div className="space-y-2">
            <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
              {/* Threshold Background */}
              <div className="absolute inset-0 flex">
                <div className="h-full w-[40%] bg-emerald-500/5 border-r border-white/10" />
                <div className="h-full w-[30%] bg-amber-500/5 border-r border-white/10" />
                <div className="h-full w-[30%] bg-rose-500/5" />
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getProgressWidth(metric.status) }}
                transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className={cn("absolute inset-y-0 left-0 rounded-full shadow-lg border-r-2 border-white/20", getStatusColor(metric.status))}
              />
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
              <span>Fast</span>
              <span>Needs Improvement</span>
              <span>Poor</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});
