"use client"

import { useState, useEffect } from "react"
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
  Eye, 
  Clock, 
  ChevronRight,
  Home,
  Star,
  Users,
  Layers
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getPromptById } from "@/lib/prompt-data"
import { PromptDetail } from "@/types/prompt"

export default function PromptDetailPage() {
  const params = useParams()
  const [prompt, setPrompt] = useState<PromptDetail | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        setLoading(true)
        const promptId = params.id as string
        const promptData = await getPromptById(promptId)
        
        if (promptData) {
          setPrompt(promptData)
          setIsBookmarked(promptData.isBookmarked || false)
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
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading prompt...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!prompt) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prompt Not Found</h1>
          <p className="text-gray-600 mb-6">The prompt you're looking for doesn't exist or has been removed.</p>
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
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <Link href="/prompts" className="hover:text-gray-700">Prompts</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{prompt.title}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {prompt.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">{prompt.shortDescription}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{prompt.category}</Badge>
                      <Badge variant={prompt.complexity === "Beginner" ? "default" : prompt.complexity === "Intermediate" ? "secondary" : "destructive"}>
                        {prompt.complexity}
                      </Badge>
                      <Badge variant={prompt.type === "FREE" ? "default" : "secondary"}>
                        {prompt.type}
                      </Badge>
                      {prompt.steps && prompt.steps.length > 1 && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Layers className="w-3 h-3 mr-1" />
                          {prompt.steps.length} Steps
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBookmark}
                    className={isBookmarked ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs defaultValue={prompt.steps && prompt.steps.length > 1 ? "step-0" : "prompt"} className="w-full">
                  <TabsList className={`grid w-full ${
                    !prompt.steps || prompt.steps.length <= 1 
                      ? 'grid-cols-2' 
                      : prompt.steps.length === 2 
                      ? 'grid-cols-3'
                      : prompt.steps.length === 3
                      ? 'grid-cols-4'
                      : prompt.steps.length === 4
                      ? 'grid-cols-5'
                      : 'grid-cols-6'
                  }`}>
                    {/* Single Prompt Tab */}
                    {(!prompt.steps || prompt.steps.length <= 1) && (
                      <TabsTrigger value="prompt">Prompt</TabsTrigger>
                    )}
                    
                    {/* Multi-Step Tabs */}
                    {prompt.steps && prompt.steps.length > 1 && prompt.steps.map((step, index) => (
                      <TabsTrigger key={index} value={`step-${index}`}>
                        Step {index + 1}
                      </TabsTrigger>
                    ))}
                    
                    {/* Info Tab */}
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>

                  {/* Single Prompt Content */}
                  {(!prompt.steps || prompt.steps.length <= 1) && (
                    <TabsContent value="prompt" className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Complete Prompt</h3>
                        <Button
                          onClick={() => handleCopy(prompt.content, 'main')}
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
                      <div className="bg-gray-50 rounded-lg p-6 border">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                          {prompt.content}
                        </pre>
                      </div>
                    </TabsContent>
                  )}

                  {/* Multi-Step Content */}
                  {prompt.steps && prompt.steps.length > 1 && prompt.steps.map((step, index) => (
                    <TabsContent key={index} value={`step-${index}`} className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {step.title || `Step ${step.stepNumber}`}
                          </h3>
                          {step.estimatedTime && (
                            <p className="text-sm text-gray-500 mt-1">
                              Estimated time: {step.estimatedTime}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleCopy(step.content || prompt.content, `step-${index}`)}
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
                      <div className="bg-gray-50 rounded-lg p-6 border">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                          {step.content || prompt.content || "This step content is currently being prepared. Please check back soon for the complete step-by-step instructions."}
                        </pre>
                      </div>
                    </TabsContent>
                  ))}

                  {/* Info Tab */}
                  <TabsContent value="info" className="mt-6">
                    <div className="space-y-8">
                      {/* How to Use */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 How To Use</h3>
                        {prompt.howToUse && prompt.howToUse.length > 0 ? (
                          <ol className="space-y-2">
                            {prompt.howToUse.map((step, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 mb-3 text-sm italic">Basic usage instructions</p>
                            <ol className="space-y-2 text-gray-600">
                              <li className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                                <span>Copy the prompt above by clicking the "Copy Prompt" button</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                                <span>Paste it into your preferred AI platform ({prompt.platforms.join(', ')})</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                                <span>Fill in any placeholders with your specific information</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">4</span>
                                <span>Review and refine the results as needed</span>
                              </li>
                            </ol>
                          </div>
                        )}
                      </div>

                      {/* What You'll Get */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 What You'll Get</h3>
                        {prompt.whatYouGet && prompt.whatYouGet.length > 0 ? (
                          <ul className="space-y-2">
                            {prompt.whatYouGet.map((item, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <Check className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 text-sm">Detailed outcomes will be available soon.</p>
                          </div>
                        )}
                      </div>

                      {/* Expected Results */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Expected Results</h3>
                        {prompt.expectedResults && prompt.expectedResults.length > 0 ? (
                          <ul className="space-y-2">
                            {prompt.expectedResults.map((result, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <span className="text-gray-700">{result}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 text-sm">Performance metrics will be available soon.</p>
                          </div>
                        )}
                      </div>

                      {/* Variations */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Variations</h3>
                        {prompt.variations && prompt.variations.length > 0 ? (
                          <ul className="space-y-2">
                            {prompt.variations.map((variation, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                <span className="text-gray-700">{variation}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 text-sm">Prompt variations will be available soon.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Prompt Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Rating</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">4.8</span>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Views</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{prompt.viewCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Users</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">2.1k</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Est. Time</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{prompt.estimatedTime}</span>
                  </div>
                </div>

                {/* Modified Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Updated</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{prompt.modifiedDate}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Compatible Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {prompt.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Workflow Overview for multi-step */}
                {prompt.steps && prompt.steps.length > 1 && prompt.workflowOverview && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Workflow Overview</h4>
                    <p className="text-sm text-gray-600">{prompt.workflowOverview}</p>
                  </div>
                )}

                {/* What You Create for multi-step */}
                {prompt.steps && prompt.steps.length > 1 && prompt.whatYouCreate && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">What You'll Create</h4>
                    <p className="text-sm text-gray-600">{prompt.whatYouCreate}</p>
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