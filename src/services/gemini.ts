import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({ apiKey });

export type ToolId = 
  | 'website-seo' | 'youtube-seo' | 'site-speed' | 'backlinks' 
  | 'broken-links' | 'seo-audit' | 'mobile-friendly' | 'bulk-url'
  | 'keyword-research' | 'content-optimizer' | 'hashtag-generator'
  | 'meta-tag' | 'serp-preview' | 'og-preview' | 'schema-markup' | 'image-alt-text'
  | 'sitemap-robots' | 'compare-websites' | 'seo-chat' | 'seo-dashboard' | 'on-page-checklist';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: string;
  icon: string;
  slug: string;
  prompt: string;
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
    icon: 'CirclePlay',
    slug: 'free-youtube-seo-tool',
    keywords: 'youtube,video,marketing',
    seoTitle: 'Free YouTube SEO Tool – Optimize Titles, Tags & Descriptions',
    seoDescription: 'Use our free YouTube SEO tool to generate optimized titles, tags, and descriptions to increase views and rankings.',
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
    icon: 'Gauge',
    slug: 'free-website-speed-test-tool',
    keywords: 'speed,fast,performance',
    seoTitle: 'Best Website Speed Test Tool – Core Web Vitals Checker',
    seoDescription: 'Test your website speed for free. Analyze Core Web Vitals, loading time, and performance to improve user experience.',
    prompt: `Simulate a page speed analysis for this URL.
    Format as a Speed Report with these sections:
    ## ⚡ Performance Score
    (Out of 100)
    
    ## ⏱️ Core Web Vitals
    (Provide simulated values for LCP, FID, and CLS. MUST use this EXACT format:)
    - LCP: [Value] [GOOD/AVERAGE/POOR]
    - FID: [Value] [GOOD/AVERAGE/POOR]
    - CLS: [Value] [GOOD/AVERAGE/POOR]
    
    ## 🐢 Performance Bottlenecks
    (List main issues slowing down the site)
    
    ## 🚀 Optimization Guide
    (Provide specific, actionable recommendations categorized as follows:
    - **High Impact (High Priority)**: (e.g., Image compression, server response time) [LOW_EFFORT]
    - **Medium Impact**: (e.g., Minifying CSS/JS, browser caching) [MEDIUM_EFFORT]
    - **Low Impact**: (e.g., Removing unused CSS, optimizing web fonts) [HIGH_EFFORT]
    
    Note: Use [LOW_EFFORT], [MEDIUM_EFFORT], or [HIGH_EFFORT] for each recommendation based on implementation complexity.
    
    ## 🛠️ Implementation Effort Summary
    (Provide a summary list of all recommendations and their estimated effort: [LOW_EFFORT], [MEDIUM_EFFORT], or [HIGH_EFFORT]))`,
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
    icon: 'LinkOff',
    slug: 'free-broken-link-checker-tool',
    keywords: 'broken,link,error',
    seoTitle: 'Advanced Broken Link Checker Tool – Find 404 Errors & Dead Links',
    seoDescription: 'Scan your website for free and detect broken links, 404 errors, and dead pages to improve SEO and UX.',
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
    icon: 'SearchCode',
    slug: 'free-seo-audit-checklist',
    keywords: 'audit,checklist,seo',
    seoTitle: 'Free SEO Audit Checklist – Complete Technical & On-Page Guide',
    seoDescription: 'Use this free SEO audit checklist to optimize your website. Cover technical SEO, on-page fixes, and ranking factors.',
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
    id: 'on-page-checklist',
    name: 'On-Page SEO Checklist',
    description: 'Optimize individual pages with a detailed on-page checklist.',
    category: 'SEO Analysis',
    icon: 'ClipboardCheck',
    slug: 'free-on-page-seo-checklist',
    keywords: 'on-page,checklist,optimization,content',
    seoTitle: 'Best On-Page SEO Checklist – Optimize Pages for Higher Rankings',
    seoDescription: 'Improve your pages with a free on-page SEO checklist. Optimize titles, content, keywords, and internal links.',
    prompt: `Generate a detailed On-Page SEO Checklist for this page or topic.
    Format as a Checklist with these EXACT sections:
    ## 📝 Page Summary
    (Brief overview of the page's current optimization state)
    
    ## 🏷️ Title & Meta Tags
    (Checklist items for Title Tag and Meta Description with [GOOD/AVERAGE/POOR])
    
    ## 🏗️ Header Structure (H1-H6)
    (Checklist items for heading hierarchy and keyword placement with [GOOD/AVERAGE/POOR])
    
    ## 🔑 Keyword Optimization
    (Checklist items for primary/secondary keyword usage and density with [GOOD/AVERAGE/POOR])
    
    ## 🔗 Internal & External Linking
    (Checklist items for link quality and anchor text with [GOOD/AVERAGE/POOR])
    
    ## 🖼️ Image & Media SEO
    (Checklist items for alt text and file names with [GOOD/AVERAGE/POOR])
    
    ## 🏁 Top 3 Optimization Fixes
    (The most critical things to fix first)`,
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
    icon: 'ListChecks',
    slug: 'free-bulk-url-seo-analysis-tool',
    keywords: 'bulk,data,list',
    seoTitle: 'Advanced Bulk URL SEO Analysis Tool – Analyze Multiple Pages',
    seoDescription: 'Analyze multiple URLs for free. Get SEO insights, performance data, and optimization tips for better rankings.',
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
    icon: 'KeyRound',
    slug: 'free-keyword-research-tool',
    keywords: 'search,keywords,research',
    seoTitle: 'Free Keyword Research Tool – Find High Volume Low Competition Keywords',
    seoDescription: 'Discover free keyword ideas with high search volume and low competition to improve SEO and rank faster.',
    prompt: `Analyze the provided topic or seed keyword and generate a comprehensive Keyword Strategy.
    Format your response with these EXACT sections:
    
    ## 🎯 Primary Keywords
    (List of high-volume, high-relevance keywords)
    
    ## 📈 Keyword Analysis Detail
    (A detailed breakdown including:)
    - **Keyword**: [Keyword Name]
    - **Volume**: [Estimated Monthly Volume]
    - **Difficulty**: [Percentage 0-100] [GOOD/AVERAGE/POOR]
    - **Search Intent**: [Informational/Transactional/Navigational]
    
    ## 🚀 Easy Wins (Low Competition)
    ### 💡 Why Easy Wins Matter
    (Briefly explain why these low-competition keywords are critical for new websites or sites with lower domain authority—focusing on building initial momentum and ranking faster.)
    
    ### 🎯 Identified Easy Wins
    Identify "Easy Win" keywords: these must have decent search volume but very low organic competition. 
    Format each as:
    - **[Keyword]**: [Reason why it's an easy win] | Volume: [X,XXX] | Difficulty: [Low]
    
    ### 🏃 Prioritization Strategy
    (Suggest how to prioritize these keywords in a content calendar—e.g., target them first to gain topical authority and early traffic.)
    
    ## 💡 Content Clusters & Topics
    (Suggested content strategies to build topical authority)
    
    ## 📉 Related Semantic Keywords
    (LSI and semantically related keywords to include in your content for better relevance)`,
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
    prompt: `Analyze this content for SEO and readability.
    Format your response as a Content Audit with these EXACT sections:
    ## ✍️ Readability Score
    Score: [0-100]
    
    ## 🚦 SEO Content Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔑 Keyword Usage Analysis
    - Primary Keyword: [Keyword]
    - Density: [X.X%] [GOOD/AVERAGE/POOR]
    - Placement: [Details]
    
    ## 🛠️ Rewrite Suggestions
    (Specific parts or sentences to improve for better flow and impact)
    
    ## 📑 Heading Structure
    (Analyze H1-H4 hierarchy and keyword placement)
    
    ## 🔗 Internal Linking Opportunities
    Identify strategic, high-value opportunities to link to other tools and blog posts within the "SEO Score Suite" platform. These links must improve user value, build topical authority, and reinforce internal SEO structure.
    
    CRITICAL Guidelines for Internal Linking:
    - **Natural Integration**: Suggestions MUST feel like an organic part of the text, not a forced insertion.
    - **Contextual Anchor Text**: Use descriptive, keyword-rich phrases as anchor text (e.g., "comprehensive technical SEO audit" instead of "click here").
    - **Topical Relevance**: Only suggest links that genuinely add value to the specific context of the content being analyzed.
    - **Variety**: Mix exact-match and semantic-match anchor texts.
    
    🚫 AVOID THESE MISTAKES:
    - NO Anchor Text Spam: Never use the exact same anchor text repeatedly across different suggestions.
    - NO Irrelevant Links: If a tool or blog post doesn't directly solve a problem mentioned in the text, do NOT suggest it.
    - NO Link Overload: Suggest a maximum of 3-5 high-quality links. Do not crowd the content.
    - NO Orphaned Entities: Ensure suggestions help connect "orphan" topics to relevant suite tools.
    
    Highly Relevant Target Tools:
    - Website SEO Analysis (website-seo): For site-wide health checks.
    - Keyword Research Tool (keyword-research): For finding new ranking opportunities.
    - Site Speed Checker (site-speed): For performance optimization.
    - Broken Link Checker (broken-links): For cleaning up 404 errors.
    - SEO Audit Checklist (seo-audit): For a complete technical review.
    - Meta Tag Generator (meta-tag): For optimizing search appearance.
    
    Highly Relevant Blog Posts:
    - Website SEO: Complete Guide to Ranking Your Website in 2026 (blog-22)
    - How to do SEO Audit Step by Step (blog-5)
    - How Gemini AI is Revolutionizing SEO Analysis (blog-1)
    
    Format each suggestion as:
    '[Contextual Anchor Text] -> [Tool ID or Blog ID] | [Brief Reason] | [Source Sentence with anchor text **bolded**]'
    
    Make sure to provide at least 3-5 high-quality linking suggestions if the content length allows.
    
    ## 🏁 Next Steps & Recommended Tools
    (Always include a clear Call-to-Action recommending the **Keyword Research Tool** (keyword-research) to find more high-value topics and relevant keywords to further optimize this content. Explain how identifying 'Easy Win' keywords specifically can accelerate their SEO performance.)`,
    placeholder: 'Paste your content or enter URL to optimize (e.g., "Our mission is...")'
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
    description: 'Generate high-CTR meta tags with advanced SERP previews and real-time SEO analysis to boost rankings.',
    category: 'Generators',
    icon: 'ScrollText',
    slug: 'free-meta-tag-generator',
    keywords: 'code,meta,tags',
    seoTitle: 'Free Meta Tag Generator – Create High CTR SEO Titles & Descriptions',
    seoDescription: 'Generate SEO-friendly meta titles and descriptions for free to improve click-through rate and visibility.',
    prompt: `Analyze the provided page information and generate optimized SEO meta tags.
    Format your response as a Meta Tag Kit with these sections:
    
    ## 🏷️ Title Tag
    (Optimized Title - Incorporate power words and a clear value proposition) [GOOD]
    
    ## 📝 Meta Description
    (Optimized Description) [GOOD]
    - **3 Specific CTR Suggestions**:
        1. [Suggestion to increase CTR 1]
        2. [Suggestion to increase CTR 2]
        3. [Suggestion to increase CTR 3]
    
    ## 🚀 High-CTR "Boosted" Versions
    Generate 5 distinct variations of high-CTR meta tags. Each variation MUST focus on one of these specific psychological triggers:
    1. **Urgency/FOMO**
    2. **Curiosity/Open Loop**
    3. **Benefit-Driven**
    4. **Social Proof**
    5. **Authority/Trust**
    
    For EACH variation, you MUST provide:
    - **Trigger**: [Trigger Name]
    - **Title**: (Aggressive power words, high-impact)
    - **Description**: (Clear CTA, emotional trigger)
    - **CTR Suggestions**: (Exactly 3 short, bulleted tips)
    
    ### Variation 1
    - **Trigger**: Urgency/FOMO
    - **Title**: ...
    - **Description**: ...
    - **CTR Suggestions**: 1. ... 2. ... 3. ...

    (Repeat for Variation 2: Curiosity, Variation 3: Benefit-Driven, Variation 4: Social Proof, Variation 5: Authority/Trust)

    ## 📈 CTR Analysis & Suggestions
    Provide a granular, deep-dive analysis of the generated (or provided) meta tags with highly specific, actionable recommendations to maximize Click-Through Rate (CTR):
    
    ### ⚡ Power Word Optimization
    - **Current Impact:** (Analyze the emotional weight of existing words. Are they "safe" or "magnetic"?)
    - **Niche-Specific Power Words:** Suggest 5 specific "Power Words" tailored to this EXACT niche (e.g., for Finance: *Secure, Guaranteed*; for Health: *Proven, Natural*).
    - **Placement Strategy:** Suggest where to place these words (front-loading vs. end-loading) for maximum visual impact in search results.
    
    ### 💎 Value Proposition Clarity
    - **The 2-Second Test:** Does the Title Tag immediately answer "Why should I click this instead of the other 9 results?"
    - **USP Refinement:** Identify the single strongest Unique Selling Point (USP) from the content and provide a "Value-First" Title rewrite that leads with that benefit.
    - **Clarity vs. Cleverness:** Audit if the title is too "clever" at the expense of being clear to a searching user.
    
    ### 📣 Call-to-Action (CTA) Strategy
    - **Psychological Trigger Audit:** Identify which trigger the current CTA uses (e.g., Fear of Missing Out, Desire for Gain, Curiosity).
    - **Funnel-Tailored CTA Matrix:** Provide a diverse set of high-converting CTAs tailored to different stages of the user funnel and psychological profiles:
      - **TOFU (Awareness - Curiosity/Education):** e.g., "Discover the 5 secrets to...", "Learn how to master...", "Uncover the truth about..."
      - **MOFU (Consideration - Benefit/Comparison):** e.g., "See why experts choose...", "Compare the best options for...", "Download your free guide to..."
      - **BOFU (Conversion - Urgency/Direct Action):** e.g., "Get started for free", "Claim your 20% discount", "Join 10,000+ happy customers today"
    - **Micro-Copy Improvement:** Suggest small tweaks to the CTA to make it feel more personal or urgent (e.g., changing "Learn More" to "Discover Your Potential").
    
    ### 📝 Meta Description Audit
    - **Clarity & Intent Analysis:** (Analyze how well the description matches the user's likely search intent. Is it too vague or highly specific?)
    - **Keyword Integration Strategy:** (Evaluate how the primary keyword is integrated. Suggest better placement, such as front-loading, to ensure it bolds in search results.)
    - **CTA Effectiveness & Hook:** (Analyze the closing hook. Provide 2-3 specific, high-conversion CTA alternatives that create urgency or curiosity.)
    - **3 Key CTR Improvements:**
        1. [Power Word/Emotional Trigger improvement]
        2. [Clarity/Readability improvement]
        3. [Call-to-Action/Intent improvement]
    - **Optimized Master Version:** (Provide a final, perfectly balanced meta description that incorporates all the above improvements within 155 characters.)
    
    ### 📏 Length & Visibility Check
    - **Title:** (Is it between 50-60 characters?)
    - **Description:** (Is it between 150-160 characters?)
    - **Suggestion:** If truncated, provide a perfectly trimmed version that keeps the most important keywords at the front.
    
    ## 🔗 OG & Social Tags
    (For social media)
    
    ## 🛠️ Schema Markup (JSON-LD)
    If product details (name, price, reviews) are provided, generate a valid Product JSON-LD schema. Otherwise, generate a WebPage or Article schema based on the content.
    
    \u0060\u0060\u0060json
    {
      "@context": "https://schema.org",
      "@type": "...",
      ...
    }
    \u0060\u0060\u0060
    
    ## 💻 Code Snippet
    \u0060\u0060\u0060html
    <!-- Standard Meta Tags -->
    <title>...</title>
    <meta name="description" content="...">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="...">
    <meta property="og:description" content="...">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="...">
    <meta name="twitter:description" content="...">
    \u0060\u0060\u0060 `,
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
    slug: 'free-open-graph-preview-tool',
    keywords: 'social,share,preview',
    seoTitle: 'Free Open Graph Preview Tool – Social Media Share Preview',
    seoDescription: 'Preview your content on social media for free. Optimize Open Graph tags for better sharing and engagement.',
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
    icon: 'CodeXml',
    slug: 'free-schema-markup-generator',
    keywords: 'schema,json,structured',
    seoTitle: 'Best Schema Markup Generator – JSON-LD Structured Data Tool',
    seoDescription: 'Generate JSON-LD schema markup for free. Improve rich snippets and search visibility easily.',
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
    icon: 'ImageDown',
    slug: 'free-image-alt-text-generator',
    keywords: 'image,alt,accessibility,seo,generator',
    seoTitle: 'Free AI Image Alt Text Generator – SEO & Accessibility Tool',
    seoDescription: 'Create SEO-friendly alt text for images for free. Improve accessibility and search rankings.',
    prompt: `Generate descriptive and SEO-friendly alt text for an image.
    Format your response as an Alt Text Kit with these sections:
    
    ## 🖼️ Primary Alt Text
    (The best, most descriptive alt text for the image, balancing accessibility and SEO)
    
    ## ♿ Accessibility Score
    (Out of 100, based on WCAG 2.1 guidelines for non-text content)
    
    ## 🔍 SEO Keywords Included
    (List of relevant keywords used in the alt text to improve image search rankings)
    
    ## 💡 Contextual Variations
    Provide 3 distinct variations based on the specific use case of the image, adhering to accessibility (WCAG) and SEO best practices:
    - **Decorative:** (For images that are purely aesthetic, like background patterns or mood-setters. Output MUST be exactly alt="" with a brief explanation that this allows screen readers to skip the element, preventing cognitive load for users. **SEO Tip**: Use CSS for these whenever possible.)
    - **Informational:** (For images that convey a specific message, data, or emotion. Provide a concise description that delivers the same information as the image itself. If the image contains text, that text MUST be included in the alt text. **SEO Tip**: This is where you should naturally include your primary keywords.)
    - **Functional:** (For images used as links or buttons. Describe the ACTION or DESTINATION, e.g., "Search", "Download Report", or "Go to Homepage", rather than describing the visual appearance of the icon. **SEO Tip**: Use keywords related to the destination page.)
    
    ## 🚦 Implementation Status
    [GOOD]
    
    ## 🛠️ Best Practices Applied
    - **Conciseness**: Avoiding "image of" or "picture of".
    - **Keyword Integration**: Natural inclusion of keywords without stuffing.
    - **Context Awareness**: Tailoring text to the image's role on the page.
    - **Screen Reader Optimization**: Ensuring the most important info is at the start.`,
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
    icon: 'GitCompare',
    slug: 'free-website-comparison-tool',
    keywords: 'compare,competitor,versus',
    seoTitle: 'Best Website Comparison Tool – SEO Competitor Analysis',
    seoDescription: 'Compare websites for free. Analyze competitors, keyword gaps, and backlinks to improve rankings.',
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
    icon: 'MessageCircleMore',
    slug: 'free-ai-seo-assistant',
    keywords: 'chat,ai,assistant',
    seoTitle: 'Free AI SEO Assistant – Instant SEO Help & Guidance',
    seoDescription: 'Get free SEO advice instantly with AI. Solve SEO problems and improve your website rankings.',
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
    icon: 'LayoutGrid',
    slug: 'free-seo-dashboard',
    keywords: 'dashboard,stats,insights',
    seoTitle: 'Advanced SEO Dashboard – Track Rankings, Reports & Performance',
    seoDescription: 'Monitor your SEO performance for free. Track rankings, reports, and website growth in one dashboard.',
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
  let contents: any[] = [];

  // Check if input is a data URL (image upload)
  if (input.startsWith('data:image/')) {
    const [header, base64Data] = input.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    contents = [{
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: tool.prompt }
      ]
    }];
  } else {
    contents = [{ role: 'user', parts: [{ text: `${tool.prompt}\n\nInput: ${input}` }] }];
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
