"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ExternalLink,
  Filter,
  Wrench,
  ImageIcon,
  FileText,
  Code,
  BarChart3,
  Mic,
  Video,
  Palette,
  Brain,
  Zap,
  Users,
  MessageSquare,
  Sparkles,
  Github,
  Bot,
  Camera,
  PieChart,
  Music,
  MonitorPlay,
  Lightbulb,
  Shield,
  Database,
  Type,
  Headphones,
  PenTool,
  Wand2,
  Terminal,
  TrendingUp,
  AudioWaveform,
  PlayCircle,
  Brush,
  BookOpen,
  Settings,
  UsersRound,
  ArrowUpDown,
  Grid3X3,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { tools, getCategoryData, type Tool } from "@/lib/tools-data"

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [sortBy, setSortBy] = useState("category") // "az" or "category"

  // Function to get icon for each tool based on its category
  const getToolIcon = (category: string) => {
    const categoryIconMap: { [key: string]: any } = {
      "writing": PenTool,
      "image": Wand2,
      "coding": Terminal,
      "analysis": TrendingUp,
      "audio": AudioWaveform,
      "video": PlayCircle,
      "design": Brush,
      "research": BookOpen,
      "automation": Settings,
      "collaboration": UsersRound,
    }
    return categoryIconMap[category] || Wrench
  }

  const categoryData = getCategoryData(tools)
  const categories = [
    { id: "all", name: "All Categories", count: categoryData.find(c => c.id === "all")?.count || 0, icon: Wrench },
    { id: "writing", name: "Writing & Content", count: categoryData.find(c => c.id === "writing")?.count || 0, icon: PenTool },
    { id: "image", name: "Image Generation", count: categoryData.find(c => c.id === "image")?.count || 0, icon: Wand2 },
    { id: "coding", name: "Code & Development", count: categoryData.find(c => c.id === "coding")?.count || 0, icon: Terminal },
    { id: "analysis", name: "Data & Analysis", count: categoryData.find(c => c.id === "analysis")?.count || 0, icon: TrendingUp },
    { id: "audio", name: "Audio & Voice", count: categoryData.find(c => c.id === "audio")?.count || 0, icon: AudioWaveform },
    { id: "video", name: "Video Creation", count: categoryData.find(c => c.id === "video")?.count || 0, icon: PlayCircle },
    { id: "design", name: "Design & Creative", count: categoryData.find(c => c.id === "design")?.count || 0, icon: Brush },
    { id: "research", name: "Research & Learning", count: categoryData.find(c => c.id === "research")?.count || 0, icon: BookOpen },
    { id: "automation", name: "Automation", count: categoryData.find(c => c.id === "automation")?.count || 0, icon: Settings },
    { id: "collaboration", name: "Team & Collaboration", count: categoryData.find(c => c.id === "collaboration")?.count || 0, icon: UsersRound },
  ]

  const roles = [
    { id: "all", name: "All Roles" },
    { id: "developer", name: "Developer" },
    { id: "marketer", name: "Marketer" },
    { id: "designer", name: "Designer" },
    { id: "writer", name: "Writer" },
    { id: "analyst", name: "Data Analyst" },
    { id: "manager", name: "Project Manager" },
    { id: "entrepreneur", name: "Entrepreneur" },
  ]

  // Get featured tools - 1 from each of the top 6 categories by count
  const getFeaturedTools = () => {
    const topCategories = categories
      .filter(c => c.id !== 'all')
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
    
    return topCategories.map(category => 
      tools.find(tool => tool.category === category.id)
    ).filter(Boolean) as Tool[]
  }

  const featuredTools = getFeaturedTools()

  // Filter and sort tools for All Tools tab
  const getFilteredAndSortedTools = () => {
    let filtered = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      const matchesRole = selectedRole === "all" || tool.roles.includes(selectedRole)

      return matchesSearch && matchesCategory && matchesRole
    })

    // Apply sorting
    if (sortBy === "az") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "category") {
      filtered = filtered.sort((a, b) => {
        const categoryComparison = a.category.localeCompare(b.category)
        if (categoryComparison === 0) {
          return a.name.localeCompare(b.name)
        }
        return categoryComparison
      })
    }

    return filtered
  }

  const filteredTools = getFilteredAndSortedTools()

  // Handle search - automatically switch to All Tools tab
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value.trim() && activeTab !== "all") {
      setActiveTab("all")
    }
  }

  // Handle category selection from home page
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      setActiveTab("all")
      setSelectedCategory("all")
    } else {
      setActiveTab("all")
      setSelectedCategory(categoryId)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Wrench className="w-8 h-8 text-purple-600" />
              <span>AI Tools Directory</span>
            </h1>
            <p className="text-gray-600 mt-2">Discover and explore the best AI tools for your workflow</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {tools.length} Tools Available
            </Badge>
          </div>
        </div>

        {/* Global Search Bar */}
        <Card className="bg-white border border-[#B0D3F3] shadow-lg py-2">
          <CardContent className="p-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tools, categories, or use cases..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="all">All Tools</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-8">
            {/* Categories Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* All Tools Category Card */}
                <Card
                  className="cursor-pointer bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 bg-gradient-to-br from-purple-50 to-blue-50"
                  onClick={() => handleCategoryClick("all")}
                >
                  <CardContent className="p-4 text-center">
                    <Wrench className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-medium text-sm">All Tools</h3>
                    <p className="text-xs text-gray-600 mt-1">{tools.length} tools</p>
                  </CardContent>
                </Card>

                {/* Regular Category Cards */}
                {categories.slice(1).map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <IconComponent className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-medium text-sm">{category.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{category.count} tools</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Featured Tools */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Tools</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredTools.map((tool) => (
                  <Card key={tool.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {(() => {
                              const IconComponent = getToolIcon(tool.category)
                              return <IconComponent className="w-8 h-8 text-purple-600" />
                            })()}
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center space-x-2">
                              <span>{tool.name}</span>
                              <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-3">{tool.description}</CardDescription>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {categories.find((c) => c.id === tool.category)?.name || tool.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs truncate max-w-[120px]" title={tool.pricing}>
                          {tool.pricing.length > 20 ? tool.pricing.substring(0, 20) + '...' : tool.pricing}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-gray-500">
                          For:{" "}
                          {tool.roles
                            .slice(0, 2)
                            .map((role) => roles.find((r) => r.id === role)?.name)
                            .join(", ")}
                          {tool.roles.length > 2 && ` +${tool.roles.length - 2} more`}
                        </div>
                        <Button size="sm" asChild>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Visit
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* All Tools Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Filters and Sorting */}
            <Card className="bg-white border border-[#B0D3F3] shadow-lg py-2">
              <CardContent className="p-3">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex gap-2 flex-1">
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

                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-40 h-10">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 h-10">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">By Category</SelectItem>
                        <SelectItem value="az">A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Showing {filteredTools.length} of {tools.length} tools
                </div>
              </CardContent>
            </Card>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {(() => {
                            const IconComponent = getToolIcon(tool.category)
                            return <IconComponent className="w-8 h-8 text-purple-600" />
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {tool.name}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-3">{tool.description}</CardDescription>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {categories.find((c) => c.id === tool.category)?.name || tool.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs truncate max-w-[120px]" title={tool.pricing}>
                        {tool.pricing.length > 20 ? tool.pricing.substring(0, 20) + '...' : tool.pricing}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        For:{" "}
                        {tool.roles
                          .slice(0, 2)
                          .map((role) => roles.find((r) => r.id === role)?.name)
                          .join(", ")}
                        {tool.roles.length > 2 && ` +${tool.roles.length - 2} more`}
                      </div>
                      <Button size="sm" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No tools found</div>
                <div className="text-gray-400 text-sm">Try adjusting your search or filters</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}