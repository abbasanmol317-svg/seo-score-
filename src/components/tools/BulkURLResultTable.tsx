import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface BulkURLData {
  url: string;
  title: string;
  meta: string;
  status: 'GOOD' | 'AVERAGE' | 'POOR';
}

interface BulkURLResultTableProps {
  content: string;
}

export const BulkURLResultTable: React.FC<BulkURLResultTableProps> = ({ content }) => {
  const [filter, setFilter] = useState<'ALL' | 'GOOD' | 'AVERAGE' | 'POOR'>('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: keyof BulkURLData; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const data = useMemo(() => {
    const lines = content.split('\n').filter(line => line.includes('|') && !line.includes('---'));
    const rows: BulkURLData[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 4) {
        let status: 'GOOD' | 'AVERAGE' | 'POOR' = 'AVERAGE';
        const statusText = cols[3].toUpperCase();
        if (statusText.includes('GOOD')) status = 'GOOD';
        else if (statusText.includes('POOR')) status = 'POOR';
        
        rows.push({
          url: cols[0],
          title: cols[1],
          meta: cols[2],
          status
        });
      }
    }
    return rows;
  }, [content]);

  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (filter !== 'ALL') {
      result = result.filter(item => item.status === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.url.toLowerCase().includes(query) || 
        item.title.toLowerCase().includes(query) || 
        item.meta.toLowerCase().includes(query)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filter, sortConfig, searchQuery]);

  const requestSort = (key: keyof BulkURLData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof BulkURLData) => {
    if (!sortConfig || sortConfig.key !== key) return <Icons.ChevronsUpDown size={12} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <Icons.ChevronUp size={12} className="text-indigo-600" /> : <Icons.ChevronDown size={12} className="text-indigo-600" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter Status:</span>
          {(['ALL', 'GOOD', 'AVERAGE', 'POOR'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border",
                filter === s 
                  ? "bg-indigo-600 text-white border-indigo-600" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
              )}
            >
              {s === 'ALL' ? 'Show All' : s}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64 group">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search URLs or Titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <th onClick={() => requestSort('url')} className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">URL {getSortIcon('url')}</div>
              </th>
              <th onClick={() => requestSort('title')} className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">Title {getSortIcon('title')}</div>
              </th>
              <th onClick={() => requestSort('meta')} className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">Meta Description {getSortIcon('meta')}</div>
              </th>
              <th onClick={() => requestSort('status')} className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredData.length > 0 ? filteredData.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]" title={item.url}>{item.url}</span>
                    <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1">
                      Open <Icons.ExternalLink size={10} />
                    </a>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">{item.title}</p>
                </td>
                <td className="p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.meta}</p>
                </td>
                <td className="p-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-black border",
                    item.status === 'GOOD' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50" :
                    item.status === 'AVERAGE' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50" :
                    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50"
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-700">
                      <Icons.SearchX size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No matching URLs found.</p>
                    <button onClick={() => { setFilter('ALL'); setSearchQuery(''); }} className="text-xs font-bold text-indigo-600 hover:underline">Clear all filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
