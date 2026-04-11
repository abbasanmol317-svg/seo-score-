import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import ToolSearch from '../components/ToolSearch';
import { cn } from '../lib/utils';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full" />
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl">
              <h1 className="text-8xl sm:text-9xl font-black text-indigo-600 tracking-tighter mb-2">404</h1>
              <div className="absolute -top-4 -right-4 bg-amber-500 text-white p-3 rounded-2xl shadow-lg rotate-12">
                <Icons.SearchX size={32} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The link you followed might be broken, or the page may have been moved. Let's get you back on track.
          </p>

          <div className="max-w-md mx-auto pt-4">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
              <ToolSearch />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
              >
                <Icons.LayoutDashboard size={20} />
                Back to Dashboard
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <Icons.ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          </div>

          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {[
              { label: 'All Tools', path: '/tools', icon: Icons.Grid3X3 },
              { label: 'SEO Audit', path: '/ai-seo-audit-tool', icon: Icons.SearchCode },
              { label: 'Keywords', path: '/keyword-research-tool', icon: Icons.KeyRound },
              { label: 'Blog', path: '/blog', icon: Icons.BookOpen },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800 transition-all group"
              >
                <link.icon size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{link.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
