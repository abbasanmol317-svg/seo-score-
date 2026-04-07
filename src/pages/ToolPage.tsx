import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { TOOLS, runTool, ToolId } from '../services/gemini';
import { cn } from '../lib/utils';
import { getToolComponent } from '../components/tools/toolRegistry';

export default function ToolPage() {
  const { id } = useParams<{ id: string }>();
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
    const savedHistory = localStorage.getItem('seo_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
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
    "Internal linking helps distribute link equity across your site."
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
          const next = prev + (100 / (messages.length * 2));
          return next > 98 ? 98 : next;
        });
        i++;
      }, 2000);

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
      const savedHistory = localStorage.getItem('seo_history');
      const historyArr = savedHistory ? JSON.parse(savedHistory) : [];
      const updatedHistory = [newEntry, ...historyArr].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem('seo_history', JSON.stringify(updatedHistory));
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
  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;

  const seoTitle = `${tool.name} | Free AI SEO Tool 2026 | SEO Score Suite`;
  const seoDescription = `Optimize your website with our free ${tool.name.toLowerCase()} tool. Powered by Google Gemini AI, this professional ${tool.category.toLowerCase()} tool provides deep insights and actionable recommendations for search engine success.`;
  const seoKeywords = `${tool.name.toLowerCase()}, free SEO tool, AI SEO analysis, ${tool.category.toLowerCase()}, search engine optimization, Google Gemini AI, SEO Score Suite, technical SEO`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={`https://seo-score-suite.com/tool/${tool.id}`} />
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

          <div className={cn("mt-12 sm:mt-20 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800", isGeneratingPDF && "hidden")}>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">About our {tool.name} tool</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {seoDescription}
            </p>
          </div>

          <div className={cn("mt-12 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-200 dark:border-slate-800", isGeneratingPDF && "hidden")}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 flex items-center gap-3">
              <Icons.Sparkles className="text-indigo-600" size={20} />
              Related SEO Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {TOOLS
                .filter(t => t.id !== tool.id && (t.category === tool.category || Math.random() > 0.7))
                .slice(0, 3)
                .map(relatedTool => {
                  const RelatedIcon = (Icons as any)[relatedTool.icon] || Icons.Zap;
                  return (
                    <Link
                      key={relatedTool.id}
                      to={`/tool/${relatedTool.id}`}
                      className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <RelatedIcon size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{relatedTool.name}</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{relatedTool.description}</p>
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
