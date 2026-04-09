import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolResult } from './ToolResult';
import { ToolPlaceholder } from './ToolPlaceholder';
import { cn } from '../../lib/utils';

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
  const codeMatch = result.match(/## 💻 Code Snippet\n```(?:html)?\n([\s\S]*?)\n```/s);

  const title = titleMatch ? titleMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  const description = descMatch ? descMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  const codeSnippet = codeMatch ? codeMatch[1].trim() : '';

  // Google Search Preview Truncation
  const previewTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const previewDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;

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

              <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  <Icons.Globe size={120} />
                </div>
                
                <div className="max-w-[600px] relative z-10">
                  <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl font-medium hover:underline cursor-pointer mb-1">
                    {previewTitle || 'Your Page Title Will Appear Here'}
                  </div>
                  <div className="text-[#006621] dark:text-[#34a853] text-sm mb-1 flex items-center gap-1">
                    <span>https://yourwebsite.com</span>
                    <Icons.ChevronDown size={12} />
                  </div>
                  <div className="text-[#4d5156] dark:text-[#bdc1c6] text-sm leading-relaxed">
                    {previewDescription || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.'}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                    title.length > 60 || title.length < 30 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        title.length > 60 || title.length < 30 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title Length</span>
                    <span className={cn(
                      "text-xs font-bold",
                      title.length > 60 || title.length < 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {title.length}/60 chars
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                    description.length > 160 || description.length < 120 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                  )}>
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        description.length > 160 || description.length < 120 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description Length</span>
                    <span className={cn(
                      "text-xs font-bold",
                      description.length > 160 || description.length < 120 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                      {description.length}/160 chars
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
