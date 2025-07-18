"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Wrench, TrendingUp, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Simple auth check
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show nothing while redirecting to login
  if (!user) {
    return null
  }

  const recommendedTools = [
    { name: "ChatGPT", category: "General AI", description: "Versatile conversational AI" },
    { name: "Claude", category: "Writing", description: "Advanced text generation" },
    { name: "Midjourney", category: "Image", description: "AI image generation" },
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Explore and manage your high-quality AI prompts.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Free Member
            </Badge>
            <Badge variant="outline">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Prompts</CardTitle>
              <Database className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600 mt-2">Ready to use anytime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools Explored</CardTitle>
              <Wrench className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600 mt-2">AI tools discovered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-gray-600 mt-2">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}

          {/* Recent Prompts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-teal-600" />
                  <span>Recently Accessed Prompts</span>
                </CardTitle>
                <CardDescription>Your most recent prompt interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No prompts accessed yet</p>
                    <p className="text-sm">Start exploring to see your recent prompts here</p>
                  </div>
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
            {/* Recommended Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-purple-600" />
                  <span>Recommended Tools</span>
                </CardTitle>
                <CardDescription>Based on your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedTools.map((tool, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{tool.description}</p>
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
