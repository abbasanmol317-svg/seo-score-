import { ToolId } from "./gemini";

export const TOOL_PROMPTS: Record<string, string> = {
  'website-seo': `Analyze the SEO of this website using a comprehensive 260+ point Search Intelligence scan.
    Analyze the URL through three lenses: Classical SEO, Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO).
    
    Format your response as a professional Search Intelligence Report with these sections:
    
    ## 🏆 Search Intelligence Index
    (An overall score out of 100 combining all 260+ semantic and technical factors)
    
    ## 🧠 AI & SGE Readiness (GEO)
    (Score out of 100. Evaluate content connectivity, citation potential for Google SGE/Perplexity/Gemini, and semantic richness for Generative Search.)
    
    ## 🎙️ Answer Engine Score (AEO)
    (Score out of 100. Evaluate direct-answer conversational potential, schema depth, and fragment clarity for Voice Search and AI assistants.)
    
    ## 📊 Technical & On-Page Health
    (Standard SEO factors: Site speed, mobile UX, meta health, crawlability.)
    
    ## 🚦 260+ Point Deep Scan Highlights
    (Group 5-10 findings using [AI_READY], [GOOD], [AVERAGE], or [POOR])
    
    ## 🛠️ Actionable Implementation Roadmap
    (Step-by-step instructions to fix high-impact issues)
    
    ## 📉 Competitive Edge
    (How this site compares to modern AI search standards)
    
    Keep it professional and technical yet actionable.`,
  
  'youtube-seo': `Analyze the SEO for this YouTube video or topic. 
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

  'site-speed': `Simulate a page speed analysis for this URL.
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

  'backlinks': `Analyze the backlink profile for this domain.
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
    - Low-quality directory submissions
    
    Provide actionable steps for removal:
    1. Outreach to webmasters for manual removal
    2. Preparing a Google Disavow file (.txt)
    3. Uploading to Google Search Console)
    
    ## 🛠️ Growth Strategy
    (How to grow backlinks)`,

  'broken-links': `Provide a broken link strategy.
    Format as a Link Health Report with these sections:
    ## 🚦 Overall Link Health
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔍 Common Issues Found
    (List typical broken link patterns)
    
    ## 🛠️ Fixing Guide
    (Simple steps to fix 404s and redirects)
    
    ## 🛡️ Prevention Strategy
    (How to avoid broken links in future)`,

  'seo-audit': `Generate a complete 260+ point Search Intelligence Audit.
    Analyze the site for traditional technical SEO, AI-Search readability (GEO), and direct-answer compatibility (AEO).
    
    Format as a Search Intelligence Checklist with these EXACT sections:
    ## 📝 Strategic Summary
    (Provide a 2-3 sentence overview of how the site competes in the 2026 search landscape.)
    
    ## 📋 Advanced Technical & Hygiene Scan
    (Checklist items for indexability, Core Web Vitals, and server hygiene with [GOOD/AVERAGE/POOR])
    
    ## 🧠 GEO & Semantic Quality (AI Context)
    (Evaluate topical clusters, semantic density, and AI citation readiness with [GOOD/AVERAGE/POOR])
    
    ## 📡 AEO & Knowledge Graph Readiness
    (Evaluate structured data depth for Answer Engines and Rich Snippets with [GOOD/AVERAGE/POOR])
    
    ## 📱 UX & Interactive Optimization
    (Mobile, Speed, and User Flow indicators with [GOOD/AVERAGE/POOR])
    
    ## 🏁 Multi-Agent Priority Roadmap
    (Top 3 high-impact tasks to win in both Google and AI-discovery engines)`,

  'on-page-checklist': `Generate a detailed On-Page SEO Checklist for this page or topic.
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

  'mobile-friendly': `Evaluate mobile-friendliness.
    Format as a Mobile UX Audit with these sections:
    ## 📱 Mobile Score
    (Out of 100)
    
    ## 🚦 UX Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🔍 Critical Issues
    (What's broken on mobile?)
    
    ## 💡 UX Optimization Tips
    (How to make it better for users)`,

  'bulk-url': `Analyze these URLs for SEO consistency.
    Format as a Comparison Table with these sections:
    ## 📊 Comparison Table
    (URL, Title, Meta, Status [GOOD/AVERAGE/POOR])
    
    ## 📝 General Observations
    (Common mistakes across all URLs)
    
    ## 🛠️ Bulk Fix Recommendations
    (How to fix them all at once)`,

  'keyword-research': `Analyze the provided topic or seed keyword and generate a comprehensive Keyword Strategy.
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

  'content-optimizer': `Analyze this content for SEO and readability.
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
    Identify strategic, high-value opportunities to link to other tools and blog posts within the "SEO Score" platform. These links must improve user value, build topical authority, and reinforce internal SEO structure.
    
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

  'content-analysis': `Perform a deep Content Analysis on the provided text or URL.
    Your analysis MUST focus on readability, keyword density, and actionable semantic improvements.
    
    Format your response as a Comprehensive Content Review with these EXACT sections:
    
    ## 🎯 Analysis Summary
    (2-3 sentences overview of the content's voice, intent, and overall SEO potential)
    
    ## ✍️ Readability Score
    Score: [0-100]
    (Provide a score based on Flesch-Kincaid logic. Explain if it's Easy, Moderate, or Difficult.)
    
    ## 🔑 Keyword Density Audit
    Provide a detailed breakdown of keyword usage:
    - **Primary Keyword**: [Detected or Target Keyword]
    - **Density**: [X.X%] [GOOD/AVERAGE/POOR]
    - **Usage Status**: [Details on placement in H1, first 100 words, and conclusion]
    
    ## 📊 Semantic Performance
    (A table showing top 5 used keywords and their frequencies)
    | Keyword | Count | Density | Status |
    |---------|-------|---------|--------|
    | ...     | ...   | ...     | ...    |
    
    ## 🛠️ Optimization Suggestions
    (List at least 5 specific, high-impact improvements for readability and keyword focus)
    
    ## 🚦 SEO Content Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🏁 Implementation Guide
    (Step-by-step instructions on what to change first for the biggest ranking boost)`,

  'hashtag-generator': `Generate hashtags.
    Format as a Hashtag Kit with these sections:
    ## 🔥 Trending Tags
    (High reach) [GOOD]
    
    ## 🎯 Niche Tags
    (Targeted) [AVERAGE]
    
    ## 📱 Platform Specific Lists
    (YT, IG, TikTok lists)
    
    ## 💡 Usage Strategy
    (How to use them for maximum reach)`,

  'meta-tag': `Analyze the provided page information and generate optimized SEO meta tags.
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
    #### 🎯 Clarity & Intent Analysis
    [Analyze how well the description matches the user's likely search intent. Evaluate if it's too vague or highly specific. Provide concrete examples on how to improve the core message for maximum clarity and user relevance.]

    #### 🔑 Keyword Integration Strategy
    [Evaluate how the primary and secondary keywords are integrated. Suggest better placement, such as front-loading or natural semantic variations, to ensure bolding in search results and thematic relevance.]

    #### 🚀 Key CTR Improvements
    1. [Power Word/Emotional Trigger improvement]
    2. [Clarity/Readability improvement]
    3. [Call-to-Action/Intent improvement]
    
    #### 🏁 Final Optimized Version
    (Provide a final, perfectly balanced meta description that incorporates all the above improvements within 155 characters.)
    
    ### 📏 Length & Visibility Check
    - **Title:** (Is it between 50-60 characters?)
    - **Description:** (Is it between 150-160 characters?)
    - **Suggestion:** If truncated, provide a perfectly trimmed version that keeps the most important keywords at the front.
    
    ## 🔗 OG & Social Tags
    (For social media)
    
    ## 🛠️ Schema Markup (JSON-LD)
    If "Product Schema Details", "Article Schema Details", "Local Business Schema Details", "Organization Schema Details", or "FAQ Schema Details" are provided in the input, generate the corresponding JSON-LD schema (Product, Article, LocalBusiness, Organization, or FAQ). If no specific details are provided, generate a WebPage or Article schema based on the content.
    
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

  'serp-preview': `Generate a SERP preview.
    Format as a Preview Report with these sections:
    ## 🖥️ Desktop Preview
    (Visual representation)
    
    ## 📱 Mobile Preview
    (Visual representation)
    
    ## 🚦 Optimization Status
    [GOOD], [AVERAGE], or [POOR]
    
    ## 🛠️ Click-Through Improvements
    (How to get more clicks)`,

  'og-preview': `Generate OG tags and preview.
    Format as a Social Share Audit with these sections:
    ## 🔗 OG Tags
    (Title, Description, Image URL)
    
    ## 🚦 Shareability Score
    [GOOD], [AVERAGE], or [POOR]
    
    ## 💡 Viral Social Tips
    (How to make it viral)`,

  'schema-markup': `Generate JSON-LD Schema.
    Format as a Schema Kit with these sections:
    ## 🛠️ Schema Type
    (Article, Product, etc.)
    
    ## 💻 JSON-LD Code
    (Ready to copy-paste)
    
    ## 🚦 Validation Status
    [GOOD]
    
    ## 💡 Implementation Guide
    (Where to put the code)`,

  'image-alt-text': `Generate descriptive and SEO-friendly alt text for an image.
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

  'sitemap-robots': `Generate robots.txt and sitemap.
    Format as a Technical File Kit with these sections:
    ## 🤖 Robots.txt
    (Optimized code in a \`\`\`text code block)
    
    ## 🗺️ Sitemap.xml
    (Structure in a \`\`\`xml code block)
    
    ## 🚦 Indexability Status
    [GOOD]
    
    ## 💡 Setup Guide
    (How to upload)`,

  'compare-websites': `Compare two websites.
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

  'seo-chat': `You are an expert SEO consultant. 
    Always format your answers with these sections:
    ## 💡 Direct Answer
    (Simple and clear)
    
    ## 🚦 Importance Level
    [GOOD] (High), [AVERAGE] (Medium), [POOR] (Low)
    
    ## 🛠️ Recommended Action Steps
    (What to do next)
    
    ## 📚 Expert Explanation
    (Brief explanation)`,

  'seo-dashboard': '',
};
