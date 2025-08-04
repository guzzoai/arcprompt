const fs = require('fs')
const path = require('path')

function parseToolsFromMarkdown() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, '../../docs/top-100.md')
    const markdownContent = fs.readFileSync(markdownPath, 'utf-8')
    
    // Split into tool sections (each starting with ##)
    const toolSections = markdownContent.split(/^## /m).slice(1) // Remove first empty element
    
    const tools = []
    let id = 1
    
    for (const section of toolSections) {
      try {
        const lines = section.trim().split('\n')
        const name = lines[0].trim()
        
        let category = ''
        let description = ''
        let pricing = ''
        let forWho = ''
        let tags = []
        let url = ''
        
        // Parse each field
        for (const line of lines.slice(1)) {
          if (line.startsWith('- **Category:**')) {
            category = line.replace('- **Category:**', '').trim()
          } else if (line.startsWith('- **Description:**')) {
            description = line.replace('- **Description:**', '').trim()
          } else if (line.startsWith('- **Pricing:**')) {
            pricing = line.replace('- **Pricing:**', '').trim()
          } else if (line.startsWith('- **For who:**')) {
            forWho = line.replace('- **For who:**', '').trim()
          } else if (line.startsWith('- **Tags:**')) {
            const tagString = line.replace('- **Tags:**', '').trim()
            tags = tagString.split(',').map(tag => tag.trim())
          } else if (line.startsWith('- **Website:**')) {
            url = line.replace('- **Website:**', '').trim()
          }
        }
        
        // Map categories to frontend category IDs
        const categoryMap = {
          'Chat & Assistants': 'writing',
          'General': 'writing',
          'Coding & Developer Tools': 'coding',
          'Code & Development': 'coding',
          'Content & Copywriting': 'writing',
          'Writing & Content': 'writing',
          'Image Generation & Editing': 'image',
          'Image Generation': 'image',
          'Video & Avatar Generation': 'video',
          'Video Creation': 'video',
          'Audio & Voice': 'audio',
          'Design & Creative': 'design',
          'Presentation & Design': 'design',
          'Research & Learning': 'research',
          'Productivity & Automation': 'automation',
          'Automation': 'automation',
          'Team & Collaboration': 'collaboration',
          'Other Notable Tools': 'analysis'
        }
        
        // Map "For who" to roles
        const roleMap = {
          'developer': 'developer',
          'programmer': 'developer',
          'coder': 'developer',
          'software engineer': 'developer',
          'marketer': 'marketer',
          'marketing': 'marketer',
          'designer': 'designer',
          'artist': 'designer',
          'creative': 'designer',
          'writer': 'writer',
          'content creator': 'writer',
          'blogger': 'writer',
          'analyst': 'analyst',
          'researcher': 'analyst',
          'data': 'analyst',
          'manager': 'manager',
          'team': 'manager',
          'business': 'entrepreneur',
          'entrepreneur': 'entrepreneur',
          'individual': 'writer',
          'professional': 'manager',
          'student': 'writer'
        }
        
        // Extract roles from "For who" field
        const roles = []
        const forWhoLower = forWho.toLowerCase()
        for (const [keyword, role] of Object.entries(roleMap)) {
          if (forWhoLower.includes(keyword) && !roles.includes(role)) {
            roles.push(role)
          }
        }
        
        // If no roles found, default based on category
        if (roles.length === 0) {
          const categoryId = categoryMap[category] || 'writing'
          switch (categoryId) {
            case 'coding':
              roles.push('developer')
              break
            case 'design':
              roles.push('designer')
              break
            case 'writing':
              roles.push('writer')
              break
            case 'automation':
              roles.push('manager')
              break
            case 'analysis':
              roles.push('analyst')
              break
            default:
              roles.push('writer')
          }
        }
        
        if (name && description && url) {
          tools.push({
            id,
            name,
            description,
            category: categoryMap[category] || 'writing',
            roles,
            pricing: pricing || 'Not specified',
            url,
            tags: tags.length > 0 ? tags : [category.toLowerCase()]
          })
          id++
        }
      } catch (error) {
        console.warn('Failed to parse tool section:', error)
        continue
      }
    }
    
    return tools
  } catch (error) {
    console.error('Failed to read or parse markdown file:', error)
    return []
  }
}

// Parse the tools and generate the TypeScript file
const tools = parseToolsFromMarkdown()
console.log(`Parsed ${tools.length} tools`)

// Generate TypeScript file content
const tsContent = `// Auto-generated from top-100.md
export interface Tool {
  id: number
  name: string
  description: string
  category: string
  roles: string[]
  pricing: string
  url: string
  tags: string[]
}

export const tools: Tool[] = ${JSON.stringify(tools, null, 2)}

export function getCategoryData(toolsData: Tool[] = tools) {
  const categoryCounts = {}
  
  // Count tools in each category
  toolsData.forEach(tool => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1
  })
  
  // Return category data with actual counts
  return [
    { id: "all", name: "All Categories", count: toolsData.length },
    { id: "writing", name: "Writing & Content", count: categoryCounts.writing || 0 },
    { id: "image", name: "Image Generation", count: categoryCounts.image || 0 },
    { id: "coding", name: "Code & Development", count: categoryCounts.coding || 0 },
    { id: "analysis", name: "Data & Analysis", count: categoryCounts.analysis || 0 },
    { id: "audio", name: "Audio & Voice", count: categoryCounts.audio || 0 },
    { id: "video", name: "Video Creation", count: categoryCounts.video || 0 },
    { id: "design", name: "Design & Creative", count: categoryCounts.design || 0 },
    { id: "research", name: "Research & Learning", count: categoryCounts.research || 0 },
    { id: "automation", name: "Automation", count: categoryCounts.automation || 0 },
    { id: "collaboration", name: "Team & Collaboration", count: categoryCounts.collaboration || 0 },
  ]
}
`

// Write the TypeScript file
const outputPath = path.join(__dirname, '../lib/tools-data.ts')
fs.writeFileSync(outputPath, tsContent)

console.log(`Generated ${outputPath} with ${tools.length} tools`)

// Log category distribution
const categoryStats = {}
tools.forEach(tool => {
  categoryStats[tool.category] = (categoryStats[tool.category] || 0) + 1
})
console.log('Category distribution:', categoryStats)