"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AiAssistantPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your LibraryPlus AI assistant. How can I help you with your book management system today?",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin/login")
    }
  }, [router])

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setIsLoading(true)
    setQuery("")

    try {
      const response = await apiService.askAI(query)

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      })

      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Format message content with markdown-like syntax
  const formatMessage = (content: string) => {
    // Replace **text** with bold
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Replace newlines with <br>
    formattedContent = formattedContent.replace(/\n/g, "<br>")

    // Replace - with bullet points
    formattedContent = formattedContent.replace(/^- (.*?)$/gm, "• $1")

    return formattedContent
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center text-[#4CAF50] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="bg-[#1E1E1E] border-[#333333] max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FFC107]" />
            <CardTitle>AI Assistant</CardTitle>
          </div>
          <CardDescription>Ask questions about your library management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-[#2A2A2A] rounded-md border border-[#333333]">
            {chatHistory.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] rounded-lg p-4 ${
                    message.role === "user" ? "bg-[#4CAF50] text-white ml-auto" : "bg-[#333333] text-white mr-auto"
                  }`}
                >
                  <div className="mr-3 flex-shrink-0">
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5 text-[#FFC107]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-[#333333] text-white rounded-lg p-4 flex items-center max-w-[80%]">
                  <Bot className="h-5 w-5 text-[#FFC107] mr-3" />
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <Input
              placeholder="Type your question here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#2A2A2A] border-[#333333]"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()} className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="max-w-4xl mx-auto mt-6">
        <h3 className="text-lg font-medium mb-2">Suggested Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="justify-start h-auto py-2 bg-[#1E1E1E] border-[#333333] hover:bg-[#2A2A2A]"
            onClick={() => {
              setQuery("What are the most recent borrow requests?")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
          >
            What are the most recent borrow requests?
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-2 bg-[#1E1E1E] border-[#333333] hover:bg-[#2A2A2A]"
            onClick={() => {
              setQuery("How many books are currently on loan?")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
          >
            How many books are currently on loan?
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-2 bg-[#1E1E1E] border-[#333333] hover:bg-[#2A2A2A]"
            onClick={() => {
              setQuery("What are our most popular books this month?")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
          >
            What are our most popular books this month?
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-2 bg-[#1E1E1E] border-[#333333] hover:bg-[#2A2A2A]"
            onClick={() => {
              setQuery("How many new users registered in the last week?")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
          >
            How many new users registered in the last week?
          </Button>
        </div>
      </div>
    </div>
  )
}

