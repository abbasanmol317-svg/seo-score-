import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Terms() {
  const lastUpdated = "April 21, 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <Helmet>
        <title>Terms of Service | SEO Score</title>
        <meta name="description" content="Read the terms and conditions for using SEO Score's free AI SEO tools." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 mb-6">
          <Icons.FileText size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Terms of <span className="text-indigo-600">Service</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Last updated: {lastUpdated}
        </p>
      </motion.div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SEO Score (the "Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the tools and information on SEO Score for personal, non-commercial transitory viewing and analysis only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial) without explicit permission;</li>
            <li>Attempt to decompile or reverse engineer any software contained on SEO Score;</li>
            <li>Remove any copyright or other proprietary notations from the materials;</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">3. Disclaimer</h2>
          <p>
            The tools and materials on SEO Score are provided on an 'as is' basis. SEO Score makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-4">
            Further, SEO Score does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">4. Limitations</h2>
          <p>
            In no event shall SEO Score or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SEO Score, even if SEO Score or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on SEO Score could include technical, typographical, or photographic errors. SEO Score does not warrant that any of the materials on its website are accurate, complete or current. SEO Score may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">6. Links</h2>
          <p>
            SEO Score has not reviewed all of the websites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SEO Score of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        <div className="mt-16 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Questions about our Terms?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            If you have any questions regarding these terms, please contact us through our <Link to="/about" className="text-indigo-600 hover:underline">About Page</Link>.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline">
            Back to Home <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
