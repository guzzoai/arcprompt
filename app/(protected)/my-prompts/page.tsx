"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Download, Folder, User, Calendar, Eye, Bookmark, Code, PenTool, Briefcase, Palette, BarChart3, GraduationCap, Share2, Megaphone, Database, Layers } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPrompts } from "@/lib/prompt-data"
import { PromptDetail } from "@/types/prompt"

export default function MyPromptsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<{
    id: number
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    folder: string
    createdAt: string
    lastModified: string
    usage: number
  } | null>(null)
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    folder: "general",
  })
  const [savedPromptIds, setSavedPromptIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPrompts')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [savedPrompts, setSavedPrompts] = useState<PromptDetail[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)

  const folders = [
    { id: "all", name: "All Prompts", count: 12 },
    { id: "general", name: "General", count: 5 },
    { id: "work", name: "Work Projects", count: 4 },
    { id: "creative", name: "Creative Writing", count: 2 },
    { id: "learning", name: "Learning & Research", count: 1 },
  ]

  const [myPrompts, setMyPrompts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('myCustomPrompts')
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return [
    {
      id: 1,
      title: "Blog Post Outline Generator",
      description: "Creates detailed outlines for blog posts based on topic and target audience",
      content:
        "Create a comprehensive blog post outline for the topic '[TOPIC]' targeting '[AUDIENCE]'. Include: 1. Compelling headline options (3-5), 2. Introduction hook, 3. Main sections with subpoints, 4. Key takeaways, 5. Call-to-action suggestions. Make it SEO-friendly and engaging.",
      category: "Writing",
      tags: ["blogging", "content", "SEO"],
      folder: "work",
      createdAt: "2024-01-15",
      lastModified: "2024-01-16",
      usage: 23,
    },
    {
      id: 2,
      title: "Meeting Summary Assistant",
      description: "Summarizes meeting notes and extracts action items",
      content:
        "Analyze the following meeting notes and provide: 1. Executive summary (2-3 sentences), 2. Key decisions made, 3. Action items with responsible parties, 4. Follow-up questions or concerns, 5. Next meeting agenda suggestions. Format as a professional meeting summary.",
      category: "Business",
      tags: ["meetings", "productivity", "summary"],
      folder: "work",
      createdAt: "2024-01-14",
      lastModified: "2024-01-14",
      usage: 18,
    },
    {
      id: 3,
      title: "Character Development Helper",
      description: "Develops detailed character profiles for creative writing",
      content:
        "Create a detailed character profile for a '[CHARACTER_TYPE]' in a '[GENRE]' story. Include: 1. Physical description, 2. Personality traits and quirks, 3. Background and history, 4. Motivations and goals, 5. Relationships with other characters, 6. Character arc potential, 7. Dialogue style examples.",
      category: "Creative",
      tags: ["writing", "characters", "fiction"],
      folder: "creative",
      createdAt: "2024-01-13",
      lastModified: "2024-01-15",
      usage: 12,
    },
    {
      id: 4,
      title: "Code Review Checklist",
      description: "Comprehensive code review prompt for development teams",
      content:
        "Review the following code and provide feedback on: 1. Code quality and readability, 2. Performance considerations, 3. Security vulnerabilities, 4. Best practices adherence, 5. Testing coverage suggestions, 6. Documentation needs, 7. Refactoring opportunities. Provide specific examples and recommendations.",
      category: "Development",
      tags: ["code review", "development", "quality"],
      folder: "work",
      createdAt: "2024-01-12",
      lastModified: "2024-01-12",
      usage: 31,
    },
    {
      id: 5,
      title: "Learning Path Creator",
      description: "Creates structured learning paths for new skills",
      content:
        "Design a comprehensive learning path for '[SKILL/TOPIC]' suitable for '[SKILL_LEVEL]' learners. Include: 1. Prerequisites and foundational knowledge, 2. Learning objectives, 3. Structured curriculum with modules, 4. Recommended resources and materials, 5. Practice exercises and projects, 6. Assessment methods, 7. Timeline and milestones.",
      category: "Education",
      tags: ["learning", "education", "curriculum"],
      folder: "learning",
      createdAt: "2024-01-11",
      lastModified: "2024-01-13",
      usage: 8,
    },
    {
      id: 6,
      title: "Email Response Templates",
      description: "Professional email response templates for various scenarios",
      content:
        "Generate a professional email response for '[SCENARIO]' with the following requirements: 1. Appropriate tone and formality level, 2. Clear and concise message, 3. Proper structure (greeting, body, closing), 4. Action items or next steps, 5. Professional signature line. Adapt the style to match '[COMPANY_CULTURE]'.",
      category: "Communication",
      tags: ["email", "communication", "professional"],
      folder: "work",
      createdAt: "2024-01-10",
      lastModified: "2024-01-11",
      usage: 15,
    },
  ]
  })

  // Save custom prompts to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('myCustomPrompts', JSON.stringify(myPrompts))
    }
  }, [myPrompts])

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

  // Load saved prompts from the vault
  useEffect(() => {
    const loadSavedPrompts = async () => {
      if (savedPromptIds.length > 0) {
        setLoadingSaved(true)
        try {
          const result = await getPrompts({ page: 1, limit: 100 })
          const filtered = result.prompts.filter(prompt => savedPromptIds.includes(prompt.id))
          setSavedPrompts(filtered)
        } catch (error) {
          console.error('Error loading saved prompts:', error)
        } finally {
          setLoadingSaved(false)
        }
      } else {
        setSavedPrompts([])
      }
    }
    loadSavedPrompts()
  }, [savedPromptIds])

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('savedPrompts')
      setSavedPromptIds(saved ? JSON.parse(saved) : [])
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleCreatePrompt = () => {
    const prompt = {
      id: myPrompts.length + 1,
      ...newPrompt,
      tags: newPrompt.tags.split(",").map((tag) => tag.trim()),
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      usage: 0,
    }
    setMyPrompts([prompt, ...myPrompts])
    setNewPrompt({
      title: "",
      description: "",
      content: "",
      category: "",
      tags: "",
      folder: "general",
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeletePrompt = (id: number) => {
    setMyPrompts(myPrompts.filter((prompt: any) => prompt.id !== id))
  }

  const handleEditPrompt = (prompt: {
    id: number
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    folder: string
    createdAt: string
    lastModified: string
    usage: number
  }) => {
    router.push(`/my-prompts/edit?id=${prompt.id}`)
  }

  const handleViewPrompt = (prompt: {
    id: number
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    folder: string
    createdAt: string
    lastModified: string
    usage: number
  }) => {
    setSelectedPrompt(prompt)
    setIsViewDialogOpen(true)
  }

  const filteredPrompts = myPrompts.filter((prompt: any) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: any) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFolder = selectedFolder === "all" || prompt.folder === selectedFolder

    return matchesSearch && matchesFolder
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <User className="w-8 h-8 text-blue-600" />
              <span>My Prompts</span>
            </h1>
            <p className="text-gray-600 mt-2">Your saved prompts and custom creations in one place</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {myPrompts.length} Custom Prompts
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Prompt</DialogTitle>
                  <DialogDescription>Build a custom prompt for your specific needs</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter prompt title"
                        value={newPrompt.title}
                        onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newPrompt.category}
                        onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Writing">Writing</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Creative">Creative</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Communication">Communication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of what this prompt does"
                      value={newPrompt.description}
                      onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Prompt Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your prompt content here. Use [VARIABLES] for dynamic parts."
                      rows={6}
                      value={newPrompt.content}
                      onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="tag1, tag2, tag3"
                        value={newPrompt.tags}
                        onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="folder">Folder</Label>
                      <Select
                        value={newPrompt.folder}
                        onValueChange={(value) => setNewPrompt({ ...newPrompt, folder: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {folders.slice(1).map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePrompt} disabled={!newPrompt.title || !newPrompt.content}>
                      Create Prompt
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* View Prompt Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedPrompt?.title}</DialogTitle>
                  <DialogDescription>{selectedPrompt?.description}</DialogDescription>
                </DialogHeader>
                {selectedPrompt && (
                  <div className="space-y-6 mt-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-[#DBEAFE] border-[#B0D3F3] text-[#2563EB]">
                            {selectedPrompt.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Eye className="w-3 h-3" />
                            <span>{selectedPrompt.usage} uses</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Modified {selectedPrompt.lastModified}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{selectedPrompt.content}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrompt.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                        Close
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsViewDialogOpen(false)
                          handleEditPrompt(selectedPrompt)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Prompt
                      </Button>
                      <Button onClick={() => {
                        navigator.clipboard.writeText(selectedPrompt.content)
                        // You could add a toast notification here
                      }}>
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border border-[#B0D3F3] shadow-lg py-2">
          <CardContent className="p-3">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger className="w-48 h-10">
                    <Folder className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name} ({folder.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-10">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for saved vs created prompts */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">Saved from Vault ({savedPrompts.length})</TabsTrigger>
            <TabsTrigger value="created">My Creations ({myPrompts.length})</TabsTrigger>
          </TabsList>

          {/* Saved Prompts Tab */}
          <TabsContent value="saved" className="space-y-6">
            {loadingSaved ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
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
            ) : savedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedPrompts.map((prompt) => (
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
                        <Bookmark className="w-4 h-4 text-blue-600 fill-current" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex justify-center items-end p-0 px-6">
                      <Link href={`/prompts/${prompt.id}`} className="w-full">
                        <Button className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md">
                          <Eye className="w-4 h-4 mr-2" />
                          View Prompt
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved prompts yet</h3>
                <p className="text-gray-600 mb-4">Start bookmarking prompts from the Prompt Vault</p>
                <Link href="/prompts">
                  <Button>
                    <Database className="w-4 h-4 mr-2" />
                    Browse Prompt Vault
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Created Prompts Tab */}
          <TabsContent value="created" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt: any) => (
            <Card key={prompt.id} className="bg-white border border-[#B0D3F3] shadow-lg hover:shadow-xl hover:border-[#2563EB] transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{prompt.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{prompt.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditPrompt(prompt)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag: any) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Modified {prompt.lastModified}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Folder className="w-3 h-3" />
                    <span>{folders.find((f) => f.id === prompt.folder)?.name}</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button 
                    className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold transition-all duration-300 shadow-md"
                    onClick={() => handleViewPrompt(prompt)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>

            {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedFolder !== "all" ? "No prompts found" : "No prompts yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedFolder !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first custom prompt to get started"}
            </p>
            {!searchQuery && selectedFolder === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Prompt
              </Button>
            )}
          </div>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
