import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { TOOLS, runTool, ToolId } from '../services/gemini';
import { cn } from '../lib/utils';
import { getToolComponent } from '../components/tools/toolRegistry';

export default function ToolPage({ idOverride }: { idOverride?: string }) {
  const { id: paramId } = useParams<{ id: string }>();
  const id = idOverride || paramId;
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'up' | 'down' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const tool = TOOLS.find(t => t.id === id);

  useEffect(() => {
    if (!tool) {
      navigate('/');
      return;
    }
    try {
      const savedHistory = localStorage.getItem('seo_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }, [id, tool, navigate]);

  const [loadingMessage, setLoadingMessage] = useState('Analyzing your data...');
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState('');

  const SEO_TIPS = [
    "Google uses over 200 ranking factors in their algorithm.",
    "Page speed is a direct ranking factor for both desktop and mobile.",
    "High-quality content is the #1 most important SEO factor.",
    "Backlinks remain one of the strongest signals for search authority.",
    "User intent is more important than keyword density in 2026.",
    "Mobile-first indexing means Google primarily uses the mobile version of content.",
    "Core Web Vitals are essential for a good user experience and ranking.",
    "Schema markup helps search engines understand your content better.",
    "Voice search is growing; optimize for conversational keywords.",
    "Internal linking helps distribute link equity across your site.",
    "HTTPS is a confirmed ranking signal; ensure your SSL is valid.",
    "Alt text for images improves accessibility and image search rankings.",
    "Long-form content tends to rank higher for complex topics.",
    "Meta descriptions don't affect rankings directly but impact CTR.",
    "A clean URL structure helps both users and search engines.",
    "Regularly update old content to maintain its search relevance.",
    "Social signals may not be direct factors, but they drive traffic.",
    "Avoid duplicate content; use canonical tags where necessary.",
    "Optimize for 'Featured Snippets' by answering questions directly.",
    "Local SEO is crucial for businesses with physical locations."
  ];

  useEffect(() => {
    let interval: any;
    let tipInterval: any;
    
    if (loading) {
      setProgress(0);
      setCurrentTip(SEO_TIPS[Math.floor(Math.random() * SEO_TIPS.length)]);
      
      const getMessages = () => {
        const baseMessages = [
          'Analyzing your data...',
          'Checking SEO patterns...',
          'Consulting AI experts...',
          'Generating recommendations...',
          'Finalizing your report...',
          'Almost there, refining results...'
        ];

        const toolSpecific: Record<string, string[]> = {
          'website-seo': [
            'Scanning domain authority...',
            'Analyzing on-page elements...',
            'Checking meta tag consistency...',
            'Evaluating content depth...'
          ],
          'youtube-seo': [
            'Analyzing video metadata...',
            'Checking tag relevance...',
            'Evaluating title CTR potential...',
            'Scanning description for keywords...'
          ],
          'site-speed': [
            'Simulating page load...',
            'Measuring Core Web Vitals...',
            'Identifying render-blocking assets...',
            'Analyzing image compression...'
          ],
          'broken-links': [
            'Crawling site structure...',
            'Verifying HTTP status codes...',
            'Mapping internal link paths...',
            'Identifying 404 error patterns...'
          ],
          'seo-audit': [
            'Running comprehensive audit...',
            'Checking technical health...',
            'Evaluating mobile-first readiness...',
            'Scanning for security protocols...'
          ],
          'mobile-friendly': [
            'Simulating mobile viewport...',
            'Checking touch target sizes...',
            'Analyzing font legibility...',
            'Testing responsive breakpoints...'
          ],
          'meta-tag': [
            'Generating high-CTR titles...',
            'Optimizing meta descriptions...',
            'Checking character limits...',
            'Analyzing keyword prominence...'
          ],
          'schema-markup': [
            'Identifying entity relationships...',
            'Generating JSON-LD code...',
            'Validating structured data...',
            'Mapping rich snippet opportunities...'
          ],
          'image-alt-text': [
            'Analyzing image context...',
            'Generating descriptive alt text...',
            'Checking accessibility standards...',
            'Optimizing for image search...'
          ],
          'sitemap-robots': [
            'Mapping site architecture...',
            'Generating XML sitemap...',
            'Configuring robots.txt rules...',
            'Optimizing crawl instructions...'
          ],
          'keyword-research': [
            'Extracting high-volume keywords...',
            'Analyzing search volume trends...',
            'Evaluating keyword difficulty...',
            'Identifying long-tail opportunities...'
          ],
          'content-optimizer': [
            'Scanning content for readability...',
            'Checking keyword placement...',
            'Analyzing semantic relevance...',
            'Suggesting structural improvements...'
          ],
          'backlink-checker': [
            'Crawling referring domains...',
            'Evaluating link authority...',
            'Identifying toxic backlink patterns...',
            'Mapping anchor text distribution...'
          ],
          'technical-audit': [
            'Checking server response times...',
            'Auditing crawlability and indexing...',
            'Verifying SSL and security protocols...',
            'Testing mobile responsiveness...'
          ],
          'rank-tracker': [
            'Fetching real-time SERP data...',
            'Comparing historical positions...',
            'Analyzing competitor movements...',
            'Calculating visibility index...'
          ]
        };

        const specific = toolSpecific[tool?.id || ''] || [];
        return [...specific, ...baseMessages].sort(() => Math.random() - 0.5);
      };

      const messages = getMessages();
      let i = 0;
      
      interval = setInterval(() => {
        setLoadingMessage(messages[i % messages.length]);
        setProgress(prev => {
          // Faster initial progress, slowing down as it nears 100
          const increment = prev < 30 ? 8 : prev < 60 ? 4 : prev < 85 ? 2 : 0.5;
          const next = prev + increment;
          return next > 99 ? 99 : next;
        });
        i++;
      }, 1500);

      tipInterval = setInterval(() => {
        setCurrentTip(SEO_TIPS[Math.floor(Math.random() * SEO_TIPS.length)]);
      }, 6000);
    }
    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
      if (!loading) setProgress(100);
    };
  }, [loading, tool?.id]);

  if (!tool) return null;

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    setFeedbackRating(null);
    setFeedbackText('');
    setIsFeedbackSubmitted(false);
    try {
      const output = await runTool(tool.id as ToolId, input);
      setResult(output || 'No response from AI.');
      
      const newEntry = {
        id: Date.now(),
        toolId: tool.id,
        toolName: tool.name,
        input: input.substring(0, 100),
        timestamp: new Date().toISOString(),
      };
      try {
        const savedHistory = localStorage.getItem('seo_history');
        const historyArr = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = [newEntry, ...historyArr].slice(0, 50);
        setHistory(updatedHistory);
        localStorage.setItem('seo_history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.warn('Failed to save to history:', e);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    setIsGeneratingPDF(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${tool?.name.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsDownloading(false);
      setIsGeneratingPDF(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'email' | 'copy' | 'native') => {
    const shareText = `Check out my SEO analysis for "${input}" using SEO Score!`;
    const shareUrl = window.location.href;

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title: 'SEO Score Analysis',
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=SEO Analysis Report&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
    }
    setShowShareMenu(false);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError('');
  };

  const ToolComponent = getToolComponent(tool.id);
  const IconComponent = (Icons as any)[tool.icon] || Icons.CircleHelp;

  // Tool-specific blog links
  const getRelatedBlogs = (tid: string) => {
    const blogs: Record<string, { id: number, title: string }[]> = {
      'youtube-seo': [
        { id: 15, title: 'YouTube SEO Tool for Beginners Free' },
        { id: 16, title: 'AI YouTube Keyword Research Tool 2026' },
        { id: 17, title: 'Video SEO Optimization Tool Free' }
      ],
      'site-speed': [
        { id: 18, title: 'Website Speed Test AI Tool Free' }
      ],
      'backlinks': [
        { id: 19, title: 'Free Backlink Checker Tool with Report' }
      ],
      'broken-links': [
        { id: 20, title: 'Broken Link Checker Tool Online Free' },
        { id: 21, title: 'AI Tool to Fix 404 Errors Website' }
      ],
      'keyword-research': [
        { id: 6, title: 'SEO Analysis Tools: Finding Low Competition Keywords' },
        { id: 16, title: 'AI YouTube Keyword Research Tool 2026' }
      ],
      'seo-audit': [
        { id: 7, title: 'AI Website SEO Audit Tool Free Online' },
        { id: 10, title: 'Instant SEO Audit Tool Without Signup' },
        { id: 14, title: 'Technical SEO Audit Tool Online Free' },
        { id: 5, title: 'How to do SEO Audit Step by Step' }
      ],
      'website-seo': [
        { id: 8, title: 'Free SEO Analysis Tool for Beginners 2026' },
        { id: 9, title: 'Website SEO Checker with AI Report' },
        { id: 11, title: 'AI SEO Analyzer for Small Businesses' }
      ],
      'bulk-url': [
        { id: 12, title: 'Bulk URL SEO Checker Tool Free' }
      ]
    };
    return blogs[tid] || [
      { id: 4, title: 'Best Free AI SEO Tools 2026' },
      { id: 5, title: 'Step-by-Step SEO Audit Guide' }
    ];
  };

  const relatedBlogs = getRelatedBlogs(tool.id);

  // Dynamic Related Tools based on thematic similarity
  const relatedTools = useMemo(() => {
    if (!tool) return [];
    
    const currentKeywords = tool.keywords.split(',').map(k => k.trim().toLowerCase());
    
    return TOOLS
      .filter(t => t.id !== tool.id)
      .map(t => {
        const toolKeywords = t.keywords.split(',').map(k => k.trim().toLowerCase());
        const sharedKeywords = toolKeywords.filter(k => currentKeywords.includes(k));
        
        // Scoring logic:
        // 1. Shared keywords (strong thematic link)
        let score = sharedKeywords.length * 5;
        
        // 2. Same category (structural link)
        if (t.category === tool.category) score += 10;
        
        // 3. Description overlap (semantic link)
        const currentDesc = tool.description.toLowerCase();
        const targetDesc = t.description.toLowerCase();
        const descWords = currentDesc.split(/\s+/).filter(w => w.length > 3);
        const sharedDescWords = descWords.filter(w => targetDesc.includes(w));
        score += sharedDescWords.length * 1;

        // 4. Add a tiny bit of randomness for variety among equal scores
        score += Math.random();
        
        return { ...t, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [tool]);

  // Optimized Meta Tags
  let seoTitle = `${tool.name}: Best Free AI ${tool.category} Tool (2026)`;
  let seoDescription = `Optimize your site with our free ${tool.name}. Get deep AI insights and actionable SEO fixes powered by Gemini. Run your free analysis now!`;

  if (tool.id === 'meta-tag') {
    seoTitle = `AI Meta Tag Generator: Create High-CTR SEO Tags Instantly (2026)`;
    seoDescription = `Boost your search rankings and CTR with our free AI Meta Tag Generator. Create perfectly optimized meta titles and descriptions in seconds using Google Gemini AI. Start for free!`;
  } else if (tool.id === 'keyword-research') {
    seoTitle = `Free AI Keyword Research Tool: Find High-Volume Keywords (2026)`;
    seoDescription = `Discover high-traffic, low-competition keywords with our free AI Keyword Research tool. Build your topical authority and dominate the SERPs today!`;
  } else if (tool.id === 'content-optimizer') {
    seoTitle = `AI Content Optimizer: Improve Your SEO Rankings Fast (2026)`;
    seoDescription = `Analyze and optimize your content for search engines with our free AI Content Optimizer. Get semantic suggestions and readability fixes in seconds.`;
  }

  const seoKeywords = `${tool.name.toLowerCase()}, free SEO tool, AI SEO analysis, ${tool.category.toLowerCase()}, search engine optimization, Google Gemini AI, SEO Score Suite, technical SEO`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={`https://seoscore.site/tool/${tool.id}`} />
      </Helmet>

      <div className="px-4 py-6 sm:py-12 flex flex-col gap-6 sm:gap-8 max-w-5xl mx-auto lg:mx-0 lg:pl-8 xl:pl-12">
        <div className="flex-grow">
          <div className="flex flex-col gap-2 mb-6 sm:mb-8">
            <nav className={cn("flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", isGeneratingPDF && "hidden")}>
              <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
              <Icons.ChevronRight size={10} />
              <span className="text-slate-300 dark:text-slate-700 truncate max-w-[80px] sm:max-w-none">{tool.category}</span>
              <Icons.ChevronRight size={10} />
              <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[100px] sm:max-w-none">{tool.name}</span>
            </nav>
            <div className={cn("flex items-center gap-3 sm:gap-4", isGeneratingPDF && "hidden")}>
              <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400 shrink-0">
                <Icons.ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </Link>
              <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                <IconComponent size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">{tool.name}</h1>
                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</p>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
            <ToolComponent
              tool={tool}
              input={input}
              setInput={setInput}
              result={result}
              loading={loading}
              error={error}
              handleRun={handleRun}
              handleClear={handleClear}
              handleCopy={handleCopy}
              handlePrint={handlePrint}
              handleDownloadPDF={handleDownloadPDF}
              isDownloading={isDownloading}
              isGeneratingPDF={isGeneratingPDF}
              copied={copied}
              showShareMenu={showShareMenu}
              setShowShareMenu={setShowShareMenu}
              handleShare={handleShare}
              reportRef={reportRef}
              loadingMessage={loadingMessage}
              progress={progress}
              currentTip={currentTip}
              isFeedbackSubmitted={isFeedbackSubmitted}
              setIsFeedbackSubmitted={setIsFeedbackSubmitted}
              feedbackRating={feedbackRating}
              setFeedbackRating={setFeedbackRating}
              feedbackText={feedbackText}
              setFeedbackText={setFeedbackText}
              history={history}
            />
          </Suspense>

          <div className={cn("mt-12 sm:mt-20 space-y-12", isGeneratingPDF && "hidden")}>
            <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">Advanced Analysis with {tool.name}</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {tool.description} This specialized tool is part of the **SEO Score Suite**, engineered to provide deep technical and semantic insights into your digital presence. By utilizing **Google Gemini AI**, we move beyond simple pattern matching to provide a holistic view of your SEO health, mimicking the analysis of a senior SEO strategist.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Icons.Settings className="text-indigo-600" size={18} />
                    How it Works
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Simply enter your data (URL, keyword, or content) and our AI will scan it against hundreds of ranking factors. It analyzes semantic relevance, technical structure, and user experience patterns to generate a comprehensive report with actionable steps.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Icons.TrendingUp className="text-indigo-600" size={18} />
                    Key Benefits
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <Icons.CircleCheckBig className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                      Professional-grade AI analysis for free.
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.CircleCheckBig className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                      Actionable recommendations to improve rankings.
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.CircleCheckBig className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                      Real-time insights based on 2026 SEO trends.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Why Choose Our AI-Driven {tool.name}?</h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                In the search landscape of 2026, authority is built on technical precision and content relevance. Our {tool.name} tool is specifically tuned to identify the subtle signals that modern search engines prioritize. Whether you're optimizing for **Core Web Vitals** or **Semantic Search**, this tool provides the data-driven edge you need to outperform your competition.
              </p>
              <div className="flex flex-wrap gap-4">
                {relatedBlogs.map(blog => (
                  <Link key={blog.id} to={`/blog/${blog.id}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <Icons.BookOpen size={14} /> {blog.title}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className={cn("mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-200 dark:border-slate-800", isGeneratingPDF && "hidden")}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
              <Icons.Sparkles className="text-indigo-600" size={20} />
              Related SEO Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedTools.map(relatedTool => {
                const RelatedIcon = (Icons as any)[relatedTool.icon] || Icons.Zap;
                return (
                  <Link
                    key={relatedTool.id}
                    to={`/tool/${relatedTool.id}`}
                    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-lg flex flex-col h-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <RelatedIcon size={20} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{relatedTool.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow">{relatedTool.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Try Tool <Icons.ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
