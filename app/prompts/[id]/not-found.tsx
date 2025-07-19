import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="text-center py-20">
        <FileQuestion className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Prompt Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The prompt you&apos;re looking for doesn&apos;t exist or may have been removed from our vault.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/prompts">
            <Button size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Prompt Vault
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}