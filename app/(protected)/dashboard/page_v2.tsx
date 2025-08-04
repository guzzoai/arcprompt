"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Wrench, ChevronRight, TrendingUp, Sparkles, Clock, Star, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const popularTools = [
    { name: "ChatGPT", category: "General AI", description: "Versatile conversational AI", color: "bg-green-500", icon: "💬" },
    { name: "Claude", category: "Writing", description: "Advanced text generation", color: "bg-purple-500", icon: "✍️" },
    { name: "Midjourney", category: "Image", description: "AI image generation", color: "bg-pink-500", icon: "🎨" },
  ]

  const latestPrompts = [
    { id: 1, slug: "viral-content-creator", title: "Viral Content Creator", category: "Social Media", timeAgo: "2 hours ago", isNew: true },
    { id: 2, slug: "facebook-ad-campaign-builder", title: "Facebook Ad Campaign Builder", category: "Advertising", timeAgo: "5 hours ago", isNew: true },
    { id: 3, slug: "email-subject-line-optimizer", title: "Email Subject Line Optimizer", category: "Writing", timeAgo: "1 day ago" },
    { id: 4, slug: "product-description-writer", title: "Product Description Writer", category: "E-commerce", timeAgo: "2 days ago" },
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Social Media": "bg-blue-100 text-blue-700",
      "Advertising": "bg-orange-100 text-orange-700",
      "Writing": "bg-purple-100 text-purple-700",
      "E-commerce": "bg-green-100 text-green-700"
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section with Gradient Background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-white to-purple-50 p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-purple-200/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}! 
                <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Explore and manage your high-quality AI prompts.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-1.5">
                <Sparkles className="w-3 h-3 mr-1" />
                Free Member
              </Badge>
              <Badge variant="outline" className="border-gray-300">
                <Clock className="w-3 h-3 mr-1" />
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-100">Saved Prompts</CardTitle>
              <div className="bg-white/20 p-2 rounded-lg">
                <Database className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-teal-100 mt-2 flex items-center">
                Ready to use anytime
                <TrendingUp className="w-3 h-3 ml-1" />
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Tools Explored</CardTitle>
              <div className="bg-white/20 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-purple-100 mt-2">Start exploring today</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Prompts Created</CardTitle>
              <div className="bg-white/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-orange-100 mt-2">Share your creativity</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Prompts with Enhanced Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-teal-600 p-2 rounded-lg">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <span>Latest Prompts</span>
                  <Badge variant="secondary" className="ml-auto bg-teal-100 text-teal-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Fresh
                  </Badge>
                </CardTitle>
                <CardDescription>Recently added to the vault</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {latestPrompts.map((prompt) => (
                    <div key={prompt.id} className="group relative flex items-center justify-between p-4 border border-[#B0D3F3] rounded-xl hover:border-[#2563EB] hover:shadow-md transition-all duration-300 bg-white">
                      {prompt.isNew && (
                        <div className="absolute -top-2 -left-2">
                          <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">NEW</Badge>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-base text-gray-900 group-hover:text-teal-700 transition-colors">{prompt.title}</h4>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge variant="outline" className={`text-xs border-0 ${getCategoryColor(prompt.category)}`}>
                            {prompt.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {prompt.timeAgo}
                          </span>
                        </div>
                      </div>
                      <Link href={`/prompts/${prompt.slug}`}>
                        <Button size="sm" variant="ghost" className="group-hover:bg-teal-50 group-hover:text-teal-700">
                          View
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/prompts">
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Browse All Prompts
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Enhanced Cards */}
          <div className="space-y-6">
            {/* Popular Tools */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <span>Popular Tools</span>
                </CardTitle>
                <CardDescription>Most used by our community</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {popularTools.map((tool, index) => (
                    <div key={index} className="group p-4 border border-[#B0D3F3] rounded-xl hover:border-[#2563EB] hover:shadow-md transition-all duration-300 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
                            <span className="text-lg">{tool.icon}</span>
                          </div>
                          <h4 className="font-semibold text-base">{tool.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <Button size="sm" variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
                        Explore
                        <Star className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/tools">
                    <Button variant="outline" className="w-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700">
                      View All Tools
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions with Icons */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/prompts/create">
                  <Button variant="outline" className="w-full justify-start bg-white hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all duration-300 group">
                    <Database className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Create New Prompt
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 group">
                    <Wrench className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Discover Tools
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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