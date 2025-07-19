"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Star,
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
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")

  // Function to get icon for each tool
  const getToolIcon = (toolName: string) => {
    const iconMap: { [key: string]: any } = {
      "ChatGPT": MessageSquare,
      "Midjourney": Sparkles,
      "GitHub Copilot": Github,
      "Claude": Bot,
      "DALL-E 3": Camera,
      "Tableau GPT": PieChart,
      "Speechify": Headphones,
      "Loom": MonitorPlay,
      "Figma": Palette,
      "Notion AI": FileText,
      "Grammarly": Type,
      "Zapier": Zap,
      "Canva": Palette,
      "Stable Diffusion": ImageIcon,
      "Perplexity": Brain,
      "Runway ML": Video,
      "ElevenLabs": Mic,
      "Copy.ai": Type,
      "Jasper": FileText,
      "Otter.ai": Mic,
    }
    return iconMap[toolName] || Wrench
  }

  const categories = [
    { id: "all", name: "All Categories", count: 100, icon: Wrench },
    { id: "writing", name: "Writing & Content", count: 18, icon: FileText },
    { id: "image", name: "Image Generation", count: 15, icon: ImageIcon },
    { id: "coding", name: "Code & Development", count: 14, icon: Code },
    { id: "analysis", name: "Data & Analysis", count: 12, icon: BarChart3 },
    { id: "audio", name: "Audio & Voice", count: 10, icon: Mic },
    { id: "video", name: "Video Creation", count: 8, icon: Video },
    { id: "design", name: "Design & Creative", count: 7, icon: Palette },
    { id: "research", name: "Research & Learning", count: 6, icon: Brain },
    { id: "automation", name: "Automation", count: 5, icon: Zap },
    { id: "collaboration", name: "Team & Collaboration", count: 5, icon: Users },
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

  const tools = [
    {
      id: 1,
      name: "ChatGPT",
      description:
        "Advanced conversational AI for text generation, analysis, and problem-solving across various domains.",
      category: "writing",
      roles: ["developer", "writer", "marketer", "analyst"],
      rating: 4.8,
      users: "100M+",
      pricing: "Free + Paid",
      url: "https://chat.openai.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
      tags: ["conversation", "text generation", "analysis"],
    },
    {
      id: 2,
      name: "Midjourney",
      description: "AI-powered image generation tool that creates stunning artwork from text descriptions.",
      category: "image",
      roles: ["designer", "marketer", "entrepreneur"],
      rating: 4.7,
      users: "15M+",
      pricing: "Paid",
      url: "https://midjourney.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
      tags: ["image generation", "art", "creative"],
    },
    {
      id: 3,
      name: "GitHub Copilot",
      description: "AI pair programmer that helps you write code faster with intelligent suggestions and completions.",
      category: "coding",
      roles: ["developer"],
      rating: 4.6,
      users: "5M+",
      pricing: "Paid",
      url: "https://github.com/features/copilot",
      logo: "/placeholder.svg?height=40&width=40",
      featured: true,
      tags: ["coding", "programming", "development"],
    },
    {
      id: 4,
      name: "Claude",
      description: "Anthropic's AI assistant focused on helpful, harmless, and honest conversations.",
      category: "writing",
      roles: ["writer", "analyst", "manager"],
      rating: 4.7,
      users: "10M+",
      pricing: "Free + Paid",
      url: "https://claude.ai",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["conversation", "analysis", "writing"],
    },
    {
      id: 5,
      name: "DALL-E 3",
      description: "OpenAI's latest image generation model with improved accuracy and detail.",
      category: "image",
      roles: ["designer", "marketer"],
      rating: 4.5,
      users: "8M+",
      pricing: "Paid",
      url: "https://openai.com/dall-e-3",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["image generation", "AI art", "creative"],
    },
    {
      id: 6,
      name: "Tableau GPT",
      description: "AI-powered data visualization and analytics platform for business intelligence.",
      category: "analysis",
      roles: ["analyst", "manager"],
      rating: 4.4,
      users: "2M+",
      pricing: "Paid",
      url: "https://tableau.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["data visualization", "analytics", "business intelligence"],
    },
    {
      id: 7,
      name: "ElevenLabs",
      description: "Advanced AI voice synthesis for creating realistic speech from text.",
      category: "audio",
      roles: ["marketer", "entrepreneur"],
      rating: 4.6,
      users: "3M+",
      pricing: "Free + Paid",
      url: "https://elevenlabs.io",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["voice synthesis", "audio", "text-to-speech"],
    },
    {
      id: 8,
      name: "Runway ML",
      description: "AI-powered video editing and generation platform for creative professionals.",
      category: "video",
      roles: ["designer", "marketer"],
      rating: 4.3,
      users: "1M+",
      pricing: "Free + Paid",
      url: "https://runwayml.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["video editing", "AI video", "creative"],
    },
    {
      id: 9,
      name: "Figma AI",
      description: "AI-enhanced design tools integrated into Figma for faster prototyping and design.",
      category: "design",
      roles: ["designer"],
      rating: 4.5,
      users: "4M+",
      pricing: "Free + Paid",
      url: "https://figma.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["design", "prototyping", "UI/UX"],
    },
    {
      id: 10,
      name: "Perplexity AI",
      description: "AI-powered search engine that provides accurate answers with source citations.",
      category: "research",
      roles: ["analyst", "writer", "manager"],
      rating: 4.4,
      users: "5M+",
      pricing: "Free + Paid",
      url: "https://perplexity.ai",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["search", "research", "information"],
    },
    {
      id: 11,
      name: "Zapier AI",
      description: "Automate workflows between apps using AI-powered automation and integration.",
      category: "automation",
      roles: ["manager", "entrepreneur", "developer"],
      rating: 4.2,
      users: "6M+",
      pricing: "Free + Paid",
      url: "https://zapier.com",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["automation", "workflow", "integration"],
    },
    {
      id: 12,
      name: "Notion AI",
      description: "AI writing assistant integrated into Notion for enhanced productivity and content creation.",
      category: "writing",
      roles: ["writer", "manager", "entrepreneur"],
      rating: 4.3,
      users: "20M+",
      pricing: "Free + Paid",
      url: "https://notion.so",
      logo: "/placeholder.svg?height=40&width=40",
      featured: false,
      tags: ["productivity", "writing", "organization"],
    },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    const matchesRole = selectedRole === "all" || tool.roles.includes(selectedRole)

    return matchesSearch && matchesCategory && matchesRole
  })

  const featuredTools = tools.filter((tool) => tool.featured)

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

        {/* Search and Filters */}
        <Card className="bg-white border border-[#B0D3F3] shadow-lg py-2">
          <CardContent className="p-3">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tools, categories, or use cases..."
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
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.slice(1).map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className={`cursor-pointer bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200 ${
                  selectedCategory === category.id ? "border-purple-500 bg-purple-50" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
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

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {(() => {
                            const IconComponent = getToolIcon(tool.name)
                            return <IconComponent className="w-8 h-8 text-gray-600" />
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{tool.name}</span>
                            {tool.featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Featured
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{tool.rating}</span>
                            </div>
                            <span>{tool.users} users</span>
                          </div>
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
                      <Badge variant="secondary">{tool.pricing}</Badge>
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
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Card key={tool.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {(() => {
                            const IconComponent = getToolIcon(tool.name)
                            return <IconComponent className="w-8 h-8 text-gray-600" />
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{tool.name}</span>
                            <Badge className="bg-yellow-500 text-white">Featured</Badge>
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{tool.rating}</span>
                            </div>
                            <span>{tool.users} users</span>
                          </div>
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
                      <Badge variant="secondary">{tool.pricing}</Badge>
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
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            {categories.slice(1).map((category) => {
              const categoryTools = tools.filter((tool) => tool.category === category.id)
              if (categoryTools.length === 0) return null

              const IconComponent = category.icon
              return (
                <div key={category.id}>
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <Badge variant="outline">{categoryTools.length} tools</Badge>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categoryTools.slice(0, 6).map((tool) => (
                      <Card key={tool.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <img
                                  src={tool.logo || "/placeholder.svg"}
                                  alt={tool.name}
                                  className="w-8 h-8 rounded"
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                  <span>{tool.name}</span>
                                  {tool.featured && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                      Featured
                                    </Badge>
                                  )}
                                </CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{tool.rating}</span>
                                  </div>
                                  <span>{tool.users} users</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="line-clamp-2">{tool.description}</CardDescription>

                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{tool.pricing}</Badge>
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
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
