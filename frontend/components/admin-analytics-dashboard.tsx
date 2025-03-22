"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartTitle,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
  ChartLine,
  ChartPie,
  ChartArea,
} from "@/components/ui/chart"

export default function AdminAnalyticsDashboard() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    categoryDistribution: [] as any[],
    borrowingTrends: [] as any[],
    popularBooks: [] as any[],
    userActivity: [] as any[],
    returnRates: [] as any[],
    overdueStats: [] as any[],
    salesByMonth: [] as any[],
    salesByCategory: [] as any[],
    userGrowth: [] as any[],
  })

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would fetch from analytics endpoints
        // For now, we'll use mock data

        // Mock category distribution data
        const categoryData = [
          { name: "Fiction", value: 40 },
          { name: "Non-Fiction", value: 25 },
          { name: "Programming", value: 15 },
          { name: "Science", value: 10 },
          { name: "Biography", value: 10 },
        ]

        // Mock borrowing trends data (monthly)
        const borrowingData = [
          { name: "Jan", count: 65 },
          { name: "Feb", count: 59 },
          { name: "Mar", count: 80 },
          { name: "Apr", count: 81 },
          { name: "May", count: 56 },
          { name: "Jun", count: 55 },
          { name: "Jul", count: 40 },
          { name: "Aug", count: 70 },
          { name: "Sep", count: 90 },
          { name: "Oct", count: 110 },
          { name: "Nov", count: 95 },
          { name: "Dec", count: 85 },
        ]

        // Mock popular books data
        const popularBooksData = [
          { name: "Clean Code", count: 42 },
          { name: "The Pragmatic Programmer", count: 38 },
          { name: "Design Patterns", count: 32 },
          { name: "Refactoring", count: 25 },
          { name: "Eloquent JavaScript", count: 22 },
        ]

        // Mock user activity data
        const userActivityData = [
          { name: "Borrowing", value: 60 },
          { name: "Returns", value: 55 },
          { name: "Renewals", value: 20 },
          { name: "Reservations", value: 15 },
        ]

        // Mock return rates data
        const returnRatesData = [
          { name: "On Time", value: 75 },
          { name: "Late", value: 20 },
          { name: "Very Late", value: 5 },
        ]

        // Mock overdue stats data
        const overdueStatsData = [
          { name: "Jan", onTime: 40, late: 5 },
          { name: "Feb", onTime: 45, late: 8 },
          { name: "Mar", onTime: 50, late: 10 },
          { name: "Apr", onTime: 55, late: 7 },
          { name: "May", onTime: 60, late: 5 },
          { name: "Jun", onTime: 65, late: 3 },
        ]

        // Mock sales by month data
        const salesByMonthData = [
          { name: "Jan", sales: 1200 },
          { name: "Feb", sales: 1900 },
          { name: "Mar", sales: 2100 },
          { name: "Apr", sales: 1800 },
          { name: "May", sales: 2400 },
          { name: "Jun", sales: 2200 },
          { name: "Jul", sales: 2600 },
          { name: "Aug", sales: 2900 },
          { name: "Sep", sales: 3100 },
          { name: "Oct", sales: 2800 },
          { name: "Nov", sales: 3300 },
          { name: "Dec", sales: 3600 },
        ]

        // Mock sales by category data
        const salesByCategoryData = [
          { name: "Fiction", value: 45 },
          { name: "Non-Fiction", value: 30 },
          { name: "Programming", value: 15 },
          { name: "Science", value: 5 },
          { name: "Biography", value: 5 },
        ]

        // Mock user growth data
        const userGrowthData = [
          { name: "Jan", users: 120 },
          { name: "Feb", users: 150 },
          { name: "Mar", users: 200 },
          { name: "Apr", users: 230 },
          { name: "May", users: 280 },
          { name: "Jun", users: 310 },
          { name: "Jul", users: 350 },
          { name: "Aug", users: 390 },
          { name: "Sep", users: 420 },
          { name: "Oct", users: 460 },
          { name: "Nov", users: 510 },
          { name: "Dec", users: 580 },
        ]

        setAnalyticsData({
          categoryDistribution: categoryData,
          borrowingTrends: borrowingData,
          popularBooks: popularBooksData,
          userActivity: userActivityData,
          returnRates: returnRatesData,
          overdueStats: overdueStatsData,
          salesByMonth: salesByMonthData,
          salesByCategory: salesByCategoryData,
          userGrowth: userGrowthData,
        })
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [toast])

  const COLORS = ["#4CAF50", "#FFC107", "#03A9F4", "#9C27B0", "#F44336"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Library Analytics</h2>
        <p className="text-muted-foreground">Comprehensive analytics and insights about your library</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Book Categories</CardTitle>
                <CardDescription>Distribution of books by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Book Categories</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.categoryDistribution.map((entry, index) => (
                          <ChartPie.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Monthly Sales</ChartTitle>
                    <Chart type="line">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartLine 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#4CAF50" 
                        activeDot={{ r: 8 }} 
                      />
                      <ChartArea 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#4CAF50" 
                        fill="#4CAF50" 
                      />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Borrowing Trends</CardTitle>
                <CardDescription>Monthly borrowing activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Borrowing Trends</ChartTitle>
                    <Chart type="line">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartLine type="monotone" dataKey="count" stroke="#03A9F4" activeDot={{ r: 8 }} />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>User Growth</ChartTitle>
                    <Chart type="line">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartLine type="monotone" dataKey="users" stroke="#9C27B0" activeDot={{ r: 8 }} />
                      <ChartArea type="monotone" dataKey="users" stroke="#9C27B0" fill="#9C27B0" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Sales by Month</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Sales by Month</ChartTitle>
                    <Chart type="bar">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="sales" fill="#4CAF50" />
                      <ChartTooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution by book category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Sales by Category</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.salesByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.salesByCategory.map((entry, index) => (
                          <ChartPie.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333] md:col-span-2">
              <CardHeader>
                <CardTitle>Popular Books (by Sales)</CardTitle>
                <CardDescription>Top-selling books in your store</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Popular Books</ChartTitle>
                    <Chart type="bar" layout="vertical">
                      <ChartXAxis type="number" />
                      <ChartYAxis type="category" dataKey="name" width={150} />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="count" fill="#4CAF50" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="borrowing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Borrowing Trends</CardTitle>
                <CardDescription>Monthly borrowing activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Borrowing Trends</ChartTitle>
                    <Chart type="line">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartLine type="monotone" dataKey="count" stroke="#03A9F4" activeDot={{ r: 8 }} />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Return Rates</CardTitle>
                <CardDescription>Book return statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Return Rates</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.returnRates}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <ChartPie.Cell fill="#4CAF50" />
                        <ChartPie.Cell fill="#FFC107" />
                        <ChartPie.Cell fill="#F44336" />
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Overdue Statistics</CardTitle>
                <CardDescription>On-time vs. late returns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Overdue Statistics</ChartTitle>
                    <Chart type="bar">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="onTime" stackId="a" fill="#4CAF50" name="On Time" />
                      <ChartBar dataKey="late" stackId="a" fill="#F44336" name="Late" />
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Types of user interactions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>User Activity</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.userActivity}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.userActivity.map((entry, index) => (
                          <ChartPie.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>User Growth</ChartTitle>
                    <Chart type="line">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartLine type="monotone" dataKey="users" stroke="#9C27B0" activeDot={{ r: 8 }} />
                      <ChartArea type="monotone" dataKey="users" stroke="#9C27B0" fill="#9C27B0" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Types of user interactions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>User Activity</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.userActivity}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.userActivity.map((entry, index) => (
                          <ChartPie.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333] md:col-span-2">
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by role and activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>User Demographics</ChartTitle>
                    <Chart type="bar">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="users" fill="#9C27B0" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Book Categories</CardTitle>
                <CardDescription>Distribution of books by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Book Categories</ChartTitle>
                    <Chart type="pie">
                      <ChartPie
                        data={analyticsData.categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.categoryDistribution.map((entry, index) => (
                          <ChartPie.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </ChartPie>
                      <ChartTooltip />
                      <ChartLegend />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
                <CardDescription>Most borrowed books</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Popular Books</ChartTitle>
                    <Chart type="bar" layout="vertical">
                      <ChartXAxis type="number" />
                      <ChartYAxis type="category" dataKey="name" width={150} />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="count" fill="#4CAF50" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] border-[#333333] md:col-span-2">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>Inventory status by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full bg-[#333333]" />
                  </div>
                ) : (
                  <ChartContainer className="h-full">
                    <ChartTitle>Stock Levels</ChartTitle>
                    <Chart type="bar">
                      <ChartXAxis dataKey="name" />
                      <ChartYAxis />
                      <ChartGrid strokeDasharray="3 3" />
                      <ChartBar dataKey="value" fill="#03A9F4" />
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

