import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download, BarChart3 } from "lucide-react"

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
          <p className="text-muted-foreground">Track and manage book sales and revenue</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
            <Plus className="mr-2 h-4 w-4" /> New Sale
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Input placeholder="Search sales by book title, customer name..." className="bg-[#1E1E1E] border-[#333333]" />
        </div>
        <Button variant="outline" className="w-full md:w-auto bg-[#1E1E1E] border-[#333333]">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="recent">Recent Sales</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions in your bookstore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Recent sales will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Sales data for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Monthly sales data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Yearly Sales</CardTitle>
              <CardDescription>Sales data for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Yearly sales data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bestsellers" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Bestsellers</CardTitle>
              <CardDescription>Top-selling books in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Bestseller data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

