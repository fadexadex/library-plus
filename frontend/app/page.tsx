"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, BookCopy, ShoppingCart, Eye, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { apiService, type Book } from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useDebounce } from "@/hooks/use-debounce"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null)
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const response = await apiService.getBooks(1)
        setBooks(response.books)
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

    // Check if there's a pending borrow action after login
    if (isAuthenticated) {
      const borrowAfterLogin = localStorage.getItem("borrowAfterLogin")
      if (borrowAfterLogin) {
        handleBorrow(borrowAfterLogin)
        localStorage.removeItem("borrowAfterLogin")
      }
    }
  }, [toast, isAuthenticated])

  // Handle real-time search with debounced query
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true)

      const performSearch = async () => {
        try {
          const results = await apiService.searchBooks(debouncedSearchQuery)
          setSearchResults(results)
          setShowSearchResults(true)
        } catch (error) {
          console.error("Search failed:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }

      performSearch()
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [debouncedSearchQuery])

  // Handle clicking outside to close search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".search-container") && showSearchResults) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showSearchResults])

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

  const handleViewDetails = (bookId: string) => {
    router.push(`/books/${bookId}`)
  }

  const handleResultClick = (bookId: string) => {
    router.push(`/books/${bookId}`)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleViewAllResults = () => {
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to LibraryPlus</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
          Discover, borrow, and enjoy our extensive collection of books
        </p>

        <div className="w-full max-w-md relative search-container">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or category..."
              className="pl-10 bg-[#1E1E1E] border-[#333333]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Real-time search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E1E] border border-[#333333] rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
              <div className="p-2 border-b border-[#333333] text-sm text-muted-foreground">
                {searchResults.length} results for "{searchQuery}"
              </div>
              <div className="py-1">
                {searchResults.slice(0, 6).map((book) => (
                  <div
                    key={book.bookId}
                    className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer flex items-center gap-3"
                    onClick={() => handleResultClick(book.bookId)}
                  >
                    <div className="w-10 h-14 bg-[#2A2A2A] flex items-center justify-center rounded overflow-hidden shrink-0">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=50&width=35"
                          }}
                        />
                      ) : (
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-1">{book.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{book.author}</div>
                    </div>
                  </div>
                ))}
                {searchResults.length > 6 && (
                  <div
                    className="px-4 py-2 text-center text-sm text-[#4CAF50] hover:bg-[#2A2A2A] cursor-pointer"
                    onClick={handleViewAllResults}
                  >
                    View all {searchResults.length} results
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <Button
            variant="link"
            onClick={() => router.push("/books")}
            className="text-[#4CAF50] hover:text-[#4CAF50]/80 flex items-center"
          >
            View all books
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="min-h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] w-full bg-[#333333] rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-[400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.bookId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  key={book.bookId}
                  className="bg-[#1E1E1E] border-[#333333] overflow-hidden flex flex-col card-hover relative cursor-pointer group transition-all duration-300"
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
                  <CardContent className="p-4 flex flex-col">
                    <div className="flex flex-col">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-[#4CAF50] transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/books">
          <Button size="lg" className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
            Browse All Books
          </Button>
        </Link>
      </div>
    </div>
  )
}

