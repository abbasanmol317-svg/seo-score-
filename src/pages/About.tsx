import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { TOOLS } from '../services/gemini';

export default function About() {
  const topTools = TOOLS.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-3xl text-white mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icons.Info size={40} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          About <span className="text-indigo-600 dark:text-indigo-400">SEO Score</span>
        </h1>
        <p className="mt-4 text-xl text-slate-500 dark:text-slate-400">
          The ultimate AI-powered SEO toolkit for modern digital marketers.
        </p>
      </motion.div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At SEO Score, we believe that high-quality SEO analysis should be accessible to everyone. 
            By leveraging the power of Google's Gemini AI, we've built a suite of 19 professional tools 
            that provide deep insights, actionable recommendations, and technical audits in seconds.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <Icons.Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI-Powered Insights</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Our tools don't just crunch numbers; they understand context. Gemini AI analyzes your content 
              like a human expert would, but with the speed of a supercomputer.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Icons.ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Professional Grade</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              From technical audits to content optimization, our tools cover the entire SEO spectrum, 
              ensuring your website meets the highest search engine standards.
            </p>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Popular SEO Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topTools.map(tool => {
              const ToolIcon = (Icons as any)[tool.icon] || Icons.Zap;
              return (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.id}`}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ToolIcon size={20} />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-indigo-600 rounded-[2.5rem] p-12 text-white text-center">
          <h2 className="text-3xl font-black mb-4">Ready to dominate search?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join thousands of marketers who use SEO Score to improve their rankings and drive more organic traffic.
          </p>
          <Link to="/" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-xl">
            Explore All Tools
          </Link>
        </section>
      </div>
    </div>
  );
}
