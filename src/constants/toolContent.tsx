import React from 'react';
import { Link } from 'react-router-dom';
import { ToolId } from '../services/gemini';

interface ToolDeepContent {
  about: React.ReactNode;
  howTo: string[];
  whyItMatters: React.ReactNode;
  proTips: string[];
  mistakesToAvoid?: string[];
  faqs: { q: string, a: React.ReactNode }[];
}

export const TOOL_DEEP_CONTENT: Record<string, ToolDeepContent> = {
  'Generators': {
    about: (
      <>
        Our AI-powered generators are designed to take the guesswork out of technical SEO. Whether you're crafting meta tags that demand clicks or building complex schema markups that help Google understand your business, these tools provide production-ready code in seconds. We don't just generate text; we engineer snippets that align with the latest search engine algorithms and user psychology. Our goal is to help you win the 'click' before the user even lands on your site. For a deeper dive into technical optimization, check out our <Link to="/tools/free-website-seo-audit-tool" className="text-indigo-600 hover:underline font-bold">Website SEO Audit</Link> tool.
      </>
    ),
    howTo: [
      "Input your primary page details, target keywords, or product information.",
      "Review the AI-generated variations tailored to different psychological triggers like urgency or curiosity.",
      "Use the built-in SERP preview to visualize how your content appears on mobile and desktop devices.",
      "Copy the optimized code directly into your website's <head> section or CMS."
    ],
    whyItMatters: "In a crowded search landscape, your 'first impression' is often your meta title and description. If they aren't optimized for both keywords and clicks, you're leaving traffic on the table. These tools ensure your technical foundations are rock-solid, improving your visibility and click-through rates simultaneously.",
    proTips: [
      "Front-load your most important keywords in titles for better visibility in search results.",
      "Use 'Power Words' (e.g., 'Proven', 'Instant', 'Free') to trigger emotional responses and increase CTR.",
      "Always validate your schema markup using Google's Rich Results Test after implementation to ensure it's error-free."
    ],
    mistakesToAvoid: [
      "Keyword stuffing in titles (focus on readability instead).",
      "Using generic meta descriptions for every page.",
      "Neglecting mobile SERP previews; many users only see the first 45 characters on mobile."
    ],
    faqs: [
      { q: "Do meta tags still matter for SEO in 2026?", a: "Yes, while meta descriptions aren't a direct ranking factor, they significantly impact Click-Through Rate (CTR). A higher CTR signals to Google that your page is highly relevant to the user's query." },
      { q: "How long should my meta title be?", a: "Ideally between 50-60 characters. Anything longer will likely be truncated in search results, which can hide your call-to-action or primary keywords." },
      { q: "What is Schema Markup?", a: "Schema is a form of structured data that helps search engines understand the context of your content, often resulting in 'Rich Snippets' like star ratings, prices, or event dates that stand out in the SERPs." }
    ]
  },
  'Content & Keywords': {
    about: (
      <>
        Content is the soul of SEO, but without the right keywords, even the best writing can go unnoticed. Our Content & Keywords suite helps you bridge the gap between what you want to say and what users are actually searching for. Using advanced semantic analysis, we identify high-value opportunities and help you optimize your writing for maximum topical authority and readability. Pair this with our <Link to="/tools/free-ai-seo-assistant" className="text-indigo-600 hover:underline font-bold">AI SEO Chat</Link> for personalized content strategies.
      </>
    ),
    howTo: [
      "Enter your main topic, a seed keyword, or a competitor's URL to extract high-potential ideas.",
      "Analyze search volume and difficulty metrics to find 'low-hanging fruit' keywords that are easier to rank for.",
      "Use the Content Optimizer to identify semantic gaps and readability issues in your existing articles.",
      "Integrate suggested long-tail keywords naturally into your headings and body text to improve relevance."
    ],
    whyItMatters: "Google's algorithm has evolved from simple keyword matching to understanding 'entities' and 'intent'. Our tools help you write for humans first, while ensuring search engines can easily categorize your expertise. This balance is the key to sustainable, long-term organic growth and building a loyal audience.",
    proTips: [
      "Focus on 'User Intent' (Informational, Navigational, Transactional) rather than just search volume.",
      "Build 'Topic Clusters' by linking related articles together to boost your site's overall authority on a subject.",
      "Don't over-optimize; aim for a natural reading flow that provides genuine value to your readers."
    ],
    mistakesToAvoid: [
      "Same anchor text spam (using the exact same phrase for every internal link).",
      "Linking to irrelevant tools or pages that don't add value to the reader.",
      "Orphan pages (having important content that has no internal links pointing to it).",
      "Too many links on one page (which dilutes 'link juice' and confuses users)."
    ],
    faqs: [
      { q: "What is keyword difficulty?", a: "It's a metric that estimates how hard it would be to rank on the first page of Google for a specific keyword, based on the authority and quality of existing results." },
      { q: "How many keywords should I target per page?", a: "Focus on one primary keyword and 3-5 related semantic keywords (LSI) to maintain topical depth without confusing search engines or readers." },
      { q: "What are long-tail keywords?", a: "These are longer, more specific phrases that users search for. They usually have lower volume but much higher conversion rates because they target specific needs." }
    ]
  },
  'Audits & Analysis': {
    about: (
      <>
        A successful SEO strategy starts with a clear understanding of where you stand. Our Audits & Analysis tools provide a 360-degree view of your website's health, from technical bottlenecks to competitor movements. We simulate a deep crawl of your site, identifying issues that might be holding you back from the first page of results and providing a clear roadmap for improvement. If you find technical issues, use our <Link to="/tools/free-website-speed-test-tool" className="text-indigo-600 hover:underline font-bold">Site Speed Checker</Link> to diagnose performance lags.
      </>
    ),
    howTo: [
      "Run a full SEO Audit to get an instant health score and a prioritized list of technical and on-page fixes.",
      "Check your backlink profile to identify high-quality links and potential toxic ones that need to be disavowed.",
      "Track your rankings over time to see the direct impact of your optimization efforts on your search visibility.",
      "Compare your technical performance and keyword gaps against top competitors in your niche."
    ],
    whyItMatters: "SEO isn't a 'set it and forget it' task. It requires constant monitoring and adjustment. By identifying technical errors, broken links, or ranking drops early, you can take corrective action before they impact your traffic and revenue. Data-driven decisions are always more effective than guesswork.",
    proTips: [
      "Prioritize 'Critical' errors in your audit reports as these have the most immediate impact on your rankings.",
      "Monitor your 'Core Web Vitals' regularly, as they are a direct ranking factor and critical for user experience.",
      "Keep an eye on competitor backlinks to find new outreach opportunities and understand their link-building strategy."
    ],
    mistakesToAvoid: [
      "Ignoring the 'overall SEO score' trend; consistent progress is better than a one-time fix.",
      "Focusing only on high search volume keywords that you have zero chance of ranking for (ignore difficulty).",
      "Assuming a site is 'done' with SEO; it's a continuous process of auditing and refinement."
    ],
    faqs: [
      { q: "How often should I audit my website?", a: "We recommend a full technical audit at least once a quarter, or whenever you make significant changes to your site's structure, content, or hosting." },
      { q: "What are backlinks?", a: "Backlinks are links from other websites to yours. They act as 'votes of confidence' and are one of Google's strongest signals for determining authority and trust." },
      { q: "Why did my rankings drop suddenly?", a: "Sudden drops can be caused by technical errors (like accidental 'noindex' tags), Google algorithm updates, or a loss of high-quality backlinks." }
    ]
  },
  'Technical': {
    about: (
      <>
        Technical SEO is the foundation upon which all other efforts are built. If your site is slow, broken, or not mobile-friendly, even the best content won't rank. Our Technical suite provides deep-dive diagnostics into your site's infrastructure, helping you provide a seamless, fast, and secure experience for both users and search crawlers. For content-specific technical fixes, try our <Link to="/tools/free-meta-tag-generator" className="text-indigo-600 hover:underline font-bold">Meta Tag Generator</Link>.
      </>
    ),
    howTo: [
      "Test your page speed to identify large images, render-blocking scripts, or server response issues.",
      "Use the Broken Link Checker to find and fix 404 errors that frustrate users and waste crawl budget.",
      "Verify your site's mobile-friendliness to ensure you provide a perfect experience for smartphone users.",
      "Analyze your site's crawlability and indexability to make sure search engines can find and store your important pages."
    ],
    whyItMatters: "User experience (UX) is now a core part of SEO. Google prioritizes sites that load quickly and work perfectly on all devices. Technical excellence reduces your bounce rate and increases the time users spend on your site, which are both strong positive signals to search engines.",
    proTips: [
      "Optimize and compress all images before uploading them to your site to significantly improve load times.",
      "Use a Content Delivery Network (CDN) to speed up global load times by serving content from servers closer to the user.",
      "Ensure your site uses HTTPS for security, as it's a confirmed ranking signal and builds trust with your visitors."
    ],
    mistakesToAvoid: [
      "Having slow server response times (TTFB) which can negate all other front-end optimizations.",
      "Using massive image files that haven't been resized for web use.",
      "Ignoring 404 errors for too long; they reflect poorly on your site's quality in the eyes of search crawlers."
    ],
    faqs: [
      { q: "What are Core Web Vitals?", a: "These are a set of specific factors that Google considers important in a webpage's overall user experience, focusing on loading speed, interactivity, and visual stability." },
      { q: "Why are broken links bad for SEO?", a: "They create a poor user experience and waste 'crawl budget', making it harder for search engines to index your site efficiently and accurately." },
      { q: "Is mobile-friendliness a ranking factor?", a: "Absolutely. Google uses mobile-first indexing, meaning it primarily uses the mobile version of your site for ranking and indexing in its search results." }
    ]
  }
};

export const getDeepContent = (category: string) => {
  return TOOL_DEEP_CONTENT[category] || TOOL_DEEP_CONTENT['Generators'];
};
