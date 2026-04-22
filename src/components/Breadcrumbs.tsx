import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest",
        className
      )}
    >
      <Link 
        to="/" 
        className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Icons.Home size={12} className="sm:w-3.5 sm:h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Icons.ChevronRight size={10} className="text-slate-300 dark:text-slate-700 sm:w-3 sm:h-3" />
          {item.path && !item.active ? (
            <Link 
              to={item.path} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[100px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                "truncate max-w-[120px] sm:max-w-none",
                item.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-700"
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
