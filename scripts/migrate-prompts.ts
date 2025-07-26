#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { MarkdownParser, ParsedPrompt } from '../lib/markdown-parser'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface DatabasePrompt {
  title: string
  short_description: string
  description: string
  content: string
  category_id: string | null
  difficulty_level: string
  ai_platforms: string[]
  status: string
  workflow_type: string
  step_count: number
  steps_data: any[]
  estimated_time: string | null
  platforms: string[]
  slug: string
  how_to_use: string[]
  what_you_get: string[]
  expected_results: string[]
  variations: string[]
  workflow_overview: string | null
  what_you_create: string | null
  prompt_type: string
  usage_count: number
  rating_avg: number
  rating_count: number
  featured: boolean
}

class PromptMigrator {
  private categoryMap: Map<string, string> = new Map()
  private tagMap: Map<string, string> = new Map()
  
  async loadCategories() {
    console.log('Loading categories...')
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug')
    
    if (error) {
      console.error('Error loading categories:', error)
      return
    }
    
    categories?.forEach(cat => {
      this.categoryMap.set(cat.name, cat.id)
      this.categoryMap.set(cat.slug, cat.id)
    })
    
    console.log(`Loaded ${categories?.length} categories`)
  }
  
  async loadTags() {
    console.log('Loading tags...')
    const { data: tags, error } = await supabase
      .from('tags')
      .select('id, name, slug')
    
    if (error) {
      console.error('Error loading tags:', error)
      return
    }
    
    tags?.forEach(tag => {
      this.tagMap.set(tag.name, tag.id)
      this.tagMap.set(tag.slug, tag.id)
    })
    
    console.log(`Loaded ${tags?.length} tags`)
  }
  
  private getCategoryId(categoryName: string): string | null {
    return this.categoryMap.get(categoryName) || null
  }
  
  private mapParsedPromptToDatabase(parsed: ParsedPrompt): DatabasePrompt {
    // Generate description from short description or title
    const description = parsed.shortDescription || `${parsed.title} - Advanced AI prompt for enhanced productivity and results.`
    
    // Combine single prompt or multi-step content for the main content field
    let content = ''
    if (parsed.singlePrompt) {
      content = parsed.singlePrompt
    } else if (parsed.stepsData && parsed.stepsData.length > 0) {
      content = parsed.stepsData.map((step, index) => 
        `Step ${index + 1}: ${step.title}\n\n${step.content}`
      ).join('\n\n---\n\n')
    }
    
    return {
      title: parsed.title,
      short_description: parsed.shortDescription,
      description,
      content,
      category_id: this.getCategoryId(parsed.category),
      difficulty_level: parsed.complexity,
      ai_platforms: parsed.platforms,
      status: 'published',
      workflow_type: parsed.workflowType,
      step_count: parsed.stepCount,
      steps_data: parsed.stepsData || [],
      estimated_time: parsed.estimatedTime || null,
      platforms: parsed.platforms,
      slug: parsed.slug,
      how_to_use: parsed.howToUse,
      what_you_get: parsed.whatYouGet,
      expected_results: parsed.expectedResults,
      variations: parsed.variations,
      workflow_overview: parsed.workflowOverview || null,
      what_you_create: parsed.whatYouCreate || null,
      prompt_type: parsed.type,
      usage_count: Math.floor(Math.random() * 1000) + 100, // Random usage count for demo
      rating_avg: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0-5.0
      rating_count: Math.floor(Math.random() * 50) + 10, // Random rating count
      featured: Math.random() > 0.85 // 15% chance of being featured
    }
  }
  
  async insertPrompt(dbPrompt: DatabasePrompt): Promise<string | null> {
    const { data, error } = await supabase
      .from('prompts')
      .insert(dbPrompt)
      .select('id')
      .single()
    
    if (error) {
      console.error(`Error inserting prompt "${dbPrompt.title}":`, error)
      return null
    }
    
    return data.id
  }
  
  async createTagsFromPrompt(parsed: ParsedPrompt): Promise<string[]> {
    const tagNames = new Set<string>()
    
    // Add category-based tags
    tagNames.add(parsed.category.toLowerCase().replace(/\s+/g, '-'))
    
    // Add complexity tag
    tagNames.add(parsed.complexity.toLowerCase())
    
    // Add type tag
    tagNames.add(parsed.type.toLowerCase())
    
    // Add workflow type tag
    if (parsed.workflowType === 'multi-step') {
      tagNames.add('workflow')
    }
    
    // Add platform tags
    parsed.platforms.forEach(platform => {
      tagNames.add(platform.toLowerCase().replace(/\s+/g, '-'))
    })
    
    // Create tags that don't exist
    const tagIds: string[] = []
    
    for (const tagName of tagNames) {
      let tagId = this.tagMap.get(tagName)
      
      if (!tagId) {
        // Create new tag
        const { data, error } = await supabase
          .from('tags')
          .insert({
            name: tagName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: tagName,
            description: `Tag for ${tagName.replace(/-/g, ' ')} related content`
          })
          .select('id')
          .single()
        
        if (error) {
          console.error(`Error creating tag "${tagName}":`, error)
          continue
        }
        
        tagId = data.id
        this.tagMap.set(tagName, tagId)
      }
      
      tagIds.push(tagId)
    }
    
    return tagIds
  }
  
  async associatePromptTags(promptId: string, tagIds: string[]) {
    if (tagIds.length === 0) return
    
    const promptTags = tagIds.map(tagId => ({
      prompt_id: promptId,
      tag_id: tagId
    }))
    
    const { error } = await supabase
      .from('prompt_tags')
      .insert(promptTags)
    
    if (error) {
      console.error(`Error associating tags for prompt ${promptId}:`, error)
    }
  }
  
  async migratePrompts() {
    console.log('Starting prompt migration...')
    
    // Load existing categories and tags
    await this.loadCategories()
    await this.loadTags()
    
    // Parse all markdown files
    const promptVaultPath = path.join(process.cwd(), '../docs/prompt-vault')
    console.log(`Parsing markdown files from: ${promptVaultPath}`)
    
    const parsedPrompts = MarkdownParser.parseAllMarkdownFiles(promptVaultPath)
    console.log(`Found ${parsedPrompts.length} prompts to migrate`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const [index, parsed] of parsedPrompts.entries()) {
      console.log(`\nMigrating ${index + 1}/${parsedPrompts.length}: ${parsed.title}`)
      
      try {
        // Convert to database format
        const dbPrompt = this.mapParsedPromptToDatabase(parsed)
        
        // Insert prompt
        const promptId = await this.insertPrompt(dbPrompt)
        if (!promptId) {
          errorCount++
          continue
        }
        
        // Create and associate tags
        const tagIds = await this.createTagsFromPrompt(parsed)
        await this.associatePromptTags(promptId, tagIds)
        
        successCount++
        console.log(`✅ Successfully migrated: ${parsed.title}`)
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error migrating ${parsed.title}:`, error)
        errorCount++
      }
    }
    
    console.log(`\n🎉 Migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} prompts`)
    console.log(`❌ Failed migrations: ${errorCount} prompts`)
    console.log(`📊 Total processed: ${parsedPrompts.length} prompts`)
  }
}

// Run the migration
async function main() {
  const migrator = new PromptMigrator()
  
  try {
    await migrator.migratePrompts()
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}