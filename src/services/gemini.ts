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
    name: 'Website SEO',
    description: 'Analyze any website for SEO improvements.',
    category: 'SEO Analysis',
    icon: 'ScanSearch',
    slug: 'free-website-seo-audit-tool',
    keywords: 'website,seo,analytics',
    seoTitle: 'Free Website SEO Audit Tool – Full Technical & On-Page Analysis',
    seoDescription: 'Run a free website SEO audit to find technical issues, on-page errors, and performance gaps. Get actionable insights to boost rankings.',
    placeholder: 'Enter website URL (e.g., https://example.com or example.com)'
  },
  {
    id: 'youtube-seo',
    name: 'YouTube SEO',
    description: 'Check and optimize YouTube video SEO.',
    category: 'SEO Analysis',
    icon: 'CirclePlay',
    slug: 'free-youtube-seo-tool',
    keywords: 'youtube,video,marketing',
    seoTitle: 'Free YouTube SEO Tool – Optimize Titles, Tags & Descriptions',
    seoDescription: 'Use our free YouTube SEO tool to generate optimized titles, tags, and descriptions to increase views and rankings.',
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
    seoTitle: 'Best Website Speed Test Tool – Core Web Vitals Checker',
    seoDescription: 'Test your website speed for free. Analyze Core Web Vitals, loading time, and performance to improve user experience.',
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
    seoTitle: 'Free Backlink Checker Tool – Analyze Domain Authority & Links',
    seoDescription: 'Check backlinks for free. Analyze domain authority, link quality, and find new opportunities to improve SEO.',
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
    seoTitle: 'Advanced Broken Link Checker Tool – Find 404 Errors & Dead Links',
    seoDescription: 'Scan your website for free and detect broken links, 404 errors, and dead pages to improve SEO and UX.',
    placeholder: 'Enter website URL to scan (e.g., https://example.com/services)'
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit Checklist',
    description: 'Complete SEO audit for your site.',
    category: 'SEO Analysis',
    icon: 'SearchCode',
    slug: 'free-seo-audit-checklist',
    keywords: 'audit,checklist,seo',
    seoTitle: 'Free SEO Audit Checklist – Complete Technical & On-Page Guide',
    seoDescription: 'Use this free SEO audit checklist to optimize your website. Cover technical SEO, on-page fixes, and ranking factors.',
    placeholder: 'Enter website URL for a full audit (e.g., https://mybrand.com)'
  },
  {
    id: 'on-page-checklist',
    name: 'On-Page SEO Checklist',
    description: 'Optimize individual pages with a detailed on-page checklist.',
    category: 'SEO Analysis',
    icon: 'ClipboardCheck',
    slug: 'free-on-page-seo-checklist',
    keywords: 'on-page,checklist,optimization,content',
    seoTitle: 'Best On-Page SEO Checklist – Optimize Pages for Higher Rankings',
    seoDescription: 'Improve your pages with a free on-page SEO checklist. Optimize titles, content, keywords, and internal links.',
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
    seoTitle: 'Free Mobile-Friendly Test Tool – Check Website Responsiveness',
    seoDescription: 'Test your website’s mobile responsiveness for free. Ensure better UX and higher rankings on mobile devices.',
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
    seoTitle: 'Advanced Bulk URL SEO Analysis Tool – Analyze Multiple Pages',
    seoDescription: 'Analyze multiple URLs for free. Get SEO insights, performance data, and optimization tips for better rankings.',
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
    seoTitle: 'Free Keyword Research Tool – Find High Volume Low Competition Keywords',
    seoDescription: 'Discover free keyword ideas with high search volume and low competition to improve SEO and rank faster.',
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
    seoTitle: 'Best AI Content Optimization Tool – Improve SEO & Readability',
    seoDescription: 'Optimize your content for free using AI. Improve readability, keyword usage, and internal linking for better SEO.',
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
    seoTitle: 'Free Content Analysis Tool – Readability & Keyword Density Checker',
    seoDescription: 'Analyze your content for readability, keyword density, and SEO quality. Get AI-powered suggestions to improve content rankings.',
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
    seoTitle: 'Free Hashtag Generator Tool – Trending Tags for Social Media',
    seoDescription: 'Generate free trending hashtags for YouTube, Instagram, and TikTok to boost reach and engagement.',
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
    seoTitle: 'Free Meta Tag Generator – Create High CTR SEO Titles & Descriptions',
    seoDescription: 'Generate SEO-friendly meta titles and descriptions for free to improve click-through rate and visibility.',
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
    seoTitle: 'Advanced Google SERP Preview Tool – Optimize Title & Description',
    seoDescription: 'Preview your website in Google search results for free. Optimize titles and meta descriptions for better CTR.',
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
    seoTitle: 'Free Open Graph Preview Tool – Social Media Share Preview',
    seoDescription: 'Preview your content on social media for free. Optimize Open Graph tags for better sharing and engagement.',
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
    seoTitle: 'Best Schema Markup Generator – JSON-LD Structured Data Tool',
    seoDescription: 'Generate JSON-LD schema markup for free. Improve rich snippets and search visibility easily.',
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
    seoTitle: 'Free AI Image Alt Text Generator – SEO & Accessibility Tool',
    seoDescription: 'Create SEO-friendly alt text for images for free. Improve accessibility and search rankings.',
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
    seoTitle: 'Advanced XML Sitemap Generator & Robots.txt Creator',
    seoDescription: 'Generate sitemap and robots.txt files for free. Improve indexing and crawlability of your website.',
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
    seoTitle: 'Best Website Comparison Tool – SEO Competitor Analysis',
    seoDescription: 'Compare websites for free. Analyze competitors, keyword gaps, and backlinks to improve rankings.',
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
    seoTitle: 'Free AI SEO Assistant – Instant SEO Help & Guidance',
    seoDescription: 'Get free SEO advice instantly with AI. Solve SEO problems and improve your website rankings.',
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
    seoTitle: 'Advanced SEO Dashboard – Track Rankings, Reports & Performance',
    seoDescription: 'Monitor your SEO performance for free. Track rankings, reports, and website growth in one dashboard.',
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
