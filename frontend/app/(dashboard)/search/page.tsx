"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookGrid } from "@/components/book-grid"
import { BookList } from "@/components/book-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Grid3X3, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Book } from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [initialLoad, setInitialLoad] = useState(true)

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Get the search query from URL parameters
  useEffect(() => {
    const query = searchParams?.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Function to perform search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setIsLoading(true)

      try {
        // Fetch results
        const results = await apiService.searchBooks(query)

        // Use setTimeout to ensure smooth transition
        setTimeout(() => {
          setSearchResults(results)
          setIsLoading(false)
          setInitialLoad(false)
        }, 300)
      } catch (error) {
        console.error("Search error:", error)
        toast({
          title: "Search failed",
          description: "There was an error performing your search. Please try again.",
          variant: "destructive",
        })
        setSearchResults([])
        setIsLoading(false)
        setInitialLoad(false)
      }
    },
    [toast],
  )

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery)
    } else {
      setSearchResults([])
      setInitialLoad(false)
    }
  }, [debouncedSearchQuery, performSearch])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardHeader>
          <CardTitle>Search Books</CardTitle>
          <CardDescription>Find books by title, author, or ISBN</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2A2A2A] border-[#333333]"
            />
          </div>

          {searchQuery && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    Showing results for <span className="font-medium text-white">"{searchQuery}"</span>
                  </>
                )}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isLoading ? "Searching..." : `${searchResults.length} Results`}</h2>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
              <TabsList className="bg-[#2A2A2A]">
                <TabsTrigger value="grid">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}>
            {isLoading || initialLoad ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[350px] rounded-lg bg-[#2A2A2A]" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <TabsContent value="grid" className="mt-0">
                  <BookGrid books={searchResults} isAdmin={false} />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <BookList books={searchResults} isAdmin={false} />
                </TabsContent>
              </>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No books found matching your search criteria.</p>
                <p className="mt-2">Try using different keywords or check for spelling errors.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Start typing to search for books.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

