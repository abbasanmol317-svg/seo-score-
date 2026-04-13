import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';
import { BLOG_POSTS } from '../constants/blogData';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const post = BLOG_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-indigo-600 font-bold hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <Helmet>
        <title>{post.title} | SEO Score Suite Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors">
        <Icons.ArrowLeft size={16} /> Back to Blog
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-5 sm:p-12 lg:p-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-800">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">•</span>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">{post.date}</span>
          </div>

          <div className="markdown-body">
            <Markdown>{post.content}</Markdown>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                <Icons.User size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Written by</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                <Icons.Share2 size={20} />
              </button>
              <button className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                <Icons.Twitter size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>

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
