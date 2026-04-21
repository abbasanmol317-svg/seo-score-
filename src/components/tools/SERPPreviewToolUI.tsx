import React, { useState, useEffect } from 'react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { SERPPreview } from './SERPPreview';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { ToolPlaceholder } from './ToolPlaceholder';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';

export const SERPPreviewToolUI: React.FC<ToolComponentProps> = (props) => {
  const { tool, input, setInput, handleRun, handleClear, result, loading, error, loadingMessage, progress, currentTip } = props;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [siteName, setSiteName] = useState('SEO Score');
  const [siteUrl, setSiteUrl] = useState('https://seoscore.site');
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');

  // Parse result to populate fields
  useEffect(() => {
    if (result) {
      const titleMatch = result.match(/## 🖥️ Desktop Preview\n(.*?)\n/s) || result.match(/Optimized Title:\s*(.*)/i);
      const descMatch = result.match(/## 📱 Mobile Preview\n(.*?)\n/s) || result.match(/Optimized Description:\s*(.*)/i);
      
      if (titleMatch?.[1]) setTitle(titleMatch[1].trim());
      if (descMatch?.[1]) setDescription(descMatch[1].trim());
      
      try {
        const url = new URL(input.includes('://') ? input : `https://${input}`);
        setSiteUrl(url.hostname + url.pathname);
      } catch (e) {
        setSiteUrl(input);
      }
    }
  }, [result, input]);

  const onClear = () => {
    setTitle('');
    setDescription('');
    setSiteName('SEO Score');
    setSiteUrl('https://seoscore.site');
    handleClear();
  };

  return (
    <ToolLayout
      inputSection={
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Icons.Monitor size={240} />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-3">
                    <Icons.Eye size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      SERP <span className="text-indigo-600">Simulator</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Live Google Search Preview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-80">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icons.Link size={16} />
                    </div>
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter URL to fetch tags..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-slate-200"
                    />
                  </div>
                  <button
                    onClick={() => handleRun()}
                    disabled={loading || !input.trim()}
                    className={cn(
                      "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-xl disabled:opacity-50",
                      loading 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                    )}
                  >
                    {loading ? "Analyzing..." : "Auto-Fetch"}
                  </button>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                Visualize how your website appears in Google search results. Enter a URL to auto-populate the fields or type manually to fine-tune your results for maximum CTR.
              </p>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <SERPPreview 
                  title={title}
                  description={description}
                  siteName={siteName}
                  siteUrl={siteUrl}
                  mode={mode}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onSiteNameChange={setSiteName}
                  onSiteUrlChange={setSiteUrl}
                  onModeChange={setMode}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                 <button 
                  onClick={onClear}
                  className="px-6 py-3 text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] transition-colors"
                >
                  Clear Fields
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    Real-time Updates Enabled
                  </span>
                  <Icons.Sparkles size={14} className="text-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
          handleRun={() => handleRun()}
          handleClear={handleClear}
        />
      }
      result={null}
    />
  );
};

// Add cn helper import
import { cn } from '../../lib/utils';
