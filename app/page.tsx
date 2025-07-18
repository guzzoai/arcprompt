import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Trophy, Zap, FileText, Megaphone, Code, Briefcase, Lightbulb, BarChart3, Eye } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const featuredPrompts = [
    {
      id: 1,
      title: "Content Marketing Strategy Generator",
      description:
        "Create comprehensive content marketing strategies tailored to your business goals and target audience.",
      category: "Marketing",
      tags: ["strategy", "content", "planning"],
      usage: 1247,
      rating: 4.8,
      preview:
        "Act as a content marketing strategist. Create a comprehensive content marketing strategy for [BUSINESS TYPE] targeting [TARGET AUDIENCE]...",
      author: "Sarah Chen",
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      title: "Code Review Assistant",
      description: "Get detailed code reviews with suggestions for improvements, best practices, and potential issues.",
      category: "Coding",
      tags: ["code review", "debugging", "best practices"],
      usage: 892,
      rating: 4.9,
      preview: "You are an expert code reviewer. Please review the following code and provide detailed feedback on...",
      author: "Mike Rodriguez",
      dateAdded: "2024-01-14",
    },
    {
      id: 3,
      title: "Email Subject Line Optimizer",
      description: "Generate compelling email subject lines that increase open rates and engagement.",
      category: "Writing",
      tags: ["email", "copywriting", "optimization"],
      usage: 756,
      rating: 4.7,
      preview: "Create 10 compelling email subject lines for [EMAIL TYPE] targeting [AUDIENCE]. Focus on...",
      author: "Emma Thompson",
      dateAdded: "2024-01-13",
    },
  ]

  const categories = [
    { id: "writing", name: "Writing", icon: FileText },
    { id: "marketing", name: "Marketing", icon: Megaphone },
    { id: "coding", name: "Coding", icon: Code },
    { id: "business", name: "Business", icon: Briefcase },
    { id: "creative", name: "Creative", icon: Lightbulb },
    { id: "analysis", name: "Analysis", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Unlock AI Potential</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Access a Curated <span className="text-blue-600">AI Prompt Database</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover, save, and manage 170+ professionally crafted prompts across multiple categories to enhance your AI
            interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Explore Prompts Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Industry Leading</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Prompts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore some of our top-rated and most popular prompts to get started.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt) => (
              <Card key={prompt.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{prompt.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">{prompt.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 line-clamp-3">{prompt.preview}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <Badge variant="outline">{prompt.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{prompt.rating}</span>
                    </div>
                  </div>
                  <Link href="/register" className="block mt-4">
                    <Button className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Prompt
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/register">
              <Button variant="outline" size="lg" className="bg-transparent">
                Browse All Prompts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find prompts tailored to your specific needs across various domains.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link key={category.id} href="/register">
                  <Card className="cursor-pointer transition-colors hover:bg-blue-50">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-medium text-lg">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/register">
              <Button variant="outline" size="lg" className="bg-transparent">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA to Pricing */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Unlock Full Potential?</h2>
          <p className="text-xl opacity-90 mb-8">
            Upgrade to Pro to access our complete prompt vault, advanced features, and priority support.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ArcPrompt</span>
              </div>
              <p className="text-gray-400">Master AI prompting with structured learning and practical resources.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/prompts" className="hover:text-white">
                    Prompt Vault
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white">
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ArcPrompt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
