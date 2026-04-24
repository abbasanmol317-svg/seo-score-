import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({ apiKey });

export type ToolId = 
  | 'website-seo' | 'youtube-seo' | 'site-speed' | 'backlinks' 
  | 'broken-links' | 'seo-audit' | 'mobile-friendly' | 'bulk-url'
  | 'keyword-research' | 'content-optimizer' | 'content-analysis' | 'hashtag-generator'
  | 'meta-tag' | 'serp-preview' | 'og-preview' | 'schema-markup' | 'image-alt-text'
  | 'sitemap-robots' | 'compare-websites' | 'seo-chat' | 'seo-dashboard' | 'on-page-checklist';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: string;
  icon: string;
  slug: string;
  placeholder: string;
  keywords: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'website-seo',
    name: 'Search Intelligence Audit',
    description: 'A 260+ point deep scan covering Technical SEO, GEO (AI Search Readiness), and AEO (Direct Answers).',
    category: 'SEO Analysis',
    icon: 'ScanSearch',
    slug: 'free-website-seo-audit-tool',
    keywords: 'website,seo,analytics,geo,aeo,ai search',
    seoTitle: '260+ Point AI SEO Audit Tool – Deep Website Analysis (2026)',
    seoDescription: 'Perform a professional 260+ point SEO audit instantly. Analyze your site for AI search readiness, GEO, and traditional SEO signals with our free deep scan tool.',
    placeholder: 'Enter website URL for a 260-point Deep Scan...'
  },
  {
    id: 'youtube-seo',
    name: 'YouTube SEO',
    description: 'Check and optimize YouTube video SEO.',
    category: 'SEO Analysis',
    icon: 'CirclePlay',
    slug: 'free-youtube-seo-tool',
    keywords: 'youtube,video,marketing',
    seoTitle: 'Free YouTube SEO Tool: Optimize Video Titles, Tags & Rankings',
    seoDescription: 'Boost your YouTube views with our AI-powered SEO tool. Generate high-CTR titles, viral tags, and optimized descriptions to rank #1 on YouTube search.',
    placeholder: 'Enter Video URL or Topic (e.g., https://youtu.be/abc or "How to bake a cake")'
  },
  {
    id: 'site-speed',
    name: 'Site Speed Checker',
    description: 'AI-simulated page load speed analysis.',
    category: 'SEO Analysis',
    icon: 'Gauge',
    slug: 'free-website-speed-test-tool',
    keywords: 'speed,fast,performance',
    seoTitle: 'Website Speed Test: Free Core Web Vitals Checker (AI-Powered)',
    seoDescription: 'Test your website speed and analyze Core Web Vitals for free. Get actionable AI suggestions to fix slow page loads and improve your Google search rankings.',
    placeholder: 'Enter website URL to test speed (e.g., https://mysite.com/blog)'
  },
  {
    id: 'backlinks',
    name: 'Backlink Checker',
    description: 'Analyze backlink profile and quality.',
    category: 'SEO Analysis',
    icon: 'Network',
    slug: 'free-backlink-checker-tool',
    keywords: 'links,network,backlinks',
    seoTitle: 'Free Backlink Checker: Analyze Domain Authority & Link Quality',
    seoDescription: 'Instantly check any website\'s backlinks for free. Monitor referring domains, link authority, and anchor text to build a stronger SEO backlink profile.',
    placeholder: 'Enter domain name (e.g., apple.com or yourdomain.io)'
  },
  {
    id: 'broken-links',
    name: 'Broken Link Checker',
    description: 'Scan for potential broken links and fixes.',
    category: 'SEO Analysis',
    icon: 'LinkOff',
    slug: 'free-broken-link-checker-tool',
    keywords: 'broken,link,error',
    seoTitle: 'Broken Link Checker: Find 404 Errors & Dead Links Instantly',
    seoDescription: 'Scan your entire website for broken links and 404 errors for free. Improve user experience and fix technical SEO issues with our fast AI-powered crawler.',
    placeholder: 'Enter website URL to scan (e.g., https://example.com/services)'
  },
  {
    id: 'seo-audit',
    name: '260+ Point Checklist',
    description: 'A complete 260+ point industrial-grade SEO audit covering AI, GEO, and technical performance.',
    category: 'SEO Analysis',
    icon: 'SearchCode',
    slug: 'free-seo-audit-checklist',
    keywords: 'audit,checklist,seo,geo,aeo,260 points',
    seoTitle: 'Professional 260+ Point SEO Checklist – Complete Site Audit',
    seoDescription: 'The most detailed free SEO checklist available. 260+ data points covering technical SEO, AI search signals, and mobile experience. Audit your site now!',
    placeholder: 'Enter website URL for 260+ point scan...'
  },
  {
    id: 'on-page-checklist',
    name: 'On-Page SEO Checklist',
    description: 'Optimize individual pages with a detailed on-page checklist.',
    category: 'SEO Analysis',
    icon: 'ClipboardCheck',
    slug: 'free-on-page-seo-checklist',
    keywords: 'on-page,checklist,optimization,content',
    seoTitle: 'On-Page SEO Checklist: Step-by-Step Optimization Guide',
    seoDescription: 'Master your on-page SEO with our free interactive checklist. Optimize content, images, H1 tags, and keyword placement to rank higher on Google.',
    placeholder: 'Enter page URL or content topic (e.g., https://example.com/blog-post or "Best Yoga Mats")'
  },
  {
    id: 'mobile-friendly',
    name: 'Mobile-Friendly Test',
    description: 'Check mobile responsiveness and UX.',
    category: 'SEO Analysis',
    icon: 'TabletSmartphone',
    slug: 'free-mobile-friendly-test-tool',
    keywords: 'mobile,responsive,phone',
    seoTitle: 'Mobile-Friendly Test Tool: Check Google Mobile Responsiveness',
    seoDescription: 'Is your site mobile-ready? Use our free mobile-friendly test tool to analyze responsiveness, font size, and touch targets for better mobile search rankings.',
    placeholder: 'Enter website URL to test mobile UX (e.g., https://myshop.com)'
  },
  {
    id: 'bulk-url',
    name: 'Bulk URL Analysis',
    description: 'Analyze up to 10 URLs at once.',
    category: 'SEO Analysis',
    icon: 'ListChecks',
    slug: 'free-bulk-url-seo-analysis-tool',
    keywords: 'bulk,data,list',
    seoTitle: 'Bulk URL SEO Analysis Tool – Analyze Multiple Pages at Once',
    seoDescription: 'Save time with our Bulk URL tool. Analyze SEO metrics for up to 10 pages simultaneously for fast, professional-grade search site audits.',
    placeholder: 'Enter up to 10 URLs, one per line (e.g.,\nhttps://site.com/p1\nhttps://site.com/p2)'
  },
  {
    id: 'keyword-research',
    name: 'Keyword Research',
    description: 'Find high/medium/low competition keywords.',
    category: 'Content & Keywords',
    icon: 'KeyRound',
    slug: 'free-keyword-research-tool',
    keywords: 'search,keywords,research',
    seoTitle: 'Free Keyword Research Tool: Find High Volume, Low-Competition Keywords',
    seoDescription: 'Discover thousands of profitable keyword ideas with search volume trends and competition data. Find long-tail keywords that rank #1 on Google and AI search.',
    placeholder: 'Enter niche or seed keyword (e.g., "vegan dog food" or "SaaS marketing")'
  },
  {
    id: 'content-optimizer',
    name: 'Content Optimizer',
    description: 'Analyze and improve content quality with AI-powered suggestions and internal linking strategy.',
    category: 'Content & Keywords',
    icon: 'PenTool',
    slug: 'free-ai-content-optimization-tool',
    keywords: 'content,writing,optimization,internal linking,seo writing',
    seoTitle: 'AI Content Optimizer: Improve SEO Writing, Semantic Density & Readability',
    seoDescription: 'Boost your content quality for Google & AI Search. Our AI Content Optimizer analyzes semantic density, readability, and keyword placement to help you rank #1.',
    placeholder: 'Paste your content or enter URL to optimize (e.g., "Our mission is...")'
  },
  {
    id: 'content-analysis',
    name: 'Content Analysis',
    description: 'Deep audit of content for readability, keyword density, and actionable SEO improvements.',
    category: 'Content & Keywords',
    icon: 'FileSearch',
    slug: 'free-content-analysis-seo-tool',
    keywords: 'content,analysis,readability,density,optimization',
    seoTitle: 'Free Content Analysis Tool – Deep Readability & SEO Audit',
    seoDescription: 'Get a professional audit of your content style, readability, and keyword density. Our AI identifies exactly what to fix to rank your content higher.',
    placeholder: 'Paste content or enter URL for detailed analysis...'
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Generate hashtags for YT, IG, TikTok.',
    category: 'Content & Keywords',
    icon: 'Tag',
    slug: 'free-hashtag-generator-tool',
    keywords: 'hashtag,social,trending',
    seoTitle: 'Hashtag Generator: Viral Tags for YouTube, IG & TikTok',
    seoDescription: 'Find trending social media hashtags for free. Boost your reach and engagement on YouTube, Instagram, and TikTok with AI-generated tag suggestions.',
    placeholder: 'Enter topic or description (e.g., "Morning coffee routine" or "Tech review")'
  },
  {
    id: 'meta-tag',
    name: 'Meta Tag Generator',
    description: 'Generate high-CTR meta tags with advanced SERP previews and real-time SEO analysis to boost rankings.',
    category: 'Generators',
    icon: 'ScrollText',
    slug: 'free-meta-tag-generator',
    keywords: 'code,meta,tags',
    seoTitle: 'Free AI Meta Tag Generator (2026) – Create High-CTR Titles & Descriptions',
    seoDescription: 'Boost your search rankings with our AI Meta Tag Generator. Create SEO-optimized meta titles, descriptions, and previews for free to maximize your Google CTR instantly.',
    placeholder: 'Enter page title, description, and optional product details like price/reviews (e.g., "Best Running Shoes - $99, 4.5 stars")'
  },
  {
    id: 'serp-preview',
    name: 'SERP Preview',
    description: 'Google search result preview tool.',
    category: 'Generators',
    icon: 'MonitorPlay',
    slug: 'free-serp-preview-tool',
    keywords: 'preview,google,serp',
    seoTitle: 'Google SERP Preview Tool: Optimize Search Result Appearance',
    seoDescription: 'See exactly how your website looks in Google Search. Tweak your titles and descriptions in our SERP simulator to maximize clicks and rankings.',
    placeholder: 'Enter Title and Description to preview (e.g., "SEO Score | AI Tools")'
  },
  {
    id: 'og-preview',
    name: 'OG Preview Generator',
    description: 'Social media share preview tool.',
    category: 'Generators',
    icon: 'Share2',
    slug: 'free-open-graph-preview-tool',
    keywords: 'social,share,preview',
    seoTitle: 'Open Graph Preview Tool: Optimize Social Media Share Cards',
    seoDescription: 'Preview how your links appear on Facebook, Twitter, and LinkedIn. Perfect your OG tags for higher engagement and professional-looking social shares.',
    placeholder: 'Enter URL or Page Info (e.g., https://example.com/blog/post-1)'
  },
  {
    id: 'schema-markup',
    name: 'Schema Markup Generator',
    description: 'Generate JSON-LD structured data.',
    category: 'Generators',
    icon: 'CodeXml',
    slug: 'free-schema-markup-generator',
    keywords: 'schema,json,structured',
    seoTitle: 'Schema Markup Generator: JSON-LD Structured Data Creator',
    seoDescription: 'Boost rich snippets with our free Schema Generator. Create valid JSON-LD code for items, products, and articles to stand out in Google Search.',
    placeholder: 'Enter entity details (e.g., "iPhone 15 Pro, $999, 4.8 stars")'
  },
  {
    id: 'image-alt-text',
    name: 'Image Alt Text Generator',
    description: 'Generate descriptive alt text for images to improve accessibility and SEO.',
    category: 'Generators',
    icon: 'ImageDown',
    slug: 'free-image-alt-text-generator',
    keywords: 'image,alt,accessibility,seo,generator',
    seoTitle: 'AI Image Alt Text Generator: Improve Accessibility & Image SEO',
    seoDescription: 'Instantly generate SEO-friendly alt text for images. Improve website accessibility and get more traffic from Google Image search results for free.',
    placeholder: 'Describe the image or provide an image URL (e.g., "A golden retriever playing in a park" or https://example.com/image.jpg)'
  },
  {
    id: 'sitemap-robots',
    name: 'Sitemap & Robots.txt',
    description: 'Generate sitemap and robots.txt files.',
    category: 'Generators',
    icon: 'FileSymlink',
    slug: 'free-sitemap-robots-txt-generator',
    keywords: 'sitemap,robots,technical',
    seoTitle: 'XML Sitemap & Robots.txt Generator – Fast Technical Setup',
    seoDescription: 'Generate sitemap and robots.txt files for free. Ensure Google crawls and indexes your website correctly with zero technical knowledge.',
    placeholder: 'Enter website URL (e.g., https://yourwebsite.com)'
  },
  {
    id: 'compare-websites',
    name: 'Compare Websites',
    description: 'Compare your site vs competitors.',
    category: 'Compare',
    icon: 'GitCompare',
    slug: 'free-website-comparison-tool',
    keywords: 'compare,competitor,versus',
    seoTitle: 'Website Comparison Tool: Analyze SEO vs Competitors',
    seoDescription: 'Compare websites for free. Analyze competitors, keyword gaps, and backlinks to help you outrank your competitors.',
    placeholder: 'Enter Your URL vs Competitor URL (e.g., siteA.com vs siteB.com)'
  },
  {
    id: 'seo-chat',
    name: 'AI SEO Chat',
    description: 'Ask any SEO related questions.',
    category: 'AI Assistant',
    icon: 'MessageCircleMore',
    slug: 'free-ai-seo-assistant',
    keywords: 'chat,ai,assistant',
    seoTitle: 'AI SEO Assistant: Get Instant Answers to SEO Questions',
    seoDescription: 'Chat with our expert AI SEO assistant for free. Solve complex search problems, get strategy advice, and learn search engine optimization instantly.',
    placeholder: 'Ask anything about SEO (e.g., "How to improve domain authority?" or "What are Core Web Vitals?")'
  },
  {
    id: 'seo-dashboard',
    name: 'SEO Dashboard',
    description: 'View your analysis history and trends.',
    category: 'Insights',
    icon: 'LayoutGrid',
    slug: 'free-seo-dashboard',
    keywords: 'dashboard,stats,insights',
    seoTitle: 'Free SEO Dashboard: Track Your Site\'s Search Performance',
    seoDescription: 'Monitor your search intelligence history and SEO trends in one free dashboard. Track audited URLs and performance improvements over time.',
    placeholder: ''
  }
];

