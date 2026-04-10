import React, { lazy } from 'react';
import { ToolId } from '../../services/gemini';
import { ToolComponentProps } from './ToolComponentProps';

const GenericToolUI = lazy(() => import('./GenericToolUI').then(m => ({ default: m.GenericToolUI })));
const SEODashboardUI = lazy(() => import('./SEODashboardUI').then(m => ({ default: m.SEODashboardUI })));
const MetaTagToolUI = lazy(() => import('./MetaTagToolUI').then(m => ({ default: m.MetaTagToolUI })));
const SitemapRobotsUI = lazy(() => import('./SitemapRobotsUI').then(m => ({ default: m.SitemapRobotsUI })));
const SEOChatUI = lazy(() => import('./SEOChatUI').then(m => ({ default: m.SEOChatUI })));
const ImageAltTextUI = lazy(() => import('./ImageAltTextUI').then(m => ({ default: m.ImageAltTextUI })));

export const TOOL_COMPONENTS: Partial<Record<ToolId, React.LazyExoticComponent<React.FC<ToolComponentProps & any>>>> = {
  'seo-dashboard': SEODashboardUI,
  'meta-tag': MetaTagToolUI,
  'sitemap-robots': SitemapRobotsUI,
  'seo-chat': SEOChatUI,
  'image-alt-text': ImageAltTextUI,
};

export const getToolComponent = (toolId: string): React.LazyExoticComponent<React.FC<ToolComponentProps & any>> | React.FC<ToolComponentProps & any> => {
  return TOOL_COMPONENTS[toolId as ToolId] || GenericToolUI;
};
