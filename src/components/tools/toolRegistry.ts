import React from 'react';
import { ToolId } from '../../services/gemini';
import { ToolComponentProps } from './ToolComponentProps';
import { GenericToolUI } from './GenericToolUI';
import { SEODashboardUI } from './SEODashboardUI';

import { MetaTagToolUI } from './MetaTagToolUI';
import { SitemapRobotsUI } from './SitemapRobotsUI';
import { SEOChatUI } from './SEOChatUI';
import { ImageAltTextUI } from './ImageAltTextUI';

export const TOOL_COMPONENTS: Partial<Record<ToolId, React.FC<ToolComponentProps & any>>> = {
  'seo-dashboard': SEODashboardUI,
  'meta-tag': MetaTagToolUI,
  'sitemap-robots': SitemapRobotsUI,
  'seo-chat': SEOChatUI,
  'image-alt-text': ImageAltTextUI,
};

export const getToolComponent = (toolId: string): React.FC<ToolComponentProps & any> => {
  return TOOL_COMPONENTS[toolId as ToolId] || GenericToolUI;
};
