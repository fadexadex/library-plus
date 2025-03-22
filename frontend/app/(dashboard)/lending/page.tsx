"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoansList } from "@/components/loans-list"
import { OverdueList } from "@/components/overdue-list"

export default function LendingPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleNewLoan = () => {
    // This would open a modal or navigate to create loan page
    toast({
      title: "Create New Loan",
      description: "The loan creation form will open.",
    })
  }

  const handleExportReport = async () => {
    setIsLoading(true)
    try {
      // Mock API call to GET /api/loans for export
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Export Successful",
        description: "Loan report has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the loan report.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lending Management</h2>
          <p className="text-muted-foreground">Track and manage book loans and returns</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90" onClick={handleNewLoan}>
            <Plus className="mr-2 h-4 w-4" /> New Loan
          </Button>
          <Button
            variant="outline"
            className="bg-[#1E1E1E] border-[#333333]"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Input placeholder="Search loans by book title, borrower name..." className="bg-[#1E1E1E] border-[#333333]" />
        </div>
        <Button variant="outline" className="w-full md:w-auto bg-[#1E1E1E] border-[#333333]">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="history">Loan History</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>Currently borrowed books</CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList status="active" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Overdue Loans</CardTitle>
              <CardDescription>Books that are past their due date</CardDescription>
            </CardHeader>
            <CardContent>
              <OverdueList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>Complete history of all loans</CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList status="history" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reserved" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Reserved Books</CardTitle>
              <CardDescription>Books that have been reserved by users</CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList status="reserved" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

