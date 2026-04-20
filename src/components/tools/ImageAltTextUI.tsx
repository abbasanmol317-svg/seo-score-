import React, { useState, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolPlaceholder } from './ToolPlaceholder';
import { cn } from '../../lib/utils';

const ToolResult = lazy(() => import('./ToolResult').then(m => ({ default: m.ToolResult })));

export const ImageAltTextUI: React.FC<ToolComponentProps> = (props) => {
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

  const [sampleImage, setSampleImage] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<'primary' | 'decorative' | 'informational' | 'functional'>('primary');
  const [previewContext, setPreviewContext] = useState<'standard' | 'article' | 'social' | 'code'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeImage = () => {
    if (sampleImage) {
      handleRun(sampleImage);
    }
  };

  // Extract alt text variations from markdown result
  const getAltTextVariations = (text: string) => {
    const primaryMatch = text.match(/## 🖼️ Primary Alt Text\n(.*?)(?=\n##|$)/s);
    const variationsMatch = text.match(/## 💡 Contextual Variations\n(.*?)(?=\n##|$)/s);
    
    const variationsText = variationsMatch ? variationsMatch[1] : '';
    
    const parseVariation = (type: string) => {
      const match = variationsText.match(new RegExp(`- \\*\\*${type}:\\*\\* (.*?)(?=\\n-|$)`, 's'));
      if (!match) return { text: '', tip: '' };
      
      const fullText = match[1].trim();
      const tipMatch = fullText.match(/\*\*SEO Tip\*\*:\s*(.*)/i);
      
      if (tipMatch) {
        return {
          text: fullText.replace(/\*\*SEO Tip\*\*:\s*.*/i, '').trim(),
          tip: tipMatch[1].trim()
        };
      }
      
      return { text: fullText, tip: '' };
    };

    const bestPracticesMatch = text.match(/## 🛠️ Best Practices Applied\n(.*?)(?=\n##|$)/s);

    return {
      primary: primaryMatch ? primaryMatch[1].trim() : '',
      decorative: parseVariation('Decorative'),
      informational: parseVariation('Informational'),
      functional: parseVariation('Functional'),
      bestPractices: bestPracticesMatch ? bestPracticesMatch[1].trim() : '',
    };
  };

  const variations = result ? getAltTextVariations(result) : { 
    primary: '', 
    decorative: { text: '', tip: '' }, 
    informational: { text: '', tip: '' }, 
    functional: { text: '', tip: '' }, 
    bestPractices: '' 
  };
  
  const currentAltText = typeof variations[selectedVariation] === 'object' 
    ? (variations[selectedVariation] as any).text 
    : variations[selectedVariation];

  const [expandedVariation, setExpandedVariation] = useState<string | null>('primary');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSampleImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window && currentAltText) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(currentAltText);
      window.speechSynthesis.speak(utterance);
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
              handleClear={handleClear}
              handleShare={handleShare}
              isDownloading={isDownloading}
              isGeneratingPDF={isGeneratingPDF}
              copied={copied}
              showShareMenu={showShareMenu}
              setShowShareMenu={setShowShareMenu}
            />
          </Suspense>

          {/* Structured Alt Text Variations */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
                <Icons.Layers size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Optimized Alt Text Options</h3>
            </div>

            <div className="grid gap-4">
              {/* Primary Alt Text - Featured Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 overflow-hidden"
              >
                <div className="bg-indigo-500 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Icons.Star size={16} fill="currentColor" />
                    <span className="text-xs font-black uppercase tracking-widest">Recommended Primary Alt Text</span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(variations.primary);
                      // You could add a local toast here if needed
                    }}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                    title="Copy Primary Alt Text"
                  >
                    <Icons.Copy size={14} />
                  </button>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight italic">
                    "{variations.primary}"
                  </p>
                </div>
              </motion.div>

              {/* Variations - Collapsible Sections */}
              {(['decorative', 'informational', 'functional'] as const).map((type) => {
                const isExpanded = expandedVariation === type;
                const variationData = variations[type] as { text: string; tip: string };
                const content = variationData.text;
                const tip = variationData.tip;
                
                if (!content) return null;

                const getIcon = () => {
                  if (type === 'decorative') return <Icons.Palette size={18} />;
                  if (type === 'informational') return <Icons.Info size={18} />;
                  return <Icons.MousePointer2 size={18} />;
                };

                const getColor = () => {
                  if (type === 'decorative') return "text-pink-500 bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800";
                  if (type === 'informational') return "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800";
                  return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800";
                };

                const getBadge = () => {
                  if (type === 'decorative') return "WCAG: Null Alt";
                  if (type === 'informational') return "SEO: Keyword Rich";
                  return "UX: Action Oriented";
                };

                return (
                  <div key={type} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                    <button 
                      onClick={() => setExpandedVariation(isExpanded ? null : type)}
                      className="w-full px-6 py-4 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110 border", getColor())}>
                          {getIcon()}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{type} Variation</h4>
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md", getColor())}>
                              {getBadge()}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                            {type === 'decorative' ? 'For aesthetic elements' : type === 'informational' ? 'For core content delivery' : 'For interactive elements'}
                          </p>
                        </div>
                      </div>
                      <Icons.ChevronDown size={20} className={cn("text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 relative group/content">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed pr-8">
                                "{content}"
                              </p>
                              {tip && (
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2">
                                  <Icons.Lightbulb size={12} className="text-amber-500 mt-0.5 shrink-0" />
                                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                    <span className="text-amber-600 dark:text-amber-400 uppercase tracking-widest mr-1">SEO Tip:</span>
                                    {tip}
                                  </p>
                                </div>
                              )}
                              <button 
                                onClick={() => navigator.clipboard.writeText(content)}
                                className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg opacity-0 group-hover/content:opacity-100 transition-all shadow-sm"
                                title="Copy this variation"
                              >
                                <Icons.Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {variations.bestPractices && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50/30 dark:bg-emerald-900/10 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-800/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
                  <Icons.CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Best Practices Applied</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {variations.bestPractices.split('\n').filter(line => line.trim().startsWith('-')).map((practice, idx) => {
                  const cleanedLine = practice.replace(/^-\s*\*\*/, '').replace(/\*\*$/, '');
                  const [title, desc] = cleanedLine.includes('**: ') 
                    ? cleanedLine.split('**: ') 
                    : [cleanedLine, ''];
                  
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center group-hover:scale-125 transition-transform">
                          <Icons.Check size={12} className="text-emerald-600 dark:text-emerald-400" strokeWidth={4} />
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{title}</p>
                        {desc && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {/* Live Preview Feature */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-[2.5rem] p-8 sm:p-12 border border-indigo-100 dark:border-indigo-800/50 shadow-xl print:hidden"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                <Icons.Eye size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Live Preview & Simulation</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">See how your alt text looks and sounds in the real world.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Upload Section */}
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-4 border-dashed rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-500",
                    sampleImage 
                      ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-900/10" 
                      : "border-slate-200 hover:border-indigo-400 bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10"
                  )}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icons.Upload className="text-indigo-600 dark:text-indigo-400" size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        {sampleImage ? "Change Sample Image" : "Upload Sample Image"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Drag and drop or click to browse</p>
                    </div>
                    {sampleImage && !loading && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyzeImage();
                        }}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
                      >
                        Analyze This Image
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {sampleImage && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl space-y-8"
                    >
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Icons.Layout size={16} className="text-indigo-600" />
                          Simulated Context
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'standard', label: 'Standard', icon: <Icons.Layout size={14} /> },
                            { id: 'article', label: 'Article', icon: <Icons.FileText size={14} /> },
                            { id: 'social', label: 'Social Post', icon: <Icons.Share2 size={14} /> },
                            { id: 'code', label: 'HTML Code', icon: <Icons.Code size={14} /> },
                          ].map((ctx) => (
                            <button
                              key={ctx.id}
                              onClick={() => setPreviewContext(ctx.id as any)}
                              className={cn(
                                "flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                                previewContext === ctx.id
                                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 shadow-sm"
                                  : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                              )}
                            >
                              {ctx.icon}
                              {ctx.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Icons.Type size={16} className="text-indigo-600" />
                          Select Variation
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(['primary', 'decorative', 'informational', 'functional'] as const).map((v) => (
                            <button
                              key={v}
                              onClick={() => setSelectedVariation(v)}
                              disabled={!variations[v]}
                              className={cn(
                                "px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2",
                                selectedVariation === v
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                                  : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800",
                                !variations[v] && "opacity-30 cursor-not-allowed"
                              )}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Icons.Settings size={16} className="text-indigo-600" />
                          Simulation Controls
                        </h4>
                        <button 
                          onClick={handleReadAloud}
                          aria-label="Simulate screen reader reading alt text"
                          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95"
                        >
                          <Icons.Volume2 size={20} />
                          Simulate Screen Reader
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview Section */}
              <div className="relative group">
                {!sampleImage ? (
                  <div className="aspect-video bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-400 border-2 border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icons.Image size={40} className="opacity-20" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Upload an image to see the preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={cn(
                      "relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 transition-all duration-500",
                      previewContext === 'article' && "max-w-md mx-auto bg-white dark:bg-slate-900 p-8",
                      previewContext === 'social' && "max-w-sm mx-auto bg-slate-100 dark:bg-slate-950 p-4 pb-20",
                      previewContext === 'code' && "bg-slate-900 p-6 font-mono text-[10px]"
                    )}>
                      {previewContext === 'standard' && (
                        <div className="group/img bg-slate-100 dark:bg-slate-900 min-h-[200px] flex items-center justify-center">
                          <img 
                            src={sampleImage} 
                            alt={currentAltText} 
                            className="w-full h-auto block transition-transform duration-700 group-hover/img:scale-105"
                            title={currentAltText}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-end p-6 sm:p-8">
                            <motion.div 
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 w-full shadow-2xl"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Previewing: {selectedVariation}</p>
                                <Icons.Accessibility size={14} className="text-white/60" />
                              </div>
                              <p className="text-white text-lg font-bold italic leading-tight">"{currentAltText || 'No text for this variation'}"</p>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {previewContext === 'article' && (
                        <div className="space-y-6">
                          <header className="space-y-2">
                            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
                            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg w-2/3" />
                          </header>
                          <div className="flex items-center gap-3 py-2 border-y border-slate-100 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <div className="space-y-1">
                              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-16" />
                            </div>
                          </div>
                          <div className="py-4 space-y-4">
                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-full" />
                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-full" />
                            <div className="relative group/article-img pt-2">
                              <img 
                                src={sampleImage} 
                                alt={currentAltText} 
                                className="w-full h-auto rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-transform duration-500 group-hover/article-img:scale-[1.02]"
                                loading="lazy"
                              />
                              <div className="mt-3 px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 flex items-start gap-2">
                                <Icons.Info size={12} className="text-indigo-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                                  <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mr-1 not-italic">Figure 1.1:</span>
                                  {currentAltText || "Alternative text description"}
                                </p>
                              </div>
                            </div>
                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-full" />
                            <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded w-4/5" />
                          </div>
                        </div>
                      )}

                      {previewContext === 'social' && (
                        <div className="max-w-[400px] mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
                          <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                SEO
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none">SEO Score Suite</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sponsored • 2m ago</p>
                              </div>
                            </div>
                            <Icons.Ellipsis className="text-slate-400" size={16} />
                          </div>
                          
                          <div className="px-5 pb-4">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                              Optimizing your brand's visual identity has never been easier. Check out our latest design insights! 🚀
                            </p>
                            <div className="relative rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg group/social-img">
                              <img 
                                src={sampleImage} 
                                alt={currentAltText} 
                                className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover/social-img:scale-110" 
                                loading="lazy"
                              />
                              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                Alt Text Applied
                              </div>
                            </div>
                          </div>

                          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <Icons.ThumbsUp size={10} className="text-white" />
                              </div>
                              <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <Icons.Heart size={10} className="text-white" />
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                              <span>392 Likes</span>
                              <span>•</span>
                              <span>12 Comments</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {previewContext === 'code' && (
                        <div className="bg-slate-950 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Icons.Code size={12} className="text-indigo-400" />
                                index.html
                              </span>
                            </div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`<img src="optimized-image.jpg" alt="${currentAltText}" loading="lazy" />`);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-white transition-all flex items-center gap-2 border border-slate-700"
                            >
                              <Icons.Copy size={12} />
                              Copy Snippet
                            </button>
                          </div>
                          
                          <div className="p-8 font-mono text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto custom-scrollbar">
                            <pre className="text-slate-400 whitespace-pre">
                              <span className="text-slate-600 italic">// Optimized Image with AI Alt Text{"\n"}</span>
                              <span className="text-indigo-400">&lt;img</span>{"\n"}
                              <span className="text-blue-400">  src</span>=<span className="text-emerald-400">"optimized-image.jpg"</span>{"\n"}
                              <span className="text-blue-400">  alt</span>=<span className="text-emerald-400">"{currentAltText || '...waiting for analysis'}"</span>{"\n"}
                              <span className="text-blue-400">  loading</span>=<span className="text-emerald-400">"lazy"</span>{"\n"}
                              <span className="text-blue-400">  width</span>=<span className="text-amber-400">"1200"</span>{"\n"}
                              <span className="text-blue-400">  height</span>=<span className="text-amber-400">"630"</span>{"\n"}
                              <span className="text-indigo-400">/&gt;</span>
                            </pre>
                          </div>

                          <div className="px-6 py-3 bg-indigo-600 flex items-center justify-between">
                            <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Validated Schema • WCAG 2.1 Compliant</span>
                            <Icons.CheckCircle size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-4 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shrink-0">
                        <Icons.Info size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <p className="font-medium leading-relaxed">
                        Hover over the image to see how a screen reader or search engine would "see" this image using the <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-xs">{selectedVariation}</span> alt text.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      }
      placeholderSection={<ToolPlaceholder tool={tool} />}
    />
  );
};
