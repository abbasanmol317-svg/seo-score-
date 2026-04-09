import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome to SEO Score Suite",
    description: "Your all-in-one platform for AI-powered SEO analysis, keyword research, and content optimization.",
    icon: <Icons.Zap size={48} />,
    color: "bg-indigo-600"
  },
  {
    title: "AI-Powered Analysis",
    description: "Leverage the power of Google Gemini to get deep insights into your website's performance and visibility.",
    icon: <Icons.BrainCircuit size={48} />,
    color: "bg-purple-600"
  },
  {
    title: "Actionable Reports",
    description: "Get detailed reports with specific recommendations to improve your rankings and drive more organic traffic.",
    icon: <Icons.BarChart3 size={48} />,
    color: "bg-emerald-600"
  },
  {
    title: "Export & Share",
    description: "Download your analysis as a professional PDF report to share with your team or clients.",
    icon: <Icons.FileDown size={48} />,
    color: "bg-amber-600"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const hasSeenOnboarding = localStorage.getItem('seo_score_onboarding_seen');
      if (!hasSeenOnboarding) {
        setIsVisible(true);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('seo_score_onboarding_seen', 'true');
    } catch (e) {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isMounted || !isVisible) return null;

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl",
                step.color
              )}>
                {step.icon}
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                {step.title}
              </h2>
              
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-12">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={handleSkip}
              className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Skip
            </button>
            
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === currentStep ? "w-6 bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  )}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all active:scale-95 flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? "Get Started" : "Next"}
              <Icons.ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
