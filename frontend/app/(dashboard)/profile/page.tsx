"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Edit,
  Shield,
  BookCopy,
  Clock,
  CheckCircle,
} from "lucide-react"
import { apiService } from "@/lib/api-service"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [recentBorrowings, setRecentBorrowings] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      // Fetch recent borrowings
      const fetchBorrowings = async () => {
        setIsLoading(true)
        try {
          const borrowings = await apiService.getBorrowRequests()
          setRecentBorrowings(borrowings.slice(0, 5))
        } catch (error) {
          console.error("Failed to fetch borrowings:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchBorrowings()
    }
  }, [isAuthenticated, router])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Get user initials for avatar
  const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "GU"

  // Format join date (mock data for now)
  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="bg-[#1E1E1E] border-[#333333] lg:col-span-1 h-fit">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <Avatar className="h-24 w-24 mb-4 border-4 border-[#4CAF50]/20">
              <AvatarFallback className="bg-[#4CAF50]/20 text-[#4CAF50] text-2xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Role
                </span>
                <Badge className="bg-[#4CAF50]">{user.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Joined
                </span>
                <span>{joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <BookCopy className="h-4 w-4" /> Books Borrowed
                </span>
                <span>12</span>
              </div>
            </div>
          </CardContent>
          <Separator className="my-2 bg-[#333333]" />
          <CardFooter className="flex flex-col gap-2 pt-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#1E1E1E] border-[#333333]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="borrowings">Borrowings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#4CAF50]" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                      <p>
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h3>
                      <p>{user.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#4CAF50]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-[#2A2A2A] animate-pulse rounded-md"></div>
                      ))}
                    </div>
                  ) : recentBorrowings.length > 0 ? (
                    <div className="space-y-3">
                      {recentBorrowings.map((borrowing) => (
                        <div
                          key={borrowing.borrowId}
                          className="flex items-center gap-3 p-3 rounded-md bg-[#2A2A2A]/50"
                        >
                          {borrowing.status === "APPROVED" ? (
                            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
                          ) : borrowing.status === "PENDING" ? (
                            <Clock className="h-8 w-8 text-amber-500 shrink-0" />
                          ) : (
                            <BookCopy className="h-8 w-8 text-blue-500 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{borrowing.book.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(borrowing.borrowDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={
                              borrowing.status === "APPROVED"
                                ? "bg-green-500"
                                : borrowing.status === "PENDING"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }
                          >
                            {borrowing.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No recent activity to display</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/borrowings")}>
                    View All Borrowings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Borrowings Tab */}
            <TabsContent value="borrowings" className="mt-6">
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader>
                  <CardTitle>Your Borrowing History</CardTitle>
                  <CardDescription>View all your past and current borrowings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="default"
                    className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    onClick={() => router.push("/borrowings")}
                  >
                    Go to Borrowings Page
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-[#4CAF50]" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Edit Profile</h3>
                        <p className="text-sm text-muted-foreground">Update your personal information</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <Separator className="bg-[#333333]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Change Password</h3>
                        <p className="text-sm text-muted-foreground">Update your password</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                    <Separator className="bg-[#333333]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-red-500">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

