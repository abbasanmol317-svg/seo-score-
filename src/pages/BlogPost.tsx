import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';
import { AdUnit } from '../components/AdSense';
import Breadcrumbs from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../constants/blogData';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [copied, setCopied] = React.useState(false);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-indigo-600 font-bold hover:underline">Back to Blog</Link>
      </div>
    );
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `Check out this SEO guide: ${post.title}`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const externalResources = [
    {
      title: "The 2026 Guide to AI-First Indexing: How Search is Changing",
      source: "Search Engine Land",
      url: "https://searchengineland.com/seo-trends-2026",
      excerpt: "Expert predictions on how Gemini and other LLMs are reshaping crawling, indexing, and ranking in the new search era."
    },
    {
      title: "Strategic SEO Pivots for 2026: Navigating AI-Powered Search",
      source: "Semrush",
      url: "https://www.semrush.com/blog/seo-trends/",
      excerpt: "Learn how to adapt your content strategy for generative AI overviews and maintain organic visibility."
    },
    {
      title: "Advanced Technical SEO 2026: Maximizing Crawl Efficiency",
      source: "Moz",
      url: "https://moz.com/blog/category/technical-seo",
      excerpt: "A deep dive into server-side optimization and semantic data structures required for modern AI search bots."
    }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": {
      "@type": "Organization",
      "name": "SEO Score"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SEO Score",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seoscore.site/logo.png"
      }
    },
    "datePublished": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://seoscore.site/blog/${post.slug}`
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <Helmet>
        <title>{post.metaTitle || post.title} | SEO Score Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3"
          >
            <Icons.CheckCircle2 className="text-emerald-400" size={18} />
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      <Breadcrumbs 
        className="mb-8"
        items={[
          { label: 'Blog', path: '/blog' },
          { label: post.category, path: `/blog?category=${encodeURIComponent(post.category)}` },
          { label: post.title, active: true }
        ]} 
      />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="relative h-64 sm:h-96 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 sm:p-12">
            <div>
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-12 lg:p-16">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-2">
              <Icons.Calendar size={16} className="text-indigo-600" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.User size={16} className="text-indigo-600" />
              <span>{post.author}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Icons.Clock size={16} className="text-indigo-600" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>

          <div className="markdown-body">
            <Markdown>{post.content}</Markdown>
          </div>

          <AdUnit slot="YOUR_SLOT_ID" className="mt-12" />

          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                <Icons.User size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Written by</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Share this post</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
                >
                  <Icons.Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
                >
                  <Icons.Linkedin size={18} />
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
                >
                  <Icons.Link size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {relatedPosts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Icons.Layers size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Related Articles</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(rp => (
              <Link 
                key={rp.id} 
                to={`/blog/${rp.slug}`}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl transition-all group"
              >
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 block">{rp.category}</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{rp.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                  <Icons.Calendar size={12} />
                  <span>{rp.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Icons.Globe size={20} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Expert Resources from the Web</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {externalResources.map((resource, i) => (
            <a 
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">{resource.source}</span>
                <Icons.ExternalLink size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{resource.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-0">
                {resource.excerpt}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/tools" 
          className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
        >
          <Icons.Zap size={20} fill="currentColor" />
          Explore All SEO Tools
        </Link>
      </div>
    </div>
  );
}
