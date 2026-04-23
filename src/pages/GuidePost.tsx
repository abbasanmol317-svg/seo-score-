import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { SEO_GUIDES } from '../constants/guidesData';
import { Icon } from '../components/ui/Icon';
import Breadcrumbs from '../components/Breadcrumbs';

export default function GuidePost() {
  const { slug } = useParams<{ slug: string }>();
  const guide = SEO_GUIDES.find(g => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      <Helmet>
        <title>{guide.metaTitle}</title>
        <meta name="description" content={guide.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": guide.title,
              "description": guide.excerpt,
              "author": {
                "@type": "Person",
                "name": guide.author.name
              },
              "publisher": {
                "@type": "Organization",
                "name": "SEO Score",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://seoscore.site/logo.png"
                }
              },
              "datePublished": "2026-04-01T00:00:00Z",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://seoscore.site/guides/${guide.slug}`
              }
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
                  "name": "Academy",
                  "item": "https://seoscore.site/guides"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": guide.title,
                  "item": `https://seoscore.site/guides/${guide.slug}`
                }
              ]
            }
          ])}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Breadcrumbs 
          items={[
            { label: 'Academy', path: '/guides' },
            { label: guide.title, path: `/guides/${guide.slug}`, active: true }
          ]} 
        />

        <article className="mt-12">
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-6"
            >
              <Icon name={guide.icon} size={14} />
              {guide.category} Guide
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight"
            >
              {guide.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <img src={guide.author.image} alt={guide.author.name} className="w-10 h-10 rounded-full border-2 border-indigo-100 dark:border-indigo-900" />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{guide.author.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium tracking-wide">{guide.author.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                <Icon name="Clock" size={14} />
                {guide.readingTime}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                <Icon name="Activity" size={14} />
                {guide.difficulty} Difficulty
              </div>
            </motion.div>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-indigo dark:prose-invert max-w-none 
              prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
              prose-li:text-slate-600 dark:prose-li:text-slate-400
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
              prose-pre:bg-slate-900 prose-pre:rounded-2xl"
          >
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </motion.div>

          <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Did you find this guide helpful?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                Share it with your team or explore more resources in our academy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/guides" className="px-8 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-2 dark:text-white">
                  <Icon name="ArrowLeft" size={14} />
                  Back to Academy
                </Link>
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 active:scale-95">
                  <Icon name="Share2" size={14} />
                  Share Guide
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
