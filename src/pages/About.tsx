import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../services/gemini';

export default function About() {
  const topTools = TOOLS.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>About SEO Score Suite | Why We Built the Best Free AI SEO Platform</title>
        <meta name="description" content="Learn how SEO Score Suite is democratizing search intelligence with Gemini AI. Discover our mission and start using professional tools for free." />
        <meta name="keywords" content="about SEO Score Suite, AI SEO mission, free SEO tools, Google Gemini SEO, SEO democratization" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icons.Info size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          About <span className="text-indigo-600 dark:text-indigo-400">SEO Score</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-500 dark:text-slate-400 px-4">
          The ultimate AI-powered SEO toolkit for modern digital marketers.
        </p>
      </motion.div>

      <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none">
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision for 2026</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At SEO Score, we believe that high-quality search intelligence should be accessible to everyone, not just those with massive marketing budgets. In an era where AI is redefining how we find information, our mission is to provide every webmaster, blogger, and small business owner with the same advanced tools used by top-tier agencies. 
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
            By harnessing Google's Gemini AI, we've developed {TOOLS.length} specialized tools that decode search algorithms with unprecedented accuracy, helping you focus on what matters most: **creating value for your audience.** You can learn more about our specific strategies in our <Link to="/blog" className="text-indigo-600 hover:underline font-bold">SEO Blog</Link> or find quick answers in our <Link to="/faq" className="text-indigo-600 hover:underline font-bold">Support Center</Link>.
          </p>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">Why AI-Powered SEO?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Traditional SEO tools often provide static data that becomes outdated the moment a search engine updates its algorithm. AI-powered SEO is different. It's dynamic, predictive, and understands **context**.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={18} /></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">**Intent Analysis**: AI understands *why* people search, not just *what* they type.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={18} /></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">**Semantic Depth**: Identify related topics that build your authority naturally.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={18} /></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">**Real-Time Audits**: Spot technical issues instantly before they hurt your rankings.</p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-indigo-600"><Icons.CheckCircle2 size={18} /></div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">**Human-First Content**: Optimize your writing without losing your unique voice.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-6">
              <Icons.Zap size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Semantic AI Intelligence</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              We go beyond simple keyword matching. Our Gemini-powered engine performs deep semantic analysis, understanding the intent and quality of your content to provide truly human-like recommendations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-6">
              <Icons.ShieldCheck size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">Professional Grade</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              From technical audits to content optimization, our tools cover the entire SEO spectrum, 
              ensuring your website meets the highest search engine standards.
            </p>
          </div>
        </div>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">Popular SEO Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {topTools.map(tool => {
              const ToolIcon = (Icons as any)[tool.icon] || Icons.Zap;
              return (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.id}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ToolIcon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-indigo-600 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">Ready to dominate search?</h2>
          <p className="text-indigo-100 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Join thousands of marketers who use SEO Score to improve their rankings and drive more organic traffic.
          </p>
          <Link to="/" className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-xl text-sm sm:text-base">
            Explore All Tools
          </Link>
        </section>
      </div>
    </div>
  );
}
