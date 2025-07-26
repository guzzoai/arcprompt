import fs from 'fs'
import path from 'path'

export interface ParsedPrompt {
  // Basic info
  title: string
  shortDescription: string
  category: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  type: 'FREE' | 'PRO' | 'PREMIUM'
  platforms: string[]
  estimatedTime?: string
  modifiedDate: string
  
  // Content
  workflowType: 'single' | 'multi-step'
  stepCount: number
  singlePrompt?: string
  stepsData?: Array<{
    stepNumber: number
    title: string
    content: string
    estimatedTime?: string
  }>
  
  // Metadata arrays
  howToUse: string[]
  whatYouGet: string[]
  expectedResults: string[]
  variations: string[]
  
  // Additional sections - all extra content from markdown
  additionalSections: Record<string, {
    title: string
    content: string
    order: number
  }>
  
  // Multi-step specific
  workflowOverview?: string
  whatYouCreate?: string
  
  // File metadata
  filePath: string
  slug: string
  categoryPath: string
}

export class MarkdownParser {
  private static extractFrontmatter(content: string): Record<string, unknown> {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) return {}
    
    const frontmatter: Record<string, unknown> = {}
    const lines = frontmatterMatch[1].split('\n')
    
    for (const line of lines) {
      const match = line.match(/^(.+?):\s*(.+)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim()
        
        // Parse different value types
        if (value.startsWith('[') && value.endsWith(']')) {
          // Array format
          frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim())
        } else if (value === 'true' || value === 'false') {
          frontmatter[key] = value === 'true'
        } else if (!isNaN(Number(value))) {
          frontmatter[key] = Number(value)
        } else {
          frontmatter[key] = value
        }
      }
    }
    
    return frontmatter
  }
  
  private static extractTitle(content: string): string {
    // Try to get title from frontmatter first
    const frontmatter = this.extractFrontmatter(content)
    if (frontmatter.Title && typeof frontmatter.Title === 'string') return frontmatter.Title
    
    // Fall back to first H1 heading
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      return titleMatch[1].replace(/🔴|⭐|FREE PREVIEW/g, '').trim()
    }
    
    return 'Untitled Prompt'
  }
  
  private static extractMetadata(content: string): Record<string, unknown> {
    const metadata: Record<string, unknown> = {}
    
    // Extract from markdown headers or frontmatter-style content
    const patterns = [
      { key: 'shortDescription', pattern: /\*\*Short Description\*\*:\s*(.+)/i },
      { key: 'category', pattern: /\*\*Category\*\*:\s*(.+)/i },
      { key: 'complexity', pattern: /\*\*Complexity\*\*:\s*(.+)/i },
      { key: 'type', pattern: /\*\*Type\*\*:\s*(.+)/i },
      { key: 'platforms', pattern: /\*\*Platforms\*\*:\s*(.+)/i },
      { key: 'estimatedTime', pattern: /\*\*Estimated Time\*\*:\s*(.+)/i },
      { key: 'modifiedDate', pattern: /\*\*Modified Date\*\*:\s*(.+)/i },
      { key: 'steps', pattern: /\*\*Steps\*\*:\s*(\d+)/i }
    ]
    
    for (const { key, pattern } of patterns) {
      const match = content.match(pattern)
      if (match) {
        const value = match[1].trim()
        
        if (key === 'platforms') {
          metadata[key] = value.split(',').map(p => p.trim())
        } else if (key === 'steps') {
          metadata[key] = parseInt(value)
        } else {
          metadata[key] = value
        }
      }
    }
    
    return metadata
  }
  
  private static extractPromptContent(content: string): { singlePrompt?: string; stepsData?: Array<{
    stepNumber: number
    title: string
    content: string
    estimatedTime?: string
  }> } {
    // Check if it's a multi-step workflow
    const stepMatches = content.match(/## 📋 \*\*STEP \d+:(.*?)\*\* \*\((.*?)\)\*/g)
    
    if (stepMatches && stepMatches.length > 0) {
      // Multi-step workflow
      const stepsData = []
      const stepSections = content.split(/## 📋 \*\*STEP \d+:/)
      
      for (let i = 1; i < stepSections.length; i++) {
        const section = stepSections[i]
        const titleMatch = section.match(/^(.*?)\*\* \*\((.*?)\)\*/)
        
        if (titleMatch) {
          const title = titleMatch[1].trim()
          const estimatedTime = titleMatch[2].trim()
          
          // Extract the code block content
          const codeBlockMatch = section.match(/```\n([\s\S]*?)\n```/)
          const content = codeBlockMatch ? codeBlockMatch[1].trim() : ''
          
          stepsData.push({
            stepNumber: i,
            title,
            content,
            estimatedTime
          })
        }
      }
      
      return { stepsData }
    } else {
      // Single prompt - extract from COPY & PASTE PROMPT section or PROMPT section
      // Try different patterns to handle various whitespace and formatting
      const promptPatterns = [
        // Original COPY & PASTE PROMPT patterns
        /## 📋 COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /##\s*📋\s*COPY\s*&\s*PASTE\s*PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /## 📋 \*\*COPY & PASTE PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /## COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /##\s*📋.*COPY.*PASTE.*PROMPT.*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/i,
        
        // New patterns for singles directory format
        /## 🎯 \*\*PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /##\s*🎯\s*\*\*PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /## 🎯 PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /##\s*🎯.*PROMPT.*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/i
      ]
      
      for (const pattern of promptPatterns) {
        const promptMatch = content.match(pattern)
        if (promptMatch) {
          return { singlePrompt: promptMatch[1].trim() }
        }
      }
    }
    
    return {}
  }
  
  private static extractListSection(content: string, sectionTitle: string): string[] {
    // Normalize line endings first
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    // Try multiple patterns for different section title formats
    const patterns = [
      // Standard formats with emojis and optional bold
      new RegExp(`## 💡 \\*\\*${sectionTitle}\\*\\*\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 🎯 \\*\\*${sectionTitle}\\*\\*\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 📊 \\*\\*${sectionTitle}\\*\\*\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 🔄 \\*\\*${sectionTitle}\\*\\*\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      // Formats without bold but with emojis
      new RegExp(`## 💡 ${sectionTitle}\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 🎯 ${sectionTitle}\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 📊 ${sectionTitle}\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      new RegExp(`## 🔄 ${sectionTitle}\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i'),
      // Plain formats without emojis
      new RegExp(`## ${sectionTitle}\\n\\n([\\s\\S]*?)(?=\\n---|\\n##|$)`, 'i')
    ]
    
    let section = ''
    for (const pattern of patterns) {
      const match = normalizedContent.match(pattern)
      if (match) {
        section = match[1].trim()
        break
      }
    }
    
    if (!section) return []
    
    // Split content into lines and process each line
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Extract meaningful content from each non-empty line
    const items: string[] = []
    
    for (const line of lines) {
      // Skip empty lines and markdown separators
      if (!line || line.startsWith('---') || line.startsWith('##')) continue
      
      // Clean up the line content
      const cleanLine = line
        // Remove various bullet point formats
        .replace(/^[-*•]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        // Remove checkmarks and their variations
        .replace(/^✅\s*/, '')
        .replace(/^☑️\s*/, '')
        // Remove bold markdown formatting while preserving content
        .replace(/\*\*(.*?)\*\*/g, '$1')
        // Clean up any remaining formatting
        .trim()
      
      // Only add substantial content (not just punctuation or short words)
      if (cleanLine.length > 3 && !cleanLine.match(/^[^\w]*$/)) {
        items.push(cleanLine)
      }
    }
    
    return items
  }
  
  private static extractWorkflowOverview(content: string): string | undefined {
    const overviewMatch = content.match(/## 🎯 \*\*WORKFLOW OVERVIEW\*\*\n\n([\s\S]*?)(?=\n##|$)/)
    if (overviewMatch) {
      // Extract the main description, skip the "What You'll Create" part
      const text = overviewMatch[1]
      const mainDescription = text.split('**What You\'ll Create:**')[0].trim()
      return mainDescription
    }
    return undefined
  }
  
  private static extractWhatYouCreate(content: string): string | undefined {
    const match = content.match(/\*\*What You'll Create:\*\*\n([\s\S]*?)(?=\n##|---)/i)
    if (match) {
      return match[1].trim().replace(/^-\s*/, '').trim()
    }
    return undefined
  }
  
  private static extractAdditionalSections(content: string): Record<string, { title: string; content: string; order: number }> {
    // Normalize line endings
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    // Skip basic sections that are already extracted
    const skipSections = [
      'COPY & PASTE PROMPT',
      'HOW TO USE THIS PROMPT',
      'HOW TO USE',
      'WHAT YOU\'LL GET',
      'EXPECTED RESULTS',
      'VARIATIONS',
      'WORKFLOW OVERVIEW'
    ]
    
    // Find all ## sections
    const sectionMatches = normalizedContent.match(/^## .+$/gm)
    if (!sectionMatches) return {}
    
    const additionalSections: Record<string, { title: string; content: string; order: number }> = {}
    let order = 1
    
    for (let i = 0; i < sectionMatches.length; i++) {
      const currentSection = sectionMatches[i]
      const nextSection = sectionMatches[i + 1]
      
      // Extract the clean title (remove emoji and formatting)
      const titleMatch = currentSection.match(/^## (.+)$/)
      if (!titleMatch) continue
      
      const rawTitle = titleMatch[1].trim()
      const cleanTitle = rawTitle
        .replace(/^\p{Emoji}+\s*/u, '') // Remove leading emojis
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*\*$/g, '') // Remove trailing ** characters
        .trim()
      
      // Skip if it's one of the basic sections
      if (skipSections.some(skip => cleanTitle.includes(skip))) continue
      
      // Skip if it starts with ⭐, 🔴, or contains "PREMIUM"
      if (rawTitle.includes('⭐') || rawTitle.includes('🔴') || rawTitle.includes('PREMIUM') || rawTitle.includes('💎')) continue
      
      // Extract content between this section and the next
      let sectionContent = ''
      if (nextSection) {
        const currentIndex = normalizedContent.indexOf(currentSection)
        const nextIndex = normalizedContent.indexOf(nextSection)
        sectionContent = normalizedContent.substring(currentIndex + currentSection.length, nextIndex).trim()
      } else {
        // This is the last section
        const currentIndex = normalizedContent.indexOf(currentSection)
        sectionContent = normalizedContent.substring(currentIndex + currentSection.length).trim()
      }
      
      // Clean up the content - remove separators, formatting, and normalize spacing
      sectionContent = sectionContent
        .replace(/^---+$/gm, '') // Remove separator lines
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple newlines
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold markdown to HTML
        .replace(/\*\*/g, '') // Remove any leftover ** characters
        .trim()
      
      // Only include sections with substantial content
      if (sectionContent.length > 50) {
        // Create a key from the clean title
        const sectionKey = cleanTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
        
        additionalSections[sectionKey] = {
          title: cleanTitle,
          content: sectionContent,
          order
        }
        order++
      }
    }
    
    return additionalSections
  }
  
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  private static mapCategory(filePath: string): string {
    const pathParts = filePath.split(path.sep)
    const categoryFolder = pathParts.find(part => part.match(/^\d{2}-/))
    
    if (!categoryFolder) return 'Uncategorized'
    
    const categoryMap: Record<string, string> = {
      '01-social-media': 'Social Media',
      '02-business-strategy': 'Business Strategy',
      '03-content-creation': 'Content Creation',
      '04-advertising': 'Advertising',
      '05-automation': 'Automation',
      '06-core-methods': 'Core Methods'
    }
    
    return categoryMap[categoryFolder] || 'Uncategorized'
  }
  
  private static determineComplexity(content: string, stepCount: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    // Try to extract from metadata first
    const metadata = this.extractMetadata(content)
    if (metadata.complexity && typeof metadata.complexity === 'string') {
      return metadata.complexity as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
    }
    
    // Determine based on step count and content complexity
    if (stepCount > 3) return 'Expert'
    if (stepCount > 1) return 'Intermediate'
    
    // Check content length and complexity indicators
    const contentLength = content.length
    const hasAdvancedTerms = /workflow|advanced|expert|comprehensive|strategic/i.test(content)
    
    if (contentLength > 5000 || hasAdvancedTerms) return 'Advanced'
    if (contentLength > 2000) return 'Intermediate'
    
    return 'Beginner'
  }
  
  private static determineType(content: string): 'FREE' | 'PRO' | 'PREMIUM' {
    if (content.includes('FREE PREVIEW')) return 'FREE'
    if (content.includes('PREMIUM WORKFLOW')) return 'PREMIUM'
    return 'PRO'
  }
  
  public static parseMarkdownFile(filePath: string): ParsedPrompt | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const categoryPath = path.dirname(filePath)
      
      // Extract basic information
      const title = this.extractTitle(content)
      const metadata = this.extractMetadata(content)
      const { singlePrompt, stepsData } = this.extractPromptContent(content)
      
      // Determine workflow type and step count
      const workflowType = stepsData ? 'multi-step' : 'single'
      const stepCount = stepsData ? stepsData.length : 1
      
      // Extract sections - handle different formats
      const howToUse = this.extractListSection(content, 'HOW TO USE THIS PROMPT') || 
                       this.extractListSection(content, 'HOW TO USE') || 
                       this.extractListSection(content, '💡 HOW TO USE THIS PROMPT') ||
                       this.extractListSection(content, '💡 HOW TO USE')
      const whatYouGet = this.extractListSection(content, 'WHAT YOU\'LL GET') || 
                        this.extractListSection(content, '🎯 WHAT YOU\'LL GET')
      const expectedResults = this.extractListSection(content, 'EXPECTED RESULTS') || 
                             this.extractListSection(content, '📊 EXPECTED RESULTS')
      const variations = this.extractListSection(content, 'VARIATIONS') || 
                        this.extractListSection(content, '🔄 VARIATIONS')
      
      const parsedPrompt: ParsedPrompt = {
        title,
        shortDescription: (typeof metadata.shortDescription === 'string' ? metadata.shortDescription : undefined) || `${title} - AI prompt for enhanced productivity`,
        category: this.mapCategory(filePath),
        complexity: this.determineComplexity(content, stepCount),
        type: this.determineType(content),
        platforms: (Array.isArray(metadata.platforms) ? metadata.platforms : undefined) || ['ChatGPT', 'Claude', 'Gemini'],
        estimatedTime: typeof metadata.estimatedTime === 'string' ? metadata.estimatedTime : undefined,
        modifiedDate: (typeof metadata.modifiedDate === 'string' ? metadata.modifiedDate : undefined) || '2024-01-01',
        workflowType,
        stepCount,
        singlePrompt,
        stepsData,
        howToUse,
        whatYouGet,
        expectedResults,
        variations,
        additionalSections: this.extractAdditionalSections(content),
        workflowOverview: this.extractWorkflowOverview(content),
        whatYouCreate: this.extractWhatYouCreate(content),
        filePath,
        slug: this.generateSlug(title),
        categoryPath
      }
      
      return parsedPrompt
    } catch (error) {
      console.error(`Error parsing markdown file ${filePath}:`, error)
      return null
    }
  }
  
  public static parseAllMarkdownFiles(baseDir: string): ParsedPrompt[] {
    const results: ParsedPrompt[] = []
    
    function walkDirectory(dir: string) {
      const files = fs.readdirSync(dir)
      
      for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          walkDirectory(fullPath)
        } else if (file.endsWith('.md') && file !== 'README.md') {
          const parsed = MarkdownParser.parseMarkdownFile(fullPath)
          if (parsed) {
            results.push(parsed)
          }
        }
      }
    }
    
    walkDirectory(baseDir)
    return results
  }
}