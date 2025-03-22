"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, X, Minimize, Send } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { apiService } from "@/lib/api-service"

interface AiAssistantWidgetProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function AiAssistantWidget({ isOpen, onClose }: AiAssistantWidgetProps) {
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your library assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!isOpen) return null

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the actual AI API endpoint
      const response = await apiService.askAI(input)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="w-12 h-12 rounded-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 p-0 shadow-lg"
          onClick={() => setMinimized(false)}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] z-50 flex flex-col shadow-xl bg-[#1E1E1E] border-[#333333]">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0 border-b border-[#333333]">
        <CardTitle className="text-base font-medium flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-[#4CAF50]" />
          AI Library Assistant
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMinimized(true)}>
            <Minimize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[380px] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2 bg-[#4CAF50]/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#4CAF50]" />
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "assistant" ? "bg-[#2A2A2A] text-white" : "bg-[#4CAF50] text-white ml-2"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2 bg-[#4CAF50]/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#4CAF50]" />
              </Avatar>
              <div className="max-w-[80%] rounded-lg p-3 bg-[#2A2A2A]">
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-[#4CAF50] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-[#4CAF50] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-[#4CAF50] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t border-[#333333]">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            className="flex-1 min-h-10 max-h-32 bg-[#2A2A2A] border-[#333333]"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

