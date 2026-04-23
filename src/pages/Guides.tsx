import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { SEO_GUIDES } from '../constants/guidesData';
import { Icon } from '../components/ui/Icon';
import { cn } from '../lib/utils';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Guides() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Helmet>
        <title>SEO Learning Academy: Mastering Search in 2026 | SEO Score</title>
        <meta name="description" content="Enter the Learning Academy to master SEO. Free detailed guides on Local SEO, YouTube SEO, Voice Search, and AI-driven strategies." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Breadcrumbs 
          items={[
            { label: 'Academy', path: '/guides', active: true }
          ]} 
        />

        <div className="mt-10 mb-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Icon name="GraduationCap" size={14} />
            Learning Academy
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]"
          >
            The Ultimate SEO <br /><span className="text-indigo-600">Learning Academy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
          >
            Detailed, actionable guides designed to turn you into a search expert. From neighborhood dominance with Local SEO to the future of AI Search.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SEO_GUIDES.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/guides/${guide.slug}`} className="block h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all active:scale-95 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                    <Icon name={guide.icon} size={32} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                      guide.difficulty === 'Easy' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" :
                      guide.difficulty === 'Medium' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" :
                      "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                    )}>
                      {guide.difficulty} Difficulty
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {guide.readingTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
                  {guide.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs group-hover:gap-3 transition-all">
                    Read Guide
                    <Icon name="ArrowRight" size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 p-12 bg-indigo-600 rounded-[3rem] text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Icon name="Sparkles" size={240} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Need a Personalized SEO Audit?</h2>
            <p className="text-indigo-100 font-medium text-lg leading-relaxed mb-8">
              Our AI can scan your website for these exact factors and give you a custom roadmap to success.
            </p>
            <Link 
              to="/tools/free-website-seo-audit-tool" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
            >
              Run Free Audit
              <Icon name="Zap" size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
