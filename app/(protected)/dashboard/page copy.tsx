"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Wrench, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const popularTools = [
    { name: "ChatGPT", category: "General AI", description: "Versatile conversational AI" },
    { name: "Claude", category: "Writing", description: "Advanced text generation" },
    { name: "Midjourney", category: "Image", description: "AI image generation" },
  ]

  const latestPrompts = [
    { id: 1, slug: "viral-content-creator", title: "Viral Content Creator", category: "Social Media", timeAgo: "2 hours ago" },
    { id: 2, slug: "facebook-ad-campaign-builder", title: "Facebook Ad Campaign Builder", category: "Advertising", timeAgo: "5 hours ago" },
    { id: 3, slug: "email-subject-line-optimizer", title: "Email Subject Line Optimizer", category: "Writing", timeAgo: "1 day ago" },
    { id: 4, slug: "product-description-writer", title: "Product Description Writer", category: "E-commerce", timeAgo: "2 days ago" },
  ]

  // const nextLessons = [
  //   { id: 1, title: "Advanced Prompt Chaining", chapter: "Chapter 4", duration: "8 min" },
  //   { id: 2, title: "Context Window Management", chapter: "Chapter 4", duration: "12 min" },
  //   { id: 3, title: "Role-Based Prompting", chapter: "Chapter 5", duration: "10 min" },
  // ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">Explore and manage your high-quality AI prompts.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Free Member
            </Badge>
            <Badge variant="outline">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Prompts</CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-2">Ready to use anytime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}

          {/* Latest Prompts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>Latest Prompts</span>
                </CardTitle>
                <CardDescription>Recently added to the vault</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {latestPrompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{prompt.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                          <span className="text-xs text-muted-foreground">{prompt.timeAgo}</span>
                        </div>
                      </div>
                      <Link href={`/prompts/${prompt.slug}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/prompts">
                    <Button variant="outline" className="w-full bg-transparent">
                      Browse All Prompts
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-purple-600" />
                  <span>Popular Tools</span>
                </CardTitle>
                <CardDescription>Most used by our community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularTools.map((tool, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{tool.description}</p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Explore
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/tools">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Tools
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/prompts/create">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Database className="w-4 h-4 mr-2" />
                    Create New Prompt
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Wrench className="w-4 h-4 mr-2" />
                    Discover Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
