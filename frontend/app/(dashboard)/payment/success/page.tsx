"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Home, BookOpen } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract payment details from URL parameters if available
  const bookTitle = searchParams?.get("title") || "your book"
  const orderNumber = searchParams?.get("order") || "N/A"

  useEffect(() => {
    // You could verify the payment status with your backend here
    const verifyPayment = async () => {
      // This would be an API call in a real implementation
      console.log("Verifying payment for order:", orderNumber)
    }

    if (orderNumber !== "N/A") {
      verifyPayment()
    }
  }, [orderNumber])

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-500/20 p-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your purchase has been completed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-[#2A2A2A] p-4 border border-[#333333]">
            <div className="text-center mb-2">
              <p className="font-medium text-lg">Order Details</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Book:</span>
                <span className="font-medium">{bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#2A2A2A] p-4 border border-[#333333]">
            <p className="text-center mb-2">
              <Mail className="inline-block mr-2 h-5 w-5 text-[#4CAF50]" />
              <span className="font-medium">Check Your Email</span>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              A confirmation email has been sent to your registered email address with your purchase details and
              receipt.
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>If you have any questions about your purchase, please contact our support team.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
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

