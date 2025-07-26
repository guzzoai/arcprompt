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
  Home
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
          <p className="text-gray-600 mb-6">The prompt you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/prompts">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Prompt Vault
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isMultiStep = prompt.steps && prompt.steps.length > 0
  const tabTriggers = []

  if (isMultiStep && prompt.steps) {
    prompt.steps.forEach((step) => {
      tabTriggers.push({
        value: `step-${step.stepNumber}`,
        label: `STEP ${step.stepNumber}`
      })
    })
  } else {
    tabTriggers.push({
      value: 'prompt',
      label: 'PROMPT'
    })
  }

  tabTriggers.push({
    value: 'info',
    label: 'INFO'
  })

  // Add PRO TIPS tab if additional sections exist
  if (prompt?.additionalSections && Object.keys(prompt.additionalSections).length > 0) {
    tabTriggers.push({
      value: 'pro-tips',
      label: 'PRO TIPS'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/prompts" className="hover:text-gray-900">
            Prompt Vault
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{prompt.title}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
              <Badge 
                className={`${prompt.type === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}
              >
                {prompt.type}
              </Badge>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
              {prompt.shortDescription}
            </p>
          </div>
          <Link href="/prompts">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Tabbed Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={tabTriggers[0].value} className="w-full space-y-6">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabTriggers.length}, minmax(0, 1fr))` }}>
                {tabTriggers.map((trigger) => (
                  <TabsTrigger key={trigger.value} value={trigger.value} className="text-sm font-medium">
                    {trigger.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <Card className="bg-white border border-[#B0D3F3] shadow-lg">
                <CardContent className="p-0">

                  {/* Single Prompt Tab */}
                  {!isMultiStep && (
                    <TabsContent value="prompt" className="p-0">
                      <div className="px-6 pt-6 pb-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Copy & Paste Prompt</h3>
                          <Button 
                            onClick={() => handleCopy(prompt.singlePrompt || prompt.content || '', 'main')}
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
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          {(prompt.singlePrompt || prompt.content) ? (
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                              {prompt.singlePrompt || prompt.content}
                            </pre>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 mb-4">Prompt content is currently being prepared.</p>
                              <p className="text-sm text-gray-400">
                                Please check back later or contact support if this issue persists.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Multi-Step Tabs */}
                  {isMultiStep && prompt.steps?.map((step) => (
                    <TabsContent key={`step-${step.stepNumber}`} value={`step-${step.stepNumber}`} className="p-0">
                      <div className="px-6 pt-6 pb-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{step.title || `Step ${step.stepNumber}`}</h3>
                            {step.estimatedTime && (
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <Clock className="w-4 h-4 mr-1" />
                                {step.estimatedTime}
                              </p>
                            )}
                          </div>
                          <Button 
                            onClick={() => handleCopy(step.content || prompt.singlePrompt || '', `step-${step.stepNumber}`)}
                            className="flex items-center space-x-2"
                          >
                            {copiedStep === `step-${step.stepNumber}` ? (
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
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          {step.content ? (
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                              {step.content}
                            </pre>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 mb-4">This step content is currently being prepared.</p>
                              <p className="text-sm text-gray-400">
                                In the meantime, you can use the main prompt above and adapt it for this specific step.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  ))}

                  {/* Info Tab */}
                  <TabsContent value="info" className="p-0">
                    <div className="px-6 pt-6 pb-6 space-y-8">
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
                            <p className="text-gray-500 mb-3 text-sm italic">Generic usage instructions (prompt-specific guidance not available)</p>
                            <ol className="space-y-2 text-gray-600">
                              <li className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                                <span>Copy the prompt above by clicking the &quot;Copy Prompt&quot; button</span>
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 What You&apos;ll Get</h3>
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
                            <p className="text-gray-500 mb-3 text-sm italic">Generic benefits (prompt-specific outcomes not available)</p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start space-x-3">
                                <Check className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                                <span>High-quality, structured output tailored to your needs</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <Check className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                                <span>Professional-grade content that meets industry standards</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <Check className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                                <span>Time-saving solution that delivers consistent results</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <Check className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" />
                                <span>Customizable framework for various use cases</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Expected Results */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Expected Results</h3>
                        {prompt.expectedResults && prompt.expectedResults.length > 0 ? (
                          <ul className="space-y-2">
                            {prompt.expectedResults.map((result, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                <span className="text-gray-700">{result}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 mb-3 text-sm italic">Generic expected results (prompt-specific metrics not available)</p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Improved efficiency and productivity in your workflow</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Higher quality outputs with professional standards</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Consistent results that align with your objectives</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Reduced trial-and-error time with proven techniques</span>
                              </li>
                            </ul>
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
                                <div className="flex-shrink-0 w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                                <span className="text-gray-700">{variation}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 border border-dashed">
                            <p className="text-gray-500 mb-3 text-sm italic">Generic variations (prompt-specific adaptations not available)</p>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Adjust the tone to match your brand voice (formal, casual, friendly)</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Modify the length and depth based on your specific needs</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Customize for different audiences or market segments</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span>Adapt for various platforms and content formats</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>
                  </TabsContent>

                  {/* PRO TIPS Tab */}
                  <TabsContent value="pro-tips" className="p-0">
                    <div className="px-6 pt-6 pb-6 space-y-8">
                      {/* Additional Sections */}
                      {prompt.additionalSections && Object.keys(prompt.additionalSections).length > 0 && (
                        <>
                          {Object.entries(prompt.additionalSections)
                            .sort(([, a], [, b]) => a.order - b.order)
                            .map(([key, section]) => (
                              <div key={key}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  {section.title}
                                </h3>
                                <div className="prose prose-gray max-w-none">
                                  <div 
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ 
                                      __html: section.content
                                        .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                        .split('\n\n')
                                        .map(section => {
                                          if (section.trim().startsWith('```')) {
                                            const content = section.replace(/^```\n/, '').replace(/\n```$/, '');
                                            const items = content.split('\n').filter(line => line.trim());
                                            const listItems = items.map(item => {
                                              if (item.trim().startsWith('- ')) {
                                                return `<li class="flex items-start space-x-3 mb-2"><div class="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div><span>${item.replace(/^- /, '')}</span></li>`;
                                              }
                                              return `<div class="font-medium mb-3 mt-3">${item}</div>`;
                                            }).join('');
                                            return `<div class="mb-4">${listItems}</div>`;
                                          } else if (section.includes('\n- ')) {
                                            const lines = section.split('\n');
                                            let html = '';
                                            for (const line of lines) {
                                              if (line.trim().startsWith('- ')) {
                                                html += `<li class="flex items-start space-x-3 mb-2"><div class="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div><span>${line.replace(/^- /, '')}</span></li>`;
                                              } else if (line.trim()) {
                                                html += `<div class="font-medium mb-3 mt-3">${line}</div>`;
                                              }
                                            }
                                            return `<div class="mb-4">${html}</div>`;
                                          } else if (section.trim()) {
                                            return `<div class="mb-4">${section}</div>`;
                                          }
                                          return '';
                                        })
                                        .join('')
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>

          {/* Right Column - Metadata */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Prompt Info */}
              <Card className="bg-white border border-[#B0D3F3] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Prompt Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="mt-1">
                      <Badge variant="outline">{prompt.category}</Badge>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Complexity</label>
                    <p className="mt-1">
                      <Badge className={prompt.complexity === 'Beginner' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {prompt.complexity}
                      </Badge>
                    </p>
                  </div>

                  {prompt.estimatedTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estimated Time</label>
                      <p className="mt-1 flex items-center text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-1" />
                        {prompt.estimatedTime}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Platforms</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prompt.platforms.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Updated {prompt.modifiedDate}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {prompt.viewCount} views
                    </div>
                  </div>

                  <Button 
                    onClick={toggleBookmark}
                    variant={isBookmarked ? "default" : "outline"}
                    className="w-full"
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                </CardContent>
              </Card>

              {/* Multi-step specific info */}
              {isMultiStep && (
                <Card className="bg-white border border-[#B0D3F3] shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Workflow Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prompt.workflowOverview && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {prompt.workflowOverview}
                      </p>
                    )}
                    
                    {prompt.whatYouCreate && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">What You&apos;ll Create:</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {prompt.whatYouCreate}
                        </p>
                      </div>
                    )}

                    {prompt.steps && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Steps:</h4>
                        <div className="space-y-2">
                          {prompt.steps.map((step) => (
                            <div key={step.stepNumber} className="flex items-start space-x-2 text-sm">
                              <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
                                {step.stepNumber}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">{step.title}</p>
                                {step.estimatedTime && (
                                  <p className="text-gray-500 text-xs">{step.estimatedTime}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}