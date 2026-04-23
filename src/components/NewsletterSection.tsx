import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900/40 -z-10" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20"
            >
              <Zap size={12} className="text-amber-400" />
              The Intelligence Brief
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
              Master the Future of <span className="text-indigo-200">AI Search</span>
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-xl font-medium leading-relaxed">
              Join 50,000+ SEO professionals who receive our weekly breakdown of algorithm shifts, Gemini updates, and AEO strategy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-sm font-bold text-indigo-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                No Spam, Ever
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Unsubscribe Anytime
              </div>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center shadow-2xl"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200/50">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Welcome to the Club!</h3>
                  <p className="text-slate-600 font-medium">
                    Check your inbox. Your first "Intelligence Brief" is on its way.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Enter another email
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-4 bg-amber-500 rounded-2xl text-white shadow-xl rotate-12 group">
                    <Zap size={24} className="animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Mail className="text-indigo-600" size={24} />
                    Ready to Scale?
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Get Your First Lesson <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                  
                  <p className="mt-6 text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure & Private Verification
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
