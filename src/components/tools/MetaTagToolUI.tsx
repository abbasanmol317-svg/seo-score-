import React, { Suspense, lazy, useState } from 'react';
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

const ToolResult = lazy(() => import('./ToolResult').then(m => ({ default: m.ToolResult })));

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
  const [siteName, setSiteName] = React.useState('SEO Score Suite');
  const [siteUrl, setSiteUrl] = React.useState('https://seo-score-suite.com');

  const [editableTitle, setEditableTitle] = React.useState('');
  const [editableDescription, setEditableDescription] = React.useState('');

  // Product Schema Fields
  const [showProductFields, setShowProductFields] = React.useState(false);
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [productCurrency, setProductCurrency] = React.useState('USD');
  const [productRating, setProductRating] = React.useState('5');
  const [productReviews, setProductReviews] = React.useState('10');

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
    if (showProductFields && productName) {
      finalInput = `${input}\n\nProduct Details:\n- Name: ${productName}\n- Price: ${productPrice} ${productCurrency}\n- Rating: ${productRating}/5\n- Reviews: ${productReviews}`;
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
  React.useEffect(() => {
    setEditableTitle(currentTitle);
    setEditableDescription(currentDescription);
  }, [currentTitle, currentDescription]);

  const previewTitle = editableTitle.length > 61 ? editableTitle.substring(0, 58) + '...' : editableTitle;
  const previewDescription = editableDescription.length > 161 ? editableDescription.substring(0, 158) + '...' : editableDescription;

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
              
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
                <button 
                  onClick={() => setShowProductFields(!showProductFields)}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                      <Icons.ShoppingBag size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Product Schema Details</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Optional • Boost Rich Snippets</p>
                    </div>
                  </div>
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    showProductFields ? "bg-amber-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  )}>
                    {showProductFields ? <Icons.ChevronUp size={16} /> : <Icons.ChevronDown size={16} />}
                  </div>
                </button>

                {showProductFields && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pt-6 space-y-4"
                  >
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
                  </motion.div>
                )}
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
      result={result || bulkResults.length > 0}
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
              <Suspense fallback={<div className="h-96 animate-pulse bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800" />}>
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
              </Suspense>
              
              {result && (title || description || codeSnippet) && (
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
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Search Result Preview</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Real-time Google SERP Simulation</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => setPreviewMode('desktop')}
                          className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            previewMode === 'desktop' 
                              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          )}
                        >
                          <Icons.Monitor size={14} />
                          Desktop
                        </button>
                        <button
                          onClick={() => setPreviewMode('mobile')}
                          className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            previewMode === 'mobile' 
                              ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          )}
                        >
                          <Icons.Smartphone size={14} />
                          Mobile
                        </button>
                      </div>

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
                  <div className="grid lg:grid-cols-2 gap-10 sm:gap-14">
                    {/* Editor Section */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between ml-1">
                            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page Title</label>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              editableTitle.length > 61 || editableTitle.length < 30 
                                ? "bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                                : "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            )}>
                              {editableTitle.length} / 60 Chars
                            </span>
                          </div>
                          <div className="relative group/title">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/title:text-indigo-500 transition-colors">
                              <Icons.Type size={16} />
                            </div>
                            <input 
                              type="text"
                              value={editableTitle}
                              onChange={(e) => setEditableTitle(e.target.value)}
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
                              editableDescription.length > 161 || editableDescription.length < 120 
                                ? "bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                                : "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            )}>
                              {editableDescription.length} / 160 Chars
                            </span>
                          </div>
                          <div className="relative group/desc">
                            <div className="absolute left-4 top-4 text-slate-400 group-focus-within/desc:text-indigo-500 transition-colors">
                              <Icons.AlignLeft size={16} />
                            </div>
                            <textarea 
                              value={editableDescription}
                              onChange={(e) => setEditableDescription(e.target.value)}
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
                                onChange={(e) => setSiteName(e.target.value)}
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
                                onChange={(e) => setSiteUrl(e.target.value)}
                                placeholder="e.g. site.com/page"
                                className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Icons.Eye size={12} className="text-indigo-500" />
                        Live Result
                      </h4>
                      
                      <div className={cn(
                        "bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 min-h-[180px] flex flex-col justify-center",
                        previewMode === 'mobile' ? "max-w-[420px] mx-auto ring-[12px] ring-slate-100 dark:ring-slate-800/50" : "w-full"
                      )}>
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none">
                          {previewMode === 'desktop' ? <Icons.Monitor size={140} /> : <Icons.Smartphone size={140} />}
                        </div>

                        <div className="relative z-10 font-sans group/serp">
                          {/* Modern Google SERP Header */}
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
                                  "font-medium text-slate-900 dark:text-slate-200 truncate",
                                  previewMode === 'mobile' ? "text-xs" : "text-sm"
                                )}>
                                  {siteName || 'Enter Site Name'}
                                </span>
                                <Icons.ChevronDown size={12} className="text-slate-400" />
                              </div>
                              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate opacity-80">{siteUrl || 'example.com/slug'}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <button className={cn(
                            "text-[#1a0dab] dark:text-[#8ab4f8] hover:underline text-left cursor-pointer mb-2 leading-tight font-medium line-clamp-2",
                            previewMode === 'mobile' ? "text-xl" : "text-[20px]"
                          )}>
                            {previewTitle || 'Optimized Page Title Will Appear Here'}
                          </button>

                          {/* Description */}
                          <div className={cn(
                            "text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2 opacity-90",
                            previewMode === 'mobile' ? "text-xs" : "text-sm"
                          )}>
                            {previewDescription || 'Your meta description will appear here. It should be between 150-160 characters for optimal visibility in search results.'}
                          </div>
                        </div>

                        {showBoosted && variations[selectedVariation]?.improvements && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 relative z-10"
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
                      </div>

                      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30 flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0">
                          <Icons.Info size={16} />
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          This preview uses Google's latest SERP layout. Aim for <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">30-60 characters</span> for titles and <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">120-160 characters</span> for descriptions to avoid truncation.
                        </p>
                      </div>
                    </div>
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
                        editableTitle.length > 60 || editableTitle.length < 30 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                      )}>
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            editableTitle.length > 60 || editableTitle.length < 30 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, (editableTitle.length / 60) * 100)}%` }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title Length</span>
                        <span className={cn(
                          "text-xs font-bold",
                          editableTitle.length > 60 || editableTitle.length < 30 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {editableTitle.length}/60 chars
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800",
                        editableDescription.length > 160 || editableDescription.length < 120 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
                      )}>
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            editableDescription.length > 160 || editableDescription.length < 120 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, (editableDescription.length / 160) * 100)}%` }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description Length</span>
                        <span className={cn(
                          "text-xs font-bold",
                          editableDescription.length > 160 || editableDescription.length < 120 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {editableDescription.length}/160 chars
                        </span>
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
