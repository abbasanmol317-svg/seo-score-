import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Tool, TOOLS } from '../services/gemini';
import { cn } from '../lib/utils';
import { ToolCard } from '../components/ToolCard';
import { CATEGORY_CONFIG } from '../constants';
import { SEOPerformanceChart, TrafficDistributionChart } from '../components/charts/SEOPerformanceChart';

export default function Dashboard() {
  const categories = Object.keys(CATEGORY_CONFIG).filter(cat => 
    TOOLS.some(t => t.category === cat)
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  React.useEffect(() => {
    try {
      const recentIds = JSON.parse(localStorage.getItem('seo_recent_tools') || '[]');
      const found = recentIds
        .map((id: string) => TOOLS.find(t => t.id === id))
        .filter(Boolean) as Tool[];
      setRecentTools(found);
    } catch (e) {
      // Ignore
    }
  }, []);

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
        <title>SEO Score Suite | AI SEO Tools for 2026</title>
        <meta name="description" content="Dominate search rankings in 2026 with SEO Score Suite. Access 50+ free AI-powered SEO tools for keyword research, technical audits, and content optimization. Start for free!" />
        <meta name="keywords" content="free SEO tools, AI SEO analysis, Google Gemini SEO, keyword research tool, technical SEO audit, backlink checker, content optimizer, SEO suite 2026" />
        <link rel="canonical" href="https://seoscore.site/" />
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
          className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl mb-4"
        >
          <span className="block">Free AI</span>
          <span className="block text-indigo-600 dark:text-indigo-400">SEO Score Suite</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 max-w-md mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 md:mt-5 md:text-xl md:max-w-3xl px-4 leading-relaxed"
        >
          Optimize your website rankings with the **SEO Score Suite**, a comprehensive collection of {TOOLS.length} professional-grade **AI SEO tools**. Powered by Google Gemini AI, our suite provides instant technical audits, keyword research, and content optimization to help you dominate the 2026 search landscape.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=60&w=1200&ixlib=rb-4.0.3" 
            alt="AI-Powered SEO Dashboard Analytics Visualization" 
            className="relative z-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full object-cover h-[200px] sm:h-[400px]"
            referrerPolicy="no-referrer"
            loading="lazy"
            width="1200"
            height="400"
          />
        </motion.div>
      </header>

      <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <SEOPerformanceChart />
        </div>
        <div className="lg:col-span-1">
          <TrafficDistributionChart />
        </div>
      </div>

      <AnimatePresence>
        {recentTools.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                <Icons.History size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Recently Used <span className="text-indigo-600">Tools</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentTools.map((tool, index) => (
                <ToolCard key={`recent-${tool.id}`} tool={tool} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
      <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Icons.Globe size={240} />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight relative z-10">
              Mastering Search in <span className="text-indigo-600">2026</span>
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
              <p className="text-base sm:text-lg font-medium mb-6">
                The SEO landscape has shifted from simple pattern matching to deep semantic understanding. Today, search engines like Google prioritize **User Intent**, **Topical Authority**, and **Technical Excellence** above all else. Our **SEO software** is designed to help you navigate these changes with ease. Stay ahead of the curve by exploring our <Link to="/blog" className="text-indigo-600 hover:underline font-bold">SEO Insights Blog</Link>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icons.Cpu size={18} className="text-indigo-600" />
                    AI-First Optimization
                  </h3>
                  <p className="text-sm">
                    We use Google Gemini AI to simulate how search crawlers perceive your content. This allows us to identify semantic gaps that traditional **website analysis** tools miss, ensuring your content is both human-friendly and machine-readable.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icons.Zap size={18} className="text-indigo-600" />
                    Technical Foundations
                  </h3>
                  <p className="text-sm">
                    From **Core Web Vitals** to **Schema Markup**, our technical tools ensure your site's infrastructure is built for speed and clarity. A fast site isn't just a luxury; it's a core **ranking factor** in 2026.
                  </p>
                </div>
              </div>
              <p className="mt-8 italic border-l-4 border-indigo-600 pl-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-r-xl">
                "SEO is no longer about tricking the algorithm; it's about providing the most comprehensive and accessible answer to the user's query."
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl sm:rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">Why Choose SEO Score Suite?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">100% Free Access</h4>
                  <p className="text-xs text-slate-500">No subscriptions, no hidden fees. Professional tools for everyone.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Gemini 3.1 Powered</h4>
                  <p className="text-xs text-slate-500">Harness the power of Google's most advanced AI models.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Real-Time Analysis</h4>
                  <p className="text-xs text-slate-500">Get instant feedback on your site's performance and SEO health.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Privacy Focused</h4>
                  <p className="text-xs text-slate-500">We don't store your sensitive data or website credentials.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Icons.ShieldCheck size={120} />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Your data is yours. We don't store your URLs or keywords. Our analysis happens in real-time, ensuring your competitive intelligence stays private.
            </p>
            <Link to="/privacy" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline">
              Learn More <Icons.ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icons.TrendingUp size={20} className="text-indigo-400" />
              SEO Trends
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-400"><span className="text-white font-bold">Semantic Search:</span> Focus on topics, not just keywords.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-400"><span className="text-white font-bold">Video SEO:</span> YouTube is the 2nd largest search engine.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-400"><span className="text-white font-bold">Local Intent:</span> 46% of all searches have local intent.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
