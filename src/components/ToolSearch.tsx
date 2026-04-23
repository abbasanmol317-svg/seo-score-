import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Command } from 'lucide-react';
import { TOOLS, Tool } from '../services/gemini';
import { BLOG_POSTS, BlogPost } from '../constants/blogData';
import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';

interface ToolSearchProps {
  className?: string;
  onSelect?: () => void;
  autoFocus?: boolean;
  isMobile?: boolean;
}

type SearchResult = (Tool & { searchType: 'tool' }) | (BlogPost & { searchType: 'blog' });

export default function ToolSearch({ className, onSelect, autoFocus, isMobile: isMobileProp }: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = isMobileProp ?? (typeof window !== 'undefined' && window.innerWidth < 1024);

  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        const queryLower = query.toLowerCase();
        
        const filteredTools = TOOLS.filter(tool => 
          tool.name.toLowerCase().includes(queryLower) ||
          tool.category.toLowerCase().includes(queryLower) ||
          tool.description.toLowerCase().includes(queryLower)
        ).map(t => ({ ...t, searchType: 'tool' as const }));

        const filteredBlogs = BLOG_POSTS.filter(post =>
          post.title.toLowerCase().includes(queryLower) ||
          post.excerpt.toLowerCase().includes(queryLower) ||
          post.category.toLowerCase().includes(queryLower)
        ).map(p => ({ ...p, searchType: 'blog' as const }));

        setResults([...filteredTools, ...filteredBlogs].slice(0, 10));
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    if (result.searchType === 'tool') {
      navigate(`/tools/${result.slug || result.id}`);
    } else {
      navigate(`/blog/${result.slug}`);
    }
    setIsOpen(false);
    setQuery('');
    if (onSelect) onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full max-w-md", !isMobile && "mx-4", className)} ref={searchRef}>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon name="Search" size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          placeholder="Search SEO tools..."
          aria-label="Search SEO tools"
          className={cn(
            "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-xl pl-10 pr-4 text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200",
            isMobile ? "py-4 sm:py-3 text-base" : "py-3 sm:py-2"
          )}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors sm:hidden"
            aria-label="Clear search"
          >
            <Icon name="X" size={16} />
          </button>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
          <div className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
            ⌘K
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[60]"
          >
            <div className="p-2 max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Search Results ({results.length})
              </div>
              {results.length > 0 ? (
                results.map((result: SearchResult, index) => {
                  const isTool = result.searchType === 'tool';
                  return (
                    <motion.button
                      key={`${result.searchType}-${result.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelect(result)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left",
                        selectedIndex === index 
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors shrink-0",
                        selectedIndex === index 
                          ? "bg-white dark:bg-slate-800 shadow-sm" 
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"
                      )}>
                        <Icon name={isTool ? result.icon : 'FileText'} size={16} className={cn(
                          selectedIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400",
                          "sm:w-[18px] sm:h-[18px]"
                        )} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-bold truncate">{isTool ? result.name : result.title}</div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                            isTool ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20" : "bg-blue-100 text-blue-700 dark:bg-blue-900/20"
                          )}>
                            {isTool ? 'Tool' : 'Blog'}
                          </span>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{result.category}</div>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={14} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </motion.button>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Icon name="SearchX" size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No tools found</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try searching for something else</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1"><Icon name="ArrowDown" size={10} /> <Icon name="ArrowUp" size={10} /> to navigate</span>
                <span className="flex items-center gap-1"><Icon name="CornerDownLeft" size={10} /> to select</span>
              </div>
              <span className="flex items-center gap-1"><Icon name="X" size={10} /> to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
