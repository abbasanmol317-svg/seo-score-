import React, { useState, useEffect } from 'react';
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

interface TutorialStep {
  title: string;
  content: string;
  icon: keyof typeof Icons;
  target?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to AI SEO Chat!",
    content: "This is your personal SEO consultant. You can ask anything from basic definitions to complex strategy advice.",
    icon: "Sparkles"
  },
  {
    title: "Ask Effective Questions",
    content: "Be specific! Instead of 'How to do SEO?', try 'How can I improve my local SEO for a bakery in London?'",
    icon: "MessageSquare",
    target: "chat-input"
  },
  {
    title: "Interpreting Responses",
    content: "Our AI provides structured answers: a Direct Answer, an Importance Level (Good/Average/Poor), Action Steps, and an Expert Explanation.",
    icon: "Layout",
    target: "chat-result"
  },
  {
    title: "Try an Example",
    content: "Click one of the suggested questions below to see the AI in action immediately.",
    icon: "Lightbulb",
    target: "chat-suggestions"
  }
];

const SUGGESTED_QUESTIONS = [
  "How do I optimize my site for Core Web Vitals?",
  "What are the best strategies for link building in 2026?",
  "How does AI impact search engine rankings?",
  "Explain the difference between On-Page and Technical SEO.",
  "How can I recover from a Google algorithm update?"
];

export const SEOChatUI: React.FC<ToolComponentProps> = (props) => {
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

  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('seo_chat_tutorial_seen');
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('seo_chat_tutorial_seen', 'true');
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSuggestionClick = (q: string) => {
    setInput(q);
  };

  return (
    <div className="relative">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                />
              </div>

              <button 
                onClick={handleCompleteTutorial}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <Icons.X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-6 mt-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl text-indigo-600 dark:text-indigo-400">
                  {React.createElement((Icons as any)[TUTORIAL_STEPS[currentStep].icon], { size: 40 })}
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {TUTORIAL_STEPS[currentStep].title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {TUTORIAL_STEPS[currentStep].content}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full mt-4">
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="flex-[2] py-4 px-6 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                  >
                    {currentStep === TUTORIAL_STEPS.length - 1 ? "Get Started" : "Next Step"}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentStep ? "w-6 bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center max-w-5xl mx-auto px-4 mb-4">
        <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Consultant Interface</h2>
        <button
          onClick={() => {
            setCurrentStep(0);
            setShowTutorial(true);
          }}
          className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Icons.HelpCircle size={14} />
          Restart Tutorial
        </button>
      </div>

      <ToolLayout
        inputSection={
          <div className="space-y-6">
            <ToolInput
              tool={tool}
              input={input}
              setInput={setInput}
              handleRun={handleRun}
              handleClear={handleClear}
              loading={loading}
            />
            
            {/* Suggested Questions Section */}
            <div id="chat-suggestions" className="px-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <Icons.Lightbulb size={16} />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Suggested Questions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(q)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
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
            handleRun={handleRun}
            handleClear={handleClear}
          />
        }
        result={result}
        resultSection={
          <div className="space-y-12">
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
            
            {/* Walkthrough Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/20">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Icons.Zap size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Instant Answers</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get immediate, AI-powered responses to any SEO query, from technical fixes to content strategy.</p>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-900/20">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-100 dark:shadow-none">
                  <Icons.CheckCircle2 size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Actionable Steps</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Every response includes clear, step-by-step instructions so you know exactly what to do next.</p>
              </div>
              <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-amber-100/50 dark:border-amber-900/20">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-100 dark:shadow-none">
                  <Icons.ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Expert Backing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Our AI is trained on the latest SEO best practices and Google algorithm guidelines for 2026.</p>
              </div>
            </div>
          </div>
        }
        placeholderSection={<ToolPlaceholder tool={tool} />}
      />
    </div>
  );
};
