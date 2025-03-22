"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Edit, MoreVertical, Plus, Search, Trash2, Upload, Loader2 } from "lucide-react"
import { apiService, type Book } from "@/lib/api-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminBooksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [isSearching, setIsSearching] = useState(false)
  // Add state for search results
  const [searchResults, setSearchResults] = useState<Book[]>([])

  // Add the fetchBooks function at the top of the component
  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await apiService.getBooks(currentPage)
      setBooks(response.books)
      setTotalPages(response.pagination.totalPages)
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

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin/login")
    }
  }, [router])

  // Fetch books
  useEffect(() => {
    fetchBooks()
  }, [currentPage])

  // Fix the search functionality in the handleSearch function
  // Update the handleSearch function to properly handle search results and display them
  // Replace the existing handleSearch function with this improved version:

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await apiService.searchBooks(searchQuery)
      console.log("Search results:", results)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Also update the displayedBooks variable to properly handle search results:
  // Replace the existing displayedBooks definition with:

  const displayedBooks =
    searchQuery && searchResults.length > 0
      ? searchResults
      : searchQuery && searchResults.length === 0 && !isSearching
        ? [] // No results found
        : searchQuery && isSearching
          ? [] // Currently searching
          : books // Default to all books when no search

  // Update the handleDeleteBook function to properly refresh the books list
  const handleDeleteBook = async (bookId: string) => {
    setIsDeleting((prev) => ({ ...prev, [bookId]: true }))

    try {
      await apiService.deleteBook(bookId)

      // Remove book from state
      setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId))

      // Also remove from search results if present
      if (searchResults.length > 0) {
        setSearchResults((prevResults) => prevResults.filter((book) => book.bookId !== bookId))
      }

      toast({
        title: "Success",
        description: "Book deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete book:", error)
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting((prev) => ({ ...prev, [bookId]: false }))
    }
  }

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle search input keydown
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="link"
          className="pl-0 text-[#4CAF50]"
          onClick={() => router.push("/admin/dashboard?tab=books")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Book Inventory</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90" onClick={() => router.push("/admin/books/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Button>
          <Button
            variant="outline"
            className="bg-[#1E1E1E] border-[#333333]"
            onClick={() => router.push("/admin/books/batch-upload")}
          >
            <Upload className="mr-2 h-4 w-4" /> Batch Upload
          </Button>
        </div>
      </div>

      <Card className="bg-[#1E1E1E] border-[#333333] mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, ISBN, or category..."
              className="pl-10 bg-[#2A2A2A] border-[#333333]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                className="absolute right-[70px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
              >
                ✕
              </button>
            )}
            <Button
              className="absolute right-0 top-0 h-full rounded-l-none"
              onClick={handleSearch}
              disabled={isLoading || isSearching}
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1E1E1E]">
                <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                  <TableHead className="w-[300px]">Title & Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isSearching ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                      <TableCell>
                        <Skeleton className="h-10 w-full bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-10 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 bg-[#333333]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 bg-[#333333] ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : displayedBooks.length > 0 ? (
                  // Book data
                  displayedBooks.map((book) => (
                    <TableRow key={book.bookId} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{book.title}</div>
                          <div className="text-sm text-muted-foreground">{book.author}</div>
                        </div>
                      </TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>
                        <Badge className={book.stockStatus === "IN_STOCK" ? "bg-green-500" : "bg-red-500"}>
                          {book.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.copies}</TableCell>
                      <TableCell>${book.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/books/edit/${book.bookId}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#333333]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-500"
                                onClick={() => handleDeleteBook(book.bookId)}
                                disabled={isDeleting[book.bookId]}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{isDeleting[book.bookId] ? "Deleting..." : "Delete"}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // No books found
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {searchQuery ? "No books match your search criteria" : "No books found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Add a fixed height container for pagination to prevent layout shifts */}
          <div className="h-16">
            {!isLoading && !searchQuery && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-[#333333]">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

