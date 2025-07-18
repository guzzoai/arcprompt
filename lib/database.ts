import { supabase } from '@/lib/supabase'
import type { 
  PromptWithDetails,
  InsertTables
} from '@/types/database'

// Prompt operations
export async function getPrompts(options: {
  category?: string
  tags?: string[]
  difficulty?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
  userId?: string
} = {}) {
  let query = supabase
    .from('prompts')
    .select(`
      *,
      category:categories(*),
      tags:prompt_tags(tag:tags(*)),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (options.category) {
    query = query.eq('category_id', options.category)
  }

  if (options.difficulty) {
    query = query.eq('difficulty_level', options.difficulty)
  }

  if (options.featured) {
    query = query.eq('featured', true)
  }

  if (options.search) {
    query = query.textSearch('title', options.search)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching prompts:', error)
    return { data: null, error }
  }

  // Transform the data to match PromptWithDetails type
  const transformedData = data?.map(prompt => ({
    ...prompt,
    tags: prompt.tags?.map((pt: { tag: { id: string; name: string } }) => pt.tag) || [],
    is_favorited: false, // Will be populated if userId is provided
    user_rating: undefined, // Will be populated if userId is provided
  })) as PromptWithDetails[]

  // If user is provided, check favorites and ratings
  if (options.userId && transformedData) {
    const promptIds = transformedData.map(p => p.id)
    
    // Get user's favorites
    const { data: favorites } = await supabase
      .from('favorites')
      .select('prompt_id')
      .eq('user_id', options.userId)
      .in('prompt_id', promptIds)

    // Get user's ratings
    const { data: ratings } = await supabase
      .from('ratings')
      .select('prompt_id, rating')
      .eq('user_id', options.userId)
      .in('prompt_id', promptIds)

    const favoriteIds = new Set(favorites?.map(f => f.prompt_id) || [])
    const ratingsMap = new Map(ratings?.map(r => [r.prompt_id, r.rating]) || [])

    transformedData.forEach(prompt => {
      prompt.is_favorited = favoriteIds.has(prompt.id)
      prompt.user_rating = ratingsMap.get(prompt.id)
    })
  }

  return { data: transformedData, error: null }
}

export async function getPromptById(id: string, userId?: string) {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      category:categories(*),
      tags:prompt_tags(tag:tags(*)),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error) {
    return { data: null, error }
  }

  // Transform the data
  const transformedData = {
    ...data,
    tags: data.tags?.map((pt: { tag: { id: string; name: string } }) => pt.tag) || [],
    is_favorited: false,
    user_rating: undefined,
  } as PromptWithDetails

  // If user is provided, check favorite and rating
  if (userId) {
    const [favoriteResult, ratingResult] = await Promise.all([
      supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('prompt_id', id)
        .single(),
      supabase
        .from('ratings')
        .select('rating')
        .eq('user_id', userId)
        .eq('prompt_id', id)
        .single()
    ])

    transformedData.is_favorited = !favoriteResult.error
    transformedData.user_rating = ratingResult.data?.rating
  }

  return { data: transformedData, error: null }
}

export async function createPrompt(prompt: InsertTables<'prompts'>, tagIds: string[] = []) {
  const { data, error } = await supabase
    .from('prompts')
    .insert(prompt)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  // Link tags
  if (tagIds.length > 0) {
    const { error: tagError } = await supabase
      .from('prompt_tags')
      .insert(tagIds.map(tagId => ({ prompt_id: data.id, tag_id: tagId })))

    if (tagError) {
      console.error('Error linking tags:', tagError)
    }
  }

  return { data, error: null }
}

// Category operations
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return { data, error }
}

export async function getCategoriesWithCounts() {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      prompts:prompts(count)
    `)
    .order('sort_order', { ascending: true })

  return { data, error }
}

// Tag operations
export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })

  return { data, error }
}

export async function searchTags(query: string) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(10)

  return { data, error }
}

// User operations
export async function getUserPrompts(userId: string, status?: string) {
  let query = supabase
    .from('prompts')
    .select(`
      *,
      category:categories(*),
      tags:prompt_tags(tag:tags(*))
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return { data: null, error }
  }

  return { 
    data: data?.map(prompt => ({
      ...prompt,
      tags: prompt.tags?.map((pt: { tag: { id: string; name: string } }) => pt.tag) || [],
    })) as PromptWithDetails[], 
    error: null 
  }
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      prompt:prompts(
        *,
        category:categories(*),
        tags:prompt_tags(tag:tags(*)),
        author:users(id, username, full_name, avatar_url)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { 
    data: data?.map(favorite => ({
      ...favorite.prompt,
      tags: favorite.prompt.tags?.map((pt: { tag: { id: string; name: string } }) => pt.tag) || [],
      is_favorited: true,
    })) as PromptWithDetails[], 
    error: null 
  }
}

export async function getUserCollections(userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      collection_prompts(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Favorite operations
export async function toggleFavorite(userId: string, promptId: string) {
  // Check if favorite exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('prompt_id', promptId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)
    
    return { data: { favorited: false }, error }
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, prompt_id: promptId })
    
    return { data: { favorited: true }, error }
  }
}

// Rating operations
export async function ratePrompt(userId: string, promptId: string, rating: number, review?: string) {
  const { data, error } = await supabase
    .from('ratings')
    .upsert({
      user_id: userId,
      prompt_id: promptId,
      rating,
      review,
    })
    .select()
    .single()

  return { data, error }
}

// Usage tracking
export async function trackPromptUsage(promptId: string, userId?: string, ipAddress?: string, userAgent?: string) {
  const { data, error } = await supabase
    .from('prompt_usage')
    .insert({
      prompt_id: promptId,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

  return { data, error }
}

// Search functionality
export async function searchPrompts(query: string, filters: {
  category?: string
  tags?: string[]
  difficulty?: string
  limit?: number
  offset?: number
} = {}) {
  let supabaseQuery = supabase
    .from('prompts')
    .select(`
      *,
      category:categories(*),
      tags:prompt_tags(tag:tags(*)),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq('status', 'published')
    .textSearch('title', query)

  if (filters.category) {
    supabaseQuery = supabaseQuery.eq('category_id', filters.category)
  }

  if (filters.difficulty) {
    supabaseQuery = supabaseQuery.eq('difficulty_level', filters.difficulty)
  }

  if (filters.limit) {
    supabaseQuery = supabaseQuery.limit(filters.limit)
  }

  if (filters.offset) {
    supabaseQuery = supabaseQuery.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  supabaseQuery = supabaseQuery.order('rating_avg', { ascending: false })

  const { data, error } = await supabaseQuery

  if (error) {
    return { data: null, error }
  }

  return { 
    data: data?.map(prompt => ({
      ...prompt,
      tags: prompt.tags?.map((pt: { tag: { id: string; name: string } }) => pt.tag) || [],
    })) as PromptWithDetails[], 
    error: null 
  }
}