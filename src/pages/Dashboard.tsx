import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Tool, TOOLS } from '../services/gemini';
import { cn } from '../lib/utils';
import { CATEGORY_CONFIG } from '../constants';

const ToolCard = React.memo(({ tool, index }: { tool: Tool; index: number }) => {
  const IconComponent = (Icons as any)[tool.icon] || Icons.CircleHelp;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/tool/${tool.id}`}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 flex flex-col h-full overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-150 group-hover:-rotate-12">
          <IconComponent size={60} className="sm:w-20 sm:h-20" />
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 relative z-10">
          <div className={cn(
            "p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3",
            "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
          )}>
            <IconComponent size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight tracking-tight">
            {tool.name}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex-grow leading-relaxed font-medium relative z-10">
          {tool.description}
        </p>
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest relative z-10">
          <span>Launch Tool</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Icons.ArrowRight size={10} className="sm:w-3 sm:h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default function Dashboard() {
  const categories = Object.keys(CATEGORY_CONFIG).filter(cat => 
    TOOLS.some(t => t.category === cat)
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>SEO Score Suite | Free AI-Powered SEO Tools for 2026</title>
        <meta name="description" content="Dominate search rankings with SEO Score Suite. Access 50+ free AI-powered SEO tools for keyword research, technical audits, backlink analysis, and content optimization using Google Gemini AI." />
        <meta name="keywords" content="free SEO tools, AI SEO analysis, Google Gemini SEO, keyword research tool, technical SEO audit, backlink checker, content optimizer, SEO suite 2026" />
        <link rel="canonical" href="https://seo-score-suite.com/" />
      </Helmet>
      <header className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200"
        >
          <Icons.Sparkles size={32} className="sm:w-10 sm:h-10" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl"
        >
          <span className="block">Next-Gen AI</span>
          <span className="block text-indigo-600 dark:text-indigo-400">SEO Score Suite</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 max-w-md mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl px-4"
        >
          Empower your digital growth with {TOOLS.length} professional-grade SEO tools. Engineered with Google Gemini AI for precision, speed, and actionable search intelligence.
        </motion.p>
      </header>

      <div className="space-y-6 sm:space-y-8">
        {categories.map((category, catIndex) => {
          const config = CATEGORY_CONFIG[category];
          const isExpanded = expandedCategories.includes(category);
          const categoryTools = TOOLS.filter(t => t.category === category);
          const CategoryIcon = (Icons as any)[config.icon] || Icons.Folder;
          
          return (
            <motion.section 
              key={category} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white dark:bg-slate-900/50 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 sm:px-8 py-4 sm:py-8 flex items-center justify-between group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className={cn(
                    "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500",
                    isExpanded 
                      ? cn(config.color, "text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 scale-110 rotate-3") 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105"
                  )}>
                    <CategoryIcon size={20} className="sm:w-7 sm:h-7" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                      <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {category}
                      </h2>
                      <span className={cn(
                        "text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-widest border transition-colors duration-300",
                        isExpanded 
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      )}>
                        {categoryTools.length} tools
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-1 sm:line-clamp-none">
                      {config.description}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                    isExpanded ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"
                  )}
                >
                  <Icons.ChevronDown size={20} className="sm:w-6 sm:h-6" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-4 sm:px-8 pb-8 sm:pb-10">
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2 sm:pt-4">
                        {categoryTools.map((tool, index) => (
                          <ToolCard key={tool.id} tool={tool} index={index} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>
      <div className="mt-16 sm:mt-24 p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">Revolutionizing Search Optimization with Gemini AI</h2>
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            The SEO landscape of 2026 demands more than just keyword stuffing; it requires semantic understanding and technical excellence. **SEO Score Suite** is built to bridge the gap between complex data and actionable strategy. By utilizing the latest Google Gemini AI models, we provide a level of analysis that was previously only available through expensive enterprise software.
          </p>
          <p>
            Our platform is designed for digital marketers, business owners, and SEO specialists who need fast, reliable, and data-driven insights. From **Core Web Vitals** audits to **Semantic Content Optimization**, each of our {TOOLS.length}+ tools is fine-tuned to help you navigate the ever-evolving search engine algorithms.
          </p>
          <p>
            Whether you're performing a deep-dive technical audit or looking for high-intent keyword opportunities, SEO Score Suite provides the precision you need to dominate the SERPs. We are committed to democratizing professional SEO tools, ensuring that every website has the chance to rank where it belongs: at the top.
          </p>
        </div>
      </div>
    </div>
  );
}
