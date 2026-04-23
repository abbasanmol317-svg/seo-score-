import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Tool } from '../services/gemini';
import { Icon } from './ui/Icon';

interface ToolCardProps {
  tool: Tool;
  index: number;
  className?: string;
}

export const ToolCard = React.memo(({ tool, index, className }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("h-full", className)}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className="group relative h-full bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-500 flex flex-col overflow-hidden"
      >
        {/* Subtle Background Color Shift on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/80 group-hover:to-purple-50/80 dark:group-hover:from-indigo-900/20 dark:group-hover:to-purple-900/20 transition-colors duration-500" />
        
        {/* Large Background Decorative Icon */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-700 group-hover:scale-150 group-hover:-rotate-12 pointer-events-none">
          <Icon name={tool.icon} size={120} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className={cn(
            "p-3 sm:p-4 rounded-[1rem] sm:rounded-[1.25rem] transition-all duration-500 shadow-sm group-hover:shadow-indigo-200/50 dark:group-hover:shadow-none bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3 group-hover:scale-110"
          )}>
            <Icon name={tool.icon} size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight tracking-tight">
            {tool.name}
          </h3>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow leading-relaxed font-medium relative z-10 line-clamp-3">
          {tool.description}
        </p>
        
        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] relative z-10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            Launch Analyzer
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:translate-x-1">
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
