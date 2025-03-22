"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Home, BookOpen, ShoppingCart } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract payment details from URL parameters if available
  const bookTitle = searchParams?.get("title") || "your book"
  const bookId = searchParams?.get("bookId") || ""

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-500/20 p-3">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your purchase of "{bookTitle}" was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-[#2A2A2A] p-4 border border-[#333333]">
            <p className="text-center mb-2">
              <ShoppingCart className="inline-block mr-2 h-5 w-5 text-amber-500" />
              <span className="font-medium">Payment Not Completed</span>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Your payment was cancelled and you have not been charged. You can try again or browse other books.
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>If you experienced any issues during checkout, please contact our support team.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {bookId && (
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-black"
              onClick={() => router.push(`/books/${bookId}/purchase`)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90" onClick={() => router.push("/books")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse More Books
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

