#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

interface MarkdownStandardizer {
  standardizeFile(filePath: string): boolean
}

class PromptMarkdownStandardizer implements MarkdownStandardizer {
  
  /**
   * Standardizes a markdown file to follow the consistent format
   */
  standardizeFile(filePath: string): boolean {
    try {
      console.log(`📄 Processing: ${path.basename(filePath)}`)
      
      const content = fs.readFileSync(filePath, 'utf-8')
      const standardized = this.standardizeContent(content, filePath)
      
      if (standardized !== content) {
        // Create backup
        const backupPath = filePath + '.backup'
        if (!fs.existsSync(backupPath)) {
          fs.writeFileSync(backupPath, content)
        }
        
        // Write standardized content
        fs.writeFileSync(filePath, standardized)
        console.log(`✅ Standardized: ${path.basename(filePath)}`)
        return true
      } else {
        console.log(`⏭️  Already standard: ${path.basename(filePath)}`)
        return false
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error)
      return false
    }
  }
  
  /**
   * Standardizes markdown content
   */
  private standardizeContent(content: string, filePath: string): string {
    // Normalize line endings
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    // Extract current sections
    const sections = this.extractAllSections(content)
    
    // Determine if this is a singles format
    const isSingles = filePath.includes('/singles/') || content.includes('## **PROMPT**')
    
    // Build standardized content
    let standardized = this.buildStandardizedContent(sections, isSingles)
    
    return standardized
  }
  
  /**
   * Extract all sections from markdown content
   */
  private extractAllSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {}
    
    // Extract frontmatter (title, metadata)
    const frontmatterMatch = content.match(/^([\s\S]*?)---\n/)
    if (frontmatterMatch) {
      sections.frontmatter = frontmatterMatch[1].trim()
    }
    
    // Find all ## sections
    const sectionMatches = content.match(/^## .+$/gm) || []
    
    for (let i = 0; i < sectionMatches.length; i++) {
      const currentSection = sectionMatches[i]
      const nextSection = sectionMatches[i + 1]
      
      // Extract section name
      const sectionNameMatch = currentSection.match(/^## (.+)$/)
      if (!sectionNameMatch) continue
      
      const rawSectionName = sectionNameMatch[1].trim()
      const cleanSectionName = rawSectionName
        .replace(/^\p{Emoji}+\s*/u, '') // Remove emojis
        .replace(/\*\*/g, '') // Remove bold
        .trim()
      
      // Extract content
      let sectionContent = ''
      if (nextSection) {
        const currentIndex = content.indexOf(currentSection)
        const nextIndex = content.indexOf(nextSection)
        sectionContent = content.substring(currentIndex + currentSection.length, nextIndex).trim()
      } else {
        const currentIndex = content.indexOf(currentSection)
        sectionContent = content.substring(currentIndex + currentSection.length).trim()
      }
      
      // Clean content
      sectionContent = sectionContent.replace(/^---+$/gm, '').trim()
      
      sections[cleanSectionName] = sectionContent
    }
    
    return sections
  }
  
  /**
   * Build standardized markdown content
   */
  private buildStandardizedContent(sections: Record<string, string>, isSingles: boolean): string {
    let content = ''
    
    // Add frontmatter
    if (sections.frontmatter) {
      content += sections.frontmatter + '\n\n---\n\n'
    }
    
    // Add main prompt section
    const promptSection = this.getPromptSection(sections, isSingles)
    if (promptSection) {
      const sectionTitle = isSingles ? '## 🎯 **PROMPT**' : '## 📋 **COPY & PASTE PROMPT**'
      content += `${sectionTitle}\n\n${promptSection}\n\n---\n\n`
    }
    
    // Add standard sections
    content += this.addStandardSection('💡 **HOW TO USE THIS PROMPT**', this.getHowToUse(sections))
    content += this.addStandardSection('🎯 **WHAT YOU\'LL GET**', this.getWhatYouGet(sections))
    content += this.addStandardSection('📊 **EXPECTED RESULTS**', this.getExpectedResults(sections))
    content += this.addStandardSection('🔄 **VARIATIONS**', this.getVariations(sections))
    
    // Add optional sections
    const exampleOutput = this.getExampleOutput(sections)
    if (exampleOutput) {
      content += this.addStandardSection('📝 **EXAMPLE OUTPUT**', exampleOutput)
    }
    
    // Add other additional sections (best practices, troubleshooting, etc.)
    const additionalSections = this.getAdditionalSections(sections)
    for (const [title, sectionContent] of additionalSections) {
      content += this.addStandardSection(title, sectionContent)
    }
    
    // Add footer
    const footer = this.getFooter(sections)
    if (footer) {
      content += `${footer}\n`
    }
    
    return content.trim() + '\n'
  }
  
  /**
   * Get main prompt section
   */
  private getPromptSection(sections: Record<string, string>, isSingles: boolean): string | null {
    const candidates = [
      'COPY & PASTE PROMPT',
      'PROMPT', 
      'COPY AND PASTE PROMPT'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return sections[candidate]
      }
    }
    
    return null
  }
  
