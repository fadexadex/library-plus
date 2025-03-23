"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, BookCopy, ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { apiService, type Book } from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

export default function BooksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [isSearching, setIsSearching] = useState(false)
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null)
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  })
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Get the current page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)

  // Fetch books when not in search mode
  useEffect(() => {
    if (!isSearchMode) {
      const fetchBooks = async () => {
        setIsLoading(true)
        try {
          const response = await apiService.getBooks(currentPage)
          setBooks(response.books)
          setPagination(response.pagination)
        } catch (error) {
          console.error("Failed to fetch books:", error)
          toast({
            title: "Error",
            description: "Failed to load books. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchBooks()
    }
  }, [toast, currentPage, isSearchMode])

  // Handle real-time search with debounced query
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true)
      setIsLoading(true)
      setIsSearchMode(true)

      const performSearch = async () => {
        try {
          const searchResults = await apiService.searchBooks(debouncedSearchQuery)
          setBooks(searchResults)

          // Update URL without navigation
          const url = `/books?q=${encodeURIComponent(debouncedSearchQuery)}`
          window.history.pushState({}, "", url)

          // If no results found, show a message
          if (searchResults.length === 0 && debouncedSearchQuery.length > 2) {
            toast({
              title: "No results found",
              description: `No books matching "${debouncedSearchQuery}" were found.`,
            })
          }
        } catch (error) {
          console.error("Search failed:", error)
          toast({
            title: "Search failed",
            description: "An error occurred while searching. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
          setIsSearching(false)
        }
      }

      performSearch()
    } else if (debouncedSearchQuery === "") {
      // If search is cleared, reset to normal book listing
      setIsSearchMode(false)
      const fetchBooks = async () => {
        setIsLoading(true)
        try {
          const response = await apiService.getBooks(currentPage)
          setBooks(response.books)
          setPagination(response.pagination)
        } catch (error) {
          console.error("Failed to fetch books:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchBooks()
      // Don't navigate away, just update the URL
      window.history.pushState({}, "", "/books")
    }
  }, [debouncedSearchQuery, currentPage, toast])

  // Add this effect to handle search from URL parameters
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      setIsSearchMode(true)
    }
  }, [searchParams])

  const handleBorrow = async (bookId: string) => {
    if (!isAuthenticated) {
      // Store the book ID in localStorage to redirect back after login
      localStorage.setItem("borrowAfterLogin", bookId)
      router.push("/login")
      return
    }

    setBorrowingBook(bookId)
    try {
      const response = await apiService.borrowBook(bookId)
      toast({
        title: "Success",
        description: response.message || "Borrow request submitted successfully",
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/books?${params.toString()}`)
  }

  const handleViewDetails = (bookId: string) => {
    router.push(`/books/${bookId}`)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearchMode(false)
    // Don't navigate away, just update the URL
    window.history.pushState({}, "", "/books")
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

      <div className="mb-8">
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              className="pl-10 bg-[#1E1E1E] border-[#333333]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search status indicator */}
      {isSearching && <div className="mb-4 text-sm text-muted-foreground">Searching for "{searchQuery}"...</div>}

      {/* Search results count when not loading */}
      {!isLoading && searchQuery && books.length > 0 && (
        <div className="mb-4 text-sm">
          Found {books.length} {books.length === 1 ? "book" : "books"} matching "{searchQuery}"
        </div>
      )}

      {/* Fixed height container to prevent layout shifts */}
      <div className="min-h-[600px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-[400px] w-full bg-[#333333] rounded-lg opacity-70"></div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card
                key={book.bookId}
                className="bg-[#1E1E1E] border-[#333333] overflow-hidden flex flex-col h-[400px] relative cursor-pointer group transition-all duration-300"
                onMouseEnter={() => setHoveredBook(book.bookId)}
                onMouseLeave={() => setHoveredBook(null)}
                onClick={() => handleViewDetails(book.bookId)}
              >
                <div className="relative pt-[60%] bg-[#2A2A2A] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage || "/placeholder.svg"}
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
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-[#4CAF50] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{book.author}</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Price: </span>${book.price}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBorrow(book.bookId)
                      }}
                      disabled={book.stockStatus === "OUT_OF_STOCK" || borrowingBook === book.bookId}
                    >
                      <BookCopy className="mr-2 h-4 w-4" />
                      {borrowingBook === book.bookId ? "..." : "Borrow"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107]/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/books/${book.bookId}/purchase`)
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-[#1E1E1E] border border-[#333333] rounded-lg p-8 text-center">
            <div className="mb-4 p-4 rounded-full bg-[#333333]">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Books Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? `We couldn't find any books matching "${searchQuery}". Try using different keywords or browse our collection.`
                : "There are no books available at the moment."}
            </p>
            <div className="flex gap-4">
              {searchQuery && <Button onClick={() => router.push("/books")}>View All Books</Button>}
              {searchQuery && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination - only show when not in search mode */}
      {!isLoading && !isSearchMode && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

