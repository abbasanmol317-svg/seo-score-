import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { GenericToolUI } from './GenericToolUI';
import { cn } from '../../lib/utils';

export const SitemapRobotsUI: React.FC<ToolComponentProps> = (props) => {
  const { result } = props;

  // Extract robots.txt and sitemap.xml from the result
  const robotsMatch = result.match(/## 🤖 Robots\.txt\n```(?:text)?\n([\s\S]*?)\n```/s);
  const sitemapMatch = result.match(/## 🗺️ Sitemap\.xml\n```(?:xml)?\n([\s\S]*?)\n```/s);

  const robotsCode = robotsMatch ? robotsMatch[1].trim() : '';
  const sitemapCode = sitemapMatch ? sitemapMatch[1].trim() : '';

  const [copiedRobots, setCopiedRobots] = React.useState(false);
  const [copiedSitemap, setCopiedSitemap] = React.useState(false);

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <GenericToolUI {...props} />
      
      {result && (robotsCode || sitemapCode) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-8">
          {robotsCode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg text-white">
                    <Icons.Settings size={18} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white tracking-tight">robots.txt</h3>
                </div>
                <button
                  onClick={() => handleCopy(robotsCode, setCopiedRobots)}
                  className={cn(
                    "p-2 rounded-lg transition-all active:scale-95",
                    copiedRobots ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600"
                  )}
                >
                  {copiedRobots ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                </button>
              </div>
              <div className="p-6 flex-grow">
                <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {robotsCode}
                </pre>
              </div>
            </motion.div>
          )}

          {sitemapCode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Icons.Map size={18} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white tracking-tight">sitemap.xml</h3>
                </div>
                <button
                  onClick={() => handleCopy(sitemapCode, setCopiedSitemap)}
                  className={cn(
                    "p-2 rounded-lg transition-all active:scale-95",
                    copiedSitemap ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600"
                  )}
                >
                  {copiedSitemap ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                </button>
              </div>
              <div className="p-6 flex-grow">
                <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {sitemapCode}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
