import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { BLOG_POSTS } from '../constants/blogData';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
    return ['All', ...cats.sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>AI SEO Blog: Latest Search Optimization Trends & Strategies (2026)</title>
        <meta name="description" content="Master search optimization with our AI SEO blog. Get expert tips on Gemini AI, technical audits, and content strategy. Read the latest insights now!" />
        <meta name="keywords" content="SEO blog, AI SEO tips, search engine optimization insights, Google Gemini SEO, technical SEO blog" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icons.BookOpen size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          AI SEO <span className="text-indigo-600 dark:text-indigo-400">Insights Blog</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-500 dark:text-slate-400 px-4 max-w-3xl mx-auto leading-relaxed">
          Master the future of search with our expert guides on AI-driven SEO, technical audits, and high-performance content strategies for 2026.
        </p>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center justify-center gap-2 min-w-max px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group transition-all hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900"
            >
              <Link to={`/blog/${post.slug}`} className="block h-full">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-800">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <Icons.Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <span className="hidden sm:inline mx-1">•</span>
                    <div className="flex items-center gap-1">
                      <Icons.Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>{post.readingTime || '5 min read'}</span>
                    </div>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm group-hover:gap-3 transition-all">
                    Read More <Icons.ArrowRight size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-6">
            <Icons.SearchX size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No posts found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try selecting a different category.</p>
        </motion.div>
      )}
    </div>
  );
}
