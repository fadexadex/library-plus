"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiService, type BorrowRequest } from "@/lib/api-service"
import { CheckCircle, XCircle } from "lucide-react"

interface AdminBorrowRequestsTableProps {
  status: string
  limit?: number
}

export default function AdminBorrowRequestsTable({ status, limit }: AdminBorrowRequestsTableProps) {
  const { toast } = useToast()
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBorrowRequests = async () => {
      setIsLoading(true)
      try {
        const requests = await apiService.getAdminBorrowRequests(status)

        // Apply limit if provided
        const limitedRequests = limit ? requests.slice(0, limit) : requests

        setBorrowRequests(limitedRequests)
      } catch (error) {
        console.error(`Failed to fetch ${status} borrow requests:`, error)
        toast({
          title: "Error",
          description: `Failed to load ${status.toLowerCase()} borrow requests.`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowRequests()
  }, [status, toast, limit])

  const handleUpdateStatus = async (borrowId: string, newStatus: string) => {
    try {
      await apiService.updateBorrowRequestStatus(borrowId, newStatus)

      // Update local state
      setBorrowRequests((prev) => prev.filter((request) => request.borrowId !== borrowId))

      toast({
        title: "Success",
        description: `Borrow request ${newStatus === "APPROVED" ? "approved" : "rejected"} successfully.`,
      })
    } catch (error) {
      console.error(`Failed to update borrow request status:`, error)
      toast({
        title: "Error",
        description: "Failed to update borrow request status.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(limit || 5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-[#333333]" />
              <Skeleton className="h-3 w-24 bg-[#333333]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-20 bg-[#333333]" />
              <Skeleton className="h-9 w-20 bg-[#333333]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (borrowRequests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No {status.toLowerCase()} borrow requests found.</div>
    )
  }

  return (
    <div className="space-y-4">
      {limit ? (
        // Simplified view for limited display
        borrowRequests.map((request) => (
          <div key={request.borrowId} className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
            <div>
              <h4 className="font-medium">{request.book.title}</h4>
              <p className="text-sm text-muted-foreground">Requested on {formatDate(request.borrowDate)}</p>
            </div>
            <div className="flex space-x-2">
              {status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    onClick={() => handleUpdateStatus(request.borrowId, "APPROVED")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(request.borrowId, "REJECTED")}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </>
              )}
              {status === "RETURN_REQUESTED" && (
                <Button
                  size="sm"
                  className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                  onClick={() => handleUpdateStatus(request.borrowId, "RETURNED")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Confirm Return
                </Button>
              )}
            </div>
          </div>
        ))
      ) : (
        // Full table view
        <div className="rounded-md border border-[#333333] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1E1E1E]">
              <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                <TableHead>Book</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowRequests.map((request) => (
                <TableRow key={request.borrowId} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                  <TableCell className="font-medium">{request.book.title}</TableCell>
                  <TableCell>{formatDate(request.borrowDate)}</TableCell>
                  <TableCell>
                    <Badge variant={status === "PENDING" ? "outline" : "secondary"}>{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                            onClick={() => handleUpdateStatus(request.borrowId, "APPROVED")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(request.borrowId, "REJECTED")}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {status === "RETURN_REQUESTED" && (
                        <Button
                          size="sm"
                          className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                          onClick={() => handleUpdateStatus(request.borrowId, "RETURNED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Confirm Return
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

