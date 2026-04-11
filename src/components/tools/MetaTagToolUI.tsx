import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolPlaceholder } from './ToolPlaceholder';
import { cn } from '../../lib/utils';

const ToolResult = lazy(() => import('./ToolResult').then(m => ({ default: m.ToolResult })));

export const MetaTagToolUI: React.FC<ToolComponentProps> = (props) => {
  const {
    tool,
    input,
    setInput,
    result,
    loading,
    error,
    handleRun,
    handleClear,
    handleCopy,
    handlePrint,
    handleDownloadPDF,
    isDownloading,
    isGeneratingPDF,
    copied,
    showShareMenu,
    setShowShareMenu,
    handleShare,
    reportRef,
    loadingMessage,
    progress,
    currentTip,
  } = props;

  // Extract title and description from the result if possible for a preview
  const titleMatch = result.match(/## 🏷️ Title Tag\n(.*?)(?=\n##|$)/s);
  const descMatch = result.match(/## 📝 Meta Description\n(.*?)(?=\n##|$)/s);
  const boostedMatch = result.match(/## 🚀 High-CTR "Boosted" Versions?\n(.*?)(?=\n##|$)/s);
  const ctrMatch = result.match(/## 📈 CTR Analysis & Suggestions\n(.*?)(?=\n##|$)/s);
  const codeMatch = result.match(/## 💻 Code Snippet\n```(?:html)?\n([\s\S]*?)\n```/s);

  const title = titleMatch ? titleMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  const description = descMatch ? descMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  
  const boostedText = boostedMatch ? boostedMatch[1].trim() : '';
  
  // Parse variations
  const variations = boostedText.split(/### Variation \d+:/).filter(v => v.trim().length > 0).map(v => {
    const tMatch = v.match(/- Title: (.*?)(?=\n- Description:|$)/s);
    const dMatch = v.match(/- Description: (.*?)(?=\n|$)/s);
    
    // Fallback for old format if regex fails
    if (!tMatch && !dMatch) {
      const oldTitleMatch = v.match(/### Title\n(.*?)(?=\n###|$)/s);
      const oldDescMatch = v.match(/### Description\n(.*?)(?=\n###|$)/s);
      return {
        title: oldTitleMatch ? oldTitleMatch[1].trim() : '',
        description: oldDescMatch ? oldDescMatch[1].trim() : v.trim()
      };
    }

    return {
      title: tMatch ? tMatch[1].trim() : '',
      description: dMatch ? dMatch[1].trim() : ''
    };
  }).filter(v => v.title || v.description);

  const ctrAnalysis = ctrMatch ? ctrMatch[1].trim() : '';
  const codeSnippet = codeMatch ? codeMatch[1].trim() : '';

  // Google Search Preview Truncation
  const [showBoosted, setShowBoosted] = React.useState(false);
  const [selectedVariation, setSelectedVariation] = React.useState(0);
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [siteName, setSiteName] = React.useState('SEO Score Suite');
  const [siteUrl, setSiteUrl] = React.useState('https://seo-score-suite.com');

  const currentTitle = showBoosted && variations.length > 0 
    ? variations[selectedVariation]?.title || title 
    : title;
  const currentDescription = showBoosted && variations.length > 0 
    ? variations[selectedVariation]?.description || description 
    : description;

  const previewTitle = currentTitle.length > 60 ? currentTitle.substring(0, 57) + '...' : currentTitle;
  const previewDescription = currentDescription.length > 160 ? currentDescription.substring(0, 157) + '...' : currentDescription;

  const [copiedCode, setCopiedCode] = React.useState(false);

  const handleCopyCode = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <ToolLayout
      inputSection={
        <ToolInput
          tool={tool}
          input={input}
          setInput={setInput}
          handleRun={handleRun}
          handleClear={handleClear}
          loading={loading}
        />
      }
      loading={loading}
      loadingSection={
        <ToolLoading
          loadingMessage={loadingMessage}
          progress={progress}
          currentTip={currentTip}
        />
      }
      error={error}
      errorSection={
        <ToolError
          error={error || ''}
          handleRun={handleRun}
          handleClear={handleClear}
        />
      }
      result={result}
      resultSection={
        <div className="space-y-8">
          <Suspense fallback={<div className="h-96 animate-pulse bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800" />}>
            <ToolResult
              tool={tool}
              result={result}
              reportRef={reportRef}
              handlePrint={handlePrint}
              handleDownloadPDF={handleDownloadPDF}
              handleCopy={handleCopy}
              handleShare={handleShare}
              isDownloading={isDownloading}
              isGeneratingPDF={isGeneratingPDF}
              copied={copied}
              showShareMenu={showShareMenu}
              setShowShareMenu={setShowShareMenu}
            />
          </Suspense>
          
          {result && (title || description || codeSnippet) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mt-8 p-4 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group print:hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
                    <Icons.Search size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Google Search Preview</h3>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                        previewMode === 'desktop' 
                          ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                      )}
                    >
                      <Icons.Monitor size={12} />
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                        previewMode === 'mobile' 
                          ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                      )}
                    >
                      <Icons.Smartphone size={12} />
                      Mobile
                    </button>
                  </div>

                  {variations.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button
                          onClick={() => setShowBoosted(false)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                            !showBoosted 
                              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          )}
                        >
                          Standard
                        </button>
                        <button
                          onClick={() => setShowBoosted(true)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                            showBoosted 
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          )}
                        >
                          <Icons.Zap size={10} className={showBoosted ? "text-white" : "text-indigo-500"} />
                          Boosted
                        </button>
                      </div>
                      
                      {showBoosted && variations.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5">
                          {variations.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedVariation(idx)}
                              className={cn(
                                "w-6 h-1.5 rounded-full transition-all",
                                selectedVariation === idx 
                                  ? "bg-indigo-600 w-8" 
                                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                              )}
                              title={`Variation ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {codeSnippet && (
                  <button
                    onClick={handleCopyCode}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg",
                      copiedCode ? "bg-emerald-500 text-white" : "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700"
                    )}
                  >
                    {copiedCode ? <Icons.Check size={18} /> : <Icons.Code size={18} />}
                    {copiedCode ? "Code Copied!" : "Copy Meta Tags Code"}
                  </button>
                )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Site Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icons.Type size={14} />
                    </div>
                    <input 
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="e.g. My Awesome Site"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Site URL</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icons.Link size={14} />
                    </div>
                    <input 
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="e.g. https://example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className={cn(
                "bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner relative overflow-hidden transition-all duration-500",
                previewMode === 'mobile' ? "max-w-[400px] mx-auto" : "w-full"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  {previewMode === 'desktop' ? <Icons.Monitor size={120} /> : <Icons.Smartphone size={120} />}
                </div>

                {showBoosted && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                      <Icons.Zap size={10} />
                      High-CTR Mode
                    </div>
                  </div>
                )}
                
                <div className="relative z-10 font-sans">
                  {/* Modern Google SERP Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                      <Icons.Globe size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{siteName}</span>
                        <Icons.ChevronDown size={12} className="text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{siteUrl}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className={cn(
                    "text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 leading-tight",
                    previewMode === 'mobile' ? "text-lg" : "text-xl font-medium"
                  )}>
                    {previewTitle || 'Your Page Title Will Appear Here'}
                  </div>

                  {/* Description */}
                  <div className="text-[#4d5156] dark:text-[#bdc1c6] text-sm leading-relaxed line-clamp-2">
                    {previewDescription || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.'}
                  </div>
                </div>
              </div>

              {ctrAnalysis && (
                <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                      <Icons.TrendingUp size={16} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">CTR Booster Suggestions</h4>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ctrAnalysis.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d\./.test(line.trim())).map((suggestion, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <div className="mt-1 text-indigo-600 dark:text-indigo-400">
                            <Icons.Zap size={14} />
                          </div>
                          <p className="text-xs font-medium leading-relaxed">
                            {suggestion.replace(/^[-*]\s*|^\d\.\s*/, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                    {!ctrAnalysis.includes('-') && !ctrAnalysis.includes('*') && !/^\d\./.test(ctrAnalysis) && (
                      <p className="text-xs leading-relaxed">{ctrAnalysis}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                    currentTitle.length > 60 || currentTitle.length < 30 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        currentTitle.length > 60 || currentTitle.length < 30 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (currentTitle.length / 60) * 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title Length</span>
                    <span className={cn(
                      "text-xs font-bold",
                      currentTitle.length > 60 || currentTitle.length < 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {currentTitle.length}/60 chars
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                    currentDescription.length > 160 || currentDescription.length < 120 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        currentDescription.length > 160 || currentDescription.length < 120 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (currentDescription.length / 160) * 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description Length</span>
                    <span className={cn(
                      "text-xs font-bold",
                      currentDescription.length > 160 || currentDescription.length < 120 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {currentDescription.length}/160 chars
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      }
      placeholderSection={<ToolPlaceholder tool={tool} />}
    />
  );
};
