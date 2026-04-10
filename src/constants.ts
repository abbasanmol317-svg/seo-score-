import * as Icons from 'lucide-react';

export const CATEGORY_CONFIG: Record<string, { icon: keyof typeof Icons; description: string; color: string; accent: string }> = {
  'SEO Analysis': { 
    icon: 'Search', 
    description: 'Deep technical and structural analysis for any website or platform.',
    color: 'bg-blue-600',
    accent: 'text-blue-600 dark:text-blue-400'
  },
  'Content & Keywords': { 
    icon: 'FileText', 
    description: 'Optimize your copy and find the best terms to rank for.',
    color: 'bg-emerald-600',
    accent: 'text-emerald-600 dark:text-emerald-400'
  },
  'Generators': { 
    icon: 'Zap', 
    description: 'Automated tools to create SEO-ready tags, schema, and files.',
    color: 'bg-amber-600',
    accent: 'text-amber-600 dark:text-amber-400'
  },
  'Compare': { 
    icon: 'ArrowLeftRight', 
    description: 'Benchmark your performance against competitors.',
    color: 'bg-indigo-600',
    accent: 'text-indigo-600 dark:text-indigo-400'
  },
  'AI Assistant': { 
    icon: 'MessageSquare', 
    description: 'Get personalized SEO advice and chat with our AI expert.',
    color: 'bg-purple-600',
    accent: 'text-purple-600 dark:text-purple-400'
  },
  'Insights': { 
    icon: 'ChartBarBig', 
    description: 'Track your progress and view historical SEO data.',
    color: 'bg-rose-600',
    accent: 'text-rose-600 dark:text-rose-400'
  }
};
