import { createClient } from '@supabase/supabase-js'
import { PromptDetail, PromptStep } from "@/types/prompt"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to transform database row to PromptDetail
function transformDatabasePrompt(dbPrompt: Record<string, unknown>): PromptDetail {
  const steps: PromptStep[] = (dbPrompt.steps_data as Array<{
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
    content: dbPrompt.content as string,
    singlePrompt: dbPrompt.workflow_type === 'single' ? dbPrompt.content as string : undefined,
    steps: dbPrompt.workflow_type === 'multi-step' ? steps : undefined,
    
    // Info tab content
    howToUse: (dbPrompt.how_to_use as string[]) || [],
    whatYouGet: (dbPrompt.what_you_get as string[]) || [],
    expectedResults: (dbPrompt.expected_results as string[]) || [],
    variations: (dbPrompt.variations as string[]) || [],
    
    // Additional sections - all extra content from markdown
    additionalSections: (dbPrompt.additional_sections as Record<string, {
      title: string
      content: string
      order: number
    }>) || {},
    
    // Multi-step specific
    workflowOverview: dbPrompt.workflow_overview as string,
    whatYouCreate: dbPrompt.what_you_create as string
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
  
  const prompts = data?.map(transformDatabasePrompt) || []
  
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
  
  return transformDatabasePrompt(data)
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
  
  return data?.map(transformDatabasePrompt) || []
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
  
  return data?.map(transformDatabasePrompt) || []
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
  
  return data?.map(transformDatabasePrompt) || []
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