import { PromptDetail } from "@/types/prompt"

export const promptsData: PromptDetail[] = [
  {
    id: "viral-content-creator",
    title: "Viral Content Creator",
    shortDescription: "Generates scroll-stopping post ideas with proven psychological triggers that drive massive engagement across any social platform.",
    category: "Social Media",
    complexity: "Beginner",
    type: "FREE",
    platforms: ["ChatGPT", "Claude", "Gemini"],
    estimatedTime: "5-10 minutes",
    viewCount: 1247,
    modifiedDate: "2 days ago",
    singlePrompt: `ROLE: You are a viral content strategist with expertise in social psychology and engagement patterns.

TASK: Generate 10 scroll-stopping post ideas for [PLATFORM] that use proven psychological triggers to maximize engagement.

CONTEXT: 
- Target audience: [DESCRIBE YOUR AUDIENCE]
- Business/niche: [YOUR BUSINESS/NICHE]
- Content goal: [AWARENESS/SALES/EDUCATION/ENTERTAINMENT]

REQUIREMENTS:
1. Use psychological triggers (curiosity gap, social proof, controversy, emotion)
2. Include specific hooks that stop the scroll
3. Provide engagement-boosting elements (questions, calls-to-action)
4. Optimize for platform-specific features and algorithms
5. Include content variations (images, carousels, videos)

OUTPUT FORMAT:
For each idea provide:
- Hook/Opening line
- Main content structure  
- Psychological trigger used
- Engagement elements
- Platform optimization tips

Make each idea unique and immediately actionable.`,
    howToUse: [
      "Copy the prompt and paste it into your AI tool of choice",
      "Replace [PLATFORM] with your target social media platform", 
      "Fill in your target audience, business niche, and content goal",
      "Run the prompt to get 10 viral post ideas",
      "Select the best ideas and customize them for your brand voice"
    ],
    whatYouGet: [
      "10 unique, scroll-stopping post ideas tailored to your niche",
      "Psychological triggers explained for each post concept",
      "Platform-specific optimization tips",
      "Ready-to-use hooks and engagement elements",
      "Content format variations (text, image, video suggestions)"
    ],
    expectedResults: [
      "10x higher engagement rates compared to standard posts",
      "Increased follower growth from viral content",
      "Better understanding of psychological triggers that work",
      "More saves, shares, and comments on your content",
      "Improved brand awareness and reach"
    ],
    variations: [
      "Adapt for specific industries (fitness, business, lifestyle)",
      "Focus on single platforms (Instagram vs TikTok vs LinkedIn)",
      "Create series content or content campaigns",
      "Generate holiday or seasonal viral content",
      "Develop brand-specific viral content templates"
    ]
  },
  {
    id: "facebook-ad-campaign-builder",
    title: "Facebook Ad Campaign Builder",
    shortDescription: "4-step comprehensive workflow that creates high-converting Facebook ad campaigns from strategy through optimization.",
    category: "Advertising",
    complexity: "Intermediate", 
    type: "PRO",
    platforms: ["ChatGPT", "Claude"],
    estimatedTime: "30-45 minutes",
    viewCount: 892,
    modifiedDate: "1 week ago",
    workflowOverview: "This multi-step workflow takes you through the complete Facebook ad campaign creation process, from initial strategy development to final optimization recommendations.",
    whatYouCreate: "A complete Facebook ad campaign including audience targeting, ad copy, creative briefs, bidding strategy, and optimization plan.",
    steps: [
      {
        stepNumber: 1,
        title: "Campaign Strategy & Audience Research",
        estimatedTime: "10-15 minutes",
        content: `ROLE: You are a Facebook advertising strategist with expertise in audience research and campaign planning.

TASK: Develop a comprehensive Facebook ad campaign strategy for [BUSINESS TYPE] promoting [PRODUCT/SERVICE].

BUSINESS CONTEXT:
- Business: [YOUR BUSINESS]
- Product/Service: [WHAT YOU'RE PROMOTING]  
- Budget: [MONTHLY AD BUDGET]
- Goal: [AWARENESS/LEADS/SALES/APP INSTALLS]
- Target market: [DESCRIBE YOUR IDEAL CUSTOMER]

DELIVERABLES:
1. Campaign objective recommendation
2. 3 detailed audience segments with:
   - Demographics and psychographics
   - Interests and behaviors
   - Estimated audience size
   - Why this audience will convert
3. Budget allocation strategy
4. Campaign structure recommendations
5. Key performance indicators (KPIs) to track

Provide detailed reasoning for each recommendation.`
      },
      {
        stepNumber: 2,
        title: "Ad Copy & Creative Strategy",
        estimatedTime: "15-20 minutes", 
        content: `ROLE: You are a Facebook ad copywriter and creative strategist specializing in high-converting ad content.

TASK: Create compelling ad copy and creative briefs using the audience insights from Step 1.

INPUT FROM STEP 1: [PASTE YOUR AUDIENCE SEGMENTS AND STRATEGY]

DELIVERABLES:
1. 5 different ad copy variations for each audience segment including:
   - Attention-grabbing headlines
   - Compelling ad text (under 125 characters for mobile)
   - Strong call-to-action buttons
   - Value propositions tailored to each audience
2. Creative briefs for each ad variation:
   - Image/video concept descriptions
   - Visual style guidelines
   - Key elements to include/avoid
3. A/B testing recommendations
4. Platform-specific optimizations (Feed vs Stories vs Reels)

Focus on emotional triggers and clear value propositions.`
      },
      {
        stepNumber: 3,
        title: "Campaign Setup & Targeting Configuration",
        estimatedTime: "10-15 minutes",
        content: `ROLE: You are a Facebook Ads Manager expert specializing in campaign setup and targeting optimization.

TASK: Provide detailed campaign setup instructions and targeting configurations.

INPUT: [PASTE STRATEGY AND AD COPY FROM PREVIOUS STEPS]

DELIVERABLES:
1. Complete campaign structure:
   - Campaign naming conventions
   - Ad set organization
   - Budget distribution recommendations
2. Detailed targeting setup for each audience:
   - Exact demographic settings
   - Interest targeting recommendations  
   - Behavior targeting options
   - Exclusion audiences to avoid overlap
3. Placement recommendations:
   - Best placements for your objectives
   - Placement-specific creative requirements
4. Bidding strategy recommendations:
   - Bid strategy selection reasoning
   - Budget pacing recommendations
5. Conversion tracking setup requirements

Include step-by-step setup instructions for Facebook Ads Manager.`
      },
      {
        stepNumber: 4,
        title: "Launch & Optimization Plan",
        estimatedTime: "5-10 minutes",
        content: `ROLE: You are a Facebook advertising analyst focused on campaign optimization and performance improvement.

TASK: Create a comprehensive launch and optimization plan for ongoing campaign success.

DELIVERABLES:
1. Launch checklist:
   - Pre-launch verification steps
   - Testing timeline and methodology
   - Initial performance benchmarks
2. Optimization schedule:
   - Daily monitoring tasks (first week)
   - Weekly optimization activities  
   - Monthly performance reviews
3. Performance analysis framework:
   - Key metrics to monitor for each objective
   - Red flags that require immediate action
   - Success indicators and scaling triggers
4. Scaling strategy:
   - When and how to increase budgets
   - Audience expansion recommendations
   - Creative refresh timeline
5. Troubleshooting guide:
   - Common issues and solutions
   - Performance improvement tactics

Include specific metrics thresholds for optimization decisions.`
      }
    ],
    howToUse: [
      "Work through each step sequentially - don't skip ahead",
      "Complete Step 1 first and use those insights for Step 2",
      "Save the output from each step to reference in later steps", 
      "Customize each prompt with your specific business details",
      "Follow the campaign setup instructions in Facebook Ads Manager",
      "Use the optimization plan to monitor and improve performance"
    ],
    whatYouGet: [
      "Complete Facebook ad campaign strategy tailored to your business",
      "Research-backed audience segments with targeting details",
      "High-converting ad copy and creative briefs for testing",
      "Step-by-step campaign setup instructions",
      "Comprehensive optimization and scaling plan",
      "Performance monitoring framework with specific metrics"
    ],
    expectedResults: [
      "50-80% higher click-through rates vs generic campaigns",
      "25-40% lower cost per acquisition through better targeting",
      "Improved campaign performance through systematic optimization",
      "Better audience insights for future marketing efforts",
      "Scalable campaign structure for business growth"
    ],
    variations: [
      "Adapt for different business types (e-commerce, B2B, local business)",
      "Customize for specific campaign objectives (leads vs sales)",
      "Create seasonal or promotional campaign variations",
      "Develop retargeting campaign workflows",
      "Build lookalike audience expansion strategies"
    ]
  }
]

export function getPromptById(id: string): PromptDetail | null {
  return promptsData.find(prompt => prompt.id === id) || null
}