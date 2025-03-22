"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, BookCopy, ShoppingCart, BookOpen, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/api-service"
import { apiService } from "@/lib/api-service"
import { useRouter } from "next/navigation"

interface BookGridProps {
  books: Book[]
  isAdmin: boolean
}

export function BookGrid({ books, isAdmin }: BookGridProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null)
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  const handleBorrow = async (id: string, title: string) => {
    setBorrowingBook(id)
    try {
      const response = await apiService.borrowBook(id)
      toast({
        title: "Borrow Request Submitted",
        description: response.message,
      })
    } catch (error) {
      console.error("Failed to borrow book:", error)
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBorrowingBook(null)
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/books/${id}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px]">
      {books.map((book) => (
        <Card
          key={book.bookId}
          className="bg-[#1E1E1E] border-[#333333] overflow-hidden flex flex-col h-[320px] relative cursor-pointer group transition-all duration-300"
          onMouseEnter={() => setHoveredBook(book.bookId)}
          onMouseLeave={() => setHoveredBook(null)}
          onClick={() => handleViewDetails(book.bookId)}
        >
          <div className="relative pt-[50%] bg-[#2A2A2A] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=150"
                  }}
                />
              ) : (
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <Badge
              className={`absolute top-2 right-2 ${book.stockStatus === "IN_STOCK" ? "bg-green-500" : "bg-red-500"}`}
            >
              {book.stockStatus === "IN_STOCK" ? "Available" : "Out of Stock"}
            </Badge>

            {/* View Details Overlay */}
            <div
              className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${hoveredBook === book.bookId ? "opacity-100" : "opacity-0"}`}
            >
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails(book.bookId)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </div>
          <CardContent className="p-3 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-[#4CAF50] transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Price: </span>${book.price}
              </p>
            </div>

            <div className="flex gap-1 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBorrow(book.bookId, book.title)
                }}
                disabled={book.stockStatus === "OUT_OF_STOCK" || borrowingBook === book.bookId}
              >
                <BookCopy className="mr-1 h-4 w-4" />
                {borrowingBook === book.bookId ? "..." : "Borrow"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/books/${book.bookId}/purchase`)
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy
              </Button>
            </div>
          </CardContent>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#333333]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/admin/books/edit/${book.bookId}`)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/books/${book.bookId}/purchase`)
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Sell</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </Card>
      ))}
    </div>
  )
}

