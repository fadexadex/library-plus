"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, BookOpen } from "lucide-react"
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
]

export function BookRecommendations() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      // Mock API call to GET /api/recommendations
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setShowRecommendations(true)
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="favorite-genre">Favorite Genre</Label>
          <Select defaultValue="fiction">
            <SelectTrigger id="favorite-genre" className="mt-1 bg-[#1E1E1E] border-[#333333]">
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
          <Label htmlFor="favorite-author">Favorite Author</Label>
          <Input id="favorite-author" className="mt-1 bg-[#1E1E1E] border-[#333333]" placeholder="Enter author name" />
        </div>
        <div>
          <Label htmlFor="recently-read">Recently Read Book</Label>
          <Input id="recently-read" className="mt-1 bg-[#1E1E1E] border-[#333333]" placeholder="Enter book title" />
        </div>
        <div>
          <Label htmlFor="reading-level">Reading Level</Label>
          <Select defaultValue="adult">
            <SelectTrigger id="reading-level" className="mt-1 bg-[#1E1E1E] border-[#333333]">
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
        <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90" onClick={handleGetRecommendations} disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Generating Recommendations..." : "Get Personalized Recommendations"}
        </Button>
      </div>

      {showRecommendations && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-[#FFC107]" />
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedBooks.map((book) => (
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
    </div>
  )
}

