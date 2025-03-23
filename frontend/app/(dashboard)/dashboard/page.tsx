"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Users, ShoppingCart, TrendingUp, BookCopy, AlertTriangle, RefreshCw } from "lucide-react"
import RecentActivities from "@/components/recent-activities"
import InventoryAlerts from "@/components/inventory-alerts"
import SalesChart from "@/components/sales-chart"
import PopularBooksChart from "@/components/popular-books-chart"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    activeUsers: 0,
    booksOnLoan: 0,
    monthlySales: 0,
    salesGrowth: 0,
  })

  const isAdmin = useMemo(() => user?.role === "admin", [user])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock API call to fetch dashboard data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setDashboardData({
          totalBooks: 2543,
          activeUsers: 1274,
          booksOnLoan: 342,
          monthlySales: 12543,
          salesGrowth: 18.2,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  // Refresh dashboard data
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Mock API call to refresh dashboard data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDashboardData({
        totalBooks: 2548,
        activeUsers: 1280,
        booksOnLoan: 339,
        monthlySales: 12650,
        salesGrowth: 19.5,
      })

      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Render different dashboard based on user role
  if (!isAdmin) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
          <p className="text-muted-foreground">Welcome to your library account</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Borrowed Books</CardTitle>
              <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 bg-[#333333]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">1 due for return soon</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reading History</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 bg-[#333333]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Books read this year</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 bg-[#333333]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Unread notifications</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <CardTitle>My Recent Activity</CardTitle>
            <CardDescription>Your recent borrowing and reading history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#333333]" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full bg-[#333333]" />
                      <Skeleton className="h-3 w-24 bg-[#333333]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RecentActivities userOnly={true} />
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of your library management system</p>
        </div>
        <Button
          variant="outline"
          className="bg-[#1E1E1E] border-[#333333] self-start sm:self-auto"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-[#333333]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.totalBooks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12 added this month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-[#333333]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+32 new users this month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Books on Loan</CardTitle>
                <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-[#333333]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.booksOnLoan.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">24 due for return today</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 bg-[#333333]" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.monthlySales)}</div>
                    <div className="flex items-center text-xs text-green-500">
                      <TrendingUp className="mr-1 h-3 w-3" />+{dashboardData.salesGrowth}% from last month
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="bg-[#1E1E1E] border-[#333333] col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales data for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <SalesChart />
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333] col-span-3">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Distribution of books by category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <PopularBooksChart />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-[#333333]" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full bg-[#333333]" />
                          <Skeleton className="h-3 w-24 bg-[#333333]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RecentActivities />
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inventory Alerts</CardTitle>
                <AlertTriangle className="h-5 w-5 text-[#FFC107]" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full bg-[#333333]" />
                    ))}
                  </div>
                ) : (
                  <InventoryAlerts />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Advanced analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

