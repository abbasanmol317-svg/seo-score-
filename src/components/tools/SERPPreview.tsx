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
  // Use full titles and descriptions to let CSS handle device-specific truncation simulation
  const displayTitle = title || 'Optimized Page Title Will Appear Here';
  const displayDescription = description || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.';

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

  // Calculate CTR Impact Score based on analysis and content
  const getCtrCalculations = () => {
    let score = 40;
    const powerWordsList = [/best/i, /free/i, /guide/i, /top/i, /2026/i, /how to/i, /why/i, /secret/i, /proven/i, /ultimate/i];
    let foundPowerWords = false;

    if (title.length >= 50 && title.length <= 60) score += 20;
    if (description.length >= 120 && description.length <= 160) score += 20;
    
    powerWordsList.forEach(pw => {
      if (pw.test(title + description)) {
        score += 5;
        foundPowerWords = true;
      }
    });

    if (ctrAnalysis) score += 10;
    return { score: Math.min(100, score), hasPowerWords: foundPowerWords };
  };

  const { score: ctrScore, hasPowerWords } = getCtrCalculations();

  // Extract structured insights from ctrAnalysis
  const triggers = ctrAnalysis?.match(/Trigger:\s*(.*)/i)?.[1] || 
                  ctrAnalysis?.match(/Emotional Triggers?:\s*(.*)/i)?.[1];
  const funnelStage = ctrAnalysis?.match(/Funnel Stage:\s*(.*)/i)?.[1];
  const predictedImpact = ctrAnalysis?.match(/Predicted CTR Impact:\s*(.*)/i)?.[1];

  const [showHeatmap, setShowHeatmap] = React.useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState('standard');

  const DEVICES = [
    { id: 'se', name: 'iPhone SE', width: 320 },
    { id: 'standard', name: 'iPhone 15', width: 393 },
    { id: 'large', name: 'S24 Ultra', width: 412 },
  ];

  const currentDevice = DEVICES.find(d => d.id === selectedDeviceId) || DEVICES[1];

  return (
    <div className="space-y-8">
      {showEditor && (
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-14">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page Title</label>
                <div className="flex items-center gap-2">
                  {title.length > 50 && title.length <= 60 && (
                    <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded animate-pulse">Perfect Length</span>
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
            
            <div className="p-5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icons.Zap size={14} className="text-indigo-500" />
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">SERP Visualizer</span>
                </div>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    showHeatmap 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                      : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
                  )}
                >
                  <Icons.Flame size={12} />
                  {showHeatmap ? "Heatmap On" : "Show Heatmap"}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Our heatmap simulation uses F-shaped eye-tracking patterns to predict where users focus their attention most in SERPs.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/card:opacity-[0.08] transition-opacity">
                <Icons.BarChart3 size={100} />
              </div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">CTR Impact Score</h4>
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-4xl font-black tracking-tight",
                      ctrScore > 80 ? "text-emerald-600" : ctrScore > 60 ? "text-amber-600" : "text-rose-600"
                    )}>
                      {ctrScore}%
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Predicted</span>
                  </div>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border transition-all duration-500",
                  ctrScore > 80 ? "border-emerald-100 dark:border-emerald-900/30 text-emerald-500" : 
                  ctrScore > 60 ? "border-amber-100 dark:border-amber-900/30 text-amber-500" : 
                  "border-rose-100 dark:border-rose-900/30 text-rose-500"
                )}>
                  {ctrScore > 80 ? <Icons.Trophy size={28} /> : ctrScore > 60 ? <Icons.TrendingUp size={28} /> : <Icons.AlertCircle size={28} />}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ctrScore}%` }}
                    className={cn(
                      "h-full transition-all duration-1000 relative",
                      ctrScore > 80 ? "bg-emerald-500" : ctrScore > 60 ? "bg-amber-500" : "bg-rose-500"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Trigger</span>
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                        {triggers || 'Authenticity'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Funnel</span>
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                        {funnelStage || 'Awareness'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Impact</span>
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate block">
                        {predictedImpact || 'High'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {ctrAnalysis && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Icons.Sparkles size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest tracking-tighter">AI Success Factors</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {ctrAnalysis.split('\n').find(l => l.length > 40 && !l.includes('##'))?.replace(/^[-*]\s*|^\d\.\s*/, '') || "Optimizing your tags for search visibility and click-through intent..."}
                    </p>
                  </div>
                </div>
              )}
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Preview Mode</span>
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

              {mode === 'mobile' && (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Simulate Device</span>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                    {DEVICES.map(device => (
                      <button
                        key={device.id}
                        onClick={() => setSelectedDeviceId(device.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-0.5 min-w-[80px]",
                          selectedDeviceId === device.id
                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        )}
                      >
                        <span>{device.name}</span>
                        <span className="text-[8px] opacity-60 font-medium">{device.width}px</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Icons.Eye size={12} className="text-indigo-500" />
            Live Result Preview
          </h4>
          {mode === 'mobile' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <Icons.Info size={10} className="text-slate-400" />
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                Simulating {currentDevice.name} width ({currentDevice.width}px)
              </span>
            </div>
          )}
        </div>
        
        <div 
          className={cn(
            "bg-white dark:bg-slate-950 transition-all duration-700 relative overflow-hidden flex flex-col group/serp",
            mode === 'mobile' 
              ? "mx-auto border-[14px] border-slate-900 dark:border-slate-800 rounded-[3.5rem] shadow-2xl min-h-[650px]" 
              : "w-full p-8 sm:p-12 min-h-[220px] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl"
          )}
          style={mode === 'mobile' ? { width: `${currentDevice.width + 28}px`, maxWidth: '100%' } : undefined}
        >
          {/* Heatmap Overlay */}
          {showHeatmap && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-60">
              <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-rose-500 rounded-full blur-[40px] animate-pulse" />
              <div className="absolute top-[20%] left-[20%] w-24 h-24 bg-orange-400 rounded-full blur-[30px]" />
              <div className="absolute top-[35%] left-[10%] w-40 h-16 bg-amber-400 rounded-full blur-[35px]" />
              <div className="absolute top-[50%] left-[5%] w-20 h-20 bg-yellow-300 rounded-full blur-[25px]" />
            </div>
          )}

          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover/serp:scale-110 transition-transform duration-1000">
            {mode === 'desktop' ? <Icons.Search size={180} /> : <Icons.Smartphone size={150} />}
          </div>

          {mode === 'mobile' && (
            <>
              {/* Phone Status Bar */}
              <div className="h-10 flex items-center justify-between px-8 text-white font-bold text-[10px] bg-slate-900 dark:bg-slate-800 sticky top-0 z-40">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Icons.Signal size={10} />
                  <Icons.Wifi size={10} />
                  <Icons.Battery size={14} />
                </div>
              </div>
              {/* Camera Notch Simulation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 dark:bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-slate-800 rounded-full" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>
            </>
          )}

          <div className={cn(
            "flex-grow relative z-10 p-6 pt-10",
            mode === 'mobile' && "bg-white dark:bg-slate-950 overflow-y-auto custom-scrollbar"
          )}>
            {/* Desktop and Mobile Headers differ slightly */}
            <div className={cn(
              "flex items-center gap-3 mb-3",
              mode === 'mobile' ? "flex-col items-start gap-1" : "flex-row"
            )}>
              {mode === 'mobile' ? (
                <div className="flex items-center gap-3 mb-2 w-full">
                  <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-md border border-slate-100 dark:border-slate-800">
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
                  <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[14px] font-medium text-slate-900 dark:text-slate-200 truncate">{siteName || 'Enter Site Name'}</span>
                      <Icons.MoreVertical size={14} className="text-slate-400" />
                    </div>
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 truncate opacity-80">{siteUrl || 'example.com'}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 transition-transform group-hover/serp:scale-110">
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
              "text-[#1a0dab] dark:text-[#8ab4f8] hover:underline text-left cursor-pointer mb-2 leading-tight font-sans",
              mode === 'mobile' ? "text-[22px] font-normal line-clamp-2" : "text-[20px] font-medium line-clamp-1"
            )}>
              {displayTitle}
            </button>

            {schema?.type === 'product' && schema.product && (
              <div className="flex items-center gap-1.5 text-[13px] text-[#70757a] dark:text-[#bdc1c6] mb-2 bg-slate-50 dark:bg-slate-800/50 w-fit px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
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
                <span className="font-bold">{schema.product.rating}</span>
                <span className="opacity-50">({schema.product.reviews})</span>
                <span className="opacity-20">|</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {schema.product.currency === 'USD' ? '$' : schema.product.currency === 'EUR' ? '€' : schema.product.currency === 'GBP' ? '£' : ''}
                  {schema.product.price}
                </span>
                <span className="opacity-20">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <Icons.Check size={12} />
                  In Stock
                </span>
              </div>
            )}

            {schema?.type === 'article' && schema.article && (
              <div className="text-[13px] text-[#70757a] dark:text-[#bdc1c6] mb-2 flex items-center gap-2">
                <Icons.Calendar size={12} />
                <span>{schema.article.date}</span>
              </div>
            )}

            <div className={cn(
              "text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed opacity-90 font-sans",
              mode === 'mobile' ? "text-[15px] line-clamp-3" : "text-sm line-clamp-2"
            )}>
              {displayDescription}
            </div>

            {schema?.type === 'faq' && schema.faq && schema.faq.length > 0 && (
              <div className="mt-3 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                {schema.faq.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 group/faq cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-lg transition-colors">
                    <span className="text-[14px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline truncate pr-4 font-sans">{item.q || 'Sample Question?'}</span>
                    <Icons.ChevronDown size={14} className="text-slate-400 shrink-0 group-hover/faq:text-indigo-500 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Highlights from CTR Analysis */}
          <div className="mt-6 flex flex-wrap gap-2 relative z-20">
            {ctrScore > 75 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1.5 px-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                <Icons.ArrowBigUpDash size={14} />
                High Impact Content
              </motion.div>
            )}
            {hasPowerWords && (
              <div className="p-1 px-2.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Icons.Sparkles size={12} />
                CTR Triggers Found
              </div>
            )}
            {title.length >= 50 && title.length <= 60 && (
              <div className="p-1 px-2.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} />
                Title Optimized
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
