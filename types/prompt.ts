export interface PromptStep {
  stepNumber: number
  title: string
  content: string
  estimatedTime?: string
}

export interface PromptDetail {
  id: string
  title: string
  shortDescription: string
  category: string
  complexity: "Beginner" | "Intermediate" | "Advanced"
  type: "FREE" | "PRO"
  platforms: string[]
  estimatedTime?: string
  viewCount: number
  modifiedDate: string
  isBookmarked?: boolean
  
  // Content
  content?: string // Raw content from database
  singlePrompt?: string // For single-step prompts
  steps?: PromptStep[] // For multi-step prompts
  
  // Info tab content
  howToUse: string[]
  whatYouGet: string[]
  expectedResults: string[]
  variations: string[]
  
  // Additional sections - all extra content from markdown
  additionalSections: Record<string, {
    title: string
    content: string
    order: number
    type?: string
    icon?: string
    parsedContent?: Array<{ type: 'text' | 'list' | 'scenario' | 'metric'; content: string; items?: string[] }>
  }>
  
  // Multi-step specific
  workflowOverview?: string
  whatYouCreate?: string
}