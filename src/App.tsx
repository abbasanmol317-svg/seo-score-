import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS } from './services/gemini';
import { cn } from './lib/utils';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
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
const Guides = lazy(() => import('./pages/Guides'));
const GuidePost = lazy(() => import('./pages/GuidePost'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PowerPage = lazy(() => import('./pages/PowerPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Profile = lazy(() => import('./pages/Profile'));

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
  const { preferences, user } = useUser();
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
        <div className="flex items-center justify-between h-14 sm:h-20 gap-4">
          {/* Left Section: Mobile Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Icon name="Menu" size={18} className="sm:w-5 sm:h-5" />
            </motion.button>

            <Link to="/" className="flex items-center gap-2.5 text-indigo-600 font-bold text-lg sm:text-xl group shrink-0" id="header-logo">
              <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Icon name="Gauge" size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="hidden xs:inline tracking-tighter font-black text-slate-900 dark:text-white leading-none">
                SEO<span className="text-indigo-600">Score</span>
              </span>
            </Link>
          </div>

          {/* Center Section: Navigation Breadcrumbs */}
          <div className="flex-1 hidden md:flex items-center gap-2 overflow-hidden min-w-0">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-xl font-light">/</span>
              <Link 
                to="/" 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shrink-0",
                  !currentTool 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "bg-white dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-100 dark:hover:border-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <Icon name="LayoutDashboard" size={14} className="shrink-0" />
                <span className="font-black uppercase tracking-widest text-[10px] hidden lg:inline">Dashboard</span>
              </Link>
            </div>

            {currentTool && (
              <div className="flex items-center gap-2 text-slate-300 min-w-0">
                <span className="text-xl font-light">/</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm min-w-0">
                  <Icon name={currentTool.icon} size={14} className="shrink-0" />
                  <span className="font-black truncate uppercase tracking-widest text-[10px]">{currentTool.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:block">
              <ToolSearch />
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <Icon name="Search" size={18} />
            </motion.button>

            <div className="hidden sm:block">
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              {theme === 'dark' ? <Icon name="Sun" size={18} /> : <Icon name="Moon" size={18} />}
            </motion.button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

            <Link
              to="/profile"
              className={cn(
                "p-1 rounded-xl border transition-all flex items-center gap-2 group/profile",
                location.pathname === '/profile'
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500/50"
              )}
              title="Your Profile"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all overflow-hidden",
                location.pathname === '/profile' ? "bg-white/20" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 group-hover/profile:scale-110 group-hover/profile:rotate-3"
              )}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="User" size={16} />
                )}
              </div>
              <div className="hidden lg:flex flex-col items-start pr-2 leading-tight">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  location.pathname === '/profile' ? "text-white" : "text-slate-900 dark:text-white"
                )}>
                  {user?.displayName ? user.displayName.split(' ')[0] : (preferences.name ? preferences.name.split(' ')[0] : 'Guest')}
                </span>
                <span className={cn(
                  "text-[8px] font-bold opacity-60",
                  location.pathname === '/profile' ? "text-white" : "text-slate-500"
                )}>
                  Profile
                </span>
              </div>
            </Link>
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
      <Route path="/guides" element={<Guides />} />
      <Route path="/guides/:slug" element={<GuidePost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/case-studies" element={<CaseStudies />} />
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
  const title = "Best Free SEO Score Checker Tools for 2026 | SEO Score";
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
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SEO Score Search Intelligence Engine",
      "operatingSystem": "Web",
      "applicationCategory": "SEO Tool",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "5420"
      }
    }
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="google-adsense-account" content="ca-pub-6719705037005199" />
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
        <ThemeProvider>
          <UserProvider>
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

              <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-100">
                          <Icon name="Gauge" size={24} />
                        </div>
                        <span className="tracking-tight">SEO Score</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pr-4">
                        Professional-grade SEO tools and intelligence powered by advanced AI. Uncover signals that matter for your search rankings.
                      </p>
                      <div className="flex gap-3">
                        <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shadow-sm"><Icon name="Github" size={18} /></a>
                        <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shadow-sm"><Icon name="Twitter" size={18} /></a>
                        <a href="#" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shadow-sm"><Icon name="Linkedin" size={18} /></a>
                      </div>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col gap-5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Company</h4>
                      <nav className="flex flex-col gap-3">
                        <Link to="/tools" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Tools</Link>
                        <Link to="/about" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link>
                        <Link to="/contact" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</Link>
                        <Link to="/blog" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
                        <Link to="/guides" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors mt-1">Learning Academy</Link>
                      </nav>
                    </div>

                    {/* Legal Column */}
                    <div className="flex flex-col gap-5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Legal</h4>
                      <nav className="flex flex-col gap-3">
                        <Link to="/privacy" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
                        <a href="/sitemap.xml" target="_blank" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sitemap</a>
                        <Link to="/resources" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors mt-1">Resources</Link>
                      </nav>
                    </div>

                    {/* Popular Tools Column */}
                    <div className="flex flex-col gap-5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Popular Tools</h4>
                      <nav className="flex flex-col gap-3">
                        {TOOLS.slice(0, 5).map(tool => (
                          <Link key={tool.id} to={`/tools/${tool.slug}`} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">{tool.name}</Link>
                        ))}
                      </nav>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                      &copy; {new Date().getFullYear()} SEO Score. Powered by Multi-Agent AI Technology.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Status: All Systems Operational</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </UserProvider>
      </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
