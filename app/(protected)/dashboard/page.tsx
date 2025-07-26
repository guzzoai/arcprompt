"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Wrench, ChevronRight, Sparkles, Clock, Plus, Zap } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { getLatestPrompts } from "@/lib/prompt-data"
import { PromptDetail } from "@/types/prompt"

export default function DashboardPage() {
  const { user } = useAuth()
  const [latestPrompts, setLatestPrompts] = useState<PromptDetail[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const loadLatestPrompts = async () => {
      try {
        const prompts = await getLatestPrompts(4)
        setLatestPrompts(prompts)
      } catch (error) {
        console.error('Error loading latest prompts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadLatestPrompts()
  }, [])

  // const nextLessons = [
  //   { id: 1, title: "Advanced Prompt Chaining", chapter: "Chapter 4", duration: "8 min" },
  //   { id: 2, title: "Context Window Management", chapter: "Chapter 4", duration: "12 min" },
  //   { id: 3, title: "Role-Based Prompting", chapter: "Chapter 5", duration: "10 min" },
  // ]

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-[#DBEAFE] rounded-2xl p-8 border border-[#B0D3F3]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B0D3F3]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F3E0B0]/30 rounded-full blur-2xl"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#2563EB] rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
                </h1>
              </div>
              <p className="text-lg text-gray-700 ml-14">Explore and manage your high-quality AI prompts.</p>
            </div>
            <div className="flex flex-col space-y-3 mt-6 lg:mt-0 lg:items-end">
              <Link href="/settings">
                <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}

          {/* Latest Prompts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-[#B0D3F3] shadow-lg">
              <CardHeader className="bg-white rounded-t-lg pb-0">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-[#2563EB] rounded-lg">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">Latest Prompts</span>
                    <CardDescription className="mt-1 text-[#2563EB]">Recently added to the vault</CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-0 pt-0">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="animate-pulse p-4 bg-gray-50 border border-[#B0D3F3] rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                          <div className="w-16 h-8 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestPrompts.map((prompt, index) => (
                      <div key={prompt.id} className="group relative flex items-center justify-between p-4 bg-gray-50 border border-[#B0D3F3] rounded-xl hover:bg-gray-100 hover:border-[#2563EB] transition-all duration-300 hover:shadow-md">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#B0D3F3] rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-[#2563EB]">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#2563EB] transition-colors">{prompt.title}</h4>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" className="text-xs bg-white border-[#B0D3F3] text-[#2563EB] group-hover:bg-[#F3E0B0]/50">{prompt.category}</Badge>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{prompt.modifiedDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link href={`/prompts/${prompt.id}`}>
                          <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-md">
                            <Sparkles className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Link href="/prompts">
                    <Button variant="outline" className="w-full h-12 bg-white hover:bg-[#DBEAFE] border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                      <Database className="w-4 h-4 mr-2" />
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
            {/* Quick Actions */}
            <Card className="bg-white border border-[#B0D3F3] shadow-lg">
              <CardHeader className="bg-white rounded-t-lg pb-0">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-[#2563EB] rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-0 pt-0">
                <div className="flex flex-col gap-4">
                  <Link href="/my-prompts">
                    <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-[#F3E0B0]/30 border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                      <Plus className="w-4 h-4 mr-3" />
                      Create New Prompt
                    </Button>
                  </Link>
                  
                  <Link href="/tools">
                    <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-[#F3E0B0]/30 border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                      <Wrench className="w-4 h-4 mr-3" />
                      Discover Tools
                    </Button>
                  </Link>
                  
                  <Link href="/prompts">
                    <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-[#F3E0B0]/30 border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                      <Database className="w-4 h-4 mr-3" />
                      Explore Prompts
                    </Button>
                  </Link>
                  
                  <Link href="/my-prompts">
                    <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-[#F3E0B0]/30 border-2 border-[#B0D3F3] text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-all duration-300">
                      <Database className="w-4 h-4 mr-3" />
                      My Prompts
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
