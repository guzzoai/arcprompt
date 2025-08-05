import { createClient } from '@supabase/supabase-js'
import { PromptDetail, PromptStep } from "@/types/prompt"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Static prompt content mapping for multi-step prompts that need content
const PROMPT_CONTENT_MAPPING: Record<string, {
  steps?: PromptStep[]
  howToUse?: string[]
  whatYouGet?: string[]
  expectedResults?: string[]
  variations?: string[]
  workflowOverview?: string
  whatYouCreate?: string
}> = {
  'community-building-accelerator': {
    steps: [
      {
        stepNumber: 1,
        title: 'COMMUNITY STRATEGY & PLATFORM SELECTION',
        content: `ROLE: You are a community strategy consultant who designs thriving online communities by aligning platform capabilities with member needs and business objectives.

CONTEXT: Develop a comprehensive community strategy that defines purpose, selects optimal platforms, and establishes the foundation for sustainable growth.

INTERVIEW QUESTIONS (Ask these first):
1. What's the primary purpose of your community (support, networking, education, product feedback)?
2. Who is your target community member and what do they need most?
3. What resources do you have for community management (time, budget, team)?
4. What platforms are your audience already using and comfortable with?
5. What business objectives do you want this community to support?

COMMUNITY STRATEGY FRAMEWORK:

PURPOSE AND VISION DEFINITION:
- Community mission statement and core purpose
- Value proposition for members joining and staying
- Success vision: what does a thriving community look like?
- Community culture and personality definition
- Alignment with broader business or personal brand goals

TARGET MEMBER ANALYSIS:
- Detailed member personas and demographics
- Member motivations and community participation drivers
- Pain points and challenges members face
- Expertise levels and knowledge-sharing opportunities
- Time availability and engagement preferences

PLATFORM EVALUATION MATRIX:
Compare platforms based on:
- Discord: Gaming/tech communities, real-time chat, voice channels
- Facebook Groups: Broad reach, easy discovery, integrated features
- LinkedIn Groups: Professional networking, industry discussions
- Slack: Professional teams, organized channels, integration capabilities
- Circle: Creator-focused, course integration, modern interface
- Mighty Networks: Course + community, events, mobile-first
- Reddit: Topic-focused, voting system, broad discoverability

OUTPUT FORMAT:
1. Complete community strategy document with mission and vision
2. Target member personas with detailed characteristics
3. Platform comparison matrix with recommendation
4. Community value architecture and member benefits
5. Resource allocation plan and management structure`,
        estimatedTime: '10 minutes'
      },
      {
        stepNumber: 2,
        title: 'ENGAGEMENT FRAMEWORK DEVELOPMENT',
        content: `ROLE: You are a community engagement specialist who creates systems and frameworks that drive consistent participation, valuable interactions, and member retention.

CONTEXT: Design comprehensive engagement systems that encourage participation, facilitate valuable connections, and maintain active community dynamics.

INPUTS NEEDED FROM STEP 1:
- Community strategy and mission
- Target member personas and needs
- Selected platform and its capabilities
- Community value architecture
- Resource allocation and management plan

ENGAGEMENT FRAMEWORK DESIGN:

MEMBER JOURNEY MAPPING:
- Discovery: How new members find the community
- Onboarding: First experience and orientation process
- Activation: First meaningful interaction or contribution
- Participation: Regular engagement and value creation
- Advocacy: Promoting community and bringing others

CONTENT AND DISCUSSION FRAMEWORK:
Weekly content themes and discussion topics:
- Monday Motivation: Inspiration and goal-setting
- Tutorial Tuesday: Educational content and how-tos
- Wednesday Wins: Member achievements and celebrations
- Thoughtful Thursday: Industry insights and discussions
- Feature Friday: Member spotlights and showcases

ENGAGEMENT MECHANICS:
- Welcome rituals and new member introduction protocols
- Regular challenges and community-wide initiatives
- Recognition systems and member highlighting
- Expert AMAs (Ask Me Anything) and guest sessions
- Peer-to-peer learning and mentorship matching

OUTPUT FORMAT:
1. Complete member journey map with touchpoint optimization
2. Weekly content calendar with engagement themes
3. Engagement mechanics and interaction catalyst library
4. Community rituals and tradition establishment plan
5. Value-driven activity schedule and implementation guide`,
        estimatedTime: '12 minutes'
      },
      {
        stepNumber: 3,
        title: 'CONTENT & EVENT PLANNING',
        content: `ROLE: You are a community content strategist who creates comprehensive content plans and event systems that drive engagement and provide consistent value to community members.

CONTEXT: Develop systematic content creation and event planning that maintains community momentum and provides ongoing value.

INPUTS NEEDED FROM STEP 2:
- Member journey mapping and touchpoints
- Weekly content themes and engagement framework
- Engagement mechanics and interaction catalysts
- Community rituals and traditions plan
- Value-driven activities and event schedule

COMPREHENSIVE CONTENT STRATEGY:

CONTENT PILLAR DEVELOPMENT:
- Educational Content: Tutorials, how-tos, skill development
- Industry Insights: Trends, news, expert perspectives
- Member-Generated: Showcases, testimonials, peer contributions
- Behind-the-Scenes: Transparent operations, decision-making processes
- Community Culture: Values reinforcement, tradition building

EVENT PLANNING FRAMEWORK:
Regular event types and scheduling:
- Weekly: Community check-ins, topic discussions
- Bi-weekly: Expert interviews, skill-building workshops
- Monthly: Community challenges, member spotlights
- Quarterly: Community surveys, strategic planning sessions
- Annually: Community summit, major milestone celebrations

OUTPUT FORMAT:
1. Complete content calendar with pillar-based organization
2. Event planning framework with regular scheduling
3. Live interaction opportunity calendar and formats
4. Resource development plan and content library structure
5. Content quality standards and creation workflows`,
        estimatedTime: '8 minutes'
      },
      {
        stepNumber: 4,
        title: 'GROWTH & MODERATION SYSTEMS',
        content: `ROLE: You are a community operations specialist who creates scalable growth systems and effective moderation frameworks that maintain community health as it expands.

CONTEXT: Establish sustainable growth mechanisms and community moderation systems that preserve culture and quality while enabling expansion.

INPUTS NEEDED FROM STEP 3:
- Comprehensive content strategy and calendar
- Event planning framework and schedules
- Live interaction opportunities and formats
- Resource development and library plans
- Content quality standards and workflows

GROWTH ACCELERATION SYSTEMS:

MEMBER ACQUISITION STRATEGIES:
- Referral programs and member incentives
- Content marketing and SEO for community discovery
- Partnership development with complementary communities
- Influencer collaborations and expert endorsements
- Social media promotion and cross-platform marketing

MODERATION FRAMEWORK:

COMMUNITY GUIDELINES AND ENFORCEMENT:
- Comprehensive community rules and expectations
- Violation reporting and response procedures
- Progressive discipline system and appeal processes
- Moderator training and decision-making frameworks
- Crisis escalation and emergency response protocols

SCALING SYSTEMS:
- Automated moderation tools and AI assistance
- Community self-governance and peer moderation
- Subgroup creation and specialized community areas
- Advanced member privileges and leadership development
- Community expansion and platform migration planning

OUTPUT FORMAT:
1. Complete growth acceleration strategy with acquisition channels
2. Optimized onboarding process and new member experience
3. Comprehensive moderation framework with guidelines and procedures
4. Community health monitoring system with quality metrics
5. Scaling roadmap with automation and governance evolution`,
        estimatedTime: '5 minutes'
      }
    ],
    howToUse: [
      'Follow each step in sequence, completing all outputs before moving to the next step',
      'Adapt the frameworks to your specific community type and audience needs',
      'Use the interview questions to gather necessary information before starting',
      'Customize the templates and frameworks based on your platform choice'
    ],
    whatYouGet: [
      'Complete community strategy with platform selection and value architecture',
      'Engagement framework with content systems and interaction catalysts',
      'Content and event plan with systematic value delivery',
      'Growth and moderation systems for sustainable community scaling',
      'Community health monitoring for quality maintenance and improvement'
    ],
    expectedResults: [
      '5x faster member acquisition through systematic growth strategies',
      '75% member retention rate after 90 days with optimized onboarding',
      '3x higher engagement levels through structured frameworks',
      '90% reduction in moderation issues with clear guidelines',
      '10x community value creation through member-to-member connections'
    ],
    variations: [
      'For B2B Communities: Focus on professional networking and industry expertise sharing',
      'For Creator Communities: Emphasize fan engagement and exclusive content access',
      'For Support Communities: Prioritize problem-solving and peer assistance frameworks',
      'For Learning Communities: Structure around curriculum and skill development progression'
    ],
    workflowOverview: 'This comprehensive workflow guides you through building thriving online communities that drive engagement, loyalty, and business growth. Perfect for businesses, creators, and organizations looking to cultivate dedicated audiences.',
    whatYouCreate: 'Complete community strategy with platform selection, engagement framework and content systems, content and event plan, growth acceleration protocols and member acquisition, moderation systems and community management structure'
  }
}

