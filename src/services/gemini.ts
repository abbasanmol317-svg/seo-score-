import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey });

export type ToolId = 
  | 'website-seo' | 'youtube-seo' | 'site-speed' | 'backlinks' 
  | 'broken-links' | 'seo-audit' | 'mobile-friendly' | 'bulk-url'
  | 'keyword-research' | 'content-optimizer' | 'hashtag-generator'
  | 'meta-tag' | 'serp-preview' | 'og-preview' | 'schema-markup' | 'image-alt-text'
  | 'sitemap-robots' | 'compare-websites' | 'seo-chat' | 'seo-dashboard';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
  placeholder: string;
  keywords: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'website-seo',
    name: 'Website SEO',
    description: 'Analyze any website for SEO improvements.',
    category: 'SEO Analysis',
    icon: 'Globe',
    keywords: 'website,seo,analytics',
    prompt: `Analyze the SEO of this website. 
    Format your response as a professional SEO Report with these EXACT sections:
    ## 🏆 Overall SEO Score
    (Give a score out of 100 with a brief explanation)
    
    ## 📝 Executive Summary
    (2-3 sentences in simple language)
    
    ## 🚦 Key Findings
    (Use [GOOD], [AVERAGE], or [POOR] for each point)
    
    ## 🛠️ Action Plan
    (Step-by-step instructions to fix issues)
    
    ## 📈 Potential Impact
    (What will happen if fixed)
    
    Keep it simple and easy to understand for a non-technical user.`,
    placeholder: 'Enter website URL (e.g., https://example.com or example.com)'
  },
  {
    id: 'youtube-seo',
    name: 'YouTube SEO',
    description: 'Check and optimize YouTube video SEO.',
    category: 'SEO Analysis',
    icon: 'Youtube',
    keywords: 'youtube,video,marketing',
    prompt: `Analyze the SEO for this YouTube video or topic. 
    Format your response as a YouTube Optimization Guide with these sections:
    ## 📊 SEO Score
    (Out of 100)
    
    ## 🎯 Target Keywords
    (List of best keywords)
    
    ## ✍️ Optimized Title
    (Suggested title)
    
    ## 📝 Description Template
    (A ready-to-use description)
    
    ## 🏷️ Tags
    (Comma separated tags)
    
    ## 🚦 Current Status
    (Use [GOOD], [AVERAGE], or [POOR] for current elements)`,
    placeholder: 'Enter Video URL or Topic (e.g., https://youtu.be/abc or "How to bake a cake")'
  },
  {
    id: 'site-speed',
    name: 'Site Speed Checker',
    description: 'AI-simulated page load speed analysis.',
    category: 'SEO Analysis',
    icon: 'Zap',
    keywords: 'speed,fast,performance',
    prompt: `Simulate a page speed analysis for this URL.
    Format as a Speed Report with these sections:
    ## ⚡ Performance Score
    (Out of 100)
    
    ## ⏱️ Core Web Vitals
    - LCP: (Value) [GOOD/AVERAGE/POOR]
    - FID: (Value) [GOOD/AVERAGE/POOR]
    - CLS: (Value) [GOOD/AVERAGE/POOR]
    
    ## 🐢 Performance Bottlenecks
    (List main issues slowing down the site)
    
    ## 🚀 Optimization Guide
    (Provide specific, actionable recommendations categorized as follows:
    - **High Impact (High Priority)**: (e.g., Image compression, server response time) - Estimated Effort: (Low/Medium/High)
    - **Medium Impact**: (e.g., Minifying CSS/JS, browser caching) - Estimated Effort: (Low/Medium/High)
    - **Low Impact**: (e.g., Removing unused CSS, optimizing web fonts) - Estimated Effort: (Low/Medium/High))`,
    placeholder: 'Enter website URL to test speed (e.g., https://mysite.com/blog)'
  },
  {
    id: 'backlinks',
    name: 'Backlink Checker',
    description: 'Analyze backlink profile and quality.',
    category: 'SEO Analysis',
    icon: 'Link',
    keywords: 'links,network,backlinks',
    prompt: `Analyze the backlink profile for this domain.
    Format as a Backlink Audit with these sections:
    ## 🔗 Authority Score
    (Out of 100)
    
    ## 🚦 Profile Health
    [GOOD], [AVERAGE], or [POOR]
    
    ## 💎 Top Opportunities
    (List of sites to get links from)
    
    ## ⚠️ Risk Analysis
    (Identify spammy patterns or toxic links. Include specific examples like:
    - Link farms and PBNs
    - Irrelevant foreign language sites
    - Over-optimized anchor text
    - Low-quality directory submissions
    
    Provide actionable steps for removal:
    1. Outreach to webmasters for manual removal
    2. Preparing a Google Disavow file (.txt)
    3. Uploading to Google Search Console)
    
    ## 🛠️ Growth Strategy
    (How to grow backlinks)`,
    placeholder: 'Enter domain name (e.g., apple.com or yourdomain.io)'
  },
  {
    id: 'broken-links',
    name: 'Broken Link Checker',
    description: 'Scan for potential broken links and fixes.',
    category: 'SEO Analysis',
    icon: 'Unlink',
    keywords: 'broken,link,error',
    prompt: `Provide a broken link strategy.
    Format as a Link Health Report with these sections:
    ## 🚦 Overall Link Health
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔍 Common Issues Found
    (List typical broken link patterns)
    
    ## 🛠️ Fixing Guide
    (Simple steps to fix 404s and redirects)
    
    ## 🛡️ Prevention Strategy
    (How to avoid broken links in future)`,
    placeholder: 'Enter website URL to scan (e.g., https://example.com/services)'
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit Checklist',
    description: 'Complete SEO audit for your site.',
    category: 'SEO Analysis',
    icon: 'ClipboardCheck',
    keywords: 'audit,checklist,seo',
    prompt: `Generate a complete SEO Audit Checklist.
    Format as a Checklist with these sections:
    ## 📝 Summary
    (Provide a 2-3 sentence overview of the audit findings)
    
    ## 📋 Technical SEO
    (List tasks with [GOOD/AVERAGE/POOR])
    
    ## ✍️ On-Page SEO
    (List tasks with [GOOD/AVERAGE/POOR])
    
    ## 🌐 Off-Page SEO
    (List tasks with [GOOD/AVERAGE/POOR])
    
    ## 📱 Mobile & UX
    (List tasks with [GOOD/AVERAGE/POOR])
    
    ## 🏁 Priority Tasks
    (Top 3 things to do first)`,
    placeholder: 'Enter website URL for a full audit (e.g., https://mybrand.com)'
  },
  {
    id: 'mobile-friendly',
    name: 'Mobile-Friendly Test',
    description: 'Check mobile responsiveness and UX.',
    category: 'SEO Analysis',
    icon: 'Smartphone',
    keywords: 'mobile,responsive,phone',
    prompt: `Evaluate mobile-friendliness.
    Format as a Mobile UX Audit with these sections:
    ## 📱 Mobile Score
    (Out of 100)
    
    ## 🚦 UX Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔍 Critical Issues
    (What's broken on mobile?)
    
    ## 💡 UX Optimization Tips
    (How to make it better for users)`,
    placeholder: 'Enter website URL to test mobile UX (e.g., https://myshop.com)'
  },
  {
    id: 'bulk-url',
    name: 'Bulk URL Analysis',
    description: 'Analyze up to 10 URLs at once.',
    category: 'SEO Analysis',
    icon: 'Layers',
    keywords: 'bulk,data,list',
    prompt: `Analyze these URLs for SEO consistency.
    Format as a Comparison Table with these sections:
    ## 📊 Comparison Table
    (URL, Title, Meta, Status [GOOD/AVERAGE/POOR])
    
    ## 📝 General Observations
    (Common mistakes across all URLs)
    
    ## 🛠️ Bulk Fix Recommendations
    (How to fix them all at once)`,
    placeholder: 'Enter up to 10 URLs, one per line (e.g.,\nhttps://site.com/p1\nhttps://site.com/p2)'
  },
  {
    id: 'keyword-research',
    name: 'Keyword Research',
    description: 'Find high/medium/low competition keywords.',
    category: 'Content & Keywords',
    icon: 'Search',
    keywords: 'search,keywords,research',
    prompt: `Perform keyword research.
    Format as a Keyword Strategy with these sections:
    ## 🎯 Primary Keywords
    (High volume, relevant)
    
    ## 📈 Keyword Analysis Table
    (Keyword, Volume, Difficulty [GOOD/AVERAGE/POOR], Intent)
    
    ## 💡 Content Ideas
    (Topics for these keywords)
    
    ## 🏁 Easy Wins
    (Low competition keywords to target now)`,
    placeholder: 'Enter niche or seed keyword (e.g., "vegan dog food" or "SaaS marketing")'
  },
  {
    id: 'content-optimizer',
    name: 'Content Optimizer',
    description: 'Analyze and improve content quality.',
    category: 'Content & Keywords',
    icon: 'FileText',
    keywords: 'content,writing,optimization',
    prompt: `Analyze this content for SEO.
    Format as a Content Audit with these sections:
    ## ✍️ Readability Score
    (Out of 100)
    
    ## 🚦 SEO Content Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔑 Keyword Usage Analysis
    (Density and placement)
    
    ## 🛠️ Rewrite Suggestions
    (Specific parts to improve)
    
    ## 📑 Heading Structure
    (Is it optimized?)
    
    ## 🔗 Internal Linking Opportunities
    Identify potential phrases or keywords in the content that could link to other tools within the "SEO Score Suite". 
    Suggest anchor text and the corresponding target tool from this list:
    - Website SEO Analysis (website-seo)
    - YouTube SEO Checker (youtube-seo)
    - Site Speed Checker (site-speed)
    - Backlink Checker (backlinks)
    - SEO Audit Checklist (seo-audit)
    - Keyword Research Tool (keyword-research)
    - Meta Tag Generator (meta-tag)
    - Schema Markup Generator (schema-markup)
    - AI SEO Chat (seo-chat)
    
    Format as a list of suggestions.`,
    placeholder: 'Paste your content or enter URL to optimize (e.g., "Our mission is...")'
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Generate hashtags for YT, IG, TikTok.',
    category: 'Content & Keywords',
    icon: 'Hash',
    keywords: 'hashtag,social,trending',
    prompt: `Generate hashtags.
    Format as a Hashtag Kit with these sections:
    ## 🔥 Trending Tags
    (High reach) [GOOD]
    
    ## 🎯 Niche Tags
    (Targeted) [AVERAGE]
    
    ## 📱 Platform Specific Lists
    (YT, IG, TikTok lists)
    
    ## 💡 Usage Strategy
    (How to use them for maximum reach)`,
    placeholder: 'Enter topic or description (e.g., "Morning coffee routine" or "Tech review")'
  },
  {
    id: 'meta-tag',
    name: 'Meta Tag Generator',
    description: 'Generate SEO-friendly meta tags.',
    category: 'Generators',
    icon: 'Code',
    keywords: 'code,meta,tags',
    prompt: `Generate SEO meta tags.
    Format as a Meta Tag Kit with these sections:
    ## 🏷️ Title Tag
    (Optimized) [GOOD]
    
    ## 📝 Meta Description
    (Optimized) [GOOD]
    
    ## 🔗 OG & Social Tags
    (For social media)
    
    ## 💻 Code Snippet
    (Ready to copy-paste)`,
    placeholder: 'Enter page title and description (e.g., "Best Running Shoes - A guide to top footwear")'
  },
  {
    id: 'serp-preview',
    name: 'SERP Preview',
    description: 'Google search result preview tool.',
    category: 'Generators',
    icon: 'Eye',
    keywords: 'preview,google,serp',
    prompt: `Generate a SERP preview.
    Format as a Preview Report with these sections:
    ## 🖥️ Desktop Preview
    (Visual representation)
    
    ## 📱 Mobile Preview
    (Visual representation)
    
    ## 🚦 Optimization Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🛠️ Click-Through Improvements
    (How to get more clicks)`,
    placeholder: 'Enter Title and Description to preview (e.g., "SEO Score Suite | AI Tools")'
  },
  {
    id: 'og-preview',
    name: 'OG Preview Generator',
    description: 'Social media share preview tool.',
    category: 'Generators',
    icon: 'Share2',
    keywords: 'social,share,preview',
    prompt: `Generate OG tags and preview.
    Format as a Social Share Audit with these sections:
    ## 🔗 OG Tags
    (Title, Description, Image URL)
    
    ## 🚦 Shareability Score
    [GOOD], [AVERAGE], or [POOR]
    
    ## 💡 Viral Social Tips
    (How to make it viral)`,
    placeholder: 'Enter URL or Page Info (e.g., https://example.com/blog/post-1)'
  },
  {
    id: 'schema-markup',
    name: 'Schema Markup Generator',
    description: 'Generate JSON-LD structured data.',
    category: 'Generators',
    icon: 'Braces',
    keywords: 'schema,json,structured',
    prompt: `Generate JSON-LD Schema.
    Format as a Schema Kit with these sections:
    ## 🛠️ Schema Type
    (Article, Product, etc.)
    
    ## 💻 JSON-LD Code
    (Ready to copy-paste)
    
    ## 🚦 Validation Status
    [GOOD]
    
    ## 💡 Implementation Guide
    (Where to put the code)`,
    placeholder: 'Enter entity details (e.g., "iPhone 15 Pro, $999, 4.8 stars")'
  },
  {
    id: 'image-alt-text',
    name: 'Image Alt Text Generator',
    description: 'Generate descriptive alt text for images to improve accessibility and SEO.',
    category: 'Generators',
    icon: 'Image',
    keywords: 'image,alt,accessibility,seo,generator',
    prompt: `Generate descriptive and SEO-friendly alt text for an image.
    Format your response as an Alt Text Kit with these sections:
    
    ## 🖼️ Primary Alt Text
    (The best, most descriptive alt text for the image)
    
    ## ♿ Accessibility Score
    (Out of 100, based on how well it describes the image for screen readers)
    
    ## 🔍 SEO Keywords Included
    (List of relevant keywords used in the alt text)
    
    ## 💡 Contextual Variations
    Provide 3 distinct variations based on how the image is used:
    - **Decorative:** (Used for purely aesthetic images, usually empty alt="" or very brief)
    - **Informational:** (Describes the core content for users who need the information)
    - **Functional:** (Describes the action if the image is a link or button)
    
    ## 🚦 Implementation Status
    [GOOD]
    
    Ensure the alt text is concise yet descriptive, avoiding phrases like "image of" or "picture of".`,
    placeholder: 'Describe the image or provide an image URL (e.g., "A golden retriever playing in a park" or https://example.com/image.jpg)'
  },
  {
    id: 'sitemap-robots',
    name: 'Sitemap & Robots.txt',
    description: 'Generate sitemap and robots.txt files.',
    category: 'Generators',
    icon: 'FileCode',
    keywords: 'sitemap,robots,technical',
    prompt: `Generate robots.txt and sitemap.
    Format as a Technical File Kit with these sections:
    ## 🤖 Robots.txt
    (Optimized code in a \`\`\`text code block)
    
    ## 🗺️ Sitemap.xml
    (Structure in a \`\`\`xml code block)
    
    ## 🚦 Indexability Status
    [GOOD]
    
    ## 💡 Setup Guide
    (How to upload)`,
    placeholder: 'Enter website URL (e.g., https://yourwebsite.com)'
  },
  {
    id: 'compare-websites',
    name: 'Compare Websites',
    description: 'Compare your site vs competitors.',
    category: 'Compare',
    icon: 'ArrowLeftRight',
    keywords: 'compare,competitor,versus',
    prompt: `Compare two websites.
    Format as a Competitive Analysis with these sections:
    ## 🏁 Winner
    (Which site is better?)
    
    ## 📊 Comparison Table
    (Metric, Your Site, Competitor, Winner [GOOD/POOR], Keyword Gap [Keywords unique to one site])
    
    ## 🔍 Competitive Gap
    (What are they doing that you aren't?)
    
    ## 🔑 Keyword Gap Analysis
    (Identify keywords one website ranks for that the other does not. Provide specific, actionable strategies for leveraging these keyword gaps to gain a competitive advantage.)
    
    ## 🛠️ Strategic Action Plan
    (How to beat them)`,
    placeholder: 'Enter Your URL vs Competitor URL (e.g., siteA.com vs siteB.com)'
  },
  {
    id: 'seo-chat',
    name: 'AI SEO Chat',
    description: 'Ask any SEO related questions.',
    category: 'AI Assistant',
    icon: 'MessageSquare',
    keywords: 'chat,ai,assistant',
    prompt: `You are an expert SEO consultant. 
    Always format your answers with these sections:
    ## 💡 Direct Answer
    (Simple and clear)
    
    ## 🚦 Importance Level
    [GOOD] (High), [AVERAGE] (Medium), [POOR] (Low)
    
    ## 🛠️ Recommended Action Steps
    (What to do next)
    
    ## 📚 Expert Explanation
    (Brief explanation)`,
    placeholder: 'Ask anything about SEO (e.g., "How to improve domain authority?" or "What are Core Web Vitals?")'
  },
  {
    id: 'seo-dashboard',
    name: 'SEO Dashboard',
    description: 'View your analysis history and trends.',
    category: 'Insights',
    icon: 'LayoutDashboard',
    keywords: 'dashboard,stats,insights',
    prompt: '',
    placeholder: ''
  }
];

export async function runTool(toolId: ToolId, input: string) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) throw new Error("Tool not found");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }

  const model = "gemini-3-flash-preview";
  const fullPrompt = `${tool.prompt}\n\nInput: ${input}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        tools: [{ urlContext: {} }]
      }
    });

    if (!response.text) {
      throw new Error("AI returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Handle specific error cases
    if (error.status === 500 || error.message?.includes('500')) {
      throw new Error("AI request failed (500): The model might be overloaded or the input is causing an issue. Try again in a moment.");
    }
    
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API Key. Please check your GEMINI_API_KEY configuration.");
    }

    throw new Error(`AI request failed: ${error.message || 'Unknown error'}`);
  }
}
