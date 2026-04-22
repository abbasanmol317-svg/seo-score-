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
            By accessing and using SEO Score (the "Website"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, and others who access or use the Service.
          </p>
          <p className="mt-4">
            We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page. Your continued use of the Website after any such changes constitutes your acceptance of the new Terms of Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">2. Use License and AI Services</h2>
          <p>
            Permission is granted to temporarily use the tools and information on SEO Score for personal, non-commercial transitory viewing and analysis only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="mt-4">
            Our tools are powered by third-party AI providers (Google Gemini). By using our tools, you also agree to comply with the acceptable use policies of these AI providers. You must not use our AI-powered tools to generate harmful, illegal, or unethical content.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
            <li>Modify or copy the materials for commercial gain without attribution;</li>
            <li>Use the materials for any automated data scraping or large-scale extraction;</li>
            <li>Attempt to decompile or reverse engineer any software contained on SEO Score;</li>
            <li>Remove any copyright or other proprietary notations from the materials;</li>
            <li>Use the service in any manner that could disable, overburden, or impair the site.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">3. Disclaimer of Warranties</h2>
          <p>
            The tools and materials on SEO Score are provided on an 'as is' basis. SEO Score makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
          <p className="mt-4">
            SEO signals and search engine algorithms are constantly changing. The recommendations provided by our AI are based on probabilistic interpretations and do not guarantee specific indexing or ranking results. Your use of these insights is at your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">4. Limitation of Liability</h2>
          <p>
            In no event shall SEO Score or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SEO Score, even if SEO Score or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">5. Intellectual Property</h2>
          <p>
            The Website and its original content, features, and functionality are and will remain the exclusive property of SEO Score and its licensors. The Website is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">6. Links and External Content</h2>
          <p>
            SEO Score has not reviewed all of the websites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SEO Score of the site. Use of any such linked website is at the user's own risk. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
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
