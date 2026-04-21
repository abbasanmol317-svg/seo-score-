import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface SERPPreviewProps {
  title: string;
  description: string;
  siteName?: string;
  siteUrl?: string;
  mode?: 'desktop' | 'mobile';
  onTitleChange?: (val: string) => void;
  onDescriptionChange?: (val: string) => void;
  onSiteNameChange?: (val: string) => void;
  onSiteUrlChange?: (val: string) => void;
  onModeChange?: (mode: 'desktop' | 'mobile') => void;
  showEditor?: boolean;
}

export const SERPPreview: React.FC<SERPPreviewProps> = ({
  title,
  description,
  siteName = 'SEO Score',
  siteUrl = 'https://seoscore.site',
  mode = 'desktop',
  onTitleChange,
  onDescriptionChange,
  onSiteNameChange,
  onSiteUrlChange,
  onModeChange,
  showEditor = true
}) => {
  const previewTitle = title.length > 61 ? title.substring(0, 58) + '...' : title;
  const previewDescription = description.length > 161 ? description.substring(0, 158) + '...' : description;

  return (
    <div className="space-y-8">
      {showEditor && (
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-14">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page Title</label>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  title.length > 61 || title.length < 30 
                    ? "bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                    : "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                )}>
                  {title.length} / 60 Chars
                </span>
              </div>
              <div className="relative group/title">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/title:text-indigo-500 transition-colors">
                  <Icons.Type size={16} />
                </div>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange?.(e.target.value)}
                  placeholder="Enter SEO title..."
                  className="w-full bg-slate-50 dark:bg-slate-800/30 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-slate-200 font-bold tracking-tight"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Meta Description</label>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  description.length > 161 || description.length < 120 
                    ? "bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                    : "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                )}>
                  {description.length} / 160 Chars
                </span>
              </div>
              <div className="relative group/desc">
                <div className="absolute left-4 top-4 text-slate-400 group-focus-within/desc:text-indigo-500 transition-colors">
                  <Icons.AlignLeft size={16} />
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => onDescriptionChange?.(e.target.value)}
                  placeholder="Enter SEO description..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800/30 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-slate-200 font-medium leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Icons.Globe size={12} className="text-indigo-500" />
              Brand & URL Settings
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Site Name</label>
                <div className="relative group/sitename">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/sitename:text-indigo-500 transition-colors">
                    <Icons.Building2 size={14} />
                  </div>
                  <input 
                    type="text"
                    value={siteName}
                    onChange={(e) => onSiteNameChange?.(e.target.value)}
                    placeholder="e.g. My Agency"
                    className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Slug / Display URL</label>
                <div className="relative group/siteurl">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/siteurl:text-indigo-500 transition-colors">
                    <Icons.Link size={14} />
                  </div>
                  <input 
                    type="text"
                    value={siteUrl}
                    onChange={(e) => onSiteUrlChange?.(e.target.value)}
                    placeholder="e.g. site.com/page"
                    className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
              <button
                onClick={() => onModeChange?.('desktop')}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  mode === 'desktop' 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <Icons.Monitor size={14} />
                Desktop
              </button>
              <button
                onClick={() => onModeChange?.('mobile')}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  mode === 'mobile' 
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <Icons.Smartphone size={14} />
                Mobile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Icons.Eye size={12} className="text-indigo-500" />
          Live Result
        </h4>
        
        <div className={cn(
          "bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 min-h-[180px] flex flex-col justify-center",
          mode === 'mobile' ? "max-w-[420px] mx-auto ring-[12px] ring-slate-100 dark:ring-slate-800/50" : "w-full"
        )}>
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
            {mode === 'desktop' ? <Icons.Monitor size={140} /> : <Icons.Smartphone size={140} />}
          </div>

          <div className="relative z-10 font-sans group/serp">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 transition-transform group-hover/serp:scale-110">
                {siteUrl ? (
                  <img 
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${siteUrl.includes('://') ? siteUrl : `https://${siteUrl}`}`} 
                    alt="" 
                    className="w-full h-full object-contain p-1.5"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                    }}
                  />
                ) : (
                  <Icons.Globe size={16} />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "font-medium text-slate-900 dark:text-slate-200 truncate font-sans",
                    mode === 'mobile' ? "text-xs" : "text-sm"
                  )}>
                    {siteName || 'Enter Site Name'}
                  </span>
                  <Icons.ChevronDown size={12} className="text-slate-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate opacity-80 font-sans">{siteUrl || 'example.com/slug'}</span>
              </div>
            </div>

            <button className={cn(
              "text-[#1a0dab] dark:text-[#8ab4f8] hover:underline text-left cursor-pointer mb-2 leading-tight font-medium line-clamp-2 font-sans",
              mode === 'mobile' ? "text-xl" : "text-[20px]"
            )}>
              {previewTitle || 'Optimized Page Title Will Appear Here'}
            </button>

            <div className={cn(
              "text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2 opacity-90 font-sans",
              mode === 'mobile' ? "text-xs" : "text-sm"
            )}>
              {previewDescription || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
