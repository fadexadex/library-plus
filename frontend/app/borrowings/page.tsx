"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { BookCopy, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type BorrowRequest } from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"

export default function BorrowingsPage() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isReturning, setIsReturning] = useState<Record<string, boolean>>({})

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login"
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchBorrowRequests = async () => {
      setIsLoading(true)
      try {
        const requests = await apiService.getBorrowRequests()
        setBorrowRequests(requests)
      } catch (error) {
        console.error("Failed to fetch borrow requests:", error)
        toast({
          title: "Error",
          description: "Failed to load your borrowing history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBorrowRequests()
    }
  }, [toast, isAuthenticated])

  const handleReturn = async (id: string, bookId: string) => {
    setIsReturning((prev) => ({ ...prev, [id]: true }))
    try {
      const response = await apiService.returnBook(bookId)
      toast({
        title: "Return Request Submitted",
        description: response.message,
      })

      // Update the local state to reflect the return request
      setBorrowRequests((prev) =>
        prev.map((request) => (request.borrowId === id ? { ...request, status: "RETURN_REQUESTED" } : request)),
      )
    } catch (error) {
      console.error("Failed to return book:", error)
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsReturning((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Filter borrow requests based on active tab
  const filteredRequests = borrowRequests.filter((request) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return request.status === "PENDING"
    if (activeTab === "active") return request.status === "APPROVED" && !request.returned
    if (activeTab === "returned") return request.returned || request.status === "RETURNED"
    if (activeTab === "rejected") return request.status === "REJECTED"
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Borrowings</h1>
        <p className="text-muted-foreground mb-6">Track and manage your borrowed books</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookCopy className="mr-2 h-5 w-5" />
                {activeTab === "all"
                  ? "All Borrowings"
                  : activeTab === "pending"
                    ? "Pending Requests"
                    : activeTab === "active"
                      ? "Active Borrowings"
                      : activeTab === "returned"
                        ? "Returned Books"
                        : "Rejected Requests"}
              </CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "All your borrowing history"
                  : activeTab === "pending"
                    ? "Borrowing requests awaiting approval"
                    : activeTab === "active"
                      ? "Books you currently have borrowed"
                      : activeTab === "returned"
                        ? "Books you have returned"
                        : "Borrowing requests that were rejected"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full bg-[#333333]" />
                  ))}
                </div>
              ) : filteredRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.borrowId}
                      className="p-4 rounded-lg border border-[#333333] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{request.book.title}</h4>
                          <Badge
                            className={`ml-2 ${
                              request.status === "APPROVED" && !request.returned
                                ? "bg-green-500"
                                : request.status === "PENDING"
                                  ? "bg-amber-500"
                                  : request.status === "REJECTED"
                                    ? "bg-red-500"
                                    : request.returned ||
                                        request.status === "RETURNED" ||
                                        request.status === "RETURN_REQUESTED"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                            }`}
                          >
                            {request.status === "APPROVED" && !request.returned
                              ? "Active"
                              : request.status === "PENDING"
                                ? "Pending"
                                : request.status === "REJECTED"
                                  ? "Rejected"
                                  : request.status === "RETURN_REQUESTED"
                                    ? "Return Requested"
                                    : request.returned || request.status === "RETURNED"
                                      ? "Returned"
                                      : request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Borrowed on: {new Date(request.borrowDate).toLocaleDateString()}
                        </p>
                        {request.dueDate && (
                          <p className="text-sm text-muted-foreground">
                            Due date: {new Date(request.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {request.rejectionReason && (
                          <p className="text-sm text-red-400">Reason: {request.rejectionReason}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {request.status === "APPROVED" && !request.returned && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturn(request.borrowId, request.bookId)}
                            disabled={isReturning[request.borrowId]}
                          >
                            {isReturning[request.borrowId] ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Return
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/books/${request.bookId}`, "_blank")}
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          View Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No borrowing requests to display</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

