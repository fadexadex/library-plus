"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartArea,
  ChartLine,
  ChartBar,
  ChartLegend,
} from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Purchase } from "@/lib/api-service"
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns"
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, ShoppingCart, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SalesChartProps {
  purchases?: Purchase[]
}

interface TimeSeriesData {
  time: string
  revenue: number
  orders: number
  rawTime: Date
}

interface TopSellingProduct {
  bookId: string
  title: string
  quantity: number
  revenue: number
}

type TimeRange = "day" | "week" | "month" | "quarter" | "year"
type ChartView = "revenue" | "orders" | "combined"

export default function SalesChart({ purchases = [] }: SalesChartProps) {
  // Always use mock data for demonstration
  const [useMockData, setUseMockData] = useState(false)
  const [mockPurchases, setMockPurchases] = useState<Purchase[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("week")
  const [chartView, setChartView] = useState<ChartView>("combined")
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([])
  const [comparisonData, setComparisonData] = useState({
    revenue: { value: 0, percentage: 0, increased: true },
    orders: { value: 0, percentage: 0, increased: true },
    average: { value: 0, percentage: 0, increased: true },
  })

  // Generate mock purchases on component mount
  useEffect(() => {
    if (purchases.length === 0) {
      console.log("No real purchase data available, using fallback data for demonstration")
      setMockPurchases(generateMockPurchases())
    } else {
      console.log("Using real purchase data:", purchases.length, "records")
      setMockPurchases([])
    }
  }, [purchases])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const dataToUse = purchases.length > 0 ? purchases : mockPurchases

    if (dataToUse.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrder: 0,
      }
    }

    const totalRevenue = dataToUse.reduce((sum, purchase) => {
      return sum + Number(purchase.price) * purchase.quantity
    }, 0)

    return {
      totalRevenue,
      totalOrders: dataToUse.length,
      averageOrder: totalRevenue / dataToUse.length,
    }
  }, [purchases, mockPurchases])

  // Process time series data based on selected time range
  useEffect(() => {
    console.log("Processing time series data for range:", timeRange)

    const dataToUse = useMockData ? mockPurchases : purchases

    if (dataToUse.length === 0) {
      setTimeSeriesData(generateEmptyTimeSeries(timeRange))
      setTopSellingProducts([])

      // Set default comparison data for empty state
      setComparisonData({
        revenue: { value: 0, percentage: 0, increased: true },
        orders: { value: 0, percentage: 0, increased: true },
        average: { value: 0, percentage: 0, increased: true },
      })

      return
    }

    // Sort purchases by creation time
    const sortedPurchases = [...dataToUse].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    // Get the most recent purchase date
    const latestPurchaseDate = new Date(sortedPurchases[sortedPurchases.length - 1].createdAt)

    let intervals: Date[] = []
    let timeFormat = ""
    let compareFunction: (date1: Date, date2: Date) => boolean

    // Define time intervals and format based on selected time range
    switch (timeRange) {
      case "day":
        const dayStart = startOfDay(latestPurchaseDate)
        const dayEnd = endOfDay(latestPurchaseDate)
        intervals = eachHourOfInterval({ start: dayStart, end: dayEnd })
        timeFormat = "h a"
        compareFunction = (date1, date2) => date1.getHours() === date2.getHours() && isSameDay(date1, date2)
        break

      case "week":
        const weekStart = subDays(latestPurchaseDate, 6)
        intervals = eachDayOfInterval({ start: weekStart, end: latestPurchaseDate })
        timeFormat = "MMM d"
        compareFunction = isSameDay
        break

      case "month":
        const monthStart = startOfMonth(latestPurchaseDate)
        const monthEnd = endOfMonth(latestPurchaseDate)
        intervals = eachDayOfInterval({ start: monthStart, end: monthEnd })
        timeFormat = "MMM d"
        compareFunction = isSameDay
        break

      case "quarter":
        const quarterStart = startOfQuarter(latestPurchaseDate)
        const quarterEnd = endOfQuarter(latestPurchaseDate)
        intervals = eachMonthOfInterval({ start: quarterStart, end: quarterEnd })
        timeFormat = "MMM yyyy"
        compareFunction = isSameMonth
        break

      case "year":
        const yearStart = startOfYear(latestPurchaseDate)
        const yearEnd = endOfYear(latestPurchaseDate)
        intervals = eachMonthOfInterval({ start: yearStart, end: yearEnd })
        timeFormat = "MMM yyyy"
        compareFunction = isSameMonth
        break
    }

    // Initialize data for each interval
    const intervalData = intervals.map((interval) => ({
      time: format(interval, timeFormat),
      revenue: 0,
      orders: 0,
      rawTime: interval,
    }))

    // Aggregate purchase data by interval
    sortedPurchases.forEach((purchase) => {
      const purchaseDate = new Date(purchase.createdAt)

      // Find the corresponding interval in our data
      const intervalIndex = intervalData.findIndex((data) => compareFunction(data.rawTime, purchaseDate))

      if (intervalIndex !== -1) {
        const saleAmount = Number(purchase.price) * purchase.quantity
        intervalData[intervalIndex].revenue += saleAmount
        intervalData[intervalIndex].orders += 1
      }
    })

    console.log("Generated time series data:", intervalData)
    setTimeSeriesData(intervalData)

    // Calculate comparison data (current vs previous period)
    calculateComparisonData(sortedPurchases, timeRange)

    // Calculate top selling products
    calculateTopSellingProducts(sortedPurchases)
  }, [purchases, mockPurchases, timeRange, useMockData])

  // Calculate comparison data (current vs previous period)
  const calculateComparisonData = (sortedPurchases: Purchase[], range: TimeRange) => {
    if (sortedPurchases.length === 0) {
      setComparisonData({
        revenue: { value: 0, percentage: 0, increased: true },
        orders: { value: 0, percentage: 0, increased: true },
        average: { value: 0, percentage: 0, increased: true },
      })
      return
    }

    const latestPurchaseDate = new Date(sortedPurchases[sortedPurchases.length - 1].createdAt)

    let currentPeriodStart: Date
    let previousPeriodStart: Date
    const currentPeriodEnd = latestPurchaseDate
    let previousPeriodEnd: Date

    switch (range) {
      case "day":
        currentPeriodStart = startOfDay(latestPurchaseDate)
        previousPeriodStart = startOfDay(subDays(latestPurchaseDate, 1))
        previousPeriodEnd = endOfDay(subDays(latestPurchaseDate, 1))
        break

      case "week":
        currentPeriodStart = subDays(latestPurchaseDate, 6)
        previousPeriodStart = subDays(currentPeriodStart, 7)
        previousPeriodEnd = subDays(currentPeriodStart, 1)
        break

      case "month":
        currentPeriodStart = startOfMonth(latestPurchaseDate)
        previousPeriodStart = startOfMonth(subMonths(latestPurchaseDate, 1))
        previousPeriodEnd = endOfMonth(subMonths(latestPurchaseDate, 1))
        break

      case "quarter":
        currentPeriodStart = startOfQuarter(latestPurchaseDate)
        previousPeriodStart = startOfQuarter(subMonths(latestPurchaseDate, 3))
        previousPeriodEnd = endOfQuarter(subMonths(latestPurchaseDate, 3))
        break

      case "year":
        currentPeriodStart = startOfYear(latestPurchaseDate)
        previousPeriodStart = startOfYear(subYears(latestPurchaseDate, 1))
        previousPeriodEnd = endOfYear(subYears(latestPurchaseDate, 1))
        break
    }

    // Filter purchases for current and previous periods
    const currentPeriodPurchases = sortedPurchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt)
      return purchaseDate >= currentPeriodStart && purchaseDate <= currentPeriodEnd
    })

    const previousPeriodPurchases = sortedPurchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt)
      return purchaseDate >= previousPeriodStart && purchaseDate <= previousPeriodEnd
    })

    // Calculate metrics for current period
    const currentRevenue = currentPeriodPurchases.reduce(
      (sum, purchase) => sum + Number(purchase.price) * purchase.quantity,
      0,
    )
    const currentOrders = currentPeriodPurchases.length
    const currentAverage = currentOrders > 0 ? currentRevenue / currentOrders : 0

    // Calculate metrics for previous period
    const previousRevenue = previousPeriodPurchases.reduce(
      (sum, purchase) => sum + Number(purchase.price) * purchase.quantity,
      0,
    )
    const previousOrders = previousPeriodPurchases.length
    const previousAverage = previousOrders > 0 ? previousRevenue / previousOrders : 0

    // Calculate percentage changes
    const revenuePercentage = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100

    const ordersPercentage = previousOrders === 0 ? 100 : ((currentOrders - previousOrders) / previousOrders) * 100

    const averagePercentage = previousAverage === 0 ? 100 : ((currentAverage - previousAverage) / previousAverage) * 100

    setComparisonData({
      revenue: {
        value: currentRevenue,
        percentage: Math.abs(revenuePercentage),
        increased: revenuePercentage >= 0,
      },
      orders: {
        value: currentOrders,
        percentage: Math.abs(ordersPercentage),
        increased: ordersPercentage >= 0,
      },
      average: {
        value: currentAverage,
        percentage: Math.abs(averagePercentage),
        increased: averagePercentage >= 0,
      },
    })
  }

  // Calculate top selling products
  const calculateTopSellingProducts = (sortedPurchases: Purchase[]) => {
    // Group purchases by book
    const bookSales: Record<string, TopSellingProduct> = {}

    sortedPurchases.forEach((purchase) => {
      if (!purchase.book) return

      const { bookId, title } = purchase.book
      const quantity = purchase.quantity
      const revenue = Number(purchase.price) * quantity

      if (bookSales[bookId]) {
        bookSales[bookId].quantity += quantity
        bookSales[bookId].revenue += revenue
      } else {
        bookSales[bookId] = {
          bookId,
          title: title || `Book ${bookId}`,
          quantity,
          revenue,
        }
      }
    })

    // Convert to array and sort by revenue
    const topProducts = Object.values(bookSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    setTopSellingProducts(topProducts)
  }

  // Generate empty time series data
  const generateEmptyTimeSeries = (range: TimeRange): TimeSeriesData[] => {
    const today = new Date()
    let intervals: Date[] = []
    let timeFormat = ""

    switch (range) {
      case "day":
        const dayStart = startOfDay(today)
        const dayEnd = endOfDay(today)
        intervals = eachHourOfInterval({ start: dayStart, end: dayEnd })
        timeFormat = "h a"
        break

      case "week":
        const weekStart = subDays(today, 6)
        intervals = eachDayOfInterval({ start: weekStart, end: today })
        timeFormat = "MMM d"
        break

      case "month":
        const monthStart = startOfMonth(today)
        const monthEnd = endOfMonth(today)
        intervals = eachDayOfInterval({ start: monthStart, end: monthEnd })
        timeFormat = "MMM d"
        break

      case "quarter":
        const quarterStart = startOfQuarter(today)
        const quarterEnd = endOfQuarter(today)
        intervals = eachMonthOfInterval({ start: quarterStart, end: quarterEnd })
        timeFormat = "MMM yyyy"
        break

      case "year":
        const yearStart = startOfYear(today)
        const yearEnd = endOfYear(today)
        intervals = eachMonthOfInterval({ start: yearStart, end: yearEnd })
        timeFormat = "MMM yyyy"
        break
    }

    return intervals.map((interval) => ({
      time: format(interval, timeFormat),
      revenue: 0,
      orders: 0,
      rawTime: interval,
    }))
  }

  // Generate mock purchases
  const generateMockPurchases = (): Purchase[] => {
    const now = new Date()
    const mockData: Purchase[] = []

    // Book titles for mock data
    const bookTitles = [
      "The Great Gatsby",
      "To Kill a Mockingbird",
      "1984",
      "Pride and Prejudice",
      "The Catcher in the Rye",
      "The Hobbit",
      "Harry Potter and the Sorcerer's Stone",
      "The Lord of the Rings",
      "Animal Farm",
      "Brave New World",
    ]

    // Generate a year of mock purchases with more realistic patterns
    for (let i = 0; i < 365; i++) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // More purchases on weekends and fewer on weekdays
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Random number of purchases per day (more on weekends)
      const purchasesPerDay = Math.floor(Math.random() * (isWeekend ? 8 : 5))

      for (let j = 0; j < purchasesPerDay; j++) {
        const bookIndex = Math.floor(Math.random() * bookTitles.length)
        const quantity = Math.floor(Math.random() * 3) + 1
        const price = (Math.random() * 20 + 10).toFixed(2)

        mockData.push({
          purchaseId: `mock-${i}-${j}`,
          userId: `user-${Math.floor(Math.random() * 100)}`,
          bookId: `book-${bookIndex}`,
          quantity: quantity,
          price: price,
          createdAt: date.toISOString(),
          book: {
            title: bookTitles[bookIndex],
            bookId: `book-${bookIndex}`,
          },
          user: {
            firstName: "Mock",
            lastName: "User",
          },
        } as Purchase)
      }
    }

    return mockData
  }

  // Format currency for tooltip and display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100) // Assuming price is in cents
  }

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number, name: string, props: any) => {
    const dataIndex = props.payload.index
    if (dataIndex !== undefined && timeSeriesData[dataIndex]) {
      const data = timeSeriesData[dataIndex]

      if (name === "revenue") {
        return [formatCurrency(value), `Orders: ${data.orders}`]
      } else if (name === "orders") {
        return [`${value} orders`, `Revenue: ${formatCurrency(data.revenue)}`]
      }
    }
    return name === "revenue" ? [formatCurrency(value)] : [`${value} orders`]
  }

  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "day":
        return "Today"
      case "week":
        return "Last 7 Days"
      case "month":
        return "This Month"
      case "quarter":
        return "This Quarter"
      case "year":
        return "This Year"
    }
  }

  // Toggle between real and mock data
  const toggleDataSource = () => {
    setUseMockData(!useMockData)
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-[#4CAF50]" />
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(summaryMetrics.totalRevenue)}</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${comparisonData.revenue.increased ? "text-green-500" : "text-red-500"}`}
                >
                  {comparisonData.revenue.increased ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {comparisonData.revenue.percentage.toFixed(1)}% from previous {timeRange}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#4CAF50]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1 text-[#2196F3]" />
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold">{summaryMetrics.totalOrders}</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${comparisonData.orders.increased ? "text-green-500" : "text-red-500"}`}
                >
                  {comparisonData.orders.increased ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {comparisonData.orders.percentage.toFixed(1)}% from previous {timeRange}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#2196F3]/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-[#2196F3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                  <BarChart2 className="h-4 w-4 mr-1 text-[#FF9800]" />
                  Avg. Order Value
                </p>
                <h3 className="text-2xl font-bold">{formatCurrency(summaryMetrics.averageOrder)}</h3>
                <div
                  className={`flex items-center text-xs mt-1 ${comparisonData.average.increased ? "text-green-500" : "text-red-500"}`}
                >
                  {comparisonData.average.increased ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  <span>
                    {comparisonData.average.percentage.toFixed(1)}% from previous {timeRange}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#FF9800]/10 flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-[#FF9800]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Sales Trend</h3>
          <span className="text-sm text-muted-foreground">{getTimeRangeLabel()}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[140px] bg-[#1E1E1E] border-[#333333]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Tabs value={chartView} onValueChange={(value) => setChartView(value as ChartView)} className="w-auto">
            <TabsList className="bg-[#1E1E1E] border-[#333333] h-9">
              <TabsTrigger value="revenue" className="text-xs px-3 py-1">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs px-3 py-1">
                Orders
              </TabsTrigger>
              <TabsTrigger value="combined" className="text-xs px-3 py-1">
                Combined
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Chart */}
      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardContent className="p-6">
          <div className="min-h-[350px] w-full">
            {timeSeriesData.length === 0 ? (
              <div className="h-[350px] flex items-center justify-center flex-col">
                <p className="text-muted-foreground mb-2">No sales data available for this period</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange("month")}
                  className="bg-[#1E1E1E] border-[#333333]"
                >
                  Try a different time range
                </Button>
              </div>
            ) : (
              <div className="h-[350px]">
                <ChartContainer data={timeSeriesData}>
                  <Chart>
                    <ChartXAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#888888", fontSize: 12 }}
                    />

                    {chartView === "combined" && (
                      <>
                        <ChartYAxis
                          yAxisId="left"
                          tickFormatter={(value) => formatCurrency(value)}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#888888", fontSize: 12 }}
                        />
                        <ChartYAxis
                          yAxisId="right"
                          orientation="right"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#888888", fontSize: 12 }}
                        />
                      </>
                    )}

                    {(chartView === "revenue" || chartView === "orders") && (
                      <ChartYAxis
                        tickFormatter={(value) => (chartView === "revenue" ? formatCurrency(value) : value.toString())}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#888888", fontSize: 12 }}
                      />
                    )}

                    <ChartGrid strokeDasharray="3 3" vertical={false} />

                    {/* Revenue Line/Area */}
                    {(chartView === "revenue" || chartView === "combined") && (
                      <>
                        <ChartArea
                          dataKey="revenue"
                          yAxisId={chartView === "combined" ? "left" : undefined}
                          fill="url(#revenueGradient)"
                          stroke="#4CAF50"
                          strokeWidth={2}
                          fillOpacity={0.2}
                        />

                        <ChartLine
                          dataKey="revenue"
                          yAxisId={chartView === "combined" ? "left" : undefined}
                          stroke="#4CAF50"
                          strokeWidth={2}
                          dot={{ fill: "#4CAF50", r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: "#4CAF50", stroke: "#FFFFFF", strokeWidth: 2 }}
                        />
                      </>
                    )}

                    {/* Orders Bar */}
                    {(chartView === "orders" || chartView === "combined") && (
                      <ChartBar
                        dataKey="orders"
                        yAxisId={chartView === "combined" ? "right" : undefined}
                        fill="#2196F3"
                        radius={[4, 4, 0, 0]}
                        barSize={chartView === "combined" ? 20 : 30}
                      />
                    )}

                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <ChartTooltip
                      formatter={customTooltipFormatter}
                      contentStyle={{
                        backgroundColor: "#1E1E1E",
                        border: "1px solid #333333",
                        borderRadius: "4px",
                        padding: "8px 12px",
                      }}
                      itemStyle={{ color: "#FFFFFF" }}
                      labelStyle={{ color: "#AAAAAA", marginBottom: "4px" }}
                    />

                    <ChartLegend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: "10px" }}
                    />
                  </Chart>
                </ChartContainer>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDataSource}
              className="bg-[#1E1E1E] border-[#333333]"
              disabled={purchases.length > 0}
            >
              {purchases.length > 0 ? "Using Real Data" : useMockData ? "Using Demo Data" : "Using Real Data"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              {purchases.length > 0
                ? "Showing actual sales data"
                : useMockData
                  ? "Currently showing demonstration data"
                  : "No sales data available"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Products */}
      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>

          {topSellingProducts.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No sales data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#1E1E1E]">
                  <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                    <TableHead>Book Title</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSellingProducts.map((product) => (
                    <TableRow key={product.bookId} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

