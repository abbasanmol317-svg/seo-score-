import React from 'react';
import { ToolComponentProps } from './ToolComponentProps';
import { ToolLayout } from './ToolLayout';
import { ToolInput } from './ToolInput';
import { ToolLoading } from './ToolLoading';
import { ToolError } from './ToolError';
import { ToolResult } from './ToolResult';
import { ToolPlaceholder } from './ToolPlaceholder';

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
        <ToolResult
          tool={tool}
          result={result}
          reportRef={reportRef}
          handlePrint={handlePrint}
          handleDownloadPDF={handleDownloadPDF}
          handleCopy={handleCopy}
          handleShare={handleShare}
          isDownloading={isDownloading}
          isGeneratingPDF={isGeneratingPDF}
          copied={copied}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
        />
      }
      placeholderSection={<ToolPlaceholder tool={tool} />}
    />
  );
};
