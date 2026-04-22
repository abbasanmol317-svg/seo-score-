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
  schema?: {
    type: string;
    product?: { rating: string; reviews: string; price: string; currency: string };
    article?: { date: string };
    faq?: { q: string; a: string }[];
  };
  ctrAnalysis?: string;
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
  showEditor = true,
  schema,
  ctrAnalysis
}) => {
  const previewTitle = title.length > 61 ? title.substring(0, 58) + '...' : title;
  const previewDescription = description.length > 161 ? description.substring(0, 158) + '...' : description;

  const getTitleColor = (len: number) => {
    if (len === 0) return "bg-slate-100 text-slate-500 dark:bg-slate-800";
    if (len > 60) return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
    if (len < 30) return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  const getDescColor = (len: number) => {
    if (len === 0) return "bg-slate-100 text-slate-500 dark:bg-slate-800";
    if (len > 160) return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
    if (len < 120) return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  // Simple CTR Impact analysis based on length and keywords
  const titleScore = Math.min(100, Math.max(0, title.length > 30 && title.length < 60 ? 100 : 50));
  const descScore = Math.min(100, Math.max(0, description.length > 120 && description.length < 160 ? 100 : 50));
  const hasPowerWords = /(best|free|top|202[0-9]|get|now|instant|tutorial|guide)/i.test(title + description);
  const totalCtrScore = Math.round((titleScore + descScore + (hasPowerWords ? 20 : 0)) / 2.2);

  return (
    <div className="space-y-8">
      {showEditor && (
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-14">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page Title</label>
                <div className="flex items-center gap-2">
                  {title.length > 50 && (
                    <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded animate-pulse">High CTR Potential</span>
                  )}
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
                    getTitleColor(title.length)
                  )}>
                    {title.length} / 60 Chars
                  </span>
                </div>
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
                  "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
                  getDescColor(description.length)
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
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Icons.Globe size={12} className="text-indigo-500" />
                Brand & URL Settings
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">CTR Strength</span>
                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalCtrScore}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      totalCtrScore > 80 ? "bg-emerald-500" : totalCtrScore > 50 ? "bg-amber-500" : "bg-rose-500"
                    )}
                  />
                </div>
              </div>
            </div>
            
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
          "bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 flex flex-col justify-center",
          mode === 'mobile' 
            ? "max-w-[380px] mx-auto ring-[1px] ring-slate-200 dark:ring-slate-800 p-4 pt-12 pb-16" 
            : "w-full p-8 sm:p-10 min-h-[180px]"
        )}>
          {mode === 'mobile' && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <div className="w-12 h-1 rounded-full bg-slate-300" />
            </div>
          )}

          <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
            {mode === 'desktop' ? <Icons.Monitor size={140} /> : <Icons.Smartphone size={100} />}
          </div>

          <div className="relative z-10 font-sans group/serp">
            {/* Desktop and Mobile Headers differ slightly */}
            <div className={cn(
              "flex items-center gap-3 mb-3",
              mode === 'mobile' ? "flex-col items-start gap-1" : "flex-row"
            )}>
              {mode === 'mobile' ? (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                    {siteUrl ? (
                      <img 
                        src={`https://www.google.com/s2/favicons?sz=64&domain=${siteUrl.includes('://') ? siteUrl : `https://${siteUrl}`}`} 
                        alt="" 
                        className="w-full h-full object-contain p-1"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                        }}
                      />
                    ) : (
                      <Icons.Globe size={12} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-normal text-slate-900 dark:text-slate-200 truncate">{siteName || 'Enter Site Name'}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate opacity-80">{siteUrl || 'example.com'}</span>
                  </div>
                </div>
              ) : (
                <>
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
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate font-sans">
                        {siteName || 'Enter Site Name'}
                      </span>
                      <Icons.ChevronDown size={12} className="text-slate-400" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate opacity-80 font-sans">{siteUrl || 'example.com/slug'}</span>
                  </div>
                </>
              )}
            </div>

            <button className={cn(
              "text-[#1a0dab] dark:text-[#8ab4f8] hover:underline text-left cursor-pointer mb-1 leading-tight font-medium line-clamp-2 font-sans",
              mode === 'mobile' ? "text-xl font-normal" : "text-[20px]"
            )}>
              {previewTitle || 'Optimized Page Title Will Appear Here'}
            </button>

            {schema?.type === 'product' && schema.product && (
              <div className="flex items-center gap-1 text-[12px] text-[#70757a] dark:text-[#bdc1c6] mb-1">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icons.Star 
                      key={i} 
                      size={12} 
                      fill={i < Math.floor(parseFloat(schema.product!.rating)) ? "currentColor" : "none"} 
                      className={i < Math.floor(parseFloat(schema.product!.rating)) ? "" : "opacity-30"}
                    />
                  ))}
                </div>
                <span>Rating: {schema.product.rating}/5</span>
                <span>•</span>
                <span>{schema.product.reviews} reviews</span>
                <span>•</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {schema.product.currency === 'USD' ? '$' : schema.product.currency === 'EUR' ? '€' : schema.product.currency === 'GBP' ? '£' : ''}
                  {schema.product.price}
                </span>
                <span className="px-1 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold rounded">In Stock</span>
              </div>
            )}

            {schema?.type === 'article' && schema.article && (
              <div className="text-[12px] text-[#70757a] dark:text-[#bdc1c6] mb-1">
                <span>{schema.article.date}</span>
              </div>
            )}

            <div className={cn(
              "text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed opacity-90 font-sans",
              mode === 'mobile' ? "text-sm line-clamp-3" : "text-sm line-clamp-2"
            )}>
              {previewDescription || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.'}
            </div>

            {schema?.type === 'faq' && schema.faq && schema.faq.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                {schema.faq.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 group/faq cursor-pointer">
                    <span className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline truncate pr-4">{item.q || 'Sample Question?'}</span>
                    <Icons.ChevronDown size={14} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* High-Impact Highlights / Tooltips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {hasPowerWords && (
              <div className="p-1 px-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Icons.Sparkles size={10} />
                Power Words Detected
              </div>
            )}
            {title.length >= 50 && title.length <= 60 && (
              <div className="p-1 px-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded text-[9px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Icons.CheckCircle2 size={10} />
                Optimal Title Length
              </div>
            )}
            {description.length >= 120 && description.length <= 160 && (
              <div className="p-1 px-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Icons.CheckCircle2 size={10} />
                Optimal Description Length
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
