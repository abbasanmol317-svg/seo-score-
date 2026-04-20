import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PowerPage = () => {
  const sections = [
    {
      title: "🔍 Website SEO Tools",
      description: "A complete SEO audit is the first step toward improving your website rankings. These tools help identify technical issues, optimize on-page SEO, and improve performance.",
      linkText: "Explore the full SEO Audit Tool here",
      linkPath: "/tools/free-website-seo-audit-tool",
      learnMorePath: "/blog/22",
      icon: Icons.SearchCode,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "🎯 Keyword Research Tools",
      description: "Finding the right keywords is the backbone of SEO success. These AI-powered tools help you discover low-competition and high-traffic keywords.",
      linkText: "Try the Keyword Research Tool",
      linkPath: "/tools/free-keyword-research-tool",
      learnMorePath: "/blog/6",
      icon: Icons.KeyRound,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "🎥 YouTube SEO Tools",
      description: "YouTube SEO is essential for content creators looking to increase their views and subscribers. These tools help optimize titles, descriptions, and tags.",
      linkText: "Use the YouTube SEO Tool",
      linkPath: "/tools/free-youtube-seo-tool",
      learnMorePath: "/blog/15",
      icon: Icons.Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "⚡ Site Speed Checker",
      description: "Website speed directly impacts user experience and search engine rankings. A fast-loading website keeps visitors engaged.",
      linkText: "Test your site speed here",
      linkPath: "/tools/free-website-speed-test-tool",
      learnMorePath: "/blog/18",
      icon: Icons.Zap,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "🔗 Backlink Checker Tools",
      description: "Backlinks are one of the most important ranking factors in SEO. Monitoring your backlink profile helps improve authority and rankings.",
      linkText: "Analyze backlinks here",
      linkPath: "/tools/free-backlink-checker-tool",
      learnMorePath: "/blog/19",
      icon: Icons.Link,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  const externalResources = [
    {
      name: "Complete Guide for Beginners",
      platform: "Notion",
      url: "https://hypnotic-railway-1ec.notion.site/Best-Free-AI-SEO-Tools-2026-Complete-Guide-for-Beginners-33f1571d18dd80559032ef7f6eb88f7c?source=copy_link",
      icon: Icons.FileText
    },
    {
      name: "Curated SEO Content",
      platform: "Medium",
      url: "https://medium.com/@abbasanmol317/best-free-ai-seo-tools-2026-complete-guide-for-beginners-dc623c52b57d",
      icon: Icons.BookOpen
    },
    {
      name: "Visual SEO Insights",
      platform: "Pinterest",
      url: "https://www.pinterest.com/pin/1090082284833550906/",
      icon: Icons.Image
    },
    {
      name: "SEO Infographics & Tips",
      platform: "Pinterest",
      url: "https://www.pinterest.com/pin/1090082284833550906/",
      icon: Icons.Layout
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <Helmet>
        <title>Best AI SEO Tools & Resources (2026 Updated List) | SEO Score</title>
        <meta name="description" content="Explore our curated list of the best AI SEO tools and resources for 2026. Optimize your website, YouTube channel, and content for maximum growth." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Best AI SEO Tools & Resources <span className="text-indigo-600">(2026 Updated List)</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            In today’s fast-growing digital world, SEO (Search Engine Optimization) is essential for ranking websites, growing YouTube channels, and increasing online visibility. 
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            To simplify the process, we have compiled a list of powerful AI SEO tools and resources that can help you analyze, optimize, and scale your online presence effectively. **Write for humans first, and let our tools handle the search engine optimization.**
          </p>
        </motion.div>

        <div className="space-y-12 mb-20">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className={`p-4 rounded-2xl ${section.bgColor} ${section.color} shrink-0`}>
                  <section.icon size={32} />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{section.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {section.description} Our AI-driven approach ensures you get actionable insights that prioritize user experience while meeting technical search requirements.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link 
                      to={section.linkPath}
                      className={`inline-flex items-center gap-2 font-bold ${section.color} hover:underline decoration-2 underline-offset-4`}
                    >
                      👉 {section.linkText}
                      <Icons.ArrowRight size={16} />
                    </Link>
                    <Link 
                      to={section.learnMorePath}
                      className="inline-flex items-center gap-2 font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors text-sm hover:underline"
                    >
                      <Icons.Info size={14} />
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-indigo-600 rounded-[3rem] p-8 sm:p-12 text-white mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Icons.Globe size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <Icons.Globe className="text-indigo-200" />
              🌐 External Resources (Trusted Platforms)
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl">
              We also share valuable resources and platforms where you can explore more insights and tools related to SEO and digital marketing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all group"
                >
                  <res.icon className="mb-4 text-indigo-200" size={24} />
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">{res.platform}</p>
                  <h3 className="font-bold text-white group-hover:text-indigo-100 transition-colors">{res.name}</h3>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">🚀 Final Thoughts</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Using the right combination of tools and resources can significantly improve your SEO performance. Whether you are a beginner or an expert, these AI-powered solutions will help you achieve better rankings and faster growth.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
          >
            <Icons.Zap size={20} />
            Visit our main platform
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PowerPage;
