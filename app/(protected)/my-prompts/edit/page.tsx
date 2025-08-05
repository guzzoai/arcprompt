"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, FileText, Folder, Hash, AlignLeft, Type, FolderOpen } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"

interface CustomPrompt {
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
}

export default function EditPromptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptId = searchParams.get("id")
  
  const [prompt, setPrompt] = useState<CustomPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
    folder: "general",
  })

  const folders = [
    { id: "general", name: "General" },
    { id: "work", name: "Work Projects" },
    { id: "creative", name: "Creative Writing" },
    { id: "learning", name: "Learning & Research" },
  ]

  const categories = [
    "Writing",
    "Business", 
    "Creative",
    "Development",
    "Education",
    "Communication"
  ]

  useEffect(() => {
    // Load prompt data from localStorage
    const loadPrompt = () => {
      if (!promptId) {
        router.push("/my-prompts")
        return
      }

      // Get prompts from localStorage (in a real app, this would be an API call)
      const storedPrompts = localStorage.getItem("myCustomPrompts")
      if (storedPrompts) {
        const prompts: CustomPrompt[] = JSON.parse(storedPrompts)
        const foundPrompt = prompts.find(p => p.id === parseInt(promptId))
        
        if (foundPrompt) {
          setPrompt(foundPrompt)
          setFormData({
            title: foundPrompt.title,
            description: foundPrompt.description,
            content: foundPrompt.content,
            category: foundPrompt.category,
            tags: foundPrompt.tags.join(", "),
            folder: foundPrompt.folder,
          })
        } else {
          router.push("/my-prompts")
        }
      }
      setLoading(false)
    }

    loadPrompt()
  }, [promptId, router])

  const handleSave = () => {
    if (!prompt || !formData.title || !formData.content) return

    setSaving(true)
    
    // Update prompt in localStorage
    const storedPrompts = localStorage.getItem("myCustomPrompts")
    if (storedPrompts) {
      const prompts: CustomPrompt[] = JSON.parse(storedPrompts)
      const updatedPrompts = prompts.map(p => 
        p.id === prompt.id 
          ? {
              ...p,
              ...formData,
              tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
              lastModified: new Date().toISOString().split("T")[0]
            }
          : p
      )
      localStorage.setItem("myCustomPrompts", JSON.stringify(updatedPrompts))
    }

    // Simulate save delay
    setTimeout(() => {
      setSaving(false)
      router.push("/my-prompts")
    }, 500)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading prompt...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/my-prompts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Prompts
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Prompt</h1>
              <p className="text-gray-600 mt-1">Update your custom prompt details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/my-prompts")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.content || saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-[#B0D3F3] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  <span>Prompt Details</span>
                </CardTitle>
                <CardDescription>
                  Edit the main information for your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span>Title</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title for your prompt"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center space-x-2">
                    <AlignLeft className="w-4 h-4 text-gray-500" />
                    <span>Description</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief description of what this prompt does"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-11"
                  />
                  <p className="text-sm text-gray-500">
                    Help others understand the purpose of this prompt
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>Prompt Content</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your prompt content here. Use [VARIABLES] for dynamic parts."
                    rows={12}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500">
                    Use square brackets like [TOPIC] or [AUDIENCE] for variable parts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            <Card className="bg-white border border-[#B0D3F3] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-[#2563EB]" />
                  <span>Organization</span>
                </CardTitle>
                <CardDescription>
                  Categorize and organize your prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="folder" className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-gray-500" />
                    <span>Folder</span>
                  </Label>
                  <Select
                    value={formData.folder}
                    onValueChange={(value) => setFormData({ ...formData, folder: value })}
                  >
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span>Tags</span>
                  </Label>
                  <Input
                    id="tags"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Info Card */}
            {prompt && (
              <Card className="bg-gray-50 border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700">Prompt Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium">{prompt.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Modified</span>
                    <span className="font-medium">{prompt.lastModified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Times Used</span>
                    <span className="font-medium">{prompt.usage}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}