"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api-service"
import { ArrowLeft, ShoppingCart, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaymentDebugPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [formData, setFormData] = useState({
    bookId: "1",
    title: "Test Book",
    price: "9.99",
    quantity: "1",
  })

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTestPayment = async () => {
    setIsLoading(true)
    setError(null)
    addLog("Starting payment test...")

    try {
      // Check token
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken")
      addLog(`Auth token: ${token ? "exists" : "missing"}`)

      if (!token) {
        throw new Error("No authentication token found. Please log in.")
      }

      // Prepare payment data
      const paymentData = {
        bookId: formData.bookId,
        title: formData.title,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
      }

      addLog(`Payment data: ${JSON.stringify(paymentData)}`)

      // Make the API call
      addLog("Calling payment API...")
      const response = await apiService.initiatePayment(paymentData)

      addLog(`API response: ${JSON.stringify(response)}`)

      if (response && response.url) {
        addLog(`Payment URL: ${response.url}`)
        toast({
          title: "Success",
          description: "Payment initiated successfully. Click the link below to proceed.",
        })
      } else {
        throw new Error("Invalid response from payment service")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      addLog(`Error: ${errorMessage}`)
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      addLog("Test completed")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="max-w-2xl mx-auto bg-[#1E1E1E] border-[#333333]">
        <CardHeader>
          <CardTitle>Payment Debug Tool</CardTitle>
          <CardDescription>Test the payment API integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookId">Book ID</Label>
              <Input
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleInputChange}
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label>Debug Logs</Label>
            <div className="mt-2 p-4 bg-[#2A2A2A] border border-[#333333] rounded-md h-48 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">Logs will appear here</div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            onClick={handleTestPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Payment...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Test Payment API
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

