import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy | SEO Score - Data Security & AI Ethics</title>
        <meta name="description" content="Read the SEO Score Privacy Policy. Learn how we protect your data while providing world-class AI SEO analysis. Review our terms here." />
        <meta name="keywords" content="SEO Score privacy policy, data security, AI ethics, SEO tool privacy" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-600 rounded-2xl sm:rounded-3xl text-white mb-4 sm:mb-6 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
          <Icons.ShieldCheck size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Privacy <span className="text-indigo-600 dark:text-indigo-400">Policy</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-500 dark:text-slate-400 px-4">
          Your data security and privacy are our top priorities.
        </p>
      </motion.div>

      <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none">
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Data Collection</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We collect minimal data necessary to provide our SEO services. This includes the URLs, keywords, 
            and content you input into our tools for analysis. We do not store this data permanently 
            unless you explicitly save it to your history.
          </p>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Use of AI</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Our analysis is powered by Google's Gemini AI. When you run a tool, your input is sent to 
            the Gemini API for processing. This data is handled according to Google's AI privacy standards.
          </p>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Cookies</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We use essential cookies to maintain your theme preferences and local history. 
            We do not use tracking cookies for advertising purposes.
          </p>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Your Rights</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            You have the right to access, correct, or delete any personal information we may have. 
            Since most of our data is stored locally in your browser, you can clear your history 
            at any time through the dashboard.
          </p>
        </section>

        <section className="bg-slate-100 dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contact Us</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            If you have any questions about our privacy policy, please contact our support team at 
            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">privacy@seoscore.ai</span>
          </p>
        </section>
      </div>
    </div>
  );
}
