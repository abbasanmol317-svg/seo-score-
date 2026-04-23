import React, { useState, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, History, Target, ArrowRight, ChevronDown, Globe, Cpu, Zap, CheckCircle2, ShieldCheck, TrendingUp, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Tool, TOOLS } from '../services/gemini';
import { cn } from '../lib/utils';
import { ToolCard } from '../components/ToolCard';
import { CATEGORY_CONFIG } from '../constants';
import { AdUnit } from '../components/AdSense';
import { Icon } from '../components/ui/Icon';
import NewsletterSection from '../components/NewsletterSection';

// Lazy load heavy chart components
const SEOPerformanceChart = lazy(() => import('../components/charts/SEOPerformanceChart').then(m => ({ default: m.SEOPerformanceChart })));
const TrafficDistributionChart = lazy(() => import('../components/charts/SEOPerformanceChart').then(m => ({ default: m.TrafficDistributionChart })));
const SEOHealthRadarChart = lazy(() => import('../components/charts/SEOPerformanceChart').then(m => ({ default: m.SEOHealthRadarChart })));

const ChartPlaceholder = () => (
  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm h-[300px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Analytics...</span>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [quickAuditUrl, setQuickAuditUrl] = useState('');
  const categories = Object.keys(CATEGORY_CONFIG).filter(cat => 
    TOOLS.some(t => t.category === cat)
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
  const [userGoals, setUserGoals] = useState<string[]>([]);

  React.useEffect(() => {
    try {
      const recentIds = JSON.parse(localStorage.getItem('seo_recent_tools') || '[]');
      const found = recentIds
        .map((id: string) => TOOLS.find(t => t.id === id))
        .filter(Boolean) as Tool[];
      setRecentTools(found);

      const goals = JSON.parse(localStorage.getItem('seo_score_user_goals') || '[]');
      setUserGoals(goals);
    } catch (e) {
      // Ignore
    }
  }, []);

  const getRecommendedTools = () => {
    if (userGoals.length === 0) return [];

    const goalToTools: Record<string, string[]> = {
      traffic: ['free-keyword-research-tool', 'free-backlink-checker-tool', 'free-serp-preview-tool'],
      content: ['free-ai-content-optimization-tool', 'free-content-analysis-seo-tool', 'free-meta-tag-generator', 'free-image-alt-text-generator'],
      technical: ['free-website-seo-audit-tool', 'free-website-speed-test-tool', 'free-broken-link-checker-tool', 'free-sitemap-robots-txt-generator'],
      youtube: ['free-youtube-seo-tool'],
      local: ['free-keyword-research-tool', 'free-website-seo-audit-tool']
    };

    const recommendedIds = Array.from(new Set(userGoals.flatMap(goal => goalToTools[goal] || [])));
    return recommendedIds
      .map(id => TOOLS.find(t => t.id === id || t.slug === id))
      .filter(Boolean) as Tool[];
  };

  const recommendedTools = getRecommendedTools();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>SEO Score – Free SEO Tools for Website Audit, Keywords & Ranking</title>
        <meta name="description" content="Master search in 2026 with a free 260-point AI audit. Optimize for Google, Gemini & Answer Engines. Get your expert search roadmap—no signup required. Scan now!" />
        <meta name="keywords" content="free SEO tools, AI SEO analysis, Google Gemini SEO, keyword research tool, technical SEO audit, backlink checker, content optimizer, SEO suite 2026" />
        <link rel="canonical" href="https://seoscore.site/" />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SEO Score",
              "url": "https://seoscore.site/",
              "logo": "https://seoscore.site/logo.png",
              "description": "Professional AI-powered SEO intelligence platform providing free technical audits, keyword research, and content optimization tools.",
              "sameAs": [
                "https://twitter.com/seoscore",
                "https://linkedin.com/company/seoscore"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SEO Score",
              "url": "https://seoscore.site/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://seoscore.site/tools?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ])}
        </script>
      </Helmet>
      <header className="text-center mb-10 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
        >
          <Icon name="Sparkles" size={32} className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>
        <h1 
          className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl mb-4 leading-[1.1] px-2"
        >
          Uncover Every Ranking Factor with our <br className="hidden md:block" /><span className="text-indigo-600">260+ Point Intelligence Scan</span>
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-md mx-auto text-sm sm:text-lg text-slate-600 dark:text-slate-400 md:mt-5 md:text-xl md:max-w-3xl px-4 sm:px-4 leading-relaxed font-medium"
        >
          The first free platform to offer **GEO (AI Search)** and **AEO (Answer Engine)** readiness scores. Our multi-agent AI performs a technical deep scan of 260+ signals to give you an industrial-grade search roadmap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-2xl mx-auto px-4"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (quickAuditUrl) {
                navigate(`/tools/free-website-seo-audit-tool?url=${encodeURIComponent(quickAuditUrl)}`);
              }
            }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex-grow flex items-center px-4 gap-3 border border-transparent focus-within:border-indigo-500/30 rounded-xl transition-all">
                <Search size={20} className="text-slate-400" />
                <input 
                  type="url"
                  placeholder="Enter your website URL for a free 260-point scan..."
                  value={quickAuditUrl}
                  onChange={(e) => setQuickAuditUrl(e.target.value)}
                  className="w-full py-4 text-sm font-bold bg-transparent focus:outline-none dark:text-white"
                  required
                />
              </div>
              <button 
                type="submit"
                className="px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
              >
                Scan Now <ArrowRight size={14} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> No Credit Card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Real-time AI Scan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Expert Report</span>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&fm=webp" 
            alt="AI-Powered SEO Dashboard Analytics Visualization" 
            className="relative z-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full object-cover h-[200px] sm:h-[400px]"
            referrerPolicy="no-referrer"
            loading="eager"
            width="1200"
            height="400"
            fetchPriority="high"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 sm:mb-8">Trusted by teams from</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-16 opacity-40 grayscale hover:opacity-100 dark:opacity-20 dark:hover:opacity-60 transition-all duration-700 px-4">
            {['SearchEngineJournal', 'Moz', 'Backlinko', 'NeilPatel', 'Semrush'].map(logo => (
              <span key={logo} className="text-sm sm:text-xl font-black text-slate-900 dark:text-white tracking-tighter italic select-none cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </header>

      <AdUnit slot="YOUR_SLOT_ID" className="mb-12" />

      <div className="mb-16 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <Suspense fallback={<ChartPlaceholder />}>
          <div className="lg:col-span-2">
            <SEOPerformanceChart />
          </div>
          <div className="lg:col-span-1">
            <TrafficDistributionChart />
          </div>
          <div className="lg:col-span-1">
            <SEOHealthRadarChart />
          </div>
        </Suspense>
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
                <History size={20} />
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

        {recommendedTools.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-100 dark:shadow-none">
                  <Target size={20} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Recommended for <span className="text-orange-500">Your Goals</span>
                </h2>
              </div>
              <Link 
                to="/faq" 
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                Change Goals <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedTools.slice(0, 4).map((tool, index) => (
                <ToolCard key={`recommended-${tool.id}`} tool={tool} index={index} />
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
                    <Icon name={config.icon} size={20} className="sm:w-7 sm:h-7" strokeWidth={2} />
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
                  <ChevronDown size={20} className="sm:w-6 sm:h-6" />
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
              <Globe size={240} />
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
                    <Cpu size={18} className="text-indigo-600" />
                    AI-First Optimization
                  </h3>
                  <p className="text-sm">
                    We use Google Gemini AI to simulate how search crawlers perceive your content. This allows us to identify semantic gaps that traditional **website analysis** tools miss, ensuring your content is both human-friendly and machine-readable.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap size={18} className="text-indigo-600" />
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">Why Choose SEO Score?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">100% Free Access</h4>
                  <p className="text-xs text-slate-500">No subscriptions, no hidden fees. Professional tools for everyone.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Gemini 3.1 Powered</h4>
                  <p className="text-xs text-slate-500">Harness the power of Google's most advanced AI models.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><CheckCircle2 size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Real-Time Analysis</h4>
                  <p className="text-xs text-slate-500">Get instant feedback on your site's performance and SEO health.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 text-indigo-600"><CheckCircle2 size={20} /></div>
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
              <ShieldCheck size={120} />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Your data is yours. We don't store your URLs or keywords. Our analysis happens in real-time, ensuring your competitive intelligence stays private.
            </p>
            <Link to="/privacy" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline">
              Learn More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400" />
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

      <NewsletterSection />

      <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              Comprehensive SEO Analysis <span className="text-indigo-600">FAQ</span>
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How accurate is the SEO Score analysis?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Our platform leverages the latest Google Gemini AI models to perform semantic and technical analysis. It evaluates your site against modern ranking factors, including Core Web Vitals, E-E-A-T signals, and mobile-first indexing standards to provide professional-grade insights.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Which SEO tools are most important for beginners?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">We recommend starting with the **Free Website SEO Audit Tool** to get an overview. Next, use the **Keyword Research Tool** to plan your content and the **On-Page SEO Checklist** to ensure your individual pages are perfectly optimized for your target terms.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Do I need to pay for any of these search optimization tools?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">No. Every tool on SEO Score is 100% free with no signup required. We believe in providing the community with the best AI-powered resources to help democratize search transparency and website excellence for everyone.</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] p-10 sm:p-14 border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Search Intelligence Roadmap 2026</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Ranking in 2026 requires more than just keywords. Our intelligence scan ensures you are ready for the era of AI and Answer Engines:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-1">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">GEO (AI Search Readiness)</h4>
                  <p className="text-xs text-slate-500">Optimize for the "Generative Experience." We scan semantic depth to ensure AI models like Gemini and Perplexity cite your content.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-1">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">AEO (Universal Answers)</h4>
                  <p className="text-xs text-slate-500">Ensure your site provides direct, schema-backed answers for Voice Search and Screenless AI assistants.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-1">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">260-Point Technical Hygiene</h4>
                  <p className="text-xs text-slate-500">From protocol security to Core Web Vitals, we leave no stone unturned in your technical foundation.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