  /**
   * Get How To Use section
   */
  private getHowToUse(sections: Record<string, string>): string | null {
    const candidates = [
      'HOW TO USE THIS PROMPT',
      'HOW TO USE', 
      'USAGE INSTRUCTIONS'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return sections[candidate]
      }
    }
    
    // Generate default if not found
    return `1. **Copy the prompt above** by clicking the "Copy Prompt" button
2. **Paste it into your preferred AI platform** (ChatGPT, Claude, Gemini, etc.)
3. **Replace placeholder fields** with your specific information
4. **Review and refine** the generated output as needed
5. **Save successful variations** for future use`
  }
  
  /**
   * Get What You'll Get section
   */
  private getWhatYouGet(sections: Record<string, string>): string | null {
    const candidates = [
      'WHAT YOU\'LL GET',
      'WHAT YOULL GET',
      'WHAT YOU GET',
      'OUTPUTS',
      'DELIVERABLES'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return this.formatBulletPoints(sections[candidate])
      }
    }
    
    // Generate default if not found
    return `✅ **Professional-quality content** tailored to your specific needs  
✅ **Time-saving templates** ready for immediate use  
✅ **Consistent results** following best practices  
✅ **Customizable framework** adaptable to different scenarios  
✅ **Actionable outputs** you can implement right away  
✅ **Scalable solutions** for ongoing use`
  }
  
  /**
   * Get Expected Results section
   */
  private getExpectedResults(sections: Record<string, string>): string | null {
    const candidates = [
      'EXPECTED RESULTS',
      'RESULTS',
      'SUCCESS METRICS',
      'PERFORMANCE',
      'OUTCOMES'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return this.formatBulletPoints(sections[candidate])
      }
    }
    
    // Generate default if not found  
    return `- **Significant time savings** in content creation and planning
- **Improved quality and consistency** in outputs
- **Higher engagement rates** through optimized content
- **Better results** compared to generic approaches
- **Professional-grade outputs** that meet industry standards
- **Measurable improvements** in your target metrics`
  }
  
  /**
   * Get Variations section
   */
  private getVariations(sections: Record<string, string>): string | null {
    const candidates = [
      'VARIATIONS',
      'ADAPTATIONS',
      'CUSTOMIZATIONS',
      'MODIFICATIONS'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return sections[candidate]
      }
    }
    
    // Generate default if not found
    return `**For Different Industries**: Adapt terminology and examples to your specific field  
**For Various Audiences**: Adjust tone and complexity level as needed  
**For Different Platforms**: Modify format and length requirements  
**For Advanced Users**: Add additional parameters and customization options`
  }
  
  /**
   * Get Example Output section
   */
  private getExampleOutput(sections: Record<string, string>): string | null {
    const candidates = [
      'EXAMPLE OUTPUT',
      'EXAMPLES',
      'SAMPLE OUTPUT',
      'SAMPLE'
    ]
    
    for (const candidate of candidates) {
      if (sections[candidate]) {
        return sections[candidate]
      }
    }
    
    return null
  }
  
  /**
   * Get additional sections that should be preserved
   */
  private getAdditionalSections(sections: Record<string, string>): Array<[string, string]> {
    const standardSections = [
      'COPY & PASTE PROMPT',
      'PROMPT',
      'HOW TO USE THIS PROMPT', 
      'HOW TO USE',
      'WHAT YOU\'LL GET',
      'WHAT YOULL GET',
      'EXPECTED RESULTS',
      'VARIATIONS',
      'EXAMPLE OUTPUT',
      'EXAMPLES'
    ]
    
    const additionalSections: Array<[string, string]> = []
    
    for (const [key, content] of Object.entries(sections)) {
      if (key === 'frontmatter') continue
      
      if (!standardSections.includes(key.toUpperCase()) && content.length > 50) {
        // Map common section names to standardized versions with emojis
        let standardTitle = this.mapSectionTitle(key)
        additionalSections.push([standardTitle, content])
      }
    }
    
    return additionalSections
  }
  
  /**
   * Map section titles to standardized versions with emojis
   */
  private mapSectionTitle(title: string): string {
    const titleMap: Record<string, string> = {
      'BEST PRACTICES': '⭐ **BEST PRACTICES**',
      'FACEBOOK ALGORITHM UNDERSTANDING': '📊 **ALGORITHM UNDERSTANDING**', 
      'HIGH-ENGAGEMENT POST FORMATS': '🎯 **HIGH-ENGAGEMENT FORMATS**',
      'OPTIMAL POSTING STRATEGY': '📅 **OPTIMAL POSTING STRATEGY**',
      'ENGAGEMENT OPTIMIZATION TACTICS': '🚀 **ENGAGEMENT OPTIMIZATION**',
      'PERFORMANCE TRACKING & OPTIMIZATION': '📈 **PERFORMANCE TRACKING**',
      'PERFORMANCE TRACKING': '📈 **PERFORMANCE TRACKING**',
      'CONTENT PLANNING FRAMEWORK': '📋 **CONTENT PLANNING**',
      'INSTAGRAM STORY BEST PRACTICES': '⭐ **INSTAGRAM BEST PRACTICES**',
      'TIMING STRATEGY': '⏰ **TIMING STRATEGY**',
      'SUCCESS METRICS': '📊 **SUCCESS METRICS**',
      'TROUBLESHOOTING': '🔧 **TROUBLESHOOTING**',
      'PRO TIPS': '💡 **PRO TIPS**',
      'ADVANCED TIPS': '🚀 **ADVANCED TIPS**'
    }
    
    const upperTitle = title.toUpperCase()
    if (titleMap[upperTitle]) {
      return titleMap[upperTitle]
    }
    
    // Add emoji based on content type
    if (upperTitle.includes('PRACTICE') || upperTitle.includes('GUIDELINE')) {
      return `⭐ **${title.toUpperCase()}**`
    } else if (upperTitle.includes('TIP') || upperTitle.includes('ADVICE')) {
      return `💡 **${title.toUpperCase()}**`
    } else if (upperTitle.includes('METRIC') || upperTitle.includes('TRACK') || upperTitle.includes('MEASURE')) {
      return `📊 **${title.toUpperCase()}**`
    } else if (upperTitle.includes('STRATEGY') || upperTitle.includes('PLAN')) {
      return `📋 **${title.toUpperCase()}**`
    } else if (upperTitle.includes('OPTIMIZATION') || upperTitle.includes('IMPROVE')) {
      return `🚀 **${title.toUpperCase()}**`
    } else {
      return `📄 **${title.toUpperCase()}**`
    }
  }
  
  /**
   * Format bullet points consistently
   */
  private formatBulletPoints(content: string): string {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    return lines.map(line => {
      // If it's already formatted with ✅ or -, keep it
      if (line.match(/^[✅\-•*]\s/) || line.match(/^\d+\./)) {
        return line
      }
      
      // Add ✅ prefix for "What You'll Get" style formatting
      if (!line.startsWith('**') && !line.includes('%') && !line.includes('x ')) {
        return `✅ ${line}`
      }
      
      // Add - prefix for other bullet points
      return `- ${line}`
    }).join('\n')
  }
  
  /**
   * Get footer content
   */
  private getFooter(sections: Record<string, string>): string | null {
    // Look for existing footer
    for (const [, content] of Object.entries(sections)) {
      if (content.includes('This is a') && content.includes('prompt from')) {
        return content
      }
    }
    
    return '**⭐ This is a premium prompt from the AI Prompt Master Vault. Get 207+ copy-paste prompts for comprehensive success.**'
  }
  
  /**
   * Add a standard section with proper formatting
   */
  private addStandardSection(title: string, content: string | null): string {
    if (!content) return ''
    
    return `## ${title}\n\n${content}\n\n---\n\n`
  }
}

