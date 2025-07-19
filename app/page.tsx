"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Star, 
  Timer, 
  Target, 
  Zap,
  TrendingUp,
  Globe,
  Briefcase,
  PenTool,
  Code,
  Lightbulb,
  BarChart3,
  GraduationCap,
  Search,
  Share2,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const categories = [
    { 
      id: "writing", 
      name: "Writing & Content", 
      icon: PenTool, 
      color: "bg-blue-100 text-blue-700",
      subcategories: ["Blog Posts", "Email Copy", "Social Media", "Product Descriptions", "Press Releases"]
    },
    { 
      id: "marketing", 
      name: "Marketing & Sales", 
      icon: Target, 
      color: "bg-green-100 text-green-700",
      subcategories: ["Ad Copy", "Lead Generation", "Brand Strategy", "Customer Research", "Campaign Planning"]
    },
    { 
      id: "coding", 
      name: "Development & Tech", 
      icon: Code, 
      color: "bg-purple-100 text-purple-700",
      subcategories: ["Code Review", "Documentation", "Debugging", "API Design", "System Architecture"]
    },
    { 
      id: "business", 
      name: "Business Strategy", 
      icon: Briefcase, 
      color: "bg-orange-100 text-orange-700",
      subcategories: ["Business Plans", "Market Analysis", "Financial Modeling", "Process Optimization", "Team Management"]
    },
    { 
      id: "creative", 
      name: "Creative & Design", 
      icon: Lightbulb, 
      color: "bg-pink-100 text-pink-700",
      subcategories: ["Design Briefs", "Creative Concepts", "Brand Identity", "User Experience", "Visual Content"]
    },
    { 
      id: "analysis", 
      name: "Data & Analytics", 
      icon: BarChart3, 
      color: "bg-indigo-100 text-indigo-700",
      subcategories: ["Data Analysis", "Report Writing", "Trend Analysis", "Performance Metrics", "Predictive Modeling"]
    },
    { 
      id: "education", 
      name: "Education & Training", 
      icon: GraduationCap, 
      color: "bg-teal-100 text-teal-700",
      subcategories: ["Course Creation", "Learning Plans", "Assessment Design", "Skill Development", "Knowledge Transfer"]
    },
    { 
      id: "research", 
      name: "Research & Innovation", 
      icon: Search, 
      color: "bg-red-100 text-red-700",
      subcategories: ["Market Research", "Competitive Analysis", "Innovation Strategy", "Trend Identification", "Knowledge Discovery"]
    }
  ]

  const featuredPrompts = [
    {
      title: "Viral Content Creator",
      description: "Generates scroll-stopping post ideas with proven psychological triggers",
      category: "Social Media",
      result: "10x higher engagement rates",
      rating: 4.9,
      uses: 1247
    },
    {
      title: "Facebook Ad Campaign Builder", 
      description: "4-step comprehensive workflow for high-converting Facebook ads",
      category: "Advertising",
      result: "3x better ROAS",
      rating: 4.8,
      uses: 892
    },
    {
      title: "Email Subject Line Optimizer",
      description: "Generate compelling subject lines that increase open rates",
      category: "Email Marketing", 
      result: "65% higher open rates",
      rating: 4.7,
      uses: 756
    }
  ]

  const whyArcPrompt = [
    {
      icon: Timer,
      title: "Save 5+ Hours Weekly",
      description: "Stop starting from scratch. Our prompts give you professional results in minutes, not hours."
    },
    {
      icon: Target,
      title: "Proven Results",
      description: "Every prompt is tested and optimized by AI experts. Get consistently better outputs every time."
    },
    {
      icon: Users,
      title: "10,000+ Happy Users",
      description: "Join professionals from Fortune 500 companies who rely on our prompts for their daily work."
    },
    {
      icon: Zap,
      title: "10x Better Outputs",
      description: "Transform mediocre AI responses into professional-grade content that actually gets results."
    }
  ]

  const useCases = [
    {
      title: "Marketing Teams",
      description: "Create campaigns, write copy, and analyze performance 10x faster",
      icon: Share2,
      metrics: "Save 20+ hours per campaign"
    },
    {
      title: "Content Creators", 
      description: "Generate endless ideas and high-quality content that converts",
      icon: MessageSquare,
      metrics: "3x more content output"
    },
    {
      title: "Business Analysts",
      description: "Extract insights and create reports with precision and speed", 
      icon: BarChart3,
      metrics: "50% faster analysis"
    },
    {
      title: "Developers",
      description: "Write better code, documentation, and technical specifications",
      icon: Code,
      metrics: "Reduce debugging time by 60%"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ArcPrompt</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            170+ Professional AI Prompts
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your AI Results with <span className="text-blue-600">170+ Expert-Crafted Prompts</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time with mediocre AI outputs. Get professional-grade results from ChatGPT, Claude & Gemini with our battle-tested prompt library. Save 5+ hours weekly and 10x your productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/prompts">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Browse Prompts
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>10,000+ professionals trust ArcPrompt</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span>4.9/5 average rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span>Used in 50+ countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ArcPrompt?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who&apos;ve transformed their AI workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyArcPrompt.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Prompts That Drive Results
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our top-performing prompts can do for your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{prompt.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{prompt.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Result: {prompt.result}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{prompt.uses} uses</span>
                    <Link href="/prompts">
                      <Button size="sm" variant="outline">
                        View Prompt
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover prompts tailored to your specific needs and industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <p key={index} className="text-sm text-gray-600">• {sub}</p>
                    ))}
                    {category.subcategories.length > 3 && (
                      <p className="text-sm text-gray-500">+ {category.subcategories.length - 3} more</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/prompts">
              <Button size="lg" variant="outline">
                View All Categories
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Case Gallery */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Professional
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how different teams use ArcPrompt to supercharge their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <useCase.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{useCase.description}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {useCase.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your AI Results?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 10,000+ professionals who save 5+ hours weekly with our expert-crafted prompts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/prompts">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-600 text-gray-900 bg-white hover:bg-gray-100">
                Browse Library
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free 7-day trial</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ArcPrompt</span>
            </div>
            <p className="text-gray-600 mb-8">
              The professional AI prompt database trusted by 10,000+ users worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <Link href="/prompts" className="hover:text-gray-900">Browse Prompts</Link>
              <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="hover:text-gray-900">About</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}