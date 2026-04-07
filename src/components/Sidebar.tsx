import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TOOLS } from '../services/gemini';
import { CATEGORY_CONFIG } from '../constants';
import { cn } from '../lib/utils';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const currentToolId = location.pathname.startsWith('/tool/') ? location.pathname.split('/')[2] : null;
  const currentTool = currentToolId ? TOOLS.find(t => t.id === currentToolId) : null;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = Object.keys(CATEGORY_CONFIG).filter(cat => 
    TOOLS.some(t => t.category === cat)
  );

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    currentTool ? [currentTool.category] : []
  );

  React.useEffect(() => {
    if (currentTool && !expandedCategories.includes(currentTool.category)) {
      setExpandedCategories(prev => [...prev, currentTool.category]);
    }
  }, [currentToolId]);

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

  const isToolPage = location.pathname.startsWith('/tool/');

  if (!isToolPage && !isMobile) return null;

  const sidebarWidth = isCollapsed && !isMobile ? "w-20" : "w-72";

  return (
    <aside className={cn(
      isMobile 
        ? "flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto" 
        : cn("hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto transition-all duration-300", sidebarWidth)
    )}>
      <div className={cn("p-6", isCollapsed && !isMobile && "px-4")}>
        <div className={cn("flex items-center mb-6 sm:mb-8", isCollapsed && !isMobile ? "justify-center" : "justify-between")}>
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40">
                <Icons.Zap size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em]">
                SEO Tools
              </h2>
            </div>
          )}
          {!isMobile ? (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <Icons.PanelLeftOpen size={20} /> : <Icons.PanelLeftClose size={20} />}
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="p-2.5 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"
              aria-label="Close sidebar"
            >
              <Icons.X size={20} />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category];
            const isExpanded = expandedCategories.includes(category);
            const categoryTools = TOOLS.filter(t => t.category === category);
            const CategoryIcon = (Icons as any)[config.icon] || Icons.Folder;
            const hasActiveTool = categoryTools.some(t => t.id === currentToolId);

            return (
              <div key={category} className="space-y-1">
                <button
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "w-full flex items-center p-3 rounded-xl transition-all group",
                    isCollapsed && !isMobile ? "justify-center" : "justify-between",
                    (isExpanded || hasActiveTool) && (!isCollapsed || isMobile)
                      ? "bg-slate-50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                  title={isCollapsed && !isMobile ? category : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      (isExpanded || hasActiveTool)
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700"
                    )}>
                      <CategoryIcon size={16} strokeWidth={2.5} />
                    </div>
                    {(!isCollapsed || isMobile) && <span className="text-sm font-bold tracking-tight">{category}</span>}
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <Icons.ChevronDown size={14} />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (!isCollapsed || isMobile) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-11 pr-2 py-1 space-y-1">
                        {categoryTools.map((tool) => {
                          const isActive = tool.id === currentToolId;
                          return (
                            <Link
                              key={tool.id}
                              to={`/tool/${tool.id}`}
                              onClick={onClose}
                              className={cn(
                                "block px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                isActive
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
                                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                              )}
                            >
                              {tool.name}
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
          to="/"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-sm mb-2",
            isCollapsed && !isMobile && "justify-center"
          )}
          title={isCollapsed && !isMobile ? "Back to Dashboard" : undefined}
        >
          <Icons.LayoutDashboard size={18} />
          {(!isCollapsed || isMobile) && <span>Dashboard</span>}
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
          <Icons.HelpCircle size={18} />
          {(!isCollapsed || isMobile) && <span>FAQ</span>}
        </Link>
      </div>
    </aside>
  );
}
