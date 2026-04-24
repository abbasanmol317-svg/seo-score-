import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftOpen, PanelLeftClose, ChevronDown, ChevronRight, X, Star } from 'lucide-react';
import { TOOLS } from '../services/gemini';
import { CATEGORY_CONFIG } from '../constants';
import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default React.memo(function Sidebar({ onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const currentToolId = location.pathname.startsWith('/tool/') || location.pathname.startsWith('/tools/') 
    ? location.pathname.split('/').filter(Boolean).pop() 
    : null;
  const currentTool = currentToolId ? TOOLS.find(t => t.id === currentToolId || t.slug === currentToolId) : null;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = Object.keys(CATEGORY_CONFIG).filter(cat => 
    TOOLS.some(t => t.category === cat)
  );

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    currentTool ? [currentTool.category] : []
  );

  React.useEffect(() => {
    if (currentTool) {
      if (!expandedCategories.includes(currentTool.category)) {
        setExpandedCategories(prev => [...prev, currentTool.category]);
      }
      // If we are on a tool page and collapsed, auto-expand to show context
      if (isCollapsed && !isMobile) {
        setIsCollapsed(false);
      }
    }
  }, [currentToolId, currentTool]);

  const toggleCategory = (category: string) => {
    if (isCollapsed && !isMobile) {
      setIsCollapsed(false);
      setExpandedCategories([category]);
      return;
    }
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const isToolPage = location.pathname.startsWith('/tool/') || location.pathname.startsWith('/tools/');
  const { preferences, toggleFavorite } = useUser();
  const favoriteTools = TOOLS.filter(t => preferences.favorites?.includes(t.slug));

  if (!isToolPage && !isMobile) return null;

  const sidebarWidth = isCollapsed && !isMobile ? "w-20" : "w-72";

  return (
    <aside className={cn(
      isMobile 
        ? "flex flex-col h-full bg-white dark:bg-slate-900" 
        : cn("hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto transition-all duration-300", sidebarWidth)
    )}>
      {isMobile && (
        <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
              <Icon name="Gauge" size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              SEO Tools
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all bg-slate-100 dark:bg-slate-800 rounded-xl active:scale-90 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Close sidebar"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Close</span>
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      <div className={cn("overflow-y-auto flex-1 p-6", isCollapsed && !isMobile && "px-4", isMobile && "pt-4")}>
        {!isMobile && (
          <div className={cn("flex items-center mb-6 sm:mb-8", isCollapsed && !isMobile ? "justify-center" : "justify-between")}>
            {(!isCollapsed) && (
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40">
                  <Icon name="Gauge" size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em]">
                  SEO Tools
                </h2>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {/* Favorites Section */}
          {favoriteTools.length > 0 && (
            <div className="mb-6">
              {!isCollapsed || isMobile ? (
                <div className="flex items-center gap-2 mb-3 px-3">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Favorites</span>
                </div>
              ) : (
                <div className="flex justify-center mb-3">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                </div>
              )}
              <div className="space-y-1">
                {favoriteTools.map(tool => {
                  const isActive = tool.id === currentToolId || tool.slug === currentToolId;
                  return (
                    <div key={`fav-${tool.id}`} className="relative group/fav">
                      <Link
                        to={`/tools/${tool.slug}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all group/item relative",
                          isActive
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-100 dark:shadow-none translate-x-1"
                            : "text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                        )}
                        title={isCollapsed && !isMobile ? tool.name : undefined}
                      >
                        <div className={cn(
                          "p-1 rounded-md transition-colors shrink-0",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 group-hover/item:text-amber-600"
                        )}>
                          <Icon name={tool.icon} size={12} strokeWidth={3} />
                        </div>
                        {(!isCollapsed || isMobile) && <span className="truncate">{tool.name}</span>}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category];
            const isExpanded = expandedCategories.includes(category);
            const categoryTools = TOOLS.filter(t => t.category === category);
            const hasActiveTool = categoryTools.some(t => t.id === currentToolId || t.slug === currentToolId);
            
            // Tooltip for collapsed state
            const tooltipContent = isCollapsed && !isMobile 
              ? `${category}\n• ${categoryTools.map(t => t.name).join('\n• ')}`
              : undefined;

            return (
              <div key={category} className="relative group/category">
                <button
                  id={`category-btn-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isExpanded}
                  aria-controls={`category-panel-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  className={cn(
                    "w-full flex items-center p-3 rounded-xl transition-all group",
                    isCollapsed && !isMobile ? "justify-center" : "justify-between",
                    (isExpanded || hasActiveTool)
                      ? "bg-slate-50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                  title={tooltipContent}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      (isExpanded || hasActiveTool)
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700"
                    )}>
                      <Icon name={config.icon} size={16} strokeWidth={2.5} />
                    </div>
                    {(!isCollapsed || isMobile) && <span className="text-sm font-bold tracking-tight">{category}</span>}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (!isCollapsed || isMobile) && (
                    <motion.div
                      id={`category-panel-${category.replace(/\s+/g, '-').toLowerCase()}`}
                      role="region"
                      aria-labelledby={`category-btn-${category.replace(/\s+/g, '-').toLowerCase()}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 sm:pl-8 pr-2 py-1 space-y-1">
                        {categoryTools.map((tool) => {
                          const isActive = tool.id === currentToolId || tool.slug === currentToolId;
                          return (
                            <Link
                              key={tool.id}
                              to={`/tools/${tool.slug}`}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all group/item relative",
                                isActive
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 translate-x-1"
                                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              )}
                            >
                              {isActive && (
                                <motion.div 
                                  layoutId="active-indicator"
                                  className="absolute -left-2 w-1 h-4 bg-indigo-600 rounded-full"
                                />
                              )}
                              <div className={cn(
                                "p-1 rounded-md transition-colors",
                                isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 group-hover/item:text-indigo-600"
                              )}>
                                <Icon name={tool.icon} size={12} strokeWidth={3} />
                              </div>
                              <span className="truncate">{tool.name}</span>
                              <div className="ml-auto flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(tool.slug);
                                  }}
                                  className={cn(
                                    "p-1 rounded-md transition-all opacity-0 group-hover/item:opacity-100",
                                    preferences.favorites?.includes(tool.slug) 
                                      ? "text-amber-400 opacity-100" 
                                      : "text-slate-300 hover:text-amber-400"
                                  )}
                                >
                                  <Star size={10} fill={preferences.favorites?.includes(tool.slug) ? "currentColor" : "none"} />
                                </button>
                                {isActive && <ChevronRight size={10} className="opacity-60" strokeWidth={4} />}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn("mt-auto p-6 border-t border-slate-100 dark:border-slate-800", isCollapsed && !isMobile && "px-4")}>
        <Link
          to="/profile"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm mb-2",
            isCollapsed && !isMobile && "justify-center",
            location.pathname === '/profile'
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
          )}
          title={isCollapsed && !isMobile ? "Your Profile" : undefined}
        >
          <Icon name="User" size={18} />
          {(!isCollapsed || isMobile) && <span>Profile</span>}
        </Link>
        <Link
          to="/"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-sm mb-2",
            isCollapsed && !isMobile && "justify-center"
          )}
          title={isCollapsed && !isMobile ? "Back to Dashboard" : undefined}
        >
          <Icon name="LayoutDashboard" size={18} />
          {(!isCollapsed || isMobile) && <span>Dashboard</span>}
        </Link>
        <Link
          to="/guides"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm mb-2",
            isCollapsed && !isMobile && "justify-center",
            location.pathname.startsWith('/guides')
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
          )}
          title={isCollapsed && !isMobile ? "Learning Academy" : undefined}
        >
          <Icon name="GraduationCap" size={18} />
          {(!isCollapsed || isMobile) && <span>Academy</span>}
        </Link>
        <Link
          to="/faq"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm",
            isCollapsed && !isMobile && "justify-center",
            location.pathname === '/faq'
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
          )}
          title={isCollapsed && !isMobile ? "FAQ" : undefined}
        >
          <Icon name="CircleHelp" size={18} />
          {(!isCollapsed || isMobile) && <span>FAQ</span>}
        </Link>
      </div>
    </aside>
  );
});
