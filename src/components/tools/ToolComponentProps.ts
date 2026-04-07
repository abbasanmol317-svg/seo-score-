import { Tool } from '../../services/gemini';

export interface ToolComponentProps {
  tool: Tool;
  input: string;
  setInput: (val: string) => void;
  result: string;
  loading: boolean;
  error: string;
  handleRun: () => void;
  handleClear: () => void;
  handleCopy: () => void;
  handlePrint: () => void;
  handleDownloadPDF: () => void;
  isDownloading: boolean;
  isGeneratingPDF: boolean;
  copied: boolean;
  showShareMenu: boolean;
  setShowShareMenu: (val: boolean) => void;
  handleShare: (platform: 'twitter' | 'linkedin' | 'facebook' | 'email' | 'copy' | 'native') => void;
  reportRef: React.RefObject<HTMLDivElement>;
  loadingMessage: string;
  progress: number;
  currentTip: string;
  isFeedbackSubmitted: boolean;
  setIsFeedbackSubmitted: (val: boolean) => void;
  feedbackRating: 'up' | 'down' | null;
  setFeedbackRating: (val: 'up' | 'down' | null) => void;
  feedbackText: string;
  setFeedbackText: (val: string) => void;
}
