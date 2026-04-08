import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolLayoutProps {
  inputSection: React.ReactNode;
  loading?: boolean;
  loadingSection?: React.ReactNode;
  result?: any;
  resultSection?: React.ReactNode;
  error?: string | null;
  errorSection?: React.ReactNode;
  placeholderSection?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  inputSection,
  loading,
  loadingSection,
  result,
  resultSection,
  error,
  errorSection,
  placeholderSection,
}) => {
  return (
    <div className="flex flex-col gap-8 print:gap-4">
      {/* Input Section */}
      <div className="w-full print:hidden">
        {inputSection}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              {loadingSection}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {errorSection}
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {resultSection}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {placeholderSection}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
