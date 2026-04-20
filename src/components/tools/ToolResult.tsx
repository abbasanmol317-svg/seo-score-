import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Tool, TOOLS } from '../../services/gemini';
import { renderMarkdownContent } from '../../lib/seo-utils';
import { CoreWebVitalsUI } from './CoreWebVitalsUI';
import { PerformanceBenchmarkChart } from '../charts/SEOPerformanceChart';
import { BulkURLResultTable } from './BulkURLResultTable';

interface ToolResultProps {
  tool: Tool;
  result: string;
  reportRef: React.RefObject<HTMLDivElement | null>;
  handlePrint: () => void;
  handleDownloadPDF: () => void;
  handleCopy: () => void;
  handleClear: () => void;
  handleShare: (platform: any) => void;
  isDownloading: boolean;
  isGeneratingPDF: boolean;
  copied: boolean;
  showShareMenu: boolean;
  setShowShareMenu: (show: boolean) => void;
}

export const ToolResult = React.memo(({
  tool,
  result,
  reportRef,
  handlePrint,
  handleDownloadPDF,
  handleCopy,
  handleClear,
  handleShare,
  isDownloading,
  isGeneratingPDF,
  copied,
  showShareMenu,
  setShowShareMenu,
}: ToolResultProps) => {
  const isContentOptimizer = tool.id === 'content-optimizer';

  const metrics = useMemo(() => {
    if (!isContentOptimizer || !result) return null;

    const readabilityMatch = result.match(/Score:\s*(\d+)/i) || result.match(/Readability Score:\s*(\d+)/i);
    const overallStatusMatch = result.match(/SEO Content Status\n?\[?(GOOD|AVERAGE|POOR)\]?/i) || result.match(/\[(GOOD|AVERAGE|POOR)\]/i);
    const keywordDensityMatch = result.match(/Density:\s*\[?([\d.]+%?)\]?\s*\[?(GOOD|AVERAGE|POOR)\]?/i);

    return {
      readability: readabilityMatch ? parseInt(readabilityMatch[1]) : null,
      status: overallStatusMatch ? overallStatusMatch[1].toUpperCase() as 'GOOD' | 'AVERAGE' | 'POOR' : null,
      density: keywordDensityMatch ? keywordDensityMatch[1] : null,
      densityStatus: keywordDensityMatch ? keywordDensityMatch[2].toUpperCase() as 'GOOD' | 'AVERAGE' | 'POOR' : null,
    };
  }, [isContentOptimizer, result]);

  return (
    <div ref={reportRef} className={cn("space-y-8 print:space-y-4", isGeneratingPDF && "p-12 bg-white dark:bg-slate-900")}>
      {isGeneratingPDF && (
        <div className="mb-12 border-b-4 border-indigo-600 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white">
              <Icons.Zap size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">AI SEO Score Suite</h1>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm">{tool?.name} Analysis Report</p>
            </div>
          </div>
          <div className="flex justify-between items-end mt-6">
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium italic">"Empowering your digital presence with AI-driven insights."</p>
            <div className="text-right">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden", isGeneratingPDF && "hidden")}>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Analysis Report</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 relative">
          <button 
            onClick={handlePrint}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-[10px] sm:text-xs font-medium"
          >
            <Icons.Printer size={14} />
            <span className="hidden xs:inline">Print</span>
          </button>

          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-[10px] sm:text-xs font-medium disabled:opacity-50"
          >
            {isDownloading ? (
              <Icons.Loader2 size={14} className="animate-spin" />
            ) : (
              <Icons.Download size={14} />
            )}
            <span className="hidden xs:inline">PDF</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-[10px] sm:text-xs font-medium"
            >
              <Icons.Share2 size={14} />
              <span className="hidden xs:inline">Share</span>
            </button>
            
            <AnimatePresence>
              {showShareMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowShareMenu(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 z-50 overflow-hidden"
                  >
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left"
                    >
                      <Icons.Twitter size={16} />
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left"
                    >
                      <Icons.Linkedin size={16} />
                      LinkedIn
                    </button>
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left"
                    >
                      <Icons.Facebook size={16} />
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('email')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left"
                    >
                      <Icons.Mail size={16} />
                      Email
                    </button>
                    <button 
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left border-t border-slate-50 dark:border-slate-700 mt-1 pt-1"
                    >
                      <Icons.Link size={16} />
                      Copy Link
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-medium shadow-sm",
              copied ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            {copied ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
            {copied ? "Copied!" : "Copy Report"}
          </button>

          <button 
            onClick={handleClear}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800 transition-all flex items-center gap-2 text-[10px] sm:text-xs font-medium"
          >
            <Icons.Trash2 size={14} />
            <span className="hidden xs:inline">Clear</span>
          </button>
        </div>
      </div>

      {metrics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
              <Icons.BookOpen size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Readability</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{metrics.readability || 'N/A'}<span className="text-sm text-slate-400">/100</span></h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${metrics.readability || 0}%` }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-emerald-200 dark:hover:border-emerald-900 transition-all">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
              <Icons.ShieldCheck size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">SEO Status</p>
            <h3 className={cn(
              "text-2xl font-black uppercase tracking-tight",
              metrics.status === 'GOOD' ? "text-emerald-600" : metrics.status === 'AVERAGE' ? "text-amber-600" : "text-rose-600"
            )}>
              {metrics.status || 'PENDING'}
            </h3>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Overall Content Health</p>
          </div>

          <div className={cn(
            "bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group transition-all",
            metrics.densityStatus === 'GOOD' ? "hover:border-emerald-200 dark:hover:border-emerald-900" :
            metrics.densityStatus === 'AVERAGE' ? "hover:border-amber-200 dark:hover:border-amber-900" :
            metrics.densityStatus === 'POOR' ? "hover:border-rose-200 dark:hover:border-rose-900" :
            "hover:border-indigo-200 dark:hover:border-indigo-900"
          )}>
            <div className={cn(
              "p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform",
              metrics.densityStatus === 'GOOD' ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
              metrics.densityStatus === 'AVERAGE' ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
              metrics.densityStatus === 'POOR' ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" :
              "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            )}>
              <Icons.Target size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Keyword Density</p>
            <h3 className={cn(
               "text-2xl font-black",
               metrics.densityStatus === 'GOOD' ? "text-emerald-600" :
               metrics.densityStatus === 'AVERAGE' ? "text-amber-600" :
               metrics.densityStatus === 'POOR' ? "text-rose-600" :
               "text-slate-900 dark:text-white"
            )}>
              {metrics.density || 'N/A'}
            </h3>
            {metrics.densityStatus && (
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest mt-1",
                metrics.densityStatus === 'GOOD' ? "text-emerald-500" : metrics.densityStatus === 'AVERAGE' ? "text-amber-500" : "text-rose-500"
              )}>
                {metrics.densityStatus}
              </span>
            )}
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Primary Keyword Focus</p>
          </div>
        </motion.div>
      )}

      {result.split(/(?=## )/g).filter(s => s.trim()).map((section, index) => {
        const isHeader = section.startsWith('## ');
        const content = isHeader ? section.replace(/^## .*\n?/, '') : section;
        const title = isHeader ? section.match(/^## (.*)/)?.[1] : 'Analysis Result';
        
        const titleLower = title?.toLowerCase() || '';
        const isScore = titleLower.includes('score');
        const isSummary = titleLower.includes('summary') || titleLower.includes('overview');
        const isAction = titleLower.includes('action') || titleLower.includes('steps') || titleLower.includes('guide');
        const isFindings = titleLower.includes('findings') || titleLower.includes('status') || titleLower.includes('audit');
        const isTechnical = titleLower.includes('code') || titleLower.includes('snippet') || titleLower.includes('markup');
        const isLinking = titleLower.includes('linking') || titleLower.includes('internal');
        const isCoreWebVitals = titleLower.includes('core web vitals');
        const isRelatedKeywords = titleLower.includes('related keywords');
        const isEasyWins = titleLower.includes('easy win');
        const isNextSteps = titleLower.includes('next steps');
        const isChecklist = titleLower.includes('checklist') || titleLower.includes('tasks') || titleLower.includes('fixes') || titleLower.includes('optimization') || titleLower.includes('structure') || titleLower.includes('tags');

        const getHeaderIcon = () => {
          if (isScore) return <Icons.Trophy className="text-amber-500" size={22} />;
          if (isCoreWebVitals) return <Icons.Activity className="text-indigo-500" size={22} />;
          if (isSummary) return <Icons.FileText className="text-blue-500" size={22} />;
          if (isAction || isChecklist) return <Icons.ClipboardCheck className="text-indigo-500" size={22} />;
          if (isFindings) return <Icons.Search className="text-emerald-500" size={22} />;
          if (isTechnical) return <Icons.Code className="text-purple-500" size={22} />;
          if (isLinking) return <Icons.Link className="text-blue-600" size={22} />;
          if (isRelatedKeywords) return <Icons.Target className="text-amber-600" size={22} />;
          if (isEasyWins) return <Icons.Zap className="text-indigo-500" size={22} />;
          if (isNextSteps) return <Icons.ArrowRightCircle className="text-indigo-600" size={22} />;
          return <Icons.ChevronRight className="text-slate-400" size={22} />;
        };

        const getAccentColor = () => {
          if (isScore) return "border-l-amber-500";
          if (isCoreWebVitals) return "border-l-indigo-500";
          if (isSummary) return "border-l-blue-500";
          if (isAction || isChecklist) return "border-l-indigo-500";
          if (isFindings) return "border-l-emerald-500";
          if (isTechnical) return "border-l-purple-500";
          if (isLinking) return "border-l-blue-600";
          if (isRelatedKeywords) return "border-l-amber-600";
          if (isEasyWins) return "border-l-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/5";
          if (isNextSteps) return "border-l-indigo-600 bg-indigo-50/20 dark:bg-indigo-900/10";
          return "border-l-slate-300";
        };

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            className={cn(
              "bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-l-4 overflow-hidden print:shadow-none print:border-slate-100 group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800",
              getAccentColor(),
              isScore && "bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-900/10 border-amber-200 dark:border-amber-800 border-l-amber-500"
            )}
          >
            <div className={cn(
              "px-5 sm:px-8 py-3 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300",
              isScore ? "bg-amber-50/50 dark:bg-amber-900/20" : "bg-slate-50/50 dark:bg-slate-800/50"
            )}>
              <h2 className={cn(
                "text-base sm:text-xl font-extrabold flex items-center gap-2 sm:gap-3 tracking-tight",
                isScore ? "text-amber-900 dark:text-amber-100" : "text-slate-900 dark:text-slate-100"
              )}>
                <div className="shrink-0">
                  {getHeaderIcon()}
                </div>
                <span className="truncate">{title}</span>
              </h2>
            </div>
            <div className={cn(
              "p-4 sm:p-8 markdown-body transition-colors duration-300",
              isTechnical && "bg-slate-900 dark:bg-black text-slate-100"
            )}>
              {isScore ? (
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-4">
                  {(() => {
                    const score = parseInt(content.match(/\d+/)?.[0] || '0');
                    const colorClass = score >= 90 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : score >= 50 ? "text-orange-500" : "text-rose-500";
                    const borderClass = score >= 90 ? "border-emerald-100 dark:border-emerald-900/40" : score >= 70 ? "border-amber-100 dark:border-amber-900/40" : score >= 50 ? "border-orange-100 dark:border-orange-900/40" : "border-rose-100 dark:border-rose-900/40";
                    const shadowClass = score >= 90 ? "shadow-emerald-200/50 dark:shadow-emerald-900/20" : score >= 70 ? "shadow-amber-200/50 dark:shadow-amber-900/20" : score >= 50 ? "shadow-orange-200/50 dark:shadow-orange-900/20" : "shadow-rose-200/50 dark:shadow-rose-900/20";
                    
                    return (
                      <div className={cn("relative w-28 h-28 sm:w-48 sm:h-48 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border-[6px] sm:border-[12px] shadow-2xl transition-all duration-1000", borderClass, shadowClass)}>
                        <div className="text-center">
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn("text-4xl sm:text-7xl font-black block leading-none tracking-tighter", colorClass)}
                          >
                            {score || '0'}
                          </motion.span>
                          <span className={cn("text-[8px] sm:text-xs font-black uppercase tracking-widest mt-1 block opacity-60", colorClass)}>Score</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex-grow text-center md:text-left">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="text-lg sm:text-2xl text-slate-800 dark:text-slate-100 font-extrabold leading-tight mb-4 tracking-tight">{children}</p>
                      }}
                    >
                      {content.replace(/\d+/, '').trim()}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : isCoreWebVitals ? (
                <div className="space-y-8">
                  <CoreWebVitalsUI content={content} />
                  {tool.id === 'site-speed' && (
                    <PerformanceBenchmarkChart 
                      currentSpeed={(() => {
                        const lcpMatch = content.match(/LCP:\s*([\d.]+)/i);
                        return lcpMatch ? parseFloat(lcpMatch[1]) : 2.4;
                      })()} 
                      industryAvg={3.1} 
                    />
                  )}
                </div>
              ) : tool.id === 'bulk-url' && title.toLowerCase().includes('table') ? (
                <BulkURLResultTable content={content} />
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => {
                      if (typeof children === 'string') {
                        return <p className="mb-5 leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{renderMarkdownContent(children)}</p>;
                      }
                      return <p className="mb-5 leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{children}</p>;
                    },
                    li: ({ children }) => {
                      const text = React.Children.toArray(children).join('');
                      // Match pattern: [Anchor] -> tool-id | Reason | Source Sentence
                      const linkMatch = text.match(/\[(.*?)\]\s*->\s*([a-z0-9-]+)(?:\s*\|\s*([^|]*))(?:\s*\|\s*(.*))?/i) || 
                                       text.match(/"(.*?)"\s*->\s*([a-z0-9-]+)(?:\s*\|\s*([^|]*))(?:\s*\|\s*(.*))?/i);
                      
                      if (isLinking && linkMatch) {
                        const anchorText = linkMatch[1];
                        const toolId = linkMatch[2];
                        const reason = linkMatch[3];
                        const sourceSentence = linkMatch[4];

                        const getToolPath = (tid: string) => {
                          if (tid === 'resources') return '/resources';
                          if (tid.startsWith('blog-')) return `/blog/${tid.replace('blog-', '')}`;
                          const tool = TOOLS.find(t => t.id === tid);
                          if (tool) return `/tools/${tool.slug}`;
                          return `/tool/${tid}`;
                        };

                        return (
                          <li className="mb-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 flex flex-col gap-4 group/link">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                                  <Icons.Link size={16} />
                                </div>
                                <div>
                                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Anchor: <span className="text-indigo-600 dark:text-indigo-400">"{anchorText}"</span>
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                                      Target ID: {toolId}
                                    </span>
                                    {reason && (
                                      <>
                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{reason}</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Link 
                                to={getToolPath(toolId)}
                                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                              >
                                Open Tool <Icons.ExternalLink size={14} />
                              </Link>
                            </div>
                            
                            {sourceSentence && (
                              <div className="mt-2 p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-indigo-50 dark:border-indigo-900/30">
                                <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-1">Contextual Placement</p>
                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
                                  <ReactMarkdown
                                    components={{
                                      p: ({ children }) => <p className="m-0">{children}</p>,
                                      strong: ({ children }) => (
                                        <Link 
                                          to={getToolPath(toolId)}
                                          className="text-indigo-600 dark:text-indigo-400 font-black not-italic hover:underline decoration-2 underline-offset-4"
                                          title={`Open ${toolId} tool`}
                                        >
                                          {children}
                                        </Link>
                                      )
                                    }}
                                  >
                                    {sourceSentence}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li className={cn(
                          "mb-4 text-slate-600 dark:text-slate-400 flex items-start gap-3 sm:gap-4",
                          (isAction || isChecklist) && "p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                        )}>
                          {(isAction || isChecklist) ? (
                            <div className="mt-1 p-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                              <Icons.CircleCheckBig size={16} />
                            </div>
                          ) : (
                            <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                          )}
                          <div className="flex-grow font-medium text-sm sm:text-base">{children}</div>
                        </li>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <table className="w-full border-collapse">{children}</table>
                      </div>
                    ),
                    td: ({ children }) => <td className="border border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">{children}</td>,
                    th: ({ children }) => <th className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-left">{children}</th>,
                    h3: ({ children }) => <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2">{children}</h3>,
                    code: ({ children, className, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <pre className="p-4 sm:p-6 bg-slate-900 dark:bg-black text-slate-100 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 dark:border-slate-700 shadow-inner">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-indigo-300 rounded font-mono text-xs sm:text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>
          </motion.div>
        );
      })}

      {isGeneratingPDF && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">© 2026 AI SEO Score Suite • All Rights Reserved</p>
          <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black mt-1 tracking-widest">WWW.SEO-SCORE-SUITE.COM</p>
        </div>
      )}
    </div>
  );
});
