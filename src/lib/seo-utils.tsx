import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from './utils';

export const StatusBadge = ({ type }: { type: 'GOOD' | 'AVERAGE' | 'POOR' }) => {
  const config = {
    GOOD: { label: 'Good', icon: <Icons.CircleCheckBig size={12} />, className: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' },
    AVERAGE: { label: 'Average', icon: <Icons.CircleAlert size={12} />, className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800' },
    POOR: { label: 'Poor', icon: <Icons.CircleX size={12} />, className: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800' },
  };
  const { label, icon, className } = config[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm", className)}>
      {icon}
      {label}
    </span>
  );
};

export const EffortBadge = ({ type }: { type: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  const config = {
    LOW: { label: 'Low Effort', icon: <Icons.Zap size={12} />, className: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' },
    MEDIUM: { label: 'Medium Effort', icon: <Icons.Clock size={12} />, className: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800' },
    HIGH: { label: 'High Effort', icon: <Icons.Hammer size={12} />, className: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800' },
  };
  const { label, icon, className } = config[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ml-2", className)}>
      {icon}
      {label}
    </span>
  );
};

export const renderMarkdownContent = (content: string) => {
  const parts = content.split(/(\[GOOD\]|\[AVERAGE\]|\[POOR\]|\[LOW_EFFORT\]|\[MEDIUM_EFFORT\]|\[HIGH_EFFORT\])/g);
  return parts.map((part, i) => {
    if (part === '[GOOD]') return <StatusBadge key={i} type="GOOD" />;
    if (part === '[AVERAGE]') return <StatusBadge key={i} type="AVERAGE" />;
    if (part === '[POOR]') return <StatusBadge key={i} type="POOR" />;
    if (part === '[LOW_EFFORT]') return <EffortBadge key={i} type="LOW" />;
    if (part === '[MEDIUM_EFFORT]') return <EffortBadge key={i} type="MEDIUM" />;
    if (part === '[HIGH_EFFORT]') return <EffortBadge key={i} type="HIGH" />;
    return part;
  });
};

export const getErrorMessage = (error: string) => {
  const err = error.toLowerCase();
  
  if (err.includes('429') || err.includes('quota') || err.includes('rate limit')) {
    return 'Rate Limit Exceeded: You\'ve reached the maximum number of requests allowed for your API key. Google\'s free tier has specific limits per minute.';
  }
  
  if (err.includes('503') || err.includes('overloaded') || err.includes('service unavailable')) {
    return 'AI Service Busy: The Google Gemini servers are currently overloaded. This usually happens during peak usage times.';
  }

  if (err.includes('400') || err.includes('bad request') || err.includes('invalid field') || err.includes('malformed')) {
    return 'Invalid Input: The request couldn\'t be processed. This often happens if the text is too long, the URL is invalid, or the format is incorrect.';
  }

  if (err.includes('empty input') || err.includes('provide a value')) {
    return 'Missing Information: Please enter a URL, topic, or content before running the analysis.';
  }

  if (err.includes('401') || err.includes('403') || err.includes('unauthorized') || err.includes('forbidden')) {
    return 'Authentication Error: There is an issue with the API key configuration.';
  }

  if (err.includes('404') || err.includes('not found')) {
    return 'Resource Not Found: The requested AI model or endpoint could not be reached.';
  }

  if (err.includes('500') || err.includes('internal server error')) {
    return 'Server Error: Something went wrong on the AI provider\'s end.';
  }

  if (err.includes('504') || err.includes('gateway timeout') || err.includes('deadline')) {
    return 'Request Timeout: The server took too long to respond. Please try a simpler input.';
  }

  if (err.includes('safety') || err.includes('blocked') || err.includes('candidate')) {
    return 'Content Blocked: Our safety filters flagged the input or generated output.';
  }

  if (err.includes('fetch') || err.includes('network') || err.includes('failed to fetch')) {
    return 'Network Error: We couldn\'t connect to the AI service. Please check your connection.';
  }

  return 'Unexpected Error: Something went wrong while processing your request.';
};

export const getErrorSolutions = (error: string) => {
  const err = error.toLowerCase();
  
  if (err.includes('api key') || err.includes('unauthorized') || err.includes('forbidden') || err.includes('401') || err.includes('403')) {
    return [
      'Verify your Gemini API key is correctly set in the project settings.',
      'Check for extra spaces or hidden characters in your API key.',
      'Ensure your API key is active and has not been revoked in Google AI Studio.'
    ];
  }
  
  if (err.includes('rate limit') || err.includes('429') || err.includes('quota')) {
    return [
      'Wait exactly 60 seconds and try again—the Google AI Studio free tier resets every minute.',
      'Check your project settings to ensure you are not using a restricted API key.',
      'If you need higher limits, consider setting up a Pay-as-you-go billing account in Google Cloud.',
      'Avoid rapid-fire clicks; allow a few seconds between different tool uses.'
    ];
  }

  if (err.includes('503') || err.includes('overloaded') || err.includes('service unavailable') || err.includes('500')) {
    return [
      'Wait for 15 seconds and click "Try Again".',
      'If the service is down globally, check the Google Cloud Status Dashboard.',
      'Try analyzing a different URL or providing a shorter text snippet.',
      'Refreshing your browser can sometimes clear transient connection issues.'
    ];
  }

  if (err.includes('400') || err.includes('bad request') || err.includes('invalid') || err.includes('empty') || err.includes('malformed')) {
    return [
      'Ensure the URL starts with https:// or http:// and is a valid live website.',
      'If pasting content, try reducing the length to under 20,000 characters.',
      'Remove any complex emojis or non-standard characters from your input.',
      'Check if the website you are analyzing is blocking automated crawlers.'
    ];
  }

  if (err.includes('network') || err.includes('fetch') || err.includes('failed to fetch') || err.includes('connection')) {
    return [
      'Check your internet connection and ensure you are online.',
      'Disable any VPN or proxy that might be interfering with the request.',
      'Check if a browser extension (like an ad-blocker) is blocking the API call.'
    ];
  }

  if (err.includes('safety') || err.includes('blocked') || err.includes('candidate')) {
    return [
      'Try rephrasing your input to be more professional and neutral.',
      'Ensure the URL or text provided doesn\'t contain prohibited terms.',
      'Avoid topics that might trigger safety filters (e.g., medical advice, sensitive personal info).'
    ];
  }

  if (err.includes('timeout') || err.includes('504') || err.includes('deadline')) {
    return [
      'The server is taking too long. Try again with a smaller amount of data.',
      'Check if the website you are analyzing is slow or currently down.',
      'Try again in a few moments when traffic might be lower.'
    ];
  }

  return [
    'Double-check your input for any typos or invalid characters.',
    'Try refreshing the page to reset the application state.',
    'If the issue persists, wait a few minutes and try again.'
  ];
};

export type ErrorCategory = 'QUOTA' | 'SERVICE' | 'INPUT' | 'AUTH' | 'NETWORK' | 'SAFETY' | 'UNKNOWN';

export const getErrorCategory = (error: string): ErrorCategory => {
  const err = error.toLowerCase();
  if (err.includes('429') || err.includes('quota') || err.includes('rate limit')) return 'QUOTA';
  if (err.includes('503') || err.includes('500') || err.includes('service unavailable') || err.includes('internal server error')) return 'SERVICE';
  if (err.includes('400') || err.includes('bad request') || err.includes('empty') || err.includes('provide a value') || err.includes('invalid field') || err.includes('malformed')) return 'INPUT';
  if (err.includes('401') || err.includes('403') || err.includes('auth') || err.includes('key')) return 'AUTH';
  if (err.includes('fetch') || err.includes('network') || err.includes('timeout') || err.includes('deadline') || err.includes('504')) return 'NETWORK';
  if (err.includes('safety') || err.includes('blocked') || err.includes('candidate')) return 'SAFETY';
  return 'UNKNOWN';
};
