import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How Gemini AI is Revolutionizing SEO Analysis",
    excerpt: "Discover how large language models are changing the way we audit websites and optimize content for search engines.",
    date: "April 2, 2026",
    category: "AI & SEO",
    author: "AI SEO Expert",
    image: "https://picsum.photos/seed/ai-seo/800/400"
  },
  {
    id: 2,
    title: "10 Technical SEO Mistakes You're Probably Making",
    excerpt: "From canonical tags to core web vitals, we break down the most common technical errors that hurt your rankings.",
    date: "March 28, 2026",
    category: "Technical SEO",
    author: "SEO Strategist",
    image: "https://picsum.photos/seed/tech-seo/800/400"
  },
  {
    id: 3,
    title: "The Future of Voice Search Optimization",
    excerpt: "With more users searching via voice, learn how to adapt your content strategy for conversational queries.",
    date: "March 20, 2026",
    category: "Content Strategy",
    author: "Content Lead",
    image: "https://picsum.photos/seed/voice-search/800/400"
  }
];

export default function Blog() {
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
          SEO <span className="text-indigo-600 dark:text-indigo-400">Insights Blog</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-500 dark:text-slate-400 px-4">
          Stay updated with the latest trends and strategies in AI-driven SEO.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {BLOG_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group transition-all hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900"
          >
            <Link to={`/blog/${post.id}`} className="block h-full">
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
                    <Icons.User size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{post.author}</span>
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
      </div>
    </div>
  );
}
