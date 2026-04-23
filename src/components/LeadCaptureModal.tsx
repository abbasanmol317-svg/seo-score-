import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, CheckCircle2, ArrowRight, ShieldCheck, Download } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  title?: string;
  subtitle?: string;
}

export default function LeadCaptureModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Save Your Report",
  subtitle = "Enter your email to receive a high-resolution PDF version of this audit and our weekly SEO Intelligence Brief."
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      onSuccess(email);
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 z-[160]"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-violet-600" />

              <div className="mb-8">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold">Report sent successfully!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-all font-bold dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send My Report <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    <div className="pt-2">
                       <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        We respect your search privacy
                      </p>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
