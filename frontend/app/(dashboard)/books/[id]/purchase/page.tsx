"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Book } from "@/lib/api-service"
import { ArrowLeft, ShoppingCart, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export default function PurchaseBookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)

  const bookId = params.id

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/books/${bookId}/purchase`)
    }
  }, [isAuthenticated, router, bookId])

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await apiService.getBook(bookId)
        setBook(bookData)
      } catch (error) {
        console.error("Failed to fetch book:", error)
        toast({
          title: "Error",
          description: "Failed to load book details. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (bookId) {
      fetchBook()
    }
  }, [bookId, toast])

  // Update the handlePurchase function to include better error handling and timeout
  const handlePurchase = async () => {
    if (!book) return
    if (!isAuthenticated) {
      router.push(`/login?redirect=/books/${bookId}/purchase`)
      return
    }

    setIsLoading(true)
    setError(null)

    // Create an AbortController to handle timeouts
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      // Parse the price correctly - ensure it's a simple number without any formatting
      const priceValue =
        typeof book.price === "string" ? Number.parseFloat(book.price.replace(/[^0-9.-]+/g, "")) : book.price

      console.log("Initiating payment for:", {
        bookId: book.bookId,
        title: book.title,
        price: priceValue,
        quantity,
      })

      const response = await apiService.initiatePayment({
        bookId: book.bookId,
        title: book.title,
        price: priceValue,
        quantity,
      })

      clearTimeout(timeoutId)

      console.log("Payment initiation response:", response)

      if (response && response.url) {
        // Add a small delay before redirecting
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment page...",
        })

        setTimeout(() => {
          window.location.href = response.url
        }, 1000)
      } else {
        throw new Error("Invalid response from payment service")
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Failed to initiate payment:", error)

      // Handle timeout errors specifically
      if (error.name === "AbortError") {
        setError("Payment request timed out. Please try again.")
      } else {
        setError(error instanceof Error ? error.message : "Failed to initiate payment. Please try again.")
      }

      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="max-w-md mx-auto bg-[#1E1E1E] border-[#333333]">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to make a purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">You need to be logged in to purchase books.</p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
              onClick={() => router.push(`/login?redirect=/books/${bookId}/purchase`)}
            >
              Log In to Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-6">
        <Link href={`/books/${bookId}`} className="flex items-center text-[#4CAF50] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book Details
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-md mx-auto bg-[#1E1E1E] border-[#333333]">
        <CardHeader>
          <CardTitle>Purchase Book</CardTitle>
          <CardDescription>Complete your purchase for {book?.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {book && (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{book.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Author</p>
                <p>{book.author}</p>
              </div>
              <div className="text-2xl font-bold">{apiService.formatPrice(book.price)}</div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={book.copies}
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="pt-4 border-t border-[#333333]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{apiService.formatPrice(Number.parseFloat(book.price) * quantity)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            onClick={handlePurchase}
            disabled={isLoading || !book}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

