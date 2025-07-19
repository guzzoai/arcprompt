"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Copy, Bookmark, Filter, TrendingUp, Database, Heart, Eye, Lock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

export default function PromptsPage() {
  const { user } = useAuth()
  
  // For demo purposes, treating all users as free - can be changed based on user.user_metadata
  const isFreePlan = true // Change this logic based on your user plan detection
  
  // Function to determine if a prompt is unlocked (for demo purposes)
  const isPromptUnlocked = (promptId: number) => {
    // Make prompts with IDs 1, 3, and 5 unlocked for demo
    return [1, 3, 5].includes(promptId)
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [savedPrompts, setSavedPrompts] = useState<number[]>([1, 3, 7])

  const categories = [
    { id: "all", name: "All Categories", count: 170 },
    { id: "writing", name: "Writing", count: 28 },
    { id: "marketing", name: "Marketing", count: 24 },
    { id: "coding", name: "Coding", count: 22 },
    { id: "business", name: "Business", count: 20 },
    { id: "creative", name: "Creative", count: 18 },
    { id: "analysis", name: "Analysis", count: 16 },
    { id: "education", name: "Education", count: 14 },
    { id: "research", name: "Research", count: 12 },
    { id: "productivity", name: "Productivity", count: 10 },
    { id: "social", name: "Social Media", count: 6 },
  ]

  const prompts = [
    {
      id: 1,
      title: "Content Marketing Strategy Generator",
      description:
        "Create comprehensive content marketing strategies tailored to your business goals and target audience.",
      category: "Marketing",
      tags: ["strategy", "content", "planning"],
      usage: 1247,
      rating: 4.8,
      preview:
        "Act as a content marketing strategist. Create a comprehensive content marketing strategy for [BUSINESS TYPE] targeting [TARGET AUDIENCE]...",
      author: "Sarah Chen",
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      title: "Code Review Assistant",
      description: "Get detailed code reviews with suggestions for improvements, best practices, and potential issues.",
      category: "Coding",
      tags: ["code review", "debugging", "best practices"],
      usage: 892,
      rating: 4.9,
      preview: "You are an expert code reviewer. Please review the following code and provide detailed feedback on...",
      author: "Mike Rodriguez",
      dateAdded: "2024-01-14",
    },
    {
      id: 3,
      title: "Email Subject Line Optimizer",
      description: "Generate compelling email subject lines that increase open rates and engagement.",
      category: "Writing",
      tags: ["email", "copywriting", "optimization"],
      usage: 756,
      rating: 4.7,
      preview: "Create 10 compelling email subject lines for [EMAIL TYPE] targeting [AUDIENCE]. Focus on...",
      author: "Emma Thompson",
      dateAdded: "2024-01-13",
    },
    {
      id: 4,
      title: "Business Plan Generator",
      description:
        "Create detailed business plans with market analysis, financial projections, and strategic planning.",
      category: "Business",
      tags: ["business plan", "strategy", "planning"],
      usage: 634,
      rating: 4.6,
      preview: "Act as a business consultant. Help me create a comprehensive business plan for [BUSINESS IDEA]...",
      author: "David Kim",
      dateAdded: "2024-01-12",
    },
    {
      id: 5,
      title: "Creative Story Starter",
      description: "Generate unique story ideas, character development, and plot outlines for creative writing.",
      category: "Creative",
      tags: ["storytelling", "creative writing", "fiction"],
      usage: 523,
      rating: 4.8,
      preview: "You are a creative writing mentor. Help me develop a story with the following elements...",
      author: "Lisa Park",
      dateAdded: "2024-01-11",
    },
    {
      id: 6,
      title: "Data Analysis Interpreter",
      description: "Analyze datasets and provide insights, trends, and actionable recommendations.",
      category: "Analysis",
      tags: ["data analysis", "insights", "reporting"],
      usage: 445,
      rating: 4.7,
      preview: "Act as a data analyst. Analyze the following dataset and provide key insights...",
      author: "Alex Johnson",
      dateAdded: "2024-01-10",
    },
    {
      id: 7,
      title: "Learning Path Creator",
      description: "Design personalized learning paths for any skill or subject with structured progression.",
      category: "Education",
      tags: ["learning", "education", "curriculum"],
      usage: 389,
      rating: 4.9,
      preview: "Create a comprehensive learning path for [SKILL/SUBJECT] suitable for [SKILL LEVEL]...",
      author: "Rachel Green",
      dateAdded: "2024-01-09",
    },
    {
      id: 8,
      title: "Social Media Content Planner",
      description: "Plan and create engaging social media content across multiple platforms.",
      category: "Social Media",
      tags: ["social media", "content planning", "engagement"],
      usage: 312,
      rating: 4.5,
      preview: "Act as a social media manager. Create a content calendar for [PLATFORM] focusing on...",
      author: "Tom Wilson",
      dateAdded: "2024-01-08",
    },
  ]

  const toggleSavePrompt = (promptId: number) => {
    setSavedPrompts((prev) => (prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId]))
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || prompt.category.toLowerCase() === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case "popular":
        return b.usage - a.usage
      case "rating":
        return b.rating - a.rating
      case "alphabetical":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Database className="w-8 h-8 text-teal-600" />
              <span>Prompt Vault</span>
            </h1>
            <p className="text-gray-600 mt-2">170+ professionally crafted prompts ready to use in your AI workflows</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800">
              {prompts.length} Prompts Available
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border border-[#B0D3F3] shadow-lg py-2">
          <CardContent className="p-3">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search prompts, categories, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 h-10">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Prompts</TabsTrigger>
            <TabsTrigger value="saved">My Saved ({savedPrompts.length})</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 flex flex-col h-[300px] gap-0">
                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{prompt.title}</CardTitle>
                        <div className="mt-2">
                          <Badge variant="outline" className="mb-2 bg-[#DBEAFE] border-[#B0D3F3] text-[#2563EB]">{prompt.category}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSavePrompt(prompt.id)}
                        className={savedPrompts.includes(prompt.id) ? "text-blue-600" : "text-gray-400"}
                      >
                        {savedPrompts.includes(prompt.id) ? (
                          <Bookmark className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between p-0 pb-4 px-6">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2 border-t mt-3">
                      {isFreePlan && !isPromptUnlocked(prompt.id) ? (
                        <Button variant="outline" className="w-full h-12 bg-white hover:bg-[#DBEAFE] border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock Prompt
                        </Button>
                      ) : (
                        <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md">
                          <Eye className="w-4 h-4 mr-2" />
                          View Prompt
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedPrompts
                .filter((prompt) => savedPrompts.includes(prompt.id))
                .map((prompt) => (
                  <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{prompt.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">{prompt.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSavePrompt(prompt.id)}
                          className="text-yellow-600"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{prompt.category}</Badge>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{prompt.usage}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{prompt.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-3">{prompt.preview}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-gray-500">by {prompt.author}</div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {savedPrompts.length === 0 && (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved prompts yet</h3>
                <p className="text-gray-600">Start saving prompts to build your personal collection</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedPrompts
                .sort((a, b) => b.usage - a.usage)
                .slice(0, 9)
                .map((prompt) => (
                  <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight flex items-center space-x-2">
                            <span>{prompt.title}</span>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">{prompt.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSavePrompt(prompt.id)}
                          className={savedPrompts.includes(prompt.id) ? "text-yellow-600" : "text-gray-400"}
                        >
                          {savedPrompts.includes(prompt.id) ? (
                            <Heart className="w-4 h-4 fill-current" />
                          ) : (
                            <Heart className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{prompt.category}</Badge>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{prompt.usage}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{prompt.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-3">{prompt.preview}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-gray-500">by {prompt.author}</div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
