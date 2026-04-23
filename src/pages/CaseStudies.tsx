import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Icon } from '../components/ui/Icon';
import Breadcrumbs from '../components/Breadcrumbs';
import LeadCaptureModal from '../components/LeadCaptureModal';

const CASE_STUDIES = [
  {
    id: 1,
    client: "TechStream SaaS",
    industry: "B2B Software",
    icon: "Box",
    challenge: "Struggling with low organic visibility for high-value technical keywords in the cloud infrastructure space.",
    results: [
      { label: "Organic Traffic", value: "+340%" },
      { label: "Top 3 Rankings", value: "45 Keywords" },
      { label: "Crawl Efficiency", value: "98% Improvement" }
    ],
    strategy: "Implemented automated technical audits and topical cluster mapping using SEO Score's AI engine to resolve critical indexing loops.",
    color: "indigo"
  },
  {
    id: 2,
    client: "EcoMarket Shop",
    industry: "E-Commerce",
    icon: "ShoppingBag",
    challenge: "High product page bounce rates and low CTR due to generic, thin meta descriptions across 10k SKUs.",
    results: [
      { label: "CTR Increase", value: "+120%" },
      { label: "Conversion Rate", value: "+45%" },
      { label: "Sales Up", value: "$12k/mo" }
    ],
    strategy: "Deployed the AI Meta Tag Generator to bulk-optimize product visibility with psychological urgency triggers and A/B tested snippets.",
    color: "emerald"
  },
  {
    id: 3,
    client: "BrightDental Group",
    industry: "Local Medical",
    icon: "MapPin",
    challenge: "Invisible in local 'near me' searches despite high-quality services and positive patient reviews.",
    results: [
      { label: "Map Pack Entry", value: "Top 3" },
      { label: "Direct Calls", value: "+210%" },
      { label: "Local Revenue", value: "+85%" }
    ],
    strategy: "Used our Local SEO Strategy guide and Schema Generator to implement advanced LocalBusiness markup and location-specific semantic clusters.",
    color: "orange"
  },
  {
    id: 4,
    client: "Pixels & Tech",
    industry: "YouTube/Creators",
    icon: "Youtube",
    challenge: "High-quality reviews were being buried by older content due to poor tag optimization and weak hook descriptions.",
    results: [
      { label: "Avg. Views", value: "+500%" },
      { label: "Sub Growth", value: "15k/mo" },
      { label: "Video Revenue", value: "+300%" }
    ],
    strategy: "Integrated the YouTube SEO analyzer into the workflow to identify high-retention keywords and AI-generated 'Hook' descriptions.",
    color: "rose"
  },
  {
    id: 5,
    client: "Global Insight Media",
    industry: "Digital Publishing",
    icon: "Newspaper",
    challenge: "Massive news archive (~50k pages) failing to rank for trending topics due to thin content signals.",
    results: [
      { label: "AEO Readiness", value: "95/100" },
      { label: "SGE Citations", value: "Top Tier" },
      { label: "News Traffic", value: "+400%" }
    ],
    strategy: "Leveraged the AI Search Intelligence scanner to adapt legacy content for GEO (Generative Engine Optimization) and conversational AI queries.",
    color: "blue"
  }
];

export default function CaseStudies() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(email) => console.log('Lead:', email)}
        title="Get the Full Technical Tear-down"
        subtitle="We'll send you the detailed 40-page strategy document for all our major case studies directly to your inbox."
      />
      <Helmet>
        <title>SEO Case Studies: Proven Ranking Results | SEO Score</title>
        <meta name="description" content="See how top brands use AI search intelligence to boost traffic by 340%+. Explore our data-backed SEO case studies and get the technical roadmap. View results now!" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Breadcrumbs items={[{ label: 'Case Studies', path: '/case-studies', active: true }]} />

        <div className="mt-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6"
            >
              Proof in the <span className="text-indigo-600 font-serif italic">Results</span>
            </motion.h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Real-world search intelligence in action. We don't just track metrics; we build sustainable organic growth engines.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-8 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5">
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">$4.2M+</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Revenue Growth</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100 dark:bg-slate-800 self-center" />
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">500k+</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Keywords Ranked</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-100 dark:bg-slate-800 self-center" />
            <div className="text-center px-4">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">22+</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Niches Dominated</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{study.client}</h3>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                    {study.industry}
                  </span>
                </div>
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Icon name={study.icon as any} size={24} />
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">The Challenge</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-4">
                    "{study.challenge}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {study.results.map((res, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl sm:text-2xl font-black text-indigo-600">{res.value}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{res.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Strategy</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    {study.strategy}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Study #{study.id}</span>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 text-indigo-600 font-bold text-xs hover:gap-3 transition-all"
                >
                  Read Full Technical Tear-down
                  <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 p-8 sm:p-16 bg-slate-900 rounded-[4rem] text-center relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-indigo-500/20 rotate-3">
              <Icon name="Download" size={32} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">Ready to see these results for your site?</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              Join the elite SEOs using Search Intelligence to bypass the noise and hit the first page. No commitment, just pure technical strategy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                Download All Case Studies <Icon name="FileText" size={18} />
              </button>
              <Link 
                to="/tools" 
                className="px-8 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center gap-3 border border-white/10 backdrop-blur-md active:scale-95"
              >
                Try Audit Tools <Icon name="Zap" size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
