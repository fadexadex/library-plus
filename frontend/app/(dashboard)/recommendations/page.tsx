"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, BookOpen, TrendingUp, History, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for recommendations
const recommendedBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    rating: 4.5,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    rating: 4.8,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    rating: 4.7,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 4,
    title: "The Song of Achilles",
    author: "Madeline Miller",
    category: "Historical Fiction",
    rating: 4.6,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 5,
    title: "Educated",
    author: "Tara Westover",
    category: "Memoir",
    rating: 4.7,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 6,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    rating: 4.5,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
]

const trendingBooks = [
  {
    id: 7,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    category: "Fantasy",
    rating: 4.8,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 8,
    title: "Iron Flame",
    author: "Rebecca Yarros",
    category: "Fantasy",
    rating: 4.9,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 9,
    title: "The Heaven & Earth Grocery Store",
    author: "James McBride",
    category: "Historical Fiction",
    rating: 4.6,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 10,
    title: "Yellowface",
    author: "R.F. Kuang",
    category: "Contemporary Fiction",
    rating: 4.3,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
]

export default function RecommendationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personalized")
  const [formData, setFormData] = useState({
    genre: "fiction",
    author: "",
    recentlyRead: "",
    readingLevel: "adult",
  })
  const [showPersonalized, setShowPersonalized] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      // Mock API call to GET /api/recommendations/user/:userId
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setShowPersonalized(true)
      toast({
        title: "Recommendations Generated",
        description: "Here are some books you might enjoy!",
      })
    } catch (error) {
      toast({
        title: "Failed to Generate Recommendations",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Book Recommendations</h2>
        <p className="text-muted-foreground">Discover your next favorite book</p>
      </div>

      <Tabs defaultValue="personalized" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="personalized" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personalized</span>
            <span className="sm:hidden">For You</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Based on History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personalized" className="space-y-6">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Tell us what you like to get tailored book suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Favorite Genre</Label>
                  <Select value={formData.genre} onValueChange={(value) => handleSelectChange("genre", value)}>
                    <SelectTrigger id="genre" className="mt-1 bg-[#1E1E1E] border-[#333333]">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#333333]">
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="sci-fi">Science Fiction</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="author">Favorite Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="mt-1 bg-[#1E1E1E] border-[#333333]"
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <Label htmlFor="recentlyRead">Recently Read Book</Label>
                  <Input
                    id="recentlyRead"
                    name="recentlyRead"
                    value={formData.recentlyRead}
                    onChange={handleInputChange}
                    className="mt-1 bg-[#1E1E1E] border-[#333333]"
                    placeholder="Enter book title"
                  />
                </div>
                <div>
                  <Label htmlFor="readingLevel">Reading Level</Label>
                  <Select
                    value={formData.readingLevel}
                    onValueChange={(value) => handleSelectChange("readingLevel", value)}
                  >
                    <SelectTrigger id="readingLevel" className="mt-1 bg-[#1E1E1E] border-[#333333]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#333333]">
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="young-adult">Young Adult</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? "Generating Recommendations..." : "Get Personalized Recommendations"}
                </Button>
              </div>

              {showPersonalized && !isLoading && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-[#FFC107]" />
                    Recommended for You
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedBooks.slice(0, 6).map((book) => (
                      <Card key={book.id} className="bg-[#1E1E1E] border-[#333333] overflow-hidden card-hover">
                        <CardContent className="p-0">
                          <div className="relative pt-[60%] bg-[#2A2A2A]">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage || "/placeholder.svg"}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="h-16 w-16 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold line-clamp-1">{book.title}</h4>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs bg-[#4CAF50]/20 text-[#4CAF50] px-2 py-1 rounded-full">
                                {book.category}
                              </span>
                              <span className="text-xs text-[#FFC107]">★ {book.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Trending Books</CardTitle>
              <CardDescription>Popular books that readers are enjoying right now</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full bg-[#333333]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trendingBooks.map((book) => (
                    <Card key={book.id} className="bg-[#1E1E1E] border-[#333333] overflow-hidden card-hover">
                      <CardContent className="p-0">
                        <div className="relative pt-[60%] bg-[#2A2A2A]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage || "/placeholder.svg"}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="h-16 w-16 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold line-clamp-1">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-[#4CAF50]/20 text-[#4CAF50] px-2 py-1 rounded-full">
                              {book.category}
                            </span>
                            <span className="text-xs text-[#FFC107]">★ {book.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Based on Your Reading History</CardTitle>
              <CardDescription>Recommendations based on books you've borrowed or purchased</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full bg-[#333333]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedBooks.slice(2, 6).map((book) => (
                    <Card key={book.id} className="bg-[#1E1E1E] border-[#333333] overflow-hidden card-hover">
                      <CardContent className="p-0">
                        <div className="relative pt-[60%] bg-[#2A2A2A]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage || "/placeholder.svg"}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="h-16 w-16 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold line-clamp-1">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs bg-[#4CAF50]/20 text-[#4CAF50] px-2 py-1 rounded-full">
                              {book.category}
                            </span>
                            <span className="text-xs text-[#FFC107]">★ {book.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

