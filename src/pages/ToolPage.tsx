import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { TOOLS, runTool, ToolId } from '../services/gemini';
import { cn } from '../lib/utils';
import { AdUnit } from '../components/AdSense';
import { getToolComponent } from '../components/tools/toolRegistry';
import { getDeepContent } from '../constants/toolContent';

import { getErrorMessage } from '../lib/seo-utils';
import Breadcrumbs from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../constants/blogData';
import { Icon } from '../components/ui/Icon';

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

  const tool = useMemo(() => {
    if (!id) return undefined;
    return TOOLS.find(t => t.id === id || t.slug === id);
  }, [id]);

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

  // Track recently viewed tools
  useEffect(() => {
    if (tool) {
      try {
        const recent = JSON.parse(localStorage.getItem('seo_recent_tools') || '[]');
        const updated = [tool.id, ...recent.filter((tid: string) => tid !== tool.id)].slice(0, 4);
        localStorage.setItem('seo_recent_tools', JSON.stringify(updated));
      } catch (e) {
        // Ignore
      }
    }
  }, [tool]);

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
    "Local SEO is crucial for businesses with physical locations.",
    "Decorative images should have an empty alt attribute (alt=\"\") to avoid distracting screen readers.",
    "Informational images need alt text that provides an equivalent experience to the visual content.",
    "Functional images (like buttons) should have alt text describing the action, not the icon itself.",
    "Avoid starting alt text with 'image of' or 'picture of'—it's redundant for screen readers.",
    "Keep LCP under 2.5 seconds for a fast and search-friendly experience.",
    "The 45-character rule for Title Tags helps prevent truncation in mobile search.",
    "Internal links with descriptive anchor text act as 'roads' for Google's crawlers.",
    "Adding an FAQ section with structured data can significantly boost rich snippets.",
    "Video SEO: Use transcripts to help AI 'read' your video content.",
    "A 1-second delay in page load can lead to a 7% reduction in conversions.",
    "Prioritize 'Low Difficulty' keywords to build topical authority faster.",
    "Cumulative Layout Shift (CLS) should be less than 0.1 for maximum stability."
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
      }, 4000);
    }
    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
      if (!loading) setProgress(100);
    };
  }, [loading, tool?.id]);

  if (!tool) return null;

  const handleRun = async (overrideInput?: string) => {
    const finalInput = typeof overrideInput === 'string' ? overrideInput : input;
    if (!finalInput.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    setFeedbackRating(null);
    setFeedbackText('');
    setIsFeedbackSubmitted(false);
    try {
      const output = await runTool(tool.id as ToolId, finalInput);
      setResult(output || 'No response from AI.');
      
      const newEntry = {
        id: Date.now(),
        toolId: tool.id,
        toolName: tool.name,
        input: finalInput.substring(0, 100),
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
      setError(getErrorMessage(err.message || ''));
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareMenu(false);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError('');
  };

  const ToolComponent = getToolComponent(tool.id);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    
    const currentKeywords = tool.keywords.split(',').map(k => k.trim().toLowerCase());
    const usedToolIds = new Set(history.map(h => h.toolId));
    
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
        
        // 3. Specific hardcoded relations for better UX
        const relations: Record<string, string[]> = {
          'meta-tag': ['on-page-checklist', 'content-optimizer', 'serp-preview'],
          'keyword-research': ['content-optimizer', 'seo-audit', 'website-seo'],
          'site-speed': ['mobile-friendly', 'seo-audit', 'broken-links'],
          'seo-audit': ['on-page-checklist', 'technical-seo', 'backlinks'],
        };
        if (relations[tool.id]?.includes(t.id)) score += 20;

        // 4. Result-based context (NEW: Analysis of generated output)
        let isSmartSuggestion = false;
        if (result && tool.id === 'meta-tag') {
          const lowerResult = result.toLowerCase();
          // If result mentions content quality or length, suggest Content Optimizer
          if (lowerResult.includes('content') || lowerResult.includes('length') || lowerResult.includes('readability')) {
            if (t.id === 'content-optimizer') {
              score += 15;
              isSmartSuggestion = true;
            }
          }
          // If result mentions keywords or targeting, suggest Keyword Research
          if (lowerResult.includes('keyword') || lowerResult.includes('target') || lowerResult.includes('niche')) {
            if (t.id === 'keyword-research') {
              score += 15;
              isSmartSuggestion = true;
            }
          }
          // If result mentions structure or checklist, suggest On-Page Checklist
          if (lowerResult.includes('structure') || lowerResult.includes('checklist') || lowerResult.includes('h1')) {
            if (t.id === 'on-page-checklist') {
              score += 15;
              isSmartSuggestion = true;
            }
          }
        }

        // 5. Description overlap (semantic link)
        const currentDesc = tool.description.toLowerCase();
        const targetDesc = t.description.toLowerCase();
        const descWords = currentDesc.split(/\s+/).filter(w => w.length > 3);
        const sharedDescWords = descWords.filter(w => targetDesc.includes(w));
        score += sharedDescWords.length * 1;

        // 6. User activity boost: If user has NOT used this tool yet, encourage discovery
        if (!usedToolIds.has(t.id)) score += 5;
        
        // 7. Add a tiny bit of randomness for variety
        score += Math.random();
        
        return { ...t, score, isSmartSuggestion };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [tool, history, result]);

  const relatedPosts = useMemo(() => {
    if (!tool) return [];
    const toolKeywords = tool.keywords.toLowerCase().split(',').map(k => k.trim());
    const toolId = tool.id.toLowerCase();
    const toolName = tool.name.toLowerCase();
    const toolCategory = tool.category.toLowerCase();

    return BLOG_POSTS.map(post => {
      let score = 0;
      const title = post.title.toLowerCase();
      const excerpt = post.excerpt.toLowerCase();
      const content = post.content.toLowerCase();
      const category = post.category.toLowerCase();

      // 1. Exact Tool Name match (Very strong)
      if (title.includes(toolName)) score += 50;
      if (excerpt.includes(toolName)) score += 30;

      // 2. Tool ID match
      const toolIdClean = toolId.replace('-', ' ');
      if (title.includes(toolIdClean)) score += 40;
      if (excerpt.includes(toolIdClean)) score += 25;

      // 3. Category match (Strong)
      if (category.includes(toolCategory) || toolCategory.includes(category)) {
        score += 35;
      }

      // 4. Keyword matches
      toolKeywords.forEach(kw => {
        if (kw === 'seo' || kw === 'ai') {
          // Generic keywords get less score
          if (title.includes(kw)) score += 2;
          if (excerpt.includes(kw)) score += 1;
        } else {
          if (title.includes(kw)) score += 15;
          if (excerpt.includes(kw)) score += 8;
          if (category.includes(kw)) score += 10;
        }
      });

      // 5. Content mentions the tool path
      if (content.includes(`/tool/${toolId}`)) score += 25;

      return { ...post, score };
    })
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  }, [tool]);

  const hasHistory = history.length > 0;

  // Optimized Meta Tags
  const seoTitle = tool.seoTitle || `${tool.name}: Best Free AI ${tool.category} Tool (2026)`;
  const seoDescription = tool.seoDescription || `Optimize your site with our free ${tool.name}. Get deep AI insights and actionable SEO fixes powered by Gemini. Run your free analysis now!`;

  const seoKeywords = `${tool.name.toLowerCase()}, free SEO tool, AI SEO analysis, ${tool.category.toLowerCase()}, search engine optimization, Google Gemini AI, SEO Score, technical SEO`;

  const deepContent = getDeepContent(tool.category);

  const toolSchema = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "SEO Tool",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
      }
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
          "name": tool.category,
          "item": `https://seoscore.site/tools?category=${encodeURIComponent(tool.category)}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tool.name,
          "item": `https://seoscore.site/tools/${tool.slug}`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={`https://seoscore.site/tools/${tool.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(toolSchema)}
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
            <Icon name="CheckCircle2" className="text-emerald-400" size={18} />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6 sm:py-12 flex flex-col gap-6 sm:gap-8 max-w-5xl mx-auto lg:mx-0 lg:pl-8 xl:pl-12">
        <div className="flex-grow">
          <div className="flex flex-col gap-1.5 sm:gap-4 mb-6 sm:mb-10">
            <Breadcrumbs 
              className={cn(isGeneratingPDF && "hidden")}
              items={[
                { label: 'Tools', path: '/tools' },
                { label: tool.category, path: `/tools?category=${encodeURIComponent(tool.category)}` },
                { label: tool.name, active: true }
              ]} 
            />
            <div className={cn("flex items-center gap-3 sm:gap-4", isGeneratingPDF && "hidden")}>
              <Link to="/" className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400 shrink-0">
                <Icon name="ChevronLeft" size={18} className="sm:w-6 sm:h-6" />
              </Link>
              <div className="p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg sm:rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                <Icon name={tool.icon} size={20} className="sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white truncate leading-tight">{tool.name}</h1>
                <p className="text-[10px] sm:text-base text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{tool.description}</p>
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

          <AdUnit slot="YOUR_SLOT_ID" className="mt-12" />

          <div className={cn("mt-12 sm:mt-20 space-y-12", isGeneratingPDF && "hidden")}>
            <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Icon name="BookOpen" size={200} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                  The Definitive Guide to <span className="text-indigo-600">{tool.name}</span> Optimization
                </h2>
                
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                    Master your search strategy with our **{tool.name}** guide. {deepContent.about}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg">
                          <Icon name="ListChecks" size={20} />
                        </div>
                        Step-by-Step Optimization
                      </h3>
                      <ul className="space-y-4">
                        {deepContent.howTo.map((step, idx) => (
                          <li key={idx} className="flex gap-4 group">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {idx + 1}
                            </span>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {step}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-lg">
                          <Icon name="Lightbulb" size={20} />
                        </div>
                        Expert Pro Tips
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {deepContent.proTips.map((tip, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Pro Tip #{idx + 1}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {deepContent.mistakesToAvoid && (
                    <div className="mt-12 space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-rose-600 rounded-lg text-white shadow-lg">
                          <Icon name="XCircle" size={20} />
                        </div>
                        Mistakes to Avoid
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {deepContent.mistakesToAvoid.map((mistake, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20 group hover:border-rose-300 transition-all">
                            <div className="mt-0.5 text-rose-500 group-hover:scale-110 transition-transform">
                              <Icon name="X" size={16} strokeWidth={3} />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                              {mistake}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-12 p-6 sm:p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-800/30">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                      <Icon name="Info" size={20} className="text-indigo-600" />
                      Why This Matters for Your SEO
                    </h3>
                    <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{deepContent.whyItMatters}"
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-6 sm:p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Icon name="Zap" size={160} className="opacity-20" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-4 tracking-tight">Ready to Dominate the SERPs?</h2>
                  <p className="text-slate-300 mb-8 leading-relaxed max-w-md">
                    Our AI-driven tools are updated weekly to reflect the latest changes in Google's search algorithms. Start your journey to the first page today.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {relatedPosts.slice(0, 2).map(post => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                        <Icon name="BookOpen" size={16} /> {post.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Icon name="ShieldCheck" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">100% Free & Secure</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  No signup required. No hidden fees. Just pure SEO power for your business.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Icon name="CircleHelp" className="text-indigo-600" size={24} />
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepContent.faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                      <span className="text-indigo-600">Q:</span> {faq.q}
                    </h3>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {relatedPosts.length > 0 && (
              <div className={cn("pt-12 border-t border-slate-200 dark:border-slate-800", isGeneratingPDF && "hidden")}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                      <Icon name="BookOpen" className="text-indigo-600" size={24} />
                      Expert SEO Insights
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Master {tool?.name} with our latest guides and expert strategies.
                    </p>
                  </div>
                  <Link to="/blog" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 uppercase tracking-widest">
                    All Guides <Icon name="ArrowRight" size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-2xl flex flex-col"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800">
                            {post.category}
                          </span>
                          {(post as any).score > 40 && (
                            <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                              <Icon name="Sparkles" size={10} className="text-emerald-500" /> RECOMMENDED
                            </div>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-widest">
                          <span>Read Full Guide</span>
                          <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={cn("mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-200 dark:border-slate-800", isGeneratingPDF && "hidden")}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                  <Icon name="Sparkles" className="text-indigo-600" size={24} />
                  {hasHistory ? "Recommended for You" : "Related SEO Tools"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {hasHistory 
                    ? "Based on your recent activity and current optimization needs." 
                    : "Powerful tools to complement your current SEO workflow."}
                </p>
              </div>
              <Link to="/" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 uppercase tracking-widest">
                View All Tools <Icon name="ArrowRight" size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedTools.map((relatedTool, idx) => {
                return (
                  <Link
                    key={relatedTool.id}
                    to={`/tools/${relatedTool.slug}`}
                    className="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-150 group-hover:-rotate-12">
                      <Icon name={relatedTool.icon} size={60} />
                    </div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <Icon name={relatedTool.icon} size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                          {relatedTool.name}
                        </h3>
                        {(relatedTool as any).isSmartSuggestion && (
                          <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                            <Icon name="Zap" size={8} fill="currentColor" /> Smart Suggestion
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6 flex-grow relative z-10">
                      {relatedTool.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest relative z-10">
                      <span>Try Now</span>
                      <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
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
