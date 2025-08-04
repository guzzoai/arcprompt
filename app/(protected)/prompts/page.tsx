"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bookmark, Filter, TrendingUp, Database, Eye, Lock, Megaphone, Code, PenTool, Briefcase, Palette, BarChart3, GraduationCap, Share2, Layers } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { getPrompts, getCategories, getPopularPrompts } from "@/lib/prompt-data"
import { PromptDetail } from "@/types/prompt"

export default function PromptsPage() {
  const { } = useAuth()
  
  // State for data
  const [prompts, setPrompts] = useState<PromptDetail[]>([])
  const [categories, setCategories] = useState<Array<{ id: string, name: string, slug: string, count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [popularPrompts, setPopularPrompts] = useState<PromptDetail[]>([])
  
  // For demo purposes, treating all users as free - can be changed based on user.user_metadata
  const isFreePlan = true // Change this logic based on your user plan detection
  
  // Function to determine if a prompt is unlocked (for demo purposes)
  const isPromptUnlocked = () => {
    // For now, all prompts are unlocked for demo - can add logic later
    return true
  }

  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Marketing": <Megaphone className="w-5 h-5 text-[#2563EB]" />,
      "Coding": <Code className="w-5 h-5 text-[#2563EB]" />,
      "Writing": <PenTool className="w-5 h-5 text-[#2563EB]" />,
      "Business": <Briefcase className="w-5 h-5 text-[#2563EB]" />,
      "Creative": <Palette className="w-5 h-5 text-[#2563EB]" />,
      "Analysis": <BarChart3 className="w-5 h-5 text-[#2563EB]" />,
      "Education": <GraduationCap className="w-5 h-5 text-[#2563EB]" />,
      "Social Media": <Share2 className="w-5 h-5 text-[#2563EB]" />
    }
    return iconMap[category] || <Database className="w-5 h-5 text-[#2563EB]" />
  }
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [savedPrompts, setSavedPrompts] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPrompts')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts))
    }
  }, [savedPrompts])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load prompts, categories, and popular prompts in parallel
        const [promptsResult, categoriesResult, popularResult] = await Promise.all([
          getPrompts({
            page: 1,
            limit: 100, // Show more prompts - can add pagination later
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            search: searchQuery || undefined,
            sortBy: sortBy as 'newest' | 'popular' | 'rating'
          }),
          getCategories(),
          getPopularPrompts(10)
        ])
        
        setPrompts(promptsResult.prompts)
        setCategories([
          { id: "all", name: "All Categories", slug: "all", count: promptsResult.total },
          ...categoriesResult
        ])
        setPopularPrompts(popularResult)
        
      } catch (error) {
        console.error('Error loading prompt data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [selectedCategory, searchQuery, sortBy])

  const toggleSavePrompt = (promptId: string) => {
    setSavedPrompts((prev) => (prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId]))
  }

  // Prompts are already filtered and sorted by the backend
  const sortedPrompts = prompts

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
            <p className="text-gray-600 mt-2">{categories.find(c => c.id === 'all')?.count || 0}+ professionally crafted prompts ready to use in your AI workflows</p>
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
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="bg-white border border-[#B0D3F3] shadow-lg animate-pulse min-h-[280px]">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex justify-center items-end p-0 px-6">
                      <div className="w-full h-12 bg-gray-300 rounded mb-6"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 flex flex-col gap-0 min-h-[280px]">
                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getCategoryIcon(prompt.category)}
                          </div>
                          <span>{prompt.title}</span>
                        </CardTitle>
                        <div className="mt-2 ml-8">
                          <Badge variant="outline" className="mb-2 bg-[#DBEAFE] border-[#B0D3F3] text-[#2563EB]">{prompt.category}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2 ml-8">{prompt.shortDescription}</CardDescription>
                        <div className="flex flex-wrap gap-1 ml-8 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {prompt.complexity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.type}
                          </Badge>
                          {prompt.steps && prompt.steps.length > 0 && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                              <Layers className="w-3 h-3 mr-1" />
                              {prompt.steps.length} Steps
                            </Badge>
                          )}
                        </div>
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
                  <CardContent className="flex-1 flex justify-center items-end p-0 px-6">
                    {isFreePlan && !isPromptUnlocked() ? (
                      <Button variant="outline" className="w-full h-12 bg-white hover:bg-[#DBEAFE] border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Prompt
                      </Button>
                    ) : (
                      <Link href={`/prompts/${prompt.id}`} className="w-full">
                        <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md">
                          <Eye className="w-4 h-4 mr-2" />
                          View Prompt
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedPrompts
                .filter((prompt) => savedPrompts.includes(prompt.id))
                .map((prompt) => (
                  <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 flex flex-col gap-0 min-h-[280px]">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getCategoryIcon(prompt.category)}
                            </div>
                            <span>{prompt.title}</span>
                          </CardTitle>
                          <div className="mt-2 ml-8">
                            <Badge variant="outline" className="mb-2 bg-[#DBEAFE] border-[#B0D3F3] text-[#2563EB]">{prompt.category}</Badge>
                          </div>
                          <CardDescription className="line-clamp-2 ml-8">{prompt.shortDescription}</CardDescription>
                          <div className="flex flex-wrap gap-1 ml-8 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {prompt.complexity}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {prompt.type}
                            </Badge>
                            {prompt.steps && prompt.steps.length > 0 && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                <Layers className="w-3 h-3 mr-1" />
                                {prompt.steps.length} Steps
                              </Badge>
                            )}
                          </div>
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
                    <CardContent className="flex-1 flex justify-center items-end p-0 px-6">
                      {isFreePlan && !isPromptUnlocked() ? (
                        <Button variant="outline" className="w-full h-12 bg-white hover:bg-[#DBEAFE] border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock Prompt
                        </Button>
                      ) : (
                        <Link href={`/prompts/${prompt.id}`} className="w-full">
                          <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md">
                            <Eye className="w-4 h-4 mr-2" />
                            View Prompt
                          </Button>
                        </Link>
                      )}
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
              {popularPrompts.map((prompt) => (
                  <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 flex flex-col gap-0 min-h-[280px]">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getCategoryIcon(prompt.category)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>{prompt.title}</span>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                          </CardTitle>
                          <div className="mt-2 ml-8">
                            <Badge variant="outline" className="mb-2 bg-[#DBEAFE] border-[#B0D3F3] text-[#2563EB]">{prompt.category}</Badge>
                          </div>
                          <CardDescription className="line-clamp-2 ml-8">{prompt.shortDescription}</CardDescription>
                          <div className="flex flex-wrap gap-1 ml-8 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {prompt.complexity}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {prompt.type}
                            </Badge>
                            {prompt.steps && prompt.steps.length > 0 && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                <Layers className="w-3 h-3 mr-1" />
                                {prompt.steps.length} Steps
                              </Badge>
                            )}
                          </div>
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
                    <CardContent className="flex-1 flex justify-center items-end p-0 px-6">
                      {isFreePlan && !isPromptUnlocked() ? (
                        <Button variant="outline" className="w-full h-12 bg-white hover:bg-[#DBEAFE] border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock Prompt
                        </Button>
                      ) : (
                        <Link href={`/prompts/${prompt.id}`} className="w-full">
                          <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md">
                            <Eye className="w-4 h-4 mr-2" />
                            View Prompt
                          </Button>
                        </Link>
                      )}
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
