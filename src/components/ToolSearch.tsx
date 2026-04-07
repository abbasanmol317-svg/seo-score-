import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { TOOLS, Tool } from '../services/gemini';
import { cn } from '../lib/utils';

interface ToolSearchProps {
  className?: string;
  onSelect?: () => void;
  autoFocus?: boolean;
}

export default function ToolSearch({ className, onSelect, autoFocus }: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    if (query.trim().length > 0) {
      const filtered = TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
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

  const handleSelect = (toolId: string) => {
    navigate(`/tool/${toolId}`);
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
        handleSelect(results[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full max-w-md mx-4", className)} ref={searchRef}>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icons.Search size={18} />
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
          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
        />
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
            <div className="p-2 max-h-[400px] overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Tools Found ({results.length})
              </div>
              {results.length > 0 ? (
                results.map((tool, index) => {
                  const ToolIcon = (Icons as any)[tool.icon] || Icons.Zap;
                  return (
                    <motion.button
                      key={tool.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelect(tool.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left",
                        selectedIndex === index 
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        selectedIndex === index 
                          ? "bg-white dark:bg-slate-800 shadow-sm" 
                          : "bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"
                      )}>
                        <ToolIcon size={18} className={cn(
                          selectedIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                        )} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-bold truncate">{tool.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{tool.category}</div>
                      </div>
                      <Icons.ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Icons.SearchX size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No tools found</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try searching for something else</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Icons.ArrowDown size={10} /> <Icons.ArrowUp size={10} /> to navigate</span>
                <span className="flex items-center gap-1"><Icons.CornerDownLeft size={10} /> to select</span>
              </div>
              <span className="flex items-center gap-1"><Icons.X size={10} /> to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
