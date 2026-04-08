import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Tool } from '../../services/gemini';

interface ToolPlaceholderProps {
  tool: Tool;
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ tool }) => {
  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden"
    >
      <div className="p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 mb-6">
            <IconComponent size={32} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2">Ready to analyze</span>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {tool.name}
          </h3>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed mb-10 text-lg">
          {tool.description} Enter your details in the form above and click "Run Analysis" to generate your comprehensive AI-powered SEO report.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Icons.Zap size={16} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Fast AI Processing</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Icons.ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Safe & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Icons.BarChart3 size={16} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Actionable Insights</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
