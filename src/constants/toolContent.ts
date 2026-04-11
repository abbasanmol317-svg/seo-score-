import { ToolId } from '../services/gemini';

interface ToolDeepContent {
  about: string;
  howTo: string[];
  whyItMatters: string;
  proTips: string[];
  faqs: { q: string, a: string }[];
}

export const TOOL_DEEP_CONTENT: Record<string, ToolDeepContent> = {
  'Generators': {
    about: "Our AI-powered generators are designed to take the guesswork out of technical SEO. Whether you're crafting meta tags that demand clicks or building complex schema markups that help Google understand your business, these tools provide production-ready code in seconds. We don't just generate text; we engineer snippets that align with the latest search engine algorithms and user psychology.",
    howTo: [
      "Input your primary page details or target keywords.",
      "Review the AI-generated variations tailored to different psychological triggers.",
      "Use the built-in SERP preview to see how your content looks on mobile and desktop.",
      "Copy the optimized code directly into your website's <head> section."
    ],
    whyItMatters: "In a crowded search landscape, your 'first impression' is often your meta title and description. If they aren't optimized for both keywords and clicks, you're leaving traffic on the table. Our generators ensure your technical foundations are rock-solid, helping you win the 'click' before the user even lands on your site.",
    proTips: [
      "Front-load your most important keywords in titles for better visibility.",
      "Use 'Power Words' to trigger emotional responses and increase CTR.",
      "Always validate your schema markup using Google's Rich Results Test after implementation."
    ],
    faqs: [
      { q: "Do meta tags still matter for SEO in 2026?", a: "Yes, while meta descriptions aren't a direct ranking factor, they significantly impact Click-Through Rate (CTR), which is a strong signal to Google about your page's relevance." },
      { q: "How long should my meta title be?", a: "Ideally between 50-60 characters. Anything longer will likely be truncated in search results, losing its impact." },
      { q: "What is Schema Markup?", a: "Schema is a form of structured data that helps search engines understand the context of your content, often resulting in 'Rich Snippets' like star ratings or event dates." }
    ]
  },
  'Content & Keywords': {
    about: "Content is the soul of SEO, but without the right keywords, even the best writing can go unnoticed. Our Content & Keywords suite helps you bridge the gap between what you want to say and what users are actually searching for. Using advanced semantic analysis, we identify high-value opportunities and help you optimize your writing for maximum topical authority.",
    howTo: [
      "Enter your main topic or a competitor's URL to extract keyword ideas.",
      "Analyze the search volume and difficulty metrics to find 'low-hanging fruit'.",
      "Use the Content Optimizer to identify semantic gaps in your existing articles.",
      "Integrate suggested long-tail keywords naturally into your headings and body text."
    ],
    whyItMatters: "Google's algorithm has evolved from simple keyword matching to understanding 'entities' and 'intent'. Our tools help you write for humans first, while ensuring search engines can easily categorize your expertise. This balance is the key to sustainable, long-term organic growth.",
    proTips: [
      "Focus on 'User Intent' (Informational, Navigational, Transactional) rather than just volume.",
      "Build 'Topic Clusters' by linking related articles together to boost authority.",
      "Don't over-optimize; aim for a natural reading flow that provides genuine value."
    ],
    faqs: [
      { q: "What is keyword difficulty?", a: "It's a metric that estimates how hard it would be to rank on the first page of Google for a specific keyword, based on the authority of existing results." },
      { q: "How many keywords should I target per page?", a: "Focus on one primary keyword and 3-5 related semantic keywords (LSI) to maintain topical depth without over-optimizing." },
      { q: "What are long-tail keywords?", a: "These are longer, more specific phrases that users search for. They usually have lower volume but much higher conversion rates." }
    ]
  },
  'Audits & Analysis': {
    about: "A successful SEO strategy starts with a clear understanding of where you stand. Our Audits & Analysis tools provide a 360-degree view of your website's health, from technical bottlenecks to competitor movements. We simulate a deep crawl of your site, identifying issues that might be holding you back from the first page of results.",
    howTo: [
      "Run a full SEO Audit to get an instant health score for your domain.",
      "Check your backlink profile to identify high-quality links and potential toxic ones.",
      "Track your rankings over time to see the direct impact of your optimization efforts.",
      "Compare your technical performance against top competitors in your niche."
    ],
    whyItMatters: "SEO isn't a 'set it and forget it' task. It requires constant monitoring and adjustment. By identifying technical errors, broken links, or ranking drops early, you can take corrective action before they impact your bottom line. Data-driven decisions are always more effective than guesswork.",
    proTips: [
      "Prioritize 'Critical' errors in your audit reports as these have the biggest impact.",
      "Monitor your 'Core Web Vitals' regularly, as they are now a direct ranking factor.",
      "Keep an eye on competitor backlinks to find new outreach opportunities for your own site."
    ],
    faqs: [
      { q: "How often should I audit my website?", a: "We recommend a full technical audit at least once a quarter, or whenever you make significant changes to your site's structure or content." },
      { q: "What are backlinks?", a: "Backlinks are links from other websites to yours. They act as 'votes of confidence' and are one of Google's strongest ranking signals." },
      { q: "Why did my rankings drop suddenly?", a: "Sudden drops can be caused by technical errors, Google algorithm updates, or a loss of high-quality backlinks." }
    ]
  },
  'Technical': {
    about: "Technical SEO is the foundation upon which all other efforts are built. If your site is slow, broken, or not mobile-friendly, even the best content won't rank. Our Technical suite provides deep-dive diagnostics into your site's infrastructure, helping you provide a seamless experience for both users and search crawlers.",
    howTo: [
      "Test your page speed to identify large images or render-blocking scripts.",
      "Use the Broken Link Checker to find and fix 404 errors that frustrate users.",
      "Verify your site's mobile-friendliness to ensure you aren't losing traffic from smartphone users.",
      "Analyze your site's crawlability to make sure Google can find all your important pages."
    ],
    whyItMatters: "User experience (UX) is now a core part of SEO. Google prioritizes sites that load quickly and work perfectly on all devices. Technical excellence reduces your bounce rate and increases the time users spend on your site, which are both positive signals to search engines.",
    proTips: [
      "Optimize and compress all images before uploading them to your site.",
      "Use a Content Delivery Network (CDN) to speed up global load times.",
      "Ensure your site uses HTTPS for security, as it's a confirmed ranking signal."
    ],
    faqs: [
      { q: "What are Core Web Vitals?", a: "These are a set of specific factors that Google considers important in a webpage's overall user experience, focusing on loading, interactivity, and visual stability." },
      { q: "Why are broken links bad for SEO?", a: "They create a poor user experience and waste 'crawl budget', making it harder for search engines to index your site efficiently." },
      { q: "Is mobile-friendliness a ranking factor?", a: "Absolutely. Google uses mobile-first indexing, meaning it primarily uses the mobile version of your site for ranking and indexing." }
    ]
  }
};

export const getDeepContent = (category: string) => {
  return TOOL_DEEP_CONTENT[category] || TOOL_DEEP_CONTENT['Generators'];
};