// Helper function to transform database row to PromptDetail
async function transformDatabasePrompt(dbPrompt: Record<string, unknown>): Promise<PromptDetail> {
  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Transforming prompt:', dbPrompt.slug, 'workflow_type:', dbPrompt.workflow_type)
    console.log('Steps data from DB:', dbPrompt.steps_data)
  }
  
  let steps: PromptStep[] = (dbPrompt.steps_data as Array<{
    stepNumber: number
    title: string  
    content: string
    estimatedTime?: string
  }> || []).map((step) => ({
    stepNumber: step.stepNumber,
    title: step.title,
    content: step.content,
    estimatedTime: step.estimatedTime
  })) || []

  // Check if we need to use static content mapping
  const staticData = PROMPT_CONTENT_MAPPING[dbPrompt.slug as string]
  
  // Debug logging
  if (dbPrompt.slug === 'community-building-accelerator') {
    console.log('Loading community-building-accelerator:', {
      hasStaticData: !!staticData,
      hasStaticSteps: !!staticData?.steps,
      dbStepsEmpty: steps.every(step => !step.content),
      willUseStatic: staticData?.steps && steps.every(step => !step.content)
    })
  }
  
  // Use static content if available and database content is insufficient
  const finalContent = dbPrompt.content as string
  if (staticData?.steps && steps.every(step => !step.content)) {
    steps = staticData.steps
    console.log('Applied static steps for:', dbPrompt.slug, 'Steps with content:', steps.filter(s => s.content).length)
  }

  return {
    id: dbPrompt.slug as string,
    title: dbPrompt.title as string,
    shortDescription: (dbPrompt.short_description || dbPrompt.description) as string,
    category: (dbPrompt.categories as {name?: string})?.name || 'Uncategorized',
    complexity: dbPrompt.difficulty_level as "Beginner" | "Intermediate" | "Advanced",
    type: dbPrompt.prompt_type as "FREE" | "PRO",
    platforms: (dbPrompt.platforms as string[]) || ['ChatGPT', 'Claude', 'Gemini'],
    estimatedTime: dbPrompt.estimated_time as string,
    viewCount: (dbPrompt.usage_count as number) || 0,
    modifiedDate: formatDate(dbPrompt.updated_at as string),
    isBookmarked: false, // This would be determined by user favorites
    
    // Content
    content: finalContent,
    singlePrompt: dbPrompt.workflow_type === 'single' ? finalContent : undefined,
    steps: dbPrompt.workflow_type === 'multi-step' ? steps : undefined,
    
    // Info tab content - use static data as fallback
    howToUse: staticData?.howToUse?.length ? staticData.howToUse : (dbPrompt.how_to_use as string[]) || [],
    whatYouGet: staticData?.whatYouGet?.length ? staticData.whatYouGet : (dbPrompt.what_you_get as string[]) || [],
    expectedResults: staticData?.expectedResults?.length ? staticData.expectedResults : (dbPrompt.expected_results as string[]) || [],
    variations: staticData?.variations?.length ? staticData.variations : (dbPrompt.variations as string[]) || [],
    
    // Additional sections - use database data
    additionalSections: (dbPrompt.additional_sections as Record<string, {
      title: string
      content: string
      order: number
    }>) || {},
    
    // Multi-step specific - use static data as fallback
    workflowOverview: staticData?.workflowOverview || dbPrompt.workflow_overview as string,
    whatYouCreate: staticData?.whatYouCreate || dbPrompt.what_you_create as string
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  return `${Math.ceil(diffDays / 30)} months ago`
}

