import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolResult } from './ToolResult';
import { ToolPlaceholder } from './ToolPlaceholder';
import { cn } from '../../lib/utils';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract alt text variations from markdown result
  const getAltTextVariations = (text: string) => {
    const primary = text.match(/## 🖼️ Primary Alt Text\n\((.*?)\)/s) || 
                   text.match(/## 🖼️ Primary Alt Text\n(.*?)\n/s);
    
    const decorative = text.match(/- \*\*Decorative:\*\* \((.*?)\)/) || 
                       text.match(/- \*\*Decorative:\*\* (.*?)\n/);
    
    const informational = text.match(/- \*\*Informational:\*\* \((.*?)\)/) || 
                          text.match(/- \*\*Informational:\*\* (.*?)\n/);
    
    const functional = text.match(/- \*\*Functional:\*\* \((.*?)\)/) || 
                       text.match(/- \*\*Functional:\*\* (.*?)\n/);

    return {
      primary: primary ? primary[1].trim() : '',
      decorative: decorative ? decorative[1].trim() : '',
      informational: informational ? informational[1].trim() : '',
      functional: functional ? functional[1].trim() : '',
    };
  };

  const variations = result ? getAltTextVariations(result) : { primary: '', decorative: '', informational: '', functional: '' };
  const currentAltText = variations[selectedVariation] || variations.primary;

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
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 group/img bg-slate-100 dark:bg-slate-900 min-h-[200px] flex items-center justify-center">
                      <img 
                        src={sampleImage} 
                        alt={currentAltText} 
                        className="w-full h-auto block transition-transform duration-700 group-hover/img:scale-105"
                        title={currentAltText}
                        loading="lazy"
                      />
                      {/* Hover Overlay Simulation */}
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
