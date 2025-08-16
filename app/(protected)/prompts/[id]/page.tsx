"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Bookmark, 
  Copy, 
  Check, 
  Calendar, 
  ChevronRight,
  Home,
  Layers
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getPromptById } from "@/lib/prompt-data"
import { PromptDetail } from "@/types/prompt"
import { AdditionalSectionRenderer } from "@/components/ui/additional-section-renderer"

// Helper to determine if prompt should be displayed as multi-step
function shouldShowMultiStep(prompt: PromptDetail | null): boolean {
  if (!prompt) return false
  return !!(prompt.steps && prompt.steps.length > 1)
}

// Helper to process markdown formatting in text
function processMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return text || ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>text</strong>
    .replace(/\*(.*?)\*\*:/g, '<strong>$1</strong>:') // Handle malformed *text**: pattern
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert *text* to <em>text</em>
}

export default function PromptDetailPage() {
  const params = useParams()
  const [prompt, setPrompt] = useState<PromptDetail | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedPrompts, setSavedPrompts] = useState<string[]>([])

  // Get info sections from prompt data
  const promptInfo = useMemo(() => {
    if (!prompt) return { howToUse: [], whatYouGet: [], expectedResults: [], variations: [] }
    
    return {
      howToUse: prompt.howToUse || [],
      whatYouGet: prompt.whatYouGet || [],
      expectedResults: prompt.expectedResults || [],
      variations: prompt.variations || []
    }
  }, [prompt])

  // Load saved prompts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPrompts')
      const savedList = saved ? JSON.parse(saved) : []
      setSavedPrompts(savedList)
    }
  }, [])

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setLoading(true)
        const promptId = params.id as string
        const promptData = await getPromptById(promptId)
        
        if (promptData) {
          console.log('Loaded prompt data:', {
            id: promptData.id,
            title: promptData.title,
            stepsCount: promptData.steps?.length,
            firstStepHasContent: !!promptData.steps?.[0]?.content,
            howToUseCount: promptData.howToUse?.length
          })
          setPrompt(promptData)
          // Check if prompt is in saved list
          const saved = localStorage.getItem('savedPrompts')
          const savedList = saved ? JSON.parse(saved) : []
          setIsBookmarked(savedList.includes(promptId))
        }
      } catch (error) {
        console.error('Error loading prompt:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPrompt()
  }, [params.id])

  const handleCopy = async (content: string, stepId?: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedStep(stepId || 'main')
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const toggleBookmark = () => {
    if (!prompt) return
    
    const newBookmarkState = !isBookmarked
    setIsBookmarked(newBookmarkState)
    
    // Update localStorage
    let updatedSavedPrompts: string[]
    if (newBookmarkState) {
      updatedSavedPrompts = [...savedPrompts, prompt.id]
    } else {
      updatedSavedPrompts = savedPrompts.filter(id => id !== prompt.id)
    }
    
    setSavedPrompts(updatedSavedPrompts)
    localStorage.setItem('savedPrompts', JSON.stringify(updatedSavedPrompts))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading prompt...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!prompt) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Prompt Not Found</h1>
          <p className="text-muted-foreground mb-6">The prompt you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/prompts">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Prompts
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <Home className="w-4 h-4 text-muted-foreground" />
          <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
          <Link href="/prompts" className="text-muted-foreground hover:text-foreground transition-colors">Prompts</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
          <span className="text-foreground font-medium">{prompt.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {prompt.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{prompt.shortDescription}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBookmark}
                    className={isBookmarked ? "text-primary" : "text-muted-foreground hover:text-muted-foreground"}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue={shouldShowMultiStep(prompt) ? "step-0" : "prompt"} className="space-y-6">
                  <TabsList className="grid w-full" style={{gridTemplateColumns: shouldShowMultiStep(prompt) ? `repeat(${prompt.steps!.length + 1}, 1fr)` : 'repeat(2, 1fr)'}}>
                    {/* Single Prompt Tab */}
                    {!shouldShowMultiStep(prompt) && (
                      <TabsTrigger value="prompt">Prompt</TabsTrigger>
                    )}
                    
                    {/* Multi-Step Tabs */}
                    {shouldShowMultiStep(prompt) && prompt.steps!.map((step, index) => (
                      <TabsTrigger key={index} value={`step-${index}`}>Step {index + 1}</TabsTrigger>
                    ))}
                    
                    {/* Info Tab */}
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>

                  {/* Single Prompt Content */}
                  {!shouldShowMultiStep(prompt) && (
                    <TabsContent value="prompt">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Complete Prompt</h3>
                        <Button
                          onClick={() => handleCopy(prompt.content || '', 'main')}
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          {copiedStep === 'main' ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-6 border border-border">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                          {prompt.content}
                        </pre>
                      </div>
                    </TabsContent>
                  )}

                  {/* Multi-Step Content */}
                  {shouldShowMultiStep(prompt) && prompt.steps!.map((step, index) => (
                    <TabsContent key={index} value={`step-${index}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {step.title || `Step ${step.stepNumber}`}
                          </h3>
                          {step.estimatedTime && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Estimated time: {step.estimatedTime}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleCopy(step.content || '', `step-${index}`)}
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          {copiedStep === `step-${index}` ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Step</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-6 border border-border">
                        {step.content ? (
                          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                            {step.content}
                          </pre>
                        ) : (
                          <div className="bg-yellow-500/10 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                              This step content is currently being prepared. Please check back soon for the complete step-by-step instructions.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}

                  {/* Info Tab */}
                  <TabsContent value="info">
                    <div className="space-y-8">
                      {/* How to Use */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">💡 How To Use</h3>
                        <ol className="space-y-2">
                          {promptInfo.howToUse.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* What You'll Get */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">🎯 What You&apos;ll Get</h3>
                        <ul className="space-y-2">
                          {promptInfo.whatYouGet.map((item, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <Check className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
                              <span className="text-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Expected Results */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">📈 Expected Results</h3>
                        <ul className="space-y-2">
                          {promptInfo.expectedResults.map((result, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                              <span className="text-foreground">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Variations */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">🔄 Variations</h3>
                        <ul className="space-y-2">
                          {promptInfo.variations.map((variation, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                              <span className="text-foreground" dangerouslySetInnerHTML={{ __html: processMarkdown(variation) }}></span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Additional Sections */}
                      {prompt.additionalSections && Object.keys(prompt.additionalSections).length > 0 && (
                        <div className="space-y-8">
                          {Object.entries(prompt.additionalSections)
                            .sort(([,a], [,b]) => a.order - b.order)
                            .map(([sectionKey, section]) => (
                              <AdditionalSectionRenderer
                                key={sectionKey}
                                title={section.title}
                                type={section.type || 'generic'}
                                icon={section.icon || '📄'}
                                parsedContent={section.parsedContent}
                                rawContent={section.content}
                              />
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-card border border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Prompt Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category and Type */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Category</h4>
                  <Badge variant="outline" className="bg-primary/10 border text-primary">
                    {prompt.category}
                  </Badge>
                </div>

                {/* Complexity and Type */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Details</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={prompt.complexity === "Beginner" ? "default" : prompt.complexity === "Intermediate" ? "secondary" : "destructive"}>
                      {prompt.complexity}
                    </Badge>
                    <Badge variant={prompt.type === "FREE" ? "default" : "secondary"}>
                      {prompt.type}
                    </Badge>
                    {shouldShowMultiStep(prompt) && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Layers className="w-3 h-3 mr-1" />
                        {prompt.steps!.length} Steps
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Multi-step titles */}
                {shouldShowMultiStep(prompt) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Workflow Steps</h4>
                    <ol className="space-y-1">
                      {prompt.steps!.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {step.title || `Step ${step.stepNumber}`}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Modified Date */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Updated</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{prompt.modifiedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Compatible Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {prompt.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Workflow Overview for multi-step */}
                {shouldShowMultiStep(prompt) && prompt.workflowOverview && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Workflow Overview</h4>
                    <p className="text-sm text-muted-foreground">{prompt.workflowOverview}</p>
                  </div>
                )}

                {/* What You Create for multi-step */}
                {shouldShowMultiStep(prompt) && prompt.whatYouCreate && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">What You&apos;ll Create</h4>
                    <p className="text-sm text-muted-foreground">{prompt.whatYouCreate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}