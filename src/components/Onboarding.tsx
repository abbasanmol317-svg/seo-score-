import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, FileText, Settings, Youtube, MapPin, Zap, BrainCircuit, Target, ChartBarBig, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isGoalStep?: boolean;
}

const SEO_GOALS = [
  { id: 'traffic', label: 'Boost Website Traffic', icon: <TrendingUp size={20} />, description: 'Keyword research and link building' },
  { id: 'content', label: 'Optimize Content', icon: <FileText size={20} />, description: 'AI writing and semantic optimization' },
  { id: 'technical', label: 'Fix Technical Issues', icon: <Settings size={20} />, description: 'Speed, audits, and crawlability' },
  { id: 'youtube', label: 'YouTube Growth', icon: <Youtube size={20} />, description: 'Video SEO and channel ranking' },
  { id: 'local', label: 'Local SEO Ranking', icon: <MapPin size={20} />, description: 'Google Maps and local intent' }
];

const STEPS: Step[] = [
  {
    title: "Welcome to SEO Score",
    description: "Your all-in-one platform for AI-powered SEO analysis, keyword research, and content optimization.",
    icon: <Zap size={48} />,
    color: "bg-indigo-600"
  },
  {
    title: "AI-Powered Analysis",
    description: "Leverage the power of Google Gemini to get deep insights into your website's performance and visibility.",
    icon: <BrainCircuit size={48} />,
    color: "bg-purple-600"
  },
  {
    title: "Customized for You",
    description: "Tell us about your primary SEO goals so we can recommend the best tools for your specific needs.",
    icon: <Target size={48} />,
    color: "bg-orange-500",
    isGoalStep: true
  },
  {
    title: "Actionable Reports",
    description: "Get detailed reports with specific recommendations to improve your rankings and drive more organic traffic.",
    icon: <ChartBarBig size={48} />,
    color: "bg-emerald-600"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedGoals, setSelectedGoals] = React.useState<string[]>([]);

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

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

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
      if (selectedGoals.length > 0) {
        localStorage.setItem('seo_score_user_goals', JSON.stringify(selectedGoals));
      }
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
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800 z-10">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-white mb-6 sm:mb-8 shadow-xl",
                step.color
              )}>
                {step.icon}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                {step.title}
              </h2>
              
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed mb-8">
                {step.description}
              </p>

              {step.isGoalStep && (
                <div className="w-full space-y-3 mb-8">
                  {SEO_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                        selectedGoals.includes(goal.id)
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl shrink-0 transition-colors",
                        selectedGoals.includes(goal.id) ? "bg-white/20 text-white" : "bg-white dark:bg-slate-700 text-indigo-600"
                      )}>
                        {goal.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm sm:text-base">{goal.label}</div>
                        <div className={cn(
                          "text-[10px] sm:text-xs",
                          selectedGoals.includes(goal.id) ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"
                        )}>{goal.description}</div>
                      </div>
                      {selectedGoals.includes(goal.id) && (
                        <CheckCircle2 size={20} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 sm:px-12 sm:pb-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <button 
            onClick={handleSkip}
            className="px-4 sm:px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Skip
          </button>
          
          <div className="hidden sm:flex gap-1.5">
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
            className="px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all active:scale-95 flex items-center gap-2"
          >
            {currentStep === STEPS.length - 1 ? "Get Started" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
