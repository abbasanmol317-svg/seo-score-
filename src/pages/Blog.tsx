import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

import { BLOG_POSTS } from '../constants/blogData';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authorParam = searchParams.get('author');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Infinite Scroll State
  const POSTS_PER_PAGE = 6;
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Reset page when category or author changes
    setVisiblePostsCount(POSTS_PER_PAGE);
  }, [selectedCategory, authorParam]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_POSTS.map(post => post.category)));
    return ['All', ...cats.sort()];
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;
    if (authorParam) {
      posts = posts.filter(post => post.author === authorParam);
    }
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.category === selectedCategory);
    }
    return posts;
  }, [selectedCategory, authorParam]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visiblePostsCount);
  }, [filteredPosts, visiblePostsCount]);

  const popularPosts = useMemo(() => {
    return [...BLOG_POSTS]
      .sort((a, b) => ((b.views || 0) + (b.shares || 0) * 5) - ((a.views || 0) + (a.shares || 0) * 5))
      .slice(0, 5);
  }, []);

  const maxViews = useMemo(() => Math.max(...BLOG_POSTS.map(p => p.views || 0)), []);

  const featuredPost = popularPosts[0];
  
  const restVisiblePosts = useMemo(() => {
    return visiblePosts.filter(p => p.id !== featuredPost?.id);
  }, [visiblePosts, featuredPost]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  const clearAuthorFilter = () => {
    searchParams.delete('author');
    setSearchParams(searchParams);
  };

  // Intersection Observer for Infinite Scroll
  const loaderRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePostsCount < filteredPosts.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate network delay
          setTimeout(() => {
            setVisiblePostsCount((prev) => prev + POSTS_PER_PAGE);
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visiblePostsCount, filteredPosts.length, isLoadingMore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <Breadcrumbs 
        className="mb-8"
        items={[{ label: 'Blog', active: true }]} 
      />
      <Helmet>
        <title>AI SEO Blog: Latest Search Optimization Trends & Strategies (2026)</title>
        <meta name="description" content="Master the future of search with our expert SEO intelligence guides. Learn AI-first strategies for Google, Gemini & AEO to dominate the SERPs. Read more here!" />
        <meta name="keywords" content="SEO blog, AI SEO tips, search engine optimization insights, Google Gemini SEO, technical SEO blog" />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "AI SEO Insights Blog",
              "description": "Expert guides and strategies on AI search optimization, Google Gemini, and technical SEO.",
              "itemListElement": filteredPosts.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://seoscore.site/blog/${post.slug}`,
                "name": post.title
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
                  "name": "Blog",
                  "item": "https://seoscore.site/blog"
                }
              ]
            }
          ])}
        </script>
      </Helmet>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Feed */}
        <div className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
              <Icons.BookOpen size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              AI SEO <span className="text-indigo-600 dark:text-indigo-400">Insights Blog</span>
            </h1>
            {authorParam && (
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <Icons.User size={16} />
                <span className="text-sm font-bold">Showing posts by {authorParam}</span>
                <button 
                  onClick={clearAuthorFilter}
                  className="ml-2 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg transition-colors"
                  title="Clear author filter"
                >
                  <Icons.X size={14} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Featured Post (Only on first page and when no special filter is active) */}
          {!authorParam && selectedCategory === 'All' && visiblePostsCount <= POSTS_PER_PAGE && featuredPost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 relative group"
            >
              <Link 
                to={`/blog/${featuredPost.slug}`}
                className="block bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:shadow-indigo-500/10 border border-white/5"
              >
                <div className="flex flex-col md:flex-row min-h-[400px]">
                  <div className="md:w-1/2 relative">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      Featured Insight
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none bg-indigo-900/40 px-3 py-1.5 rounded-lg border border-indigo-500/20">{featuredPost.category}</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Icons.Calendar size={12} className="text-indigo-500" />
                          {featuredPost.date}
                        </div>
                     </div>
                     <h2 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-tight group-hover:text-indigo-400 transition-colors">
                       {featuredPost.title}
                     </h2>
                     <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                       {featuredPost.excerpt}
                     </p>
                     <div className="flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all">
                        Dive into the Guide <Icons.ArrowRight size={20} />
                     </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Category Filter Tabs */}
          <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {restVisiblePosts.map((post, index) => (
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
                  <Link to={`/blog/${post.slug}`} className="block h-full relative">
                    {popularPosts.some(p => p.id === post.id) && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-1.5 ">
                        <Icons.Zap size={10} fill="currentColor" />
                        Trending
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-800">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1"><Icons.Eye size={12} /> {post.views?.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Icons.Share2 size={12} /> {post.shares}</span>
                        </div>
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
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 line-clamp-2">
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

          {/* Infinite Scroll Loader */}
          {visiblePostsCount < filteredPosts.length && (
            <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center gap-4">
              <Icons.Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading older insights...</p>
            </div>
          )}

          {visiblePostsCount >= filteredPosts.length && filteredPosts.length > 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mb-4">
                <Icons.Check size={24} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">You've reached the end of the archive.</p>
            </div>
          )}

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

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0 space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 dark:shadow-none">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
             <div className="relative z-10">
                <h3 className="text-xl font-black mb-3">Get SEO Secrets</h3>
                <p className="text-indigo-100 text-xs mb-6 font-medium leading-relaxed">Join 50k+ experts getting AI search insights daily.</p>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-indigo-200 text-xs focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                  <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-[1.02] shadow-lg">
                    Subscribe Free
                  </button>
                </form>
                <p className="mt-4 text-[9px] text-indigo-200 text-center font-bold">100% Privacy. Zero Spam.</p>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Icons.TrendingUp className="text-indigo-600" size={20} />
              Popular Insights
            </h3>
            <div className="space-y-6">
              {popularPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md border border-indigo-100/50 dark:border-indigo-800/50">{post.category}</span>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                        <Icons.TrendingUp size={10} className="text-emerald-500" />
                        High Demand
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Icons.Eye size={12} strokeWidth={2.5} /> {post.views?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Icons.Share2 size={12} strokeWidth={2.5} /> {post.shares}</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((post.views || 0) / maxViews) * 100)}%` }}
                          className="h-full bg-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Icons.Zap size={120} />
            </div>
            <h3 className="text-xl font-black mb-4 relative z-10">Master 2026 SEO</h3>
            <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed">
              Get our weekly "Intelligence Brief" with the latest algorithm shifts and AI search updates.
            </p>
            <div className="space-y-3 relative z-10">
              <input 
                type="email" 
                placeholder="you@email.com" 
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-indigo-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full py-3 bg-white text-indigo-600 font-black rounded-xl text-sm hover:bg-slate-50 transition-colors">
                Join 50k+ Pros
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
