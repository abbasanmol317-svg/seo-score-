import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolPlaceholder } from './ToolPlaceholder';
import { cn } from '../../lib/utils';
import { runTool } from '../../services/gemini';
import { SERPPreview } from './SERPPreview';
import { ToolResult } from './ToolResult';

export const MetaTagToolUI: React.FC<ToolComponentProps> = (props) => {
  const {
    tool,
    input,
    setInput,
    result,
    loading,
    error,
    handleRun,
    handleClear,
    handleCopy,
    handlePrint,
    handleDownloadPDF,
    isDownloading,
    isGeneratingPDF,
    copied,
    showShareMenu,
    setShowShareMenu,
    handleShare,
    reportRef,
    loadingMessage,
    progress,
    currentTip,
  } = props;

  // Extract title and description from the result if possible for a preview
  const titleMatch = result.match(/## 🏷️ Title Tag\n(.*?)(?=\n##|$)/s);
  const descMatch = result.match(/## 📝 Meta Description\n(.*?)(?=\n##|$)/s);
  const boostedMatch = result.match(/## 🚀 High-CTR "Boosted" Versions?\n(.*?)(?=\n##|$)/s);
  const ctrMatch = result.match(/## 📈 CTR Analysis & Suggestions\n(.*?)(?=\n##|$)/s);
  const descAuditMatch = result.match(/### 📝 Meta Description Audit\n(.*?)(?=\n##|$)/s);
  const codeMatch = result.match(/## 💻 Code Snippet\n```(?:html)?\n([\s\S]*?)\n```/s);

  const title = titleMatch ? titleMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  const description = descMatch ? descMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : '';
  
  const boostedText = boostedMatch ? boostedMatch[1].trim() : '';
  
  // Parse variations
  const variations = boostedText.split(/### Variation \d+/).filter(v => v.trim().length > 0).map(v => {
    const triggerMatch = v.match(/- \*\*Trigger\*\*: (.*?)(?=\n|$)/);
    const tMatch = v.match(/- \*\*Title\*\*: (.*?)(?=\n- \*\*Description\*\*|$)/s);
    const dMatch = v.match(/- \*\*Description\*\*: (.*?)(?=\n- \*\*CTR Suggestions\*\*|$)/s);
    const sMatch = v.match(/- \*\*CTR Suggestions\*\*: (.*?)(?=\n###|$)/s);
    
    // Fallback for old format if regex fails
    if (!tMatch && !dMatch) {
      const oldTitleMatch = v.match(/- Title: (.*?)(?=\n- Description:|$)/s);
      const oldDescMatch = v.match(/- Description: (.*?)(?=\n|$)/s);
      return {
        trigger: triggerMatch ? triggerMatch[1].trim() : 'Boosted',
        title: oldTitleMatch ? oldTitleMatch[1].trim() : '',
        description: oldDescMatch ? oldDescMatch[1].trim() : v.trim(),
        improvements: ''
      };
    }

    return {
      trigger: triggerMatch ? triggerMatch[1].trim() : 'Boosted',
      title: tMatch ? tMatch[1].trim() : '',
      description: dMatch ? dMatch[1].trim() : '',
      improvements: sMatch ? sMatch[1].trim() : ''
    };
  }).filter(v => v.title || v.description);

  const ctrAnalysis = ctrMatch ? ctrMatch[1].trim() : '';
  const descAudit = descAuditMatch ? descAuditMatch[1].trim() : '';
  
  const clarityMatch = descAudit.match(/#### 🎯 Clarity & Intent Analysis\n(.*?)(?=\n####|$)/s);
  const keywordMatch = descAudit.match(/#### 🔑 Keyword Integration Strategy\n(.*?)(?=\n####|$)/s);
  const improvementsMatch = descAudit.match(/#### 🚀 Key CTR Improvements\n(.*?)(?=\n####|$)/s);
  
  const clarityAnalysis = clarityMatch ? clarityMatch[1].trim() : '';
  const keywordStrategy = keywordMatch ? keywordMatch[1].trim() : '';
  const keyImprovementsRaw = improvementsMatch ? improvementsMatch[1].trim() : '';
  
  const codeSnippet = codeMatch ? codeMatch[1].trim() : '';

  // Google Search Preview Truncation
  const [showBoosted, setShowBoosted] = React.useState(false);
  const [selectedVariation, setSelectedVariation] = React.useState(0);
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [siteName, setSiteName] = React.useState('SEO Score');
  const [siteUrl, setSiteUrl] = React.useState('https://seoscore.site');

  const [editableTitle, setEditableTitle] = React.useState('');
  const [editableDescription, setEditableDescription] = React.useState('');

  // Schema Markup State
  const [showSchemaFields, setShowSchemaFields] = React.useState(false);
  const [schemaType, setSchemaType] = React.useState<'product' | 'article' | 'local_business' | 'organization' | 'faq'>('product');

  // Product Schema Fields
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [productCurrency, setProductCurrency] = React.useState('USD');
  const [productRating, setProductRating] = React.useState('5');
  const [productReviews, setProductReviews] = React.useState('10');

  // Article Schema Fields
  const [articleAuthor, setArticleAuthor] = React.useState('');
  const [articleDate, setArticleDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [articleImage, setArticleImage] = React.useState('');

  // Local Business Schema Fields
  const [businessName, setBusinessName] = React.useState('');
  const [businessAddress, setBusinessAddress] = React.useState('');
  const [businessPhone, setBusinessPhone] = React.useState('');
  const [businessOpeningHours, setBusinessOpeningHours] = React.useState('Mo-Fr 09:00-17:00');

  // Organization Schema Fields
  const [orgName, setOrgName] = React.useState('');
  const [orgLogo, setOrgLogo] = React.useState('');

  // FAQ Schema Fields
  const [faqQuestions, setFaqQuestions] = React.useState<{ q: string, a: string }[]>([{ q: '', a: '' }]);

  // Bulk Mode State
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const handleRunMeta = () => {
    if (isBulkMode) {
      handleRunBulk();
      return;
    }
    
    let finalInput = input;
    
    // Add Brand Context if provided and not default
    const brandContext = [];
    if (siteName && siteName !== 'SEO Score') brandContext.push(`Site Name: ${siteName}`);
    if (siteUrl && siteUrl !== 'https://seoscore.site' && !input.includes(siteUrl)) brandContext.push(`Site URL: ${siteUrl}`);
    
    if (brandContext.length > 0) {
      finalInput = `Target Page: ${input}\n\nBrand Context:\n${brandContext.join('\n')}`;
    }
    
    if (showSchemaFields) {
      if (schemaType === 'product' && productName) {
        finalInput = `${finalInput}\n\nProduct Schema Details:\n- Name: ${productName}\n- Price: ${productPrice} ${productCurrency}\n- Rating: ${productRating}/5\n- Reviews: ${productReviews}`;
      } else if (schemaType === 'article') {
        finalInput = `${finalInput}\n\nArticle Schema Details:\n- Author: ${articleAuthor}\n- Published Date: ${articleDate}\n- Image URL: ${articleImage}`;
      } else if (schemaType === 'local_business' && businessName) {
        finalInput = `${finalInput}\n\nLocal Business Schema Details:\n- Name: ${businessName}\n- Address: ${businessAddress}\n- Phone: ${businessPhone}\n- Hours: ${businessOpeningHours}`;
      } else if (schemaType === 'organization' && orgName) {
        finalInput = `${finalInput}\n\nOrganization Schema Details:\n- Name: ${orgName}\n- Logo URL: ${orgLogo}`;
      } else if (schemaType === 'faq' && faqQuestions[0].q) {
        finalInput = `${finalInput}\n\nFAQ Schema Details:\n${faqQuestions.map(f => `- Q: ${f.q}\n  A: ${f.a}`).join('\n')}`;
      }
    }
    
    handleRun(finalInput);
  };

  const handleRunBulk = async () => {
    const urls = bulkInput.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urls.length === 0) {
      setBulkError("Please enter at least one URL.");
      return;
    }

    setIsBulkRunning(true);
    setBulkError(null);
    setBulkResults([]);
    setBulkProgress(0);

    const results: any[] = [];
    for (let i = 0; i < urls.length; i++) {
      try {
        setBulkProgress(Math.round((i / urls.length) * 100));
        const res = await runTool('meta-tag', urls[i]);
        
        // Parse result
        const tMatch = res.match(/## 🏷️ Title Tag\n(.*?)(?=\n##|$)/s);
        const dMatch = res.match(/## 📝 Meta Description\n(.*?)(?=\n##|$)/s);
        
        results.push({
          url: urls[i],
          title: tMatch ? tMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : 'N/A',
          description: dMatch ? dMatch[1].replace(/\[GOOD\]|\[AVERAGE\]|\[POOR\]/g, '').trim() : 'N/A',
          status: 'Success'
        });
      } catch (err: any) {
        results.push({
          url: urls[i],
          title: 'Error',
          description: err.message || 'Failed to generate',
          status: 'Failed'
        });
      }
      setBulkResults([...results]);
    }

    setBulkProgress(100);
    setIsBulkRunning(false);
  };

  const downloadCSV = () => {
    if (bulkResults.length === 0) return;

    const headers = ['URL', 'Title', 'Description', 'Status'];
    const csvContent = [
      headers.join(','),
      ...bulkResults.map(r => [
        `"${r.url.replace(/"/g, '""')}"`,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.description.replace(/"/g, '""')}"`,
        `"${r.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `meta-tags-bulk-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearBulk = () => {
    setBulkInput('');
    setBulkResults([]);
    setBulkError(null);
  };

  const schemaMatch = result.match(/## 🛠️ Schema Markup \(JSON-LD\)\n[\s\S]*?```json\n([\s\S]*?)\n```/s);
  const schemaSnippet = schemaMatch ? schemaMatch[1].trim() : '';

  const selfOptimizationMatch = result.match(/## 💎 Self-Optimization Suggestion\n(.*?)(?=\n##|$)/s);
  const selfOptimization = selfOptimizationMatch ? selfOptimizationMatch[1].trim() : '';

  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedSchema, setCopiedSchema] = React.useState(false);

  const handleCopyCode = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopySchema = () => {
    if (schemaSnippet) {
      navigator.clipboard.writeText(schemaSnippet);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const currentTitle = showBoosted && variations.length > 0 
    ? variations[selectedVariation]?.title || title 
    : title;
  const currentDescription = showBoosted && variations.length > 0 
    ? variations[selectedVariation]?.description || description 
    : description;

  // Sync initial AI results to editable state
  useEffect(() => {
    setEditableTitle(currentTitle);
    setEditableDescription(currentDescription);
  }, [currentTitle, currentDescription]);

  // Sync site URL from input
  useEffect(() => {
    if (input && !isBulkMode) {
      try {
        const urlStr = input.trim();
        if (urlStr.includes('.') || urlStr.startsWith('http')) {
          const url = new URL(urlStr.includes('://') ? urlStr : `https://${urlStr}`);
          setSiteUrl(url.hostname + (url.pathname !== '/' ? url.pathname : ''));
        }
      } catch (e) {
        // Not a full URL structure, ignore
      }
    }
  }, [input, isBulkMode]);

  // Handle AdSense - Push only once when ready
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        // Only push if there are empty slots
        const ads = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])');
        if (ads.length > 0) {
          ads.forEach(() => {
            try {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            } catch (e) {
              console.error('AdSense push error:', e);
            }
          });
        }
      }
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, [result]); // Re-try on new results as layout changes

  return (
    <ToolLayout
      inputSection={
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                isBulkMode ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {isBulkMode ? <Icons.Layers size={16} /> : <Icons.FileText size={16} />}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBulkMode ? "Bulk URL Mode" : "Single URL Mode"}
              </h3>
            </div>
            <button
              onClick={() => setIsBulkMode(!isBulkMode)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                isBulkMode 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {isBulkMode ? <Icons.Check size={12} /> : <Icons.Zap size={12} />}
              {isBulkMode ? "Switch to Single" : "Switch to Bulk"}
            </button>
          </div>

          {isBulkMode ? (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Enter URLs (one per line)...&#10;https://example.com&#10;https://example.com/blog"
                  className="w-full h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-slate-200 resize-none font-mono"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {bulkInput.split('\n').filter(u => u.trim()).length} URLs
                </div>
              </div>

              {bulkError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-medium">
                  <Icons.AlertCircle size={16} />
                  {bulkError}
                </div>
              )}

              <button
                onClick={handleRunMeta}
                disabled={isBulkRunning || !bulkInput.trim()}
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                  isBulkRunning 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
                )}
              >
                {isBulkRunning ? (
                  <>
                    <Icons.Loader2 size={20} className="animate-spin" />
                    Processing {bulkProgress}%
                  </>
                ) : (
                  <>
                    <Icons.Play size={20} fill="currentColor" />
                    Generate Bulk Meta Tags
                  </>
                )
              }
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <ToolInput
                tool={tool}
                input={input}
                setInput={setInput}
                handleRun={handleRunMeta}
                handleClear={handleClear}
                loading={loading}
              />

              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <Icons.Globe size={14} />
                    </div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Brand Identity</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Affects Preview & AI Context</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group/site">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2 group-focus-within/site:text-indigo-500 transition-colors">
                      <Icons.Building2 size={12} />
                      Site Name
                    </label>
                    <input 
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="e.g. My Awesome Site"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all dark:text-slate-200 font-bold"
                    />
                  </div>
                  <div className="space-y-2 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group/url">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2 group-focus-within/url:text-indigo-500 transition-colors">
                      <Icons.Link size={12} />
                      Slug / Display URL
                    </label>
                    <input 
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="e.g. awesome.site/page"
                      className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all dark:text-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-amber-100 dark:border-amber-900/30 p-1 shadow-xl shadow-amber-500/5 relative overflow-hidden group/schema-box">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover/schema-box:scale-110 transition-transform duration-700">
                  <Icons.Code2 size={120} />
                </div>
                
                <button 
                  onClick={() => setShowSchemaFields(!showSchemaFields)}
                  className="flex items-center justify-between w-full p-5 sm:p-7 group/btn relative z-10"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-lg shadow-amber-200 dark:shadow-none group-hover/btn:scale-110 transition-all">
                      <Icons.PlusSquare size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Rich Result Schema Generator</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Select type & boost search visibility</p>
                    </div>
                  </div>
                  <div className={cn(
                    "p-2 rounded-xl transition-all",
                    showSchemaFields ? "bg-amber-600 text-white rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}>
                    <Icons.ChevronDown size={20} />
                  </div>
                </button>

                {showSchemaFields && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-8 space-y-8 relative z-10"
                  >
                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-2" />
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">1. Select Schema Type</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {[
                          { id: 'product', label: 'Product', icon: Icons.Package, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
                          { id: 'article', label: 'Article', icon: Icons.FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                          { id: 'local_business', label: 'Local Business', icon: Icons.MapPin, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
                          { id: 'organization', label: 'Organization', icon: Icons.Building2, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
                          { id: 'faq', label: 'FAQ', icon: Icons.HelpCircle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' }
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSchemaType(type.id as any)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all",
                              schemaType === type.id 
                                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-lg transition-colors",
                              schemaType === type.id ? type.color : "bg-slate-100 dark:bg-slate-800"
                            )}>
                              <type.icon size={18} />
                            </div>
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">2. Provide Schema Details</label>
                      <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-inner">
                        {schemaType === 'product' && (
                          <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                            <input 
                              type="text"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              placeholder="e.g. Premium Running Shoes"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Price</label>
                              <input 
                                type="number"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                placeholder="99.99"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Currency</label>
                              <select 
                                value={productCurrency}
                                onChange={(e) => setProductCurrency(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                              >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Rating (1-5)</label>
                            <input 
                              type="number"
                              min="1"
                              max="5"
                              step="0.1"
                              value={productRating}
                              onChange={(e) => setProductRating(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Review Count</label>
                            <input 
                              type="number"
                              value={productReviews}
                              onChange={(e) => setProductReviews(e.target.value)}
                              placeholder="128"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {schemaType === 'article' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Author Name</label>
                            <input 
                              type="text"
                              value={articleAuthor}
                              onChange={(e) => setArticleAuthor(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Published Date</label>
                            <input 
                              type="date"
                              value={articleDate}
                              onChange={(e) => setArticleDate(e.target.value)}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Main Image URL</label>
                          <input 
                            type="url"
                            value={articleImage}
                            onChange={(e) => setArticleImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                          />
                        </div>
                      </div>
                    )}

                    {schemaType === 'local_business' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Business Name</label>
                            <input 
                              type="text"
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g. Joe's Coffee Shop"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                              type="tel"
                              value={businessPhone}
                              onChange={(e) => setBusinessPhone(e.target.value)}
                              placeholder="+1 234 567 890"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Address</label>
                          <input 
                            type="text"
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            placeholder="123 Street Name, City, Country"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Opening Hours</label>
                          <input 
                            type="text"
                            value={businessOpeningHours}
                            onChange={(e) => setBusinessOpeningHours(e.target.value)}
                            placeholder="Mo-Fr 09:00-17:00"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                          />
                        </div>
                      </div>
                    )}
                    {schemaType === 'organization' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Organization Name</label>
                            <input 
                              type="text"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              placeholder="e.g. Acme Corp"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Logo URL</label>
                            <input 
                              type="url"
                              value={orgLogo}
                              onChange={(e) => setOrgLogo(e.target.value)}
                              placeholder="https://example.com/logo.png"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all dark:text-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {schemaType === 'faq' && (
                      <div className="space-y-4">
                        {faqQuestions.map((faq, idx) => (
                          <div key={idx} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-3 relative">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Question {idx + 1}</label>
                              <input 
                                type="text"
                                value={faq.q}
                                onChange={(e) => {
                                  const newFaqs = [...faqQuestions];
                                  newFaqs[idx].q = e.target.value;
                                  setFaqQuestions(newFaqs);
                                }}
                                placeholder="What is your return policy?"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm font-bold"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Answer {idx + 1}</label>
                              <textarea 
                                value={faq.a}
                                onChange={(e) => {
                                  const newFaqs = [...faqQuestions];
                                  newFaqs[idx].a = e.target.value;
                                  setFaqQuestions(newFaqs);
                                }}
                                placeholder="We offer a 30-day return policy..."
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm min-h-[80px]"
                              />
                            </div>
                            {faqQuestions.length > 1 && (
                              <button 
                                onClick={() => setFaqQuestions(faqQuestions.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                              >
                                <Icons.X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          onClick={() => setFaqQuestions([...faqQuestions, { q: '', a: '' }])}
                          className="w-full py-3 border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-2xl text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all flex items-center justify-center gap-2"
                        >
                          <Icons.Plus size={14} />
                          Add Question
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
                )}
              </div>

              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-indigo-600 shadow-sm border border-indigo-50 dark:border-indigo-900/50">
                    <Icons.GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">SEO Academy</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Learn the logic behind perfect meta tags</p>
                  </div>
                </div>
                <Link 
                  to="/guides/seo-basics-beginner-guide"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 whitespace-nowrap"
                >
                  Read SEO Basics
                </Link>
              </div>
            </div>
          )}
        </div>
      }
      loading={loading || isBulkRunning}
      loadingSection={
        isBulkRunning ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border-2 border-indigo-100 dark:border-indigo-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
            <div className="relative z-10 space-y-6">
              <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                <Icons.Layers className="text-indigo-600 dark:text-indigo-400" size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Bulk Processing Meta Tags</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Analyzing {bulkResults.length} of {bulkInput.split('\n').filter(u => u.trim()).length} URLs</p>
              </div>
              <div className="max-w-md mx-auto h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${bulkProgress}%` }}
                />
              </div>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{bulkProgress}% Complete</p>
            </div>
          </div>
        ) : (
          <ToolLoading
            loadingMessage={loadingMessage}
            progress={progress}
            currentTip={currentTip}
          />
        )
      }
      error={error || bulkError}
      errorSection={
        <ToolError
          error={error || bulkError || ''}
          handleRun={handleRunMeta}
          handleClear={() => {
            handleClear();
            clearBulk();
          }}
        />
      }
      result={result || bulkResults.length > 0 || editableTitle !== '' || editableDescription !== ''}
      resultSection={
        <div className="space-y-8">
          {isBulkMode && bulkResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
                    <Icons.Table size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Bulk Meta Analysis</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{bulkResults.length} URLs Processed Successfully</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearBulk}
                    className="px-4 py-3 text-slate-500 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Clear Results
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 active:scale-95"
                  >
                    <Icons.Download size={18} />
                    Export to CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="w-1/4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">URL Target</th>
                      <th className="w-1/4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Optimized Title</th>
                      <th className="w-1/3 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Meta Description</th>
                      <th className="w-24 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bulkResults.map((res, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icons.Link size={12} className="text-slate-300 shrink-0" />
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate w-full" title={res.url}>{res.url}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{res.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{res.description}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
                            res.status === 'Success' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {!isBulkMode && (
            <>
              <ToolResult
                tool={tool}
                result={result}
                reportRef={reportRef}
                handlePrint={handlePrint}
                handleDownloadPDF={handleDownloadPDF}
                handleCopy={handleCopy}
                handleClear={handleClear}
                handleShare={handleShare}
                isDownloading={isDownloading}
                isGeneratingPDF={isGeneratingPDF}
                copied={copied}
                showShareMenu={showShareMenu}
                setShowShareMenu={setShowShareMenu}
              />
              
              {(result || editableTitle || editableDescription) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto mt-8 p-4 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group print:hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg rotate-3">
                        <Icons.Search size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Live SERP Optimizer</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time Search Simulation & Editing</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {codeSnippet && (
                        <button
                          onClick={handleCopyCode}
                          className={cn(
                            "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg",
                            copiedCode ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 shadow-slate-900/20"
                          )}
                        >
                          {copiedCode ? <Icons.CheckCircle2 size={18} /> : <Icons.Code size={18} />}
                          {copiedCode ? "Copied!" : "Copy Code"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="my-10 p-2 sm:p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-inner">
                    <SERPPreview 
                      title={editableTitle}
                      description={editableDescription}
                      siteName={siteName}
                      siteUrl={siteUrl}
                      mode={previewMode}
                      onTitleChange={setEditableTitle}
                      onDescriptionChange={setEditableDescription}
                      onSiteNameChange={setSiteName}
                      onSiteUrlChange={setSiteUrl}
                      onModeChange={setPreviewMode}
                      showEditor={true}
                      schema={showSchemaFields ? {
                        type: schemaType,
                        product: schemaType === 'product' ? { rating: productRating, reviews: productReviews, price: productPrice, currency: productCurrency } : undefined,
                        article: schemaType === 'article' ? { date: articleDate } : undefined,
                        faq: schemaType === 'faq' ? faqQuestions : undefined
                      } : undefined}
                      ctrAnalysis={ctrAnalysis}
                    />
                  </div>

                  {showBoosted && variations[selectedVariation]?.improvements && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative z-10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icons.Sparkles size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          CTR Improvements: {variations[selectedVariation].trigger}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {variations[selectedVariation].improvements.split(/[\n,;]|\d\.\s+|[-*]\s+/).filter(i => i.trim().length > 5).slice(0, 3).map((improvement, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30">
                            <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                              <Icons.CheckCircle2 size={12} />
                            </div>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-tight">
                              {improvement.trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-8 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Icons.Info size={16} />
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      This preview uses Google's latest SERP layout. Aim for <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">30-60 characters</span> for titles and <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">120-160 characters</span> for descriptions to avoid truncation.
                    </p>
                  </div>

                  {ctrAnalysis && (
                    <div className="mt-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                          <Icons.TrendingUp size={16} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">CTR Booster Suggestions</h4>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ctrAnalysis.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d\./.test(line.trim())).map((suggestion, i) => {
                            const text = suggestion.replace(/^[-*]\s*|^\d\.\s*/, '');
                            const isFunnel = /TOFU|MOFU|BOFU/.test(text);
                            const stage = text.match(/TOFU|MOFU|BOFU/)?.[0];
                            
                            return (
                              <div key={i} className={cn(
                                "flex gap-3 p-3 rounded-xl border shadow-sm transition-all",
                                isFunnel 
                                  ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-50 dark:ring-indigo-900/20" 
                                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                              )}>
                                <div className={cn(
                                  "mt-1",
                                  stage === 'TOFU' ? "text-sky-500" :
                                  stage === 'MOFU' ? "text-indigo-500" :
                                  stage === 'BOFU' ? "text-rose-500" :
                                  "text-indigo-600 dark:text-indigo-400"
                                )}>
                                  {isFunnel ? <Icons.Filter size={14} /> : <Icons.Zap size={14} />}
                                </div>
                                <div className="flex flex-col gap-1">
                                  {isFunnel && (
                                    <span className={cn(
                                      "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md w-fit",
                                      stage === 'TOFU' ? "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" :
                                      stage === 'MOFU' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                                      "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                                    )}>
                                      {stage === 'TOFU' ? 'Awareness' : stage === 'MOFU' ? 'Consideration' : 'Conversion'} Stage
                                    </span>
                                  )}
                                  <p className={cn("text-xs font-medium leading-relaxed", isFunnel && "text-slate-900 dark:text-white")}>
                                    {text.replace(/\*\*(TOFU|MOFU|BOFU).*?\*\*:\s*/, '')}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {!ctrAnalysis.includes('-') && !ctrAnalysis.includes('*') && !/^\d\./.test(ctrAnalysis) && (
                          <p className="text-xs leading-relaxed">{ctrAnalysis}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {descAudit && (
                    <div className="mt-8 p-6 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                          <Icons.TrendingUp size={16} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Meta Description Optimization Audit</h4>
                      </div>

                      <div className="space-y-6">
                        {clarityAnalysis && (
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <Icons.Focus size={14} className="text-emerald-600" />
                              <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clarity & Intent Analysis</h5>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {clarityAnalysis}
                            </p>
                          </div>
                        )}

                        {keywordStrategy && (
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <Icons.KeyRound size={14} className="text-emerald-600" />
                              <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Keyword Integration Strategy</h5>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {keywordStrategy}
                            </p>
                          </div>
                        )}

                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                          <div className="grid grid-cols-1 gap-4">
                            {(keyImprovementsRaw || descAudit).split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d\./.test(line.trim())).map((item, i) => {
                              const isImprovement = /^\d\./.test(item.trim());
                              return (
                                <div key={i} className={cn(
                                  "flex gap-3 p-3 rounded-xl border shadow-sm transition-all",
                                  isImprovement 
                                    ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 scale-[1.02]" 
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                )}>
                                  <div className={cn("mt-1", isImprovement ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")}>
                                    {isImprovement ? <Icons.Zap size={14} /> : <Icons.CheckCircle2 size={14} />}
                                  </div>
                                  <p className={cn("text-xs font-medium leading-relaxed", isImprovement && "text-slate-900 dark:text-white font-bold")}>
                                    {item.replace(/^[-*]\s*|^\d\.\s*/, '')}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          {!descAudit.includes('-') && !descAudit.includes('*') && !/^\d\./.test(descAudit) && !clarityAnalysis && (
                            <p className="text-xs leading-relaxed">{descAudit}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {schemaSnippet && (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-amber-600 rounded-lg text-white">
                          <Icons.Code2 size={16} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">JSON-LD Schema Markup</h4>
                      </div>
                      <div className="relative group/schema">
                        <div className="p-4 bg-slate-900 dark:bg-black rounded-2xl border border-slate-800 overflow-hidden">
                          <pre className="text-[10px] sm:text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                            <code>{schemaSnippet}</code>
                          </pre>
                        </div>
                        <button
                          onClick={handleCopySchema}
                          className={cn(
                            "absolute top-3 right-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-2xl backdrop-blur-md",
                            copiedSchema 
                              ? "bg-emerald-500 text-white" 
                              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 opacity-0 group-hover/schema:opacity-100"
                          )}
                        >
                          {copiedSchema ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
                          {copiedSchema ? "Copied!" : "Copy Schema"}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                        editableTitle.length === 0 ? "bg-slate-100 dark:bg-slate-800" :
                        editableTitle.length > 60 ? "bg-rose-100 dark:bg-rose-900/30" : 
                        editableTitle.length < 30 ? "bg-amber-100 dark:bg-amber-900/30" : 
                        "bg-emerald-100 dark:bg-emerald-900/30"
                      )}>
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            editableTitle.length === 0 ? "bg-slate-400" :
                            editableTitle.length > 60 ? "bg-rose-500" : 
                            editableTitle.length < 30 ? "bg-amber-500" : 
                            "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, (editableTitle.length / 60) * 100)}%` }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title Length</span>
                        <span className={cn(
                          "text-xs font-bold",
                          editableTitle.length === 0 ? "text-slate-400" :
                          editableTitle.length > 60 ? "text-rose-600 dark:text-rose-400" : 
                          editableTitle.length < 30 ? "text-amber-600 dark:text-amber-400" : 
                          "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {editableTitle.length}/60 chars
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                        editableDescription.length === 0 ? "bg-slate-100 dark:bg-slate-800" :
                        editableDescription.length > 160 ? "bg-rose-100 dark:bg-rose-900/30" : 
                        editableDescription.length < 120 ? "bg-amber-100 dark:bg-amber-900/30" : 
                        "bg-emerald-100 dark:bg-emerald-900/30"
                      )}>
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            editableDescription.length === 0 ? "bg-slate-400" :
                            editableDescription.length > 160 ? "bg-rose-500" : 
                            editableDescription.length < 120 ? "bg-amber-500" : 
                            "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, (editableDescription.length / 160) * 100)}%` }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description Length</span>
                        <span className={cn(
                          "text-xs font-bold",
                          editableDescription.length === 0 ? "text-slate-400" :
                          editableDescription.length > 160 ? "text-rose-600 dark:text-rose-400" : 
                          editableDescription.length < 120 ? "text-amber-600 dark:text-amber-400" : 
                          "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {editableDescription.length}/160 chars
                        </span>
                      </div>
                    </div>
                  </div>

                  {selfOptimization && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 group/self-opt"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg group-hover/self-opt:rotate-12 transition-transform">
                          <Icons.Sparkles size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Practice What We Preach</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Self-Optimization Intelligence for this tool</p>
                        </div>
                      </div>
                      
                      <div className="relative p-6 sm:p-10 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50 shadow-inner overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover/self-opt:scale-125 transition-transform duration-1000">
                          <Icons.Search size={150} />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {selfOptimization.split('\n').map((line, i) => {
                                if (line.toLowerCase().includes('meta title:')) {
                                  return (
                                    <div key={i} className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Proposed Page Title</span>
                                      <p className="text-sm font-black text-slate-900 dark:text-white">{line.split(/:\s*/)[1] || line}</p>
                                    </div>
                                  );
                                }
                                if (line.toLowerCase().includes('meta description:')) {
                                  return (
                                    <div key={i} className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Proposed Description</span>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{line.split(/:\s*/)[1] || line}</p>
                                    </div>
                                  );
                                }
                                return <p key={i} className="mb-2 text-xs font-medium">{line}</p>;
                              })}
                            </div>
                          </div>
                          
                          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <div className="px-5 py-2.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-200/50 dark:border-indigo-800/50">
                              <Icons.Zap size={14} />
                              Auto-Implemented for maximum CTR
                            </div>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                              Updated Live: {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-12 p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[2rem] shadow-2xl shadow-indigo-500/20">
                    <div className="bg-white dark:bg-slate-900 rounded-[1.95rem] p-6 sm:p-10 text-center">
                       <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">Analysis Complete! Ready to Rank?</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Save this optimized SEO report or share these high-CTR tags with your team.</p>
                       <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <button 
                            onClick={handleDownloadPDF}
                            disabled={isDownloading || isGeneratingPDF}
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                          >
                            {isDownloading || isGeneratingPDF ? (
                              <Icons.Loader2 size={20} className="animate-spin" />
                            ) : (
                              <Icons.Download size={20} />
                            )}
                            Save to PDF
                          </button>
                          <button 
                            onClick={() => {
                              if (navigator.share) {
                                handleShare('native');
                              } else {
                                setShowShareMenu(true);
                              }
                            }}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95"
                          >
                            <Icons.Share2 size={20} />
                            Share Report
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      }
      placeholderSection={<ToolPlaceholder tool={tool} />}
    />
  );
};
