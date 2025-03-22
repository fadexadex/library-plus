"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, BookCopy, ArrowLeft, ShoppingCart } from "lucide-react"
import { apiService, type Book } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/hooks/use-notifications"

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBorrowing, setIsBorrowing] = useState(false)
  const { refetch: refetchNotifications } = useNotifications()

  const bookId = params.id

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching book with ID:", bookId)
        const bookData = await apiService.getBook(bookId)
        console.log("Book data received:", bookData)
        setBook(bookData)
      } catch (error) {
        console.error("Failed to fetch book details:", error)
        toast({
          title: "Error",
          description: "Failed to load book details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) {
      fetchBookDetails()
    }
  }, [bookId, toast])

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      localStorage.setItem("borrowAfterLogin", bookId)
      router.push("/login")
      return
    }

    setIsBorrowing(true)
    try {
      const response = await apiService.borrowBook(bookId)
      toast({
        title: "Success",
        description: response.message || "Borrow request submitted successfully",
      })
      refetchNotifications() // Refetch notifications after successful borrow
    } catch (error) {
      console.error("Failed to borrow book:", error)
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBorrowing(false)
    }
  }

  // Check if there's a pending borrow action after login
  useEffect(() => {
    if (isAuthenticated) {
      const borrowAfterLogin = localStorage.getItem("borrowAfterLogin")
      if (borrowAfterLogin && borrowAfterLogin === bookId) {
        handleBorrow()
        localStorage.removeItem("borrowAfterLogin")
      }
    }
  }, [isAuthenticated, bookId])

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Books
      </Button>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] w-full bg-[#333333] rounded-lg" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4 bg-[#333333]" />
            <Skeleton className="h-6 w-1/2 bg-[#333333]" />
            <Skeleton className="h-4 w-1/4 bg-[#333333]" />
            <Skeleton className="h-32 w-full bg-[#333333]" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32 bg-[#333333]" />
              <Skeleton className="h-10 w-32 bg-[#333333]" />
            </div>
          </div>
        </div>
      ) : book ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2A2A2A] rounded-lg overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=300"
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/30">{book.category}</Badge>
              <Badge
                className={
                  book.stockStatus === "IN_STOCK"
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                }
              >
                {book.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${book.price}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Copies</p>
                  <p className="font-medium">{book.copies}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Shelf</p>
                  <p className="font-medium">{book.shelf}</p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{book.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 px-6 py-2 h-auto"
                disabled={book.stockStatus === "OUT_OF_STOCK" || isBorrowing}
                onClick={handleBorrow}
              >
                <BookCopy className="mr-2 h-5 w-5" />
                {isBorrowing ? "Processing..." : "Borrow Book"}
              </Button>
              <Button
                variant="outline"
                className="px-6 py-2 h-auto border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107]/10"
                onClick={() => router.push(`/books/${bookId}/purchase`)}
                disabled={book.stockStatus === "OUT_OF_STOCK"}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/books")}>
            Browse All Books
          </Button>
        </div>
      )}
    </div>
  )
}

