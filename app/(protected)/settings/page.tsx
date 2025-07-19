"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, CreditCard, Bell, Moon, Sun, Lock, Download } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || user?.email || "",
    email: user?.email || "",
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    emailNotifications: true,
    marketingEmails: false,
  })

  const [subscription] = useState({
    plan: "Free",
    status: "Active",
    nextBilling: null,
    amount: "$0.00",
  })

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log("Profile updated:", profile)
  }

  const handlePreferencesUpdate = () => {
    // Handle preferences update
    console.log("Preferences updated:", preferences)
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile & Preferences</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile & Preferences</span>
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
                      <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline">Change Photo</Button>
                      <p className="text-sm text-gray-600">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Preferences */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Notification Preferences</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications about your account activity</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Marketing Emails</Label>
                        <p className="text-sm text-gray-600">Receive updates about new courses and special offers</p>
                      </div>
                      <Switch
                        checked={preferences.marketingEmails}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Appearance */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Appearance</h3>
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center space-x-2">
                            <Sun className="w-4 h-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center space-x-2">
                            <Moon className="w-4 h-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Security */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Security</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Password</Label>
                      <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>

                {/* Single Save Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handleProfileUpdate()
                      handlePreferencesUpdate()
                    }}
                    className="px-8"
                  >
                    Save All Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription</span>
                </CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{subscription.plan} Plan</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{subscription.amount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoices
                  </Button>
                </div>

                {subscription.plan !== "Free" && (
                  <>
                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">Danger Zone</h4>
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">Cancel Subscription</h5>
                            <p className="text-sm text-gray-600">
                              You&apos;ll retain access until your current billing period ends
                            </p>
                          </div>
                          <Button variant="destructive">Cancel Plan</Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  )
}
