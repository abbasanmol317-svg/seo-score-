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

export const getErrorSolutions = (error: string) => {
  const err = error.toLowerCase();
  if (err.includes('api key') || err.includes('unauthorized')) {
    return [
      'Check if your Gemini API key is correctly configured in the environment.',
      'Ensure the API key has the necessary permissions for the requested model.',
      'Try refreshing the page and running the analysis again.'
    ];
  }
  if (err.includes('rate limit') || err.includes('429') || err.includes('quota') || err.includes('503') || err.includes('overloaded')) {
    return [
      'The AI service is currently experiencing high demand or quota limits.',
      'This is usually temporary (503). Wait for 10-20 seconds and try again.',
      'If you are on a free tier, you might have hit the rate limit.'
    ];
  }
  if (err.includes('network') || err.includes('fetch') || err.includes('failed to fetch')) {
    return [
      'Check your internet connection.',
      'Ensure that no firewall or browser extension is blocking the request.',
      'Try again in a few moments.'
    ];
  }
  if (err.includes('safety') || err.includes('blocked')) {
    return [
      'The AI blocked the response due to safety filters.',
      'Try rephrasing your input to be more neutral.',
      'Ensure your input doesn\'t contain sensitive or prohibited content.'
    ];
  }
  return [
    'Double-check your input for any typos or invalid URLs.',
    'Try simplifying your request or providing more specific details.',
    'If the issue persists, please try again in a few moments.'
  ];
};
