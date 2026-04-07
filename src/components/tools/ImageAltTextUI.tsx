import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import Markdown from 'react-markdown';
import { ToolComponentProps } from './ToolComponentProps';
import { cn } from '../../lib/utils';
import { StatusBadge } from '../../lib/seo-utils';

export const ImageAltTextUI: React.FC<ToolComponentProps> = ({
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
  reportRef,
  loadingMessage,
  progress,
  currentTip,
}) => {
  const [sampleImage, setSampleImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
        setShowPreview(true);
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
    <div className="space-y-8">
      {/* Input Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Icons.Image className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Describe the image or provide a URL for analysis.</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.placeholder}
            className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClear}
              className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Clear
            </button>
            <button
              onClick={handleRun}
              disabled={loading || !input.trim()}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Icons.Zap size={20} />
                  Generate Alt Text
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icons.Search className="text-blue-600 animate-pulse" size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{loadingMessage}</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">{currentTip}</p>
            </div>
            <div className="max-w-xs mx-auto bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Section */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div ref={reportRef} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Icons.FileText className="text-blue-600" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Alt Text Analysis Kit</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-500" title="Copy">
                  {copied ? <Icons.Check className="text-emerald-500" size={18} /> : <Icons.Copy size={18} />}
                </button>
                <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-500" title="Download PDF">
                  {isGeneratingPDF ? <Icons.Loader2 className="animate-spin" size={18} /> : <Icons.Download size={18} />}
                </button>
              </div>
            </div>
            <div className="p-8 prose dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400">
              <Markdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => {
                    const content = String(children);
                    if (content.includes('[GOOD]')) return <div className="my-2"><StatusBadge type="GOOD" /></div>;
                    if (content.includes('[AVERAGE]')) return <div className="my-2"><StatusBadge type="AVERAGE" /></div>;
                    if (content.includes('[POOR]')) return <div className="my-2"><StatusBadge type="POOR" /></div>;
                    return <p className="leading-relaxed">{children}</p>;
                  }
                }}
              >
                {result}
              </Markdown>
            </div>
          </div>

          {/* Live Preview Feature */}
          <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Icons.Eye className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Preview & Simulation</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">See how your alt text looks and sounds in the real world.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
                    sampleImage 
                      ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-900/10" 
                      : "border-slate-300 hover:border-blue-400 bg-white dark:bg-slate-800 dark:border-slate-700"
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
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Icons.Upload className="text-blue-600" size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {sampleImage ? "Change Sample Image" : "Upload Sample Image"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Drag and drop or click to browse</p>
                    </div>
                  </div>
                </div>

                {sampleImage && (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Icons.Type size={18} className="text-blue-600" />
                        Select Variation
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(['primary', 'decorative', 'informational', 'functional'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVariation(v)}
                            disabled={!variations[v]}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs font-bold transition-all border",
                              selectedVariation === v
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800",
                              !variations[v] && "opacity-30 cursor-not-allowed"
                            )}
                          >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Icons.Settings size={18} className="text-blue-600" />
                        Simulation Controls
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={handleReadAloud}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-all"
                        >
                          <Icons.Volume2 size={18} />
                          Simulate Screen Reader
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="relative group">
                {!sampleImage ? (
                  <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-300 dark:border-slate-700">
                    <div className="text-center">
                      <Icons.Image size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm">Upload an image to see the preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                      <img 
                        src={sampleImage} 
                        alt={currentAltText} 
                        className="w-full h-auto block"
                        title={currentAltText}
                      />
                      {/* Hover Overlay Simulation */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-full">
                          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Previewing: {selectedVariation}</p>
                          <p className="text-white font-medium italic">"{currentAltText || 'No text for this variation'}"</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <Icons.Info size={16} className="text-blue-600 shrink-0" />
                      <span>Hover over the image to see the {selectedVariation} alt text overlay.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </motion.div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-6 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg shrink-0">
            <Icons.AlertTriangle className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 dark:text-rose-400 mb-1">Analysis Failed</h3>
            <p className="text-rose-700 dark:text-rose-500 text-sm">{error}</p>
            <button onClick={handleRun} className="mt-4 text-sm font-bold text-rose-600 hover:underline">Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};
