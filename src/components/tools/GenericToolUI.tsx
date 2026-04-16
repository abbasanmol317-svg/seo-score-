import React, { Suspense, lazy } from 'react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolPlaceholder } from './ToolPlaceholder';

const ToolResult = lazy(() => import('./ToolResult').then(m => ({ default: m.ToolResult })));

export const GenericToolUI: React.FC<ToolComponentProps> = (props) => {
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

  return (
    <ToolLayout
      inputSection={
        <ToolInput
          tool={tool}
          input={input}
          setInput={setInput}
          handleRun={handleRun}
          handleClear={handleClear}
          loading={loading}
        />
      }
      loading={loading}
      loadingSection={
        <ToolLoading
          loadingMessage={loadingMessage}
          progress={progress}
          currentTip={currentTip}
        />
      }
      error={error}
      errorSection={
        <ToolError
          error={error || ''}
          handleRun={handleRun}
          handleClear={handleClear}
        />
      }
      result={result}
      resultSection={
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
      }
      placeholderSection={<ToolPlaceholder tool={tool} />}
    />
  );
};
