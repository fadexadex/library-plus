"use client"

import type React from "react"

import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImageUrl: string
}

interface BookPageProps {
  params: {
    id: string
  }
}

const BookPage: React.FC<BookPageProps> = ({ params }) => {
  const bookId = params.id
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Simulate fetching book data (replace with actual API call)
    const fetchBook = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual data fetching logic
        const mockBookData: Book = {
          id: bookId,
          title: `Book Title ${bookId}`,
          author: `Author ${bookId}`,
          description: `This is a description for book ${bookId}.`,
          coverImageUrl: `/images/book-cover.png`, // Replace with actual image URL
        }
        setBook(mockBookData)
      } catch (error) {
        console.error("Error fetching book:", error)
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()

    // Check authentication status (replace with your actual authentication check)
    const checkAuth = () => {
      // Simulate authentication check
      const token = localStorage.getItem("token")
      setIsAuthenticated(!!token) // Set to true if token exists, false otherwise
    }

    checkAuth()
  }, [bookId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!book) {
    return <div>Book not found.</div>
  }

  const handlePurchase = () => {
    if (!isAuthenticated) {
      localStorage.setItem("purchaseAfterLogin", bookId)
      router.push("/login")
      return
    }

    router.push(`/books/${bookId}/purchase`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <img
            src={book.coverImageUrl || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            className="w-full rounded-md shadow-md"
          />
        </div>
        <div className="md:col-span-1">
          <h1 className="text-2xl font-semibold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-4">By {book.author}</p>
          <p className="mb-4">{book.description}</p>
          <Button variant="outline" onClick={handlePurchase}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Purchase
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookPage

