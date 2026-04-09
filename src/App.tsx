import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TOOLS } from './services/gemini';
import { cn } from './lib/utils';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import { HelmetProvider, Helmet } from 'react-helmet-async';
import ToolSearch from './components/ToolSearch';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Tools = lazy(() => import('./pages/Tools'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

function NavHeader() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const toolId = location.pathname.startsWith('/tool/') ? location.pathname.split('/')[2] : null;
  const currentTool = toolId ? TOOLS.find(t => t.id === toolId) : null;
  const ToolIcon = currentTool ? (Icons as any)[currentTool.icon] || Icons.Zap : Icons.Zap;
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on navigation
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white dark:bg-slate-900 z-[70] lg:hidden shadow-2xl"
            >
              <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              aria-label="Open mobile menu"
            >
              <Icons.Menu size={20} />
            </button>

            <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg sm:text-xl group shrink-0">
              <div className="bg-indigo-600 p-1 sm:p-1.5 rounded-lg text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                <Icons.Zap size={16} className="sm:w-5 sm:h-5" fill="currentColor" />
              </div>
              <span className="hidden xs:inline tracking-tight">SEO Score</span>
            </Link>

            <div className="hidden xl:flex items-center gap-2 text-slate-300 shrink-0">
              <span className="text-xl font-light">/</span>
              <Link 
                to="/" 
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all",
                  !currentTool 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "bg-white dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-100 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <Icons.LayoutDashboard size={18} strokeWidth={2.5} />
                <span className="text-sm font-bold">Dashboard</span>
              </Link>

              {currentTool && (
                <>
                  <span className="text-xl font-light">/</span>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm">
                    <ToolIcon size={18} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-none">
                      {currentTool.name}
                    </span>
                  </div>
                </>
              )}
            </div>

            <ToolSearch className="hidden lg:block" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              aria-label="Search tools"
            >
              <Icons.Search size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === 'light' ? <Icons.Moon size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Icons.Sun size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
            <Link 
              to="/tools" 
              className={cn(
                "transition-all text-sm font-bold flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl",
                location.pathname === '/tools' 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              <Icons.LayoutGrid size={18} />
              <span className="hidden md:inline">All Tools</span>
            </Link>
            <Link 
              to="/tool/seo-dashboard" 
              className={cn(
                "transition-all text-sm font-bold flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl",
                toolId === 'seo-dashboard' 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              <Icons.BarChart3 size={18} />
              <span className="hidden md:inline">Insights</span>
            </Link>
            <Link 
              to="/tool/seo-chat" 
              className={cn(
                "transition-all text-sm font-bold flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl",
                toolId === 'seo-chat' 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              <Icons.MessageSquare size={18} />
              <span className="hidden md:inline">AI Chat</span>
            </Link>
            <Link 
              to="/faq" 
              className={cn(
                "transition-all text-sm font-bold flex items-center gap-2 px-2.5 sm:px-4 py-2 rounded-xl",
                location.pathname === '/faq' 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              <Icons.HelpCircle size={18} />
              <span className="hidden md:inline">FAQ</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quick Search</h3>
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <Icons.X size={20} />
                </button>
              </div>
              <ToolSearch 
                autoFocus 
                onSelect={() => setIsMobileSearchOpen(false)} 
                className="max-w-none mx-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function AnimatedRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">We're sorry, but the application encountered an error.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Helmet>
          <title>SEO Score Suite: Best Free AI SEO Tools for 2026 (20+ Tools)</title>
          <meta name="description" content="Boost your rankings with 20+ free AI SEO tools. Get technical audits, keyword research, and content fixes instantly. Start optimizing for free today!" />
        </Helmet>
        <ThemeProvider>
          <Router>
            <Onboarding />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <NavHeader />
            
            <div className="flex flex-1 relative">
              <Sidebar />
              <main className="flex-grow min-w-0">
                <AnimatedRoutes />
              </main>
            </div>


            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                  <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl">
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-100">
                      <Icons.Zap size={20} fill="currentColor" />
                    </div>
                    <span className="tracking-tight">SEO Score</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Company</h4>
                      <Link to="/tools" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Tools</Link>
                      <Link to="/about" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link>
                      <Link to="/blog" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
                      <Link to="/faq" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Legal</h4>
                      <Link to="/privacy" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                      <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Popular Tools</h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {TOOLS.slice(0, 4).map(tool => (
                          <Link key={tool.id} to={`/tool/${tool.id}`} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[120px]">{tool.name}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icons.Github size={20} /></a>
                    <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icons.Twitter size={20} /></a>
                    <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icons.Linkedin size={20} /></a>
                  </div>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    &copy; {new Date().getFullYear()} AI SEO Score Suite. Powered by Google Gemini. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}
