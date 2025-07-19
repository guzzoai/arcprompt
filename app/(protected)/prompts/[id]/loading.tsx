import { DashboardLayout } from "@/components/dashboard-layout"

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg">
              {/* Tabs Skeleton */}
              <div className="border-b p-2">
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}