export async function runTool(toolId: ToolId, input: string) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) throw new Error("Tool not found");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }

  // Dynamically import prompts to reduce initial bundle size
  const { TOOL_PROMPTS } = await import('./toolPrompts');
  const prompt = TOOL_PROMPTS[toolId as string];

  if (!prompt) {
    if (toolId === 'seo-dashboard') return "This tool is for viewing historical data.";
    throw new Error('Tool not found or prompt missing');
  }

  const model = "gemini-3-flash-preview";
  let contents: any[] = [];

  // Check if input is a data URL (image upload)
  if (input.startsWith('data:image/')) {
    const [header, base64Data] = input.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    contents = [{
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: prompt }
      ]
    }];
  } else {
    contents = [{ role: 'user', parts: [{ text: `${prompt}\n\nInput: ${input}` }] }];
  }

  // Retry logic for 503 errors
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          tools: [{ urlContext: {} }]
        }
      });

      if (!response.text) {
        // Check if it was blocked by safety filters
        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
          throw new Error("This request was blocked by AI safety filters. This often happens with sensitive URLs or restricted content.");
        }
        throw new Error("AI returned an empty response.");
      }

      return response.text;
    } catch (error: any) {
      console.error(`Gemini API Error (Attempt ${attempts + 1}):`, error);
      
      const isRetryable = error.status === 503 || 
                         error.message?.includes('503') || 
                         error.message?.includes('high demand') ||
                         error.message?.includes('overloaded');

      if (isRetryable && attempts < maxAttempts - 1) {
        attempts++;
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      // Handle specific error cases
      if (isRetryable) {
        throw new Error("AI service is temporarily overloaded (503). This is usually temporary. Please wait a few seconds and try again.");
      }
      
      if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        throw new Error("AI quota exceeded. Please wait a moment before trying again.");
      }

      if (error.status === 400 && error.message?.includes('safety')) {
        throw new Error("Request blocked by safety filters. Try a different URL or topic.");
      }

      if (error.status === 500 || error.message?.includes('500')) {
        throw new Error("AI request failed (500): The model might be overloaded or the input is causing an issue. Try again in a moment.");
      }
      
      if (error.message?.includes('API key')) {
        throw new Error("Invalid API Key. Please check your GEMINI_API_KEY configuration.");
      }

      throw new Error(`AI request failed: ${error.message || 'Unknown error'}`);
    }
  }
}
