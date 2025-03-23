"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api-service"
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function PurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [book, setBook] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true)
        const bookData = await apiService.getBook(params.id)
        setBook(bookData)
      } catch (error) {
        console.error("Failed to fetch book:", error)
        toast({
          title: "Error",
          description: "Failed to load book details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, toast])

  // Check if there's a pending purchase action after login
  useEffect(() => {
    if (isAuthenticated && book) {
      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin")
      if (redirectAfterLogin && redirectAfterLogin === `/books/${params.id}/purchase`) {
        localStorage.removeItem("redirectAfterLogin")
      }
    }
  }, [isAuthenticated, book, params.id])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handlePurchase = async () => {
    if (!book) return

    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      // Store the current page URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", `/books/${params.id}/purchase`)
      router.push("/login")
      return
    }

    setIsProcessing(true)
    try {
      const response = await apiService.initiatePayment({
        bookId: book.bookId,
        title: book.title,
        price: book.price, // Use the price directly without conversion
        quantity: quantity,
      })

      // Redirect to payment page
      window.location.href = response.url
    } catch (error) {
      console.error("Payment initiation failed:", error)
      toast({
        title: "Payment Failed",
        description: "Unable to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Book
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <>
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </>
        ) : book ? (
          <>
            <div>
              <div className="rounded-lg overflow-hidden border border-[#333333] bg-[#1E1E1E]">
                <img
                  src={book.coverImage || "/placeholder.svg?height=400&width=300"}
                  alt={book.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            <div>
              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader>
                  <CardTitle className="text-2xl">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-[#4CAF50]">${book.price}</p>
                    <p className="text-sm text-muted-foreground">
                      {book.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <Separator className="bg-[#333333]" />

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mx-2 text-center bg-[#1E1E1E] border-[#333333]"
                      />
                      <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-10 w-10">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-semibold">Total: ${(Number.parseFloat(book.price) * quantity).toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                    onClick={handlePurchase}
                    disabled={isProcessing || book.stockStatus !== "IN_STOCK"}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isProcessing ? "Processing..." : "Purchase Now"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center py-12">
            <h2 className="text-2xl font-bold">Book not found</h2>
            <p className="text-muted-foreground mt-2">The book you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => router.push("/books")}>
              Browse Books
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

