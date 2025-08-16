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
import { SimpleThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const categories = [
    { 
      id: "writing", 
      name: "Writing & Content", 
      icon: PenTool, 
      color: "bg-primary/10 text-primary dark:bg-primary/20",
      subcategories: ["Blog Posts", "Email Copy", "Social Media", "Product Descriptions", "Press Releases"]
    },
    { 
      id: "marketing", 
      name: "Marketing & Sales", 
      icon: Target, 
      color: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400",
      subcategories: ["Ad Copy", "Lead Generation", "Brand Strategy", "Customer Research", "Campaign Planning"]
    },
    { 
      id: "coding", 
      name: "Development & Tech", 
      icon: Code, 
      color: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
      subcategories: ["Code Review", "Documentation", "Debugging", "API Design", "System Architecture"]
    },
    { 
      id: "business", 
      name: "Business Strategy", 
      icon: Briefcase, 
      color: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
      subcategories: ["Business Plans", "Market Analysis", "Financial Modeling", "Process Optimization", "Team Management"]
    },
    { 
      id: "creative", 
      name: "Creative & Design", 
      icon: Lightbulb, 
      color: "bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
      subcategories: ["Design Briefs", "Creative Concepts", "Brand Identity", "User Experience", "Visual Content"]
    },
    { 
      id: "analysis", 
      name: "Data & Analytics", 
      icon: BarChart3, 
      color: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
      subcategories: ["Data Analysis", "Report Writing", "Trend Analysis", "Performance Metrics", "Predictive Modeling"]
    },
    { 
      id: "education", 
      name: "Education & Training", 
      icon: GraduationCap, 
      color: "bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400",
      subcategories: ["Course Creation", "Learning Plans", "Assessment Design", "Skill Development", "Knowledge Transfer"]
    },
    { 
      id: "research", 
      name: "Research & Innovation", 
      icon: Search, 
      color: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 dark:from-primary/10 dark:via-background dark:to-purple-500/10">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ArcPrompt</span>
          </div>
          <div className="flex items-center space-x-2">
            <SimpleThemeToggle />
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
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            170+ Professional AI Prompts
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Transform Your AI Results with <span className="text-blue-600">170+ Expert-Crafted Prompts</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ArcPrompt?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who&apos;ve transformed their AI workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyArcPrompt.map((item, index) => (
              <Card key={index} className="bg-card border shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Prompts That Drive Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our top-performing prompts can do for your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt, index) => (
              <Card key={index} className="bg-card border shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{prompt.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{prompt.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Result: {prompt.result}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover prompts tailored to your specific needs and industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-card border shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <p key={index} className="text-sm text-muted-foreground">• {sub}</p>
                    ))}
                    {category.subcategories.length > 3 && (
                      <p className="text-sm text-muted-foreground">+ {category.subcategories.length - 3} more</p>
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
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perfect for Every Professional
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how different teams use ArcPrompt to supercharge their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card border shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <useCase.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{useCase.description}</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    {useCase.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your AI Results?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
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
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 bg-background text-foreground hover:bg-accent">
                Browse Library
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-primary-foreground/60">
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
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ArcPrompt</span>
            </div>
            <p className="text-muted-foreground mb-8">
              The professional AI prompt database trusted by 10,000+ users worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <Link href="/prompts" className="hover:text-foreground">Browse Prompts</Link>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link href="/about" className="hover:text-foreground">About</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}