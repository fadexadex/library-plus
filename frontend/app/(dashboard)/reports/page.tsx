import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2, BarChart3, PieChart, LineChart } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and view detailed reports about your library</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="inventory" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="lending" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" /> Lending
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" /> Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Comprehensive reports on your book inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Current Stock Report</h3>
                    <p className="text-sm text-muted-foreground">Detailed report of all books currently in stock</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Low Stock Alert Report</h3>
                    <p className="text-sm text-muted-foreground">List of books that need to be restocked soon</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Category Distribution Report</h3>
                    <p className="text-sm text-muted-foreground">Analysis of books by category</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Inventory Valuation Report</h3>
                    <p className="text-sm text-muted-foreground">Total value of current inventory</p>
                  </div>
                </Button>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a report to view</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lending" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Lending Reports</CardTitle>
              <CardDescription>Reports on book loans and returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Current Loans Report</h3>
                    <p className="text-sm text-muted-foreground">List of all books currently on loan</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Overdue Books Report</h3>
                    <p className="text-sm text-muted-foreground">List of books that are past their due date</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Borrower Activity Report</h3>
                    <p className="text-sm text-muted-foreground">Analysis of borrowing patterns by user</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Popular Books Report</h3>
                    <p className="text-sm text-muted-foreground">Most frequently borrowed books</p>
                  </div>
                </Button>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a report to view</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>Reports on book sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Daily Sales Report</h3>
                    <p className="text-sm text-muted-foreground">Sales data for the current day</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Monthly Sales Report</h3>
                    <p className="text-sm text-muted-foreground">Sales data for the current month</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Yearly Sales Report</h3>
                    <p className="text-sm text-muted-foreground">Sales data for the current year</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Bestsellers Report</h3>
                    <p className="text-sm text-muted-foreground">Top-selling books in your store</p>
                  </div>
                </Button>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a report to view</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Reports on library members and staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Active Users Report</h3>
                    <p className="text-sm text-muted-foreground">List of all active library members</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">New Members Report</h3>
                    <p className="text-sm text-muted-foreground">Members who joined in the last 30 days</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">User Activity Report</h3>
                    <p className="text-sm text-muted-foreground">Analysis of user engagement</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start items-start text-left bg-[#1E1E1E] border-[#333333]"
                >
                  <div>
                    <h3 className="font-medium mb-1">Staff Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Activity and performance metrics for staff</p>
                  </div>
                </Button>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a report to view</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