// Get all prompts with pagination
export async function getPrompts(options: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sortBy?: 'newest' | 'popular' | 'rating'
} = {}): Promise<{ prompts: PromptDetail[], total: number }> {
  const { page = 1, limit = 20, category, search, sortBy = 'newest' } = options
  
  let query = supabase
    .from('prompts')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('status', 'published')
  
  // Apply filters
  if (category && category !== 'all') {
    query = query.eq('categories.slug', category)
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`)
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'popular':
      query = query.order('usage_count', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }
  
  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  query = query.range(from, to)
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('Error fetching prompts:', error)
    return { prompts: [], total: 0 }
  }
  
  const prompts = data ? await Promise.all(data.map(transformDatabasePrompt)) : []
  
  return { prompts, total: count || 0 }
}

// Get a single prompt by ID
export async function getPromptById(id: string): Promise<PromptDetail | null> {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('slug', id)
    .eq('status', 'published')
    .single()
  
  if (error || !data) {
    console.error('Error fetching prompt:', error)
    return null
  }
  
  return await transformDatabasePrompt(data)
}

// Get popular prompts
export async function getPopularPrompts(limit: number = 10): Promise<PromptDetail[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('status', 'published')
    .order('usage_count', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching popular prompts:', error)
    return []
  }
  
  return data ? await Promise.all(data.map(transformDatabasePrompt)) : []
}

// Get featured prompts
export async function getFeaturedPrompts(limit: number = 5): Promise<PromptDetail[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .order('usage_count', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching featured prompts:', error)
    return []
  }
  
  return data ? await Promise.all(data.map(transformDatabasePrompt)) : []
}

// Get latest prompts for dashboard
export async function getLatestPrompts(limit: number = 4): Promise<PromptDetail[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching latest prompts:', error)
    return []
  }
  
  return data ? await Promise.all(data.map(transformDatabasePrompt)) : []
}

// Get categories
export async function getCategories(): Promise<Array<{ id: string, name: string, slug: string, count: number }>> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      prompts!inner (
        id
      )
    `)
    .eq('prompts.status', 'published')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  // Transform and count prompts per category
  const categoriesWithCount = data?.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: Array.isArray(cat.prompts) ? cat.prompts.length : 0
  })) || []
  
  return categoriesWithCount
}

// Legacy function for backward compatibility
export function getPromptByIdSync(_id: string): PromptDetail | null {
  // This is a legacy function that should be replaced with async version
  // For now, return null and handle async loading in components
  console.warn('getPromptByIdSync is deprecated, use getPromptById instead')
  return null
}

// Export legacy array for backward compatibility during migration
export const promptsData: PromptDetail[] = []