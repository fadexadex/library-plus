"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, Filter, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { apiService, type Purchase } from "@/lib/api-service"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PurchasesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Purchase | null
    direction: "ascending" | "descending"
  }>({
    key: "createdAt",
    direction: "descending",
  })

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin/login")
    }
  }, [router])

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true)
      try {
        const purchasesData = await apiService.getAdminPurchases()
        setPurchases(purchasesData)
        setFilteredPurchases(purchasesData)

        // Calculate total pages (assuming 10 items per page)
        setTotalPages(Math.ceil(purchasesData.length / 10))
      } catch (error) {
        console.error("Failed to fetch purchases:", error)
        toast({
          title: "Error",
          description: "Failed to load purchases. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [toast])

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPurchases(purchases)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = purchases.filter(
      (purchase) =>
        purchase.user?.firstName.toLowerCase().includes(query) ||
        purchase.user?.lastName.toLowerCase().includes(query) ||
        purchase.book?.title.toLowerCase().includes(query) ||
        purchase.purchaseId.toLowerCase().includes(query),
    )

    setFilteredPurchases(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, purchases])

  // Handle sorting
  const requestSort = (key: keyof Purchase) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting
  useEffect(() => {
    if (!sortConfig.key) return

    const sortedData = [...filteredPurchases].sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA
      }

      if (sortConfig.key === "price") {
        const priceA = Number.parseFloat(a.price.toString())
        const priceB = Number.parseFloat(b.price.toString())
        return sortConfig.direction === "ascending" ? priceA - priceB : priceB - priceA
      }

      if (sortConfig.key === "quantity") {
        return sortConfig.direction === "ascending" ? a.quantity - b.quantity : b.quantity - a.quantity
      }

      // For string comparisons (user name, book title)
      if (sortConfig.key === "userId") {
        const nameA = `${a.user?.firstName} ${a.user?.lastName}`.toLowerCase()
        const nameB = `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase()
        return sortConfig.direction === "ascending" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }

      if (sortConfig.key === "bookId") {
        const titleA = a.book?.title.toLowerCase() || ""
        const titleB = b.book?.title.toLowerCase() || ""
        return sortConfig.direction === "ascending" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA)
      }

      return 0
    })

    setFilteredPurchases(sortedData)
  }, [sortConfig])

  // Format currency
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue)
  }

  // Export purchases as CSV
  const exportPurchases = () => {
    // Create CSV content
    const headers = ["Purchase ID", "Date", "Customer", "Book", "Quantity", "Price"]
    const rows = filteredPurchases.map((purchase) => [
      purchase.purchaseId,
      new Date(purchase.createdAt).toLocaleString(),
      `${purchase.user?.firstName} ${purchase.user?.lastName}`,
      purchase.book?.title,
      purchase.quantity.toString(),
      formatCurrency(purchase.price),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `purchases_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    return filteredPurchases.slice(startIndex, endIndex)
  }

  // Calculate total revenue
  const totalRevenue = filteredPurchases.reduce((sum, purchase) => {
    return sum + Number(purchase.price) * purchase.quantity
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center text-[#4CAF50] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
          <p className="text-muted-foreground">View and manage all book purchases</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]" onClick={exportPurchases}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            className="bg-[#1E1E1E] border-[#333333]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Purchases</span>
              <span className="text-2xl font-bold mt-1">{filteredPurchases.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Average Order Value</span>
              <span className="text-2xl font-bold mt-1">
                {formatCurrency(filteredPurchases.length ? totalRevenue / filteredPurchases.length : 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or book title..."
            className="pl-10 bg-[#1E1E1E] border-[#333333]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <DateRangePicker />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="bg-[#1E1E1E] border-[#333333]" />
                  <span>-</span>
                  <Input type="number" placeholder="Max" className="bg-[#1E1E1E] border-[#333333]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Book Category</label>
                <Select>
                  <SelectTrigger className="bg-[#1E1E1E] border-[#333333]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-[#333333]">
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2">
                Reset
              </Button>
              <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardHeader>
          <CardTitle>Purchase Records</CardTitle>
          <CardDescription>
            {filteredPurchases.length} {filteredPurchases.length === 1 ? "purchase" : "purchases"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#333333] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#1E1E1E]">
                <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                  <TableHead className="w-[250px]">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("createdAt")}>
                      Date & Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("userId")}>
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("bookId")}>
                      Book
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => requestSort("quantity")}
                    >
                      Quantity
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort("price")}>
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                      <TableCell>
                        <Skeleton className="h-6 w-32 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-28 bg-[#333333]" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-8 mx-auto bg-[#333333]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-6 w-16 ml-auto bg-[#333333]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : getPaginatedData().length > 0 ? (
                  // Purchase data
                  getPaginatedData().map((purchase) => (
                    <TableRow key={purchase.purchaseId} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                      <TableCell>
                        <div>
                          <div className="font-medium">{new Date(purchase.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(purchase.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {purchase.user ? (
                          `${purchase.user.firstName} ${purchase.user.lastName}`
                        ) : (
                          <span className="text-muted-foreground">Unknown User</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {purchase.book ? (
                          purchase.book.title
                        ) : (
                          <span className="text-muted-foreground">Unknown Book</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{purchase.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{apiService.formatPrice(purchase.price)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // No purchases
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No purchases found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, filteredPurchases.length)} of{" "}
                {filteredPurchases.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

