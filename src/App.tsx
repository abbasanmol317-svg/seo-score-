import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS } from './services/gemini';
import { cn } from './lib/utils';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ToolSearch from './components/ToolSearch';
import Sidebar from './components/Sidebar';
import BackToTop from './components/BackToTop';
import { AdSenseProvider } from './components/AdSense';
import { Icon } from './components/ui/Icon';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Tools = lazy(() => import('./pages/Tools'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PowerPage = lazy(() => import('./pages/PowerPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));

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
  const toolId = location.pathname.startsWith('/tool/') || location.pathname.startsWith('/tools/') 
    ? location.pathname.split('/').filter(Boolean).pop() 
    : null;
  const currentTool = toolId ? TOOLS.find(t => t.id === toolId || t.slug === toolId) : null;
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[60] lg:hidden"
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
            <div className="flex justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                >
                  <Icon name="Menu" size={20} className="sm:w-6 sm:h-6" />
                </button>

                <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg sm:text-xl group shrink-0" id="header-logo">
                  <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Icon name="Zap" size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="xs:inline tracking-tight font-black text-slate-900 dark:text-white leading-none">
                    SEO<span className="text-indigo-600">Score</span>
                  </span>
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
                    <Icon name="LayoutDashboard" size={16} />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Dashboard</span>
                  </Link>
                </div>

                {currentTool && (
                  <div className="hidden md:flex items-center gap-2 text-slate-300 shrink-0">
                    <span className="text-xl font-light">/</span>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm">
                      <Icon name={currentTool.icon} size={16} />
                      <span className="font-bold truncate max-w-[150px] uppercase tracking-widest text-[10px]">{currentTool.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:block">
                  <ToolSearch />
                </div>
                
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="sm:hidden p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                >
                  <Icon name="Search" size={20} />
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                <button
                  onClick={toggleTheme}
                  className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 shadow-sm"
                >
                  {theme === 'dark' ? <Icon name="Sun" size={20} /> : <Icon name="Moon" size={20} />}
                </button>
              </div>
            </div>
          </div>

      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[120] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 flex flex-col"
          >
            <div className="flex items-center justify-between gap-4 mb-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                  <Icon name="Search" size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Search Tools</h2>
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 active:scale-90 transition-all font-bold flex items-center gap-2"
              >
                <span className="text-xs uppercase tracking-widest hidden xs:inline">Close</span>
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ToolSearch 
                isMobile 
                autoFocus 
                onSelect={() => setIsMobileSearchOpen(false)} 
                className="!max-w-none shadow-2xl shadow-indigo-500/10"
              />
              
              <div className="mt-12">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 pl-1">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Keyword Research', 'Technical SEO', 'Content Audit', 'Site Speed'].map(cat => (
                    <button 
                      key={cat}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-left hover:border-indigo-200 transition-all"
                      onClick={() => {
                        // We could implement category filtering in search
                      }}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{cat}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Explore tools</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/:id" element={<ToolPage />} />
      <Route path="/tool/:id" element={<ToolPage />} />
      <Route path="/ai-seo-audit-tool" element={<ToolPage idOverride="seo-audit" />} />
      <Route path="/keyword-research-tool" element={<ToolPage idOverride="keyword-research" />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/resources" element={<PowerPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
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

function GlobalMetaTags() {
  const location = useLocation();
  const siteUrl = window.location.origin || 'https://seoscore.site'; // Dynamic base URL
  const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`;
  const title = "Best Free SEO Score Checker Tools for 2026";
  const description = "Get a professional AI SEO audit in 30 seconds. Access 20+ free SEO checker tools for keyword research, technical fixes, and site speed with no signup required. Analyze your site now!";
  const ogImage = `${siteUrl}/og-image.png`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SEO Score",
      "url": siteUrl,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/tools?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SEO Score",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "sameAs": [
        "https://twitter.com/seoscoresuite",
        "https://linkedin.com/company/seoscoresuite"
      ]
    }
  ];

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AdSenseProvider publisherId="ca-pub-6719705037005199" />
        <Helmet>
          <title>Best Free SEO Score Checker Tools for 2026</title>
          <meta name="description" content="Get a professional AI SEO audit in 30 seconds. Access 20+ free SEO checker tools for keyword research, technical fixes, and site speed with no signup required. Analyze your site now!" />
          <meta name="google-adsense-account" content="ca-pub-6719705037005199" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Helmet>
        <ThemeProvider>
          <Router>
            <GlobalMetaTags />
            <Suspense fallback={null}>
              <Onboarding />
            </Suspense>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
              <NavHeader />
              <div className="flex flex-1 relative">
                <Sidebar />
                <main className="flex-grow min-w-0">
                  <Suspense fallback={<PageLoader />}>
                    <AnimatedRoutes />
                  </Suspense>
                </main>
              </div>
              <BackToTop />

              <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl">
                      <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-100">
                        <Icon name="Zap" size={20} />
                      </div>
                      <span className="tracking-tight">SEO Score</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Company</h4>
                        <Link to="/tools" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Tools</Link>
                        <Link to="/about" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link>
                        <Link to="/contact" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link>
                        <Link to="/blog" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
                        <Link to="/faq" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</Link>
                        <Link to="/resources" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">Resources</Link>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Legal</h4>
                        <Link to="/privacy" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Popular Tools</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {TOOLS.slice(0, 4).map(tool => (
                            <Link key={tool.id} to={`/tools/${tool.slug}`} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[120px]">{tool.name}</Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icon name="Github" size={20} /></a>
                      <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icon name="Twitter" size={20} /></a>
                      <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"><Icon name="Linkedin" size={20} /></a>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      &copy; {new Date().getFullYear()} SEO Score. Powered by Google Gemini AI. All rights reserved.
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