/**
 * Main execution function
 */
async function standardizeAllMarkdownFiles() {
  console.log('🚀 Starting markdown standardization process...\n')
  
  const standardizer = new PromptMarkdownStandardizer()
  const promptVaultPath = path.join(process.cwd(), '..', 'docs', 'prompt-vault')
  
  if (!fs.existsSync(promptVaultPath)) {
    console.error('❌ Prompt vault directory not found:', promptVaultPath)
    process.exit(1)
  }
  
  let processedCount = 0
  let standardizedCount = 0
  
  // Process all markdown files recursively
  function processDirectory(dir: string) {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        processDirectory(fullPath)
      } else if (item.endsWith('.md') && item !== 'README.md') {
        processedCount++
        if (standardizer.standardizeFile(fullPath)) {
          standardizedCount++
        }
      }
    }
  }
  
  processDirectory(promptVaultPath)
  
  console.log('\n🎉 Standardization completed!')
  console.log(`📊 Files processed: ${processedCount}`)
  console.log(`✅ Files standardized: ${standardizedCount}`)
  console.log(`⏭️  Files already standard: ${processedCount - standardizedCount}`)
  
  if (standardizedCount > 0) {
    console.log('\n💡 Backup files (.backup) created for modified files')
    console.log('🔧 Run the update-prompt-info script to sync changes to database')
  }
}

// Run the standardization
standardizeAllMarkdownFiles().catch(console.error)