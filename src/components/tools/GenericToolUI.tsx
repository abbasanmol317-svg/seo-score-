import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { ToolComponentProps } from './ToolComponentProps';
import { renderMarkdownContent, getErrorSolutions } from '../../lib/seo-utils';
import { CoreWebVitalsUI } from './CoreWebVitalsUI';

export const GenericToolUI: React.FC<ToolComponentProps> = ({
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
  isFeedbackSubmitted,
  setIsFeedbackSubmitted,
  feedbackRating,
  setFeedbackRating,
  feedbackText,
  setFeedbackText,
}) => {
  const IconComponent = (Icons as any)[tool.icon] || Icons.HelpCircle;

  return (
    <div className="flex flex-col gap-8 print:gap-4">
      <div className={cn("w-full print:hidden", isGeneratingPDF && "hidden")}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group max-w-4xl mx-auto"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
          <div className="relative bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4 p-1 sm:p-2">
                <div className="relative w-full">
                  <div className="absolute left-4 sm:left-6 top-6 sm:top-8 -translate-y-1/2 text-indigo-500 dark:text-indigo-400 pointer-events-none transition-transform group-hover:scale-110 duration-300">
                    <Icons.Search size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleRun();
                      }
                    }}
                    placeholder={tool.placeholder}
                    className="w-full min-h-[100px] sm:min-h-[120px] max-h-[500px] py-4 sm:py-8 pl-12 sm:pl-18 pr-4 sm:pr-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl sm:rounded-3xl border-2 border-transparent focus:border-indigo-200 dark:focus:border-indigo-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-8 focus:ring-indigo-500/5 text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all resize-none shadow-inner"
                    rows={1}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 sm:gap-4 px-1 sm:px-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleClear}
                      className="p-3 sm:p-4 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl sm:rounded-2xl transition-all active:scale-90 flex items-center gap-2 font-bold text-xs sm:text-sm"
                      title="Clear Input"
                    >
                      <Icons.Trash2 size={18} className="sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">Clear</span>
                    </button>
                  </div>
                  <motion.button
                    onClick={handleRun}
                    disabled={loading || !input.trim()}
                    whileHover={!loading && input.trim() ? { scale: 1.02, y: -4 } : {}}
                    whileTap={!loading && input.trim() ? { scale: 0.98, y: 0 } : {}}
                    className={cn(
                      "flex-grow sm:flex-none py-4 sm:py-6 px-6 sm:px-12 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-2xl relative overflow-hidden group/btn",
                      loading || !input.trim() 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/40 dark:shadow-indigo-900/60"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                    {loading ? (
                      <Icons.Loader2 className="animate-spin sm:w-7 sm:h-7" size={20} />
                    ) : (
                      <Icons.Zap size={20} className="sm:w-7 sm:h-7 animate-pulse" fill="currentColor" />
                    )}
                    <span className="whitespace-nowrap tracking-tight">
                      {loading ? 'Analyzing...' : 'Run Analysis'}
                    </span>
                    {!loading && input.trim() && (
                      <Icons.ChevronRight size={16} className="sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30 rounded-b-xl sm:rounded-b-[1.5rem]">
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="text-[9px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1 sm:gap-2">
                    <div className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">CMD</div>
                    <Icons.Plus size={8} className="sm:w-2.5 sm:h-2.5" />
                    <div className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">ENTER</div>
                    <span className="ml-1 hidden xs:inline">TO RUN</span>
                  </span>
                </div>
                {input.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-1 w-16 sm:w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300" 
                        style={{ width: `${Math.min(100, (input.length / 500) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {input.length} <span className="hidden xs:inline">chars</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mt-8 relative group/error"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl blur opacity-20 group-hover/error:opacity-30 transition duration-500"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-rose-50 dark:bg-rose-900/20 p-4 sm:p-6 flex items-center justify-center md:w-24">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 animate-bounce-slow">
                        <Icons.AlertTriangle size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1">Analysis Failed</h3>
                          <p className="text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Error Detected</p>
                        </div>
                        <button 
                          onClick={handleClear}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                        >
                          <Icons.X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          {error}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] sm:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Icons.Lightbulb size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500" />
                          Potential Solutions
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {getErrorSolutions(error).map((solution, idx) => (
                            <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 sm:p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                        <motion.button 
                          onClick={handleRun}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-grow sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all text-sm sm:text-base"
                        >
                          <Icons.RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                          Try Again
                        </motion.button>
                        <motion.button 
                          onClick={handleClear}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-grow sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-all text-sm sm:text-base"
                        >
                          Clear Input
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[350px] sm:min-h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 dark:from-indigo-900/20 via-white dark:via-slate-900 to-purple-50/50 dark:to-purple-900/20" />
              <div className="relative z-10 w-full max-w-lg">
                <div className="relative mb-8 sm:mb-12 inline-block">
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                  <div className="relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-full shadow-2xl border border-indigo-100 dark:border-indigo-900 animate-bounce-slow">
                    <Icons.Zap size={48} className="sm:w-16 sm:h-16 text-indigo-600 dark:text-indigo-400" fill="currentColor" />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-purple-500 p-2 sm:p-3 rounded-full text-white shadow-lg animate-spin-slow">
                    <Icons.Sparkles size={16} className="sm:w-5 sm:h-5" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
                  {loadingMessage}
                </h2>
                <div className="w-full max-w-md mx-auto mb-6 sm:mb-8">
                  <div className="h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                    />
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{Math.round(progress)}%</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8">
                  Our AI is deep-diving into your request to provide the most accurate SEO insights possible.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={currentTip}
                  className="bg-indigo-50 dark:bg-indigo-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-indigo-100 dark:border-indigo-900/50 max-w-md mx-auto"
                >
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2 justify-center">
                    <Icons.Lightbulb size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">SEO Pro Tip</span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 italic">
                    "{currentTip}"
                  </p>
                </motion.div>
                <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : result ? (
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
                            {navigator.share && (
                              <button 
                                onClick={() => handleShare('native')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all text-left border-t border-slate-50 dark:border-slate-700 mt-1 pt-1"
                              >
                                <Icons.Share size={16} />
                                More Options
                              </button>
                            )}
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
                </div>
              </div>

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
                const isChecklist = titleLower.includes('checklist') || titleLower.includes('tasks') || titleLower.includes('fixes') || titleLower.includes('optimization') || titleLower.includes('structure') || titleLower.includes('tags');

                const getHeaderIcon = () => {
                  if (isScore) return <Icons.Trophy className="text-amber-500" size={22} />;
                  if (isCoreWebVitals) return <Icons.Activity className="text-indigo-500" size={22} />;
                  if (isSummary) return <Icons.FileText className="text-blue-500" size={22} />;
                  if (isAction || isChecklist) return <Icons.ClipboardCheck className="text-indigo-500" size={22} />;
                  if (isFindings) return <Icons.Search className="text-emerald-500" size={22} />;
                  if (isTechnical) return <Icons.Code className="text-purple-500" size={22} />;
                  if (isLinking) return <Icons.Link className="text-blue-600" size={22} />;
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
                  return "border-l-slate-300";
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -2,
                      scale: 1.001,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 border-l-4 overflow-hidden print:shadow-none print:border-slate-100 group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/30 dark:hover:shadow-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800",
                      getAccentColor(),
                      isScore && "bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-900/10 border-amber-200 dark:border-amber-800 border-l-amber-500"
                    )}
                  >
                    <div className={cn(
                      "px-5 sm:px-8 py-3 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300",
                      isScore ? "bg-amber-50/50 dark:bg-amber-900/20 group-hover:bg-amber-100/40 dark:group-hover:bg-amber-900/30" : "bg-slate-50/50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800"
                    )}>
                      <h2 className={cn(
                        "text-base sm:text-xl font-extrabold flex items-center gap-2 sm:gap-3 tracking-tight",
                        isScore ? "text-amber-900 dark:text-amber-100" : "text-slate-900 dark:text-slate-100"
                      )}>
                        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                          {getHeaderIcon()}
                        </div>
                        <span className="truncate">{title}</span>
                      </h2>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => navigator.clipboard.writeText(section)}
                          className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all print:hidden"
                          title="Copy Section"
                        >
                          <Icons.Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <div className={cn(
                      "p-6 sm:p-8 markdown-body transition-colors duration-300 group-hover:bg-slate-50/20 dark:group-hover:bg-slate-800/20",
                      isTechnical && "bg-slate-900 dark:bg-black text-slate-100 group-hover:bg-slate-800 dark:group-hover:bg-slate-900"
                    )}>
                      {isScore ? (
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-4">
                          <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border-[8px] sm:border-[12px] border-amber-100 dark:border-amber-900 shadow-2xl shadow-amber-200/50 dark:shadow-amber-900/20">
                            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin-slow opacity-30" />
                            <div className="text-center">
                              <span className="text-4xl sm:text-6xl font-black text-amber-600 dark:text-amber-400 block leading-none">
                                {content.match(/\d+/)?.[0] || 'N/A'}
                              </span>
                              <span className="text-[10px] sm:text-xs font-bold text-amber-400 dark:text-amber-500 uppercase tracking-widest mt-1 block">Score</span>
                            </div>
                          </div>
                          <div className="flex-grow text-center md:text-left">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="text-xl sm:text-2xl text-slate-800 dark:text-slate-100 font-bold leading-tight mb-4">{children}</p>
                              }}
                            >
                              {content.replace(/\d+/, '').trim()}
                            </ReactMarkdown>
                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                              <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">SEO Authority</span>
                              <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">AI Verified</span>
                            </div>
                          </div>
                        </div>
                      ) : isCoreWebVitals ? (
                        <CoreWebVitalsUI content={content} />
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
                              const renderLiContent = (content: any): any => {
                                if (typeof content === 'string') return renderMarkdownContent(content);
                                if (Array.isArray(content)) return content.map(renderLiContent);
                                return content;
                              };
                              return (
                                <li className={cn(
                                  "mb-4 text-slate-600 dark:text-slate-400 flex items-start gap-3 sm:gap-4",
                                  (isAction || isChecklist) && "p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all duration-300"
                                )}>
                                  {(isAction || isChecklist) ? (
                                    <div className="mt-1 p-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                                      <Icons.CheckCircle2 size={16} />
                                    </div>
                                  ) : (
                                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                  )}
                                  <div className="flex-grow font-medium text-sm sm:text-base">{renderLiContent(children)}</div>
                                </li>
                              );
                            },
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <table className="w-full border-collapse">{children}</table>
                              </div>
                            ),
                            td: ({ children }) => {
                              const renderTdContent = (content: any): any => {
                                if (typeof content === 'string') return renderMarkdownContent(content);
                                if (Array.isArray(content)) return content.map(renderTdContent);
                                return content;
                              };
                              return <td className="border border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">{renderTdContent(children)}</td>;
                            },
                            th: ({ children }) => <th className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3 sm:p-4 text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-left">{children}</th>,
                            h3: ({ children }) => <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2">{children}</h3>,
                            strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
                            ul: ({ children }) => <ul className={cn("mb-8", (isAction || isChecklist) ? "space-y-3" : "space-y-2")}>{children}</ul>,
                            code: ({ children, className, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const codeString = String(children).replace(/\n$/, '');
                              const [copiedCode, setCopiedCode] = React.useState(false);

                              const handleCopyCode = () => {
                                navigator.clipboard.writeText(codeString);
                                setCopiedCode(true);
                                setTimeout(() => setCopiedCode(false), 2000);
                              };

                              return match ? (
                                <div className="relative group/code my-6">
                                  <button
                                    onClick={handleCopyCode}
                                    className={cn(
                                      "absolute right-4 top-4 p-2 rounded-xl transition-all opacity-0 group-hover/code:opacity-100 z-10",
                                      copiedCode ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                                    )}
                                    title="Copy Code"
                                  >
                                    {copiedCode ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
                                  </button>
                                  <pre className="p-4 sm:p-6 bg-slate-900 dark:bg-black text-slate-100 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 dark:border-slate-700 shadow-inner">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                </div>
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

              {/* Bottom Action Bar */}
              <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 py-8 border-t border-slate-100 dark:border-slate-800 print:hidden", isGeneratingPDF && "hidden")}>
                <button 
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-lg active:scale-95"
                >
                  <Icons.Printer size={18} className="sm:w-5 sm:h-5" />
                  Print Full Report
                </button>

                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Icons.Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Icons.Download size={18} className="sm:w-5 sm:h-5" />
                  )}
                  Download PDF
                </button>

                <button 
                  onClick={handleCopy}
                  className={cn(
                    "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-xl transition-all active:scale-95",
                    copied ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900/40" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/40"
                  )}
                >
                  {copied ? <Icons.Check size={18} className="sm:w-5 sm:h-5" /> : <Icons.Copy size={18} className="sm:w-5 sm:h-5" />}
                  {copied ? "Copied!" : "Copy Full Report"}
                </button>
              </div>

              {/* Feedback Mechanism */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={cn(
                  "mt-12 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5 dark:shadow-indigo-900/10 relative overflow-hidden group print:hidden",
                  isGeneratingPDF && "hidden"
                )}
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icons.MessageSquare size={120} className="text-indigo-600" />
                </div>

                {!isFeedbackSubmitted ? (
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Was this analysis helpful?</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Your feedback helps us improve our AI models and tool accuracy.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setFeedbackRating('up')}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 font-bold",
                            feedbackRating === 'up'
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 scale-105"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-200 dark:hover:border-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-400"
                          )}
                        >
                          <Icons.ThumbsUp size={20} fill={feedbackRating === 'up' ? "currentColor" : "none"} />
                          <span>Helpful</span>
                        </button>
                        <button
                          onClick={() => setFeedbackRating('down')}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 font-bold",
                            feedbackRating === 'down'
                              ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/40 scale-105"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-rose-200 dark:hover:border-rose-900 hover:text-rose-600 dark:hover:text-rose-400"
                          )}
                        >
                          <Icons.ThumbsDown size={20} fill={feedbackRating === 'down' ? "currentColor" : "none"} />
                          <span>Not Helpful</span>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {feedbackRating && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="relative">
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Optional: Tell us more about how we can improve this tool..."
                              className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-800 dark:text-slate-200 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 min-h-[120px] resize-none"
                            />
                            <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                              Optional Feedback
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => setIsFeedbackSubmitted(true)}
                              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                              <Icons.Send size={18} />
                              Submit Feedback
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 relative z-10"
                  >
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">
                      <Icons.Heart size={40} fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Thank you for your feedback!</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your input helps us build a better SEO tool for everyone.</p>
                    <button
                      onClick={() => setIsFeedbackSubmitted(false)}
                      className="mt-8 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm"
                    >
                      Edit your feedback
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden group"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={`https://loremflickr.com/1200/600/${tool.keywords.split(',')[0] || 'seo'}`}
                  alt={tool.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Ready to analyze</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <div className="p-8 sm:p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed mb-8">
                  {tool.description} Enter your details in the form above and click "Run Analysis" to generate your comprehensive AI-powered SEO report.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Icons.Zap size={16} className="text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Fast AI Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Icons.ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Safe & Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Icons.BarChart3 size={16} className="text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Actionable Insights</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
