import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 15,
    title: "YouTube SEO Tool for Beginners Free",
    excerpt: "Master video rankings with our free YouTube SEO tool designed for beginners. Optimize your titles, descriptions, and tags in seconds.",
    date: "April 10, 2026",
    category: "YouTube",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/yt-seo-beginners/800/400"
  },
  {
    id: 16,
    title: "AI YouTube Keyword Research Tool 2026",
    excerpt: "Discover high-traffic video keywords with the most advanced AI YouTube keyword research tool of 2026. Grow your channel faster.",
    date: "April 10, 2026",
    category: "YouTube",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/yt-keywords-2026/800/400"
  },
  {
    id: 17,
    title: "Video SEO Optimization Tool Free",
    excerpt: "Optimize your videos for search engines with our free video SEO tool. Improve visibility and engagement across all platforms.",
    date: "April 10, 2026",
    category: "Video SEO",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/video-seo-free/800/400"
  },
  {
    id: 18,
    title: "Website Speed Test AI Tool Free",
    excerpt: "Test your website speed with our free AI-powered tool. Get detailed performance reports and actionable optimization tips.",
    date: "April 10, 2026",
    category: "Speed",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/speed-test-ai/800/400"
  },
  {
    id: 19,
    title: "Free Backlink Checker Tool with Report",
    excerpt: "Analyze your backlink profile for free. Get a comprehensive report on link quality, authority, and growth opportunities.",
    date: "April 10, 2026",
    category: "Backlinks",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/backlink-checker-free/800/400"
  },
  {
    id: 20,
    title: "Broken Link Checker Tool Online Free",
    excerpt: "Find and fix broken links on your website instantly with our free online checker. Improve UX and crawlability.",
    date: "April 10, 2026",
    category: "Links",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/broken-links-online/800/400"
  },
  {
    id: 21,
    title: "AI Tool to Fix 404 Errors Website",
    excerpt: "Stop losing traffic to 404 errors. Use our AI tool to identify broken links and get a strategy to fix them permanently.",
    date: "April 10, 2026",
    category: "Technical",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/fix-404-ai/800/400"
  },
  {
    id: 6,
    title: "SEO Analysis Tools: Finding Low Competition Keywords",
    excerpt: "Learn how to use AI-powered SEO analysis tools to discover high-traffic, low-competition keywords that are easy to rank for.",
    date: "April 10, 2026",
    category: "Keywords",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/low-comp-keywords/800/400"
  },
  {
    id: 7,
    title: "AI Website SEO Audit Tool Free Online",
    excerpt: "Conduct a professional-grade website audit for free using our advanced AI SEO audit tool. No technical skills required.",
    date: "April 10, 2026",
    category: "Audit",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/free-ai-audit/800/400"
  },
  {
    id: 8,
    title: "Free SEO Analysis Tool for Beginners 2026",
    excerpt: "New to SEO? Discover the best free analysis tools designed specifically for beginners to improve their search rankings in 2026.",
    date: "April 10, 2026",
    category: "Beginners",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/beginner-seo/800/400"
  },
  {
    id: 9,
    title: "Website SEO Checker with AI Report",
    excerpt: "Get a detailed, actionable SEO report for your website instantly. Our AI checker analyzes hundreds of ranking factors.",
    date: "April 10, 2026",
    category: "Analysis",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/ai-seo-report/800/400"
  },
  {
    id: 10,
    title: "Instant SEO Audit Tool Without Signup",
    excerpt: "Audit your website instantly without the hassle of signing up. Get your free SEO report in seconds.",
    date: "April 10, 2026",
    category: "Audit",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/no-signup-audit/800/400"
  },
  {
    id: 11,
    title: "AI SEO Analyzer for Small Businesses",
    excerpt: "Empower your small business with AI-driven SEO analysis. Compete with the big players without a massive budget.",
    date: "April 10, 2026",
    category: "Business",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/small-biz-seo/800/400"
  },
  {
    id: 12,
    title: "Bulk URL SEO Checker Tool Free",
    excerpt: "Analyze multiple URLs at once with our free bulk SEO checker. Save time and optimize your entire site efficiently.",
    date: "April 10, 2026",
    category: "Bulk Tools",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/bulk-seo/800/400"
  },
  {
    id: 13,
    title: "Website Health Checker SEO Free Tool",
    excerpt: "Is your website healthy? Use our free SEO health checker to find and fix technical issues that hurt your rankings.",
    date: "April 10, 2026",
    category: "Health",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/site-health/800/400"
  },
  {
    id: 14,
    title: "Technical SEO Audit Tool Online Free",
    excerpt: "Deep dive into your site's technical structure with our free online audit tool. Fix crawl errors, speed issues, and more.",
    date: "April 10, 2026",
    category: "Technical",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/tech-audit-free/800/400"
  },
  {
    id: 4,
    title: "Best Free AI SEO Tools 2026",
    excerpt: "Looking for the best free AI SEO tools to dominate search rankings in 2026? We've curated the ultimate list of tools powered by Gemini AI.",
    date: "April 10, 2026",
    category: "Tools",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/best-seo-tools/800/400"
  },
  {
    id: 5,
    title: "How to do SEO Audit Step by Step",
    excerpt: "A comprehensive guide on performing a complete SEO audit for your website using AI tools to find and fix technical issues.",
    date: "April 9, 2026",
    category: "Tutorial",
    author: "SEO Suite Team",
    image: "https://picsum.photos/seed/seo-audit-guide/800/400"
  },
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
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image.replace('800/400', '400/250')} 
                  alt={post.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
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
