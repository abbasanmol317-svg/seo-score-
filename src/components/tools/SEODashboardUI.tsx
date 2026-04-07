import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ToolComponentProps } from './ToolComponentProps';

export const SEODashboardUI: React.FC<ToolComponentProps & { history: any[] }> = ({
  history,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>SEO Insights Dashboard | AI SEO Score Suite</title>
        <meta name="description" content="View your SEO analysis history and insights." />
      </Helmet>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
          <Icons.ChevronLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SEO Insights Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Total Tools Used</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{history.length}</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Most Used Tool</p>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {history.length > 0 
              ? (() => {
                  const counts = history.reduce((acc, curr) => {
                    acc[curr.toolName] = (acc[curr.toolName] || 0) + 1;
                    return acc;
                  }, {} as any);
                  return Object.entries(counts).sort((a, b) => (b[1] as any) - (a[1] as any))[0][0];
                })()
              : 'N/A'}
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Last Activity</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {history.length > 0 ? new Date(history[0].timestamp).toLocaleString() : 'N/A'}
          </p>
        </motion.div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recent Activity</h2>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-400 dark:text-slate-500">No history yet. Start using tools to see insights!</p>
          </div>
        ) : (
          history.map((item) => (
            <motion.div 
              key={item.id} 
              whileHover={{ x: 4 }}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-all hover:border-indigo-100 dark:hover:border-indigo-900 group"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.toolName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">{item.input}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                <Link to={`/tool/${item.toolId}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Run again</Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
