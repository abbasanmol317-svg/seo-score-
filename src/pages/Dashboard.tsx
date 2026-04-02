import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Tool, TOOLS } from '../services/gemini';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));
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
        <title>Best AI Tools for SEO 2026 | AI SEO Score Suite</title>
        <meta name="description" content="Discover the best AI tools for SEO in 2026. Our comprehensive suite of 19+ professional tools helps you analyze, optimize, and dominate search rankings with the power of Google Gemini AI. From keyword research to technical audits, we provide everything you need for search engine success." />
        <meta name="keywords" content="best AI tools for SEO, SEO tool 2026, AI SEO suite, keyword research AI, SEO audit tool, search engine optimization 2026" />
        <link rel="canonical" href="https://seo-score-suite.com/" />
      </Helmet>
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-200"
        >
          <Icons.Zap size={40} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl"
        >
          <span className="block">AI-Powered</span>
          <span className="block text-indigo-600 dark:text-indigo-400">SEO Score Suite</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
        >
          19 professional SEO tools powered by Google Gemini. Analyze, optimize, and dominate search rankings.
        </motion.p>
      </header>

      <div className="space-y-6">
        {categories.map((category, catIdx) => {
          const isExpanded = expandedCategories.includes(category);
          const categoryTools = TOOLS.filter(t => t.category === category);
          
          return (
            <section key={category} className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-8 py-6 flex items-center justify-between group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    isExpanded 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  )}>
                    {catIdx === 0 ? <Icons.Search size={20} /> : 
                     catIdx === 1 ? <Icons.Layout size={20} /> : 
                     catIdx === 2 ? <Icons.BarChart3 size={20} /> : 
                     <Icons.Settings size={20} />}
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      {category}
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                        {categoryTools.length} tools
                      </span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Professional tools for {category.toLowerCase()}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                >
                  <Icons.ChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
                        {categoryTools.map((tool, index) => {
                          const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;
                          return (
                            <motion.div
                              key={tool.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -5, scale: 1.02 }}
                            >
                              <Link
                                to={`/tool/${tool.id}`}
                                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 flex flex-col h-full"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900/40 group-hover:scale-110">
                                    <IconComponent size={20} strokeWidth={2.5} />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                                    {tool.name}
                                  </h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow leading-relaxed">
                                  {tool.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                  <span>Open Tool</span>
                                  <Icons.ArrowRight size={14} />
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
      <div className="mt-24 p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">The Future of Search Engine Optimization</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            Welcome to the AI SEO Score Suite, the ultimate collection of professional tools designed to help you succeed in the search landscape of 2026. Our platform leverages the advanced capabilities of Google Gemini AI to provide you with deep insights, actionable recommendations, and automated analysis that traditional tools simply can't match.
          </p>
          <p>
            In today's fast-paced digital world, staying ahead of search engine algorithms requires more than just basic keyword tracking. It requires a comprehensive understanding of content quality, technical performance, and user experience. Our suite of 19+ tools covers every aspect of SEO, from website analysis and site speed checking to content optimization and schema markup generation.
          </p>
          <p>
            Whether you are looking for the best AI tool for keyword research or a professional SEO audit checklist, our suite has you covered. Each tool is meticulously crafted to provide the most accurate and relevant information, helping you make data-driven decisions that lead to higher rankings and more organic traffic. Join thousands of digital professionals who trust AI SEO Score Suite to power their search engine optimization strategies.
          </p>
        </div>
      </div>
    </div>
  );
}
