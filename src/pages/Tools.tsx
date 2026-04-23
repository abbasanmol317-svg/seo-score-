import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../services/gemini';

import Breadcrumbs from '../components/Breadcrumbs';
import { ToolCard } from '../components/ToolCard';
import NewsletterSection from '../components/NewsletterSection';

export default function Tools() {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <Breadcrumbs 
        className="mb-8 pl-1"
        items={[
          { label: 'Tools', active: true }
        ]} 
      />
      <Helmet>
        <title>Free AI SEO Tools Directory: 20+ Professional Tools (No Signup)</title>
        <meta name="description" content="Explore 20+ free AI SEO tools to audit, optimize, and rank. From technical fixes to AEO strategy, get everything you need for search dominance. Try them free now!" />
        <meta name="keywords" content="SEO tools directory, free AI SEO tools, technical SEO suite, keyword research tools, content optimization tools" />
        <link rel="canonical" href="https://seoscore.site/tools" />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Free AI SEO Tools Directory",
              "description": "Comprehensive directory of free AI-powered search optimization tools.",
              "itemListElement": TOOLS.map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://seoscore.site/tools/${tool.slug}`,
                "name": tool.name
              }))
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Dashboard",
                  "item": "https://seoscore.site/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Tools",
                  "item": "https://seoscore.site/tools"
                }
              ]
            }
          ])}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icons.LayoutGrid size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Free AI <span className="text-indigo-600 dark:text-indigo-400">SEO Tools Directory</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-500 dark:text-slate-400 px-4 max-w-2xl mx-auto">
          Explore our complete directory of **AI SEO tools** designed for technical precision and content excellence. Access over 20 professional-grade tools to optimize your search rankings today.
        </p>
      </motion.div>

      <div className="space-y-16">
        {categories.map((category, catIndex) => (
          <section key={category}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {category}
              </h2>
              <div className="h-px flex-grow bg-slate-200 dark:border-slate-800" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {TOOLS.filter(t => t.category === category).map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index + (catIndex * 5)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-20">
        <NewsletterSection />
      </div>

      <section className="mt-20 bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-8 sm:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">Can't find what you're looking for?</h2>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg">
            Our AI SEO Chat can help you with custom analysis and specific search optimization questions.
          </p>
          <Link 
            to="/tools/free-ai-seo-assistant" 
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl"
          >
            <Icons.MessageSquare size={20} />
            Chat with AI Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
