"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

  useEffect(() => {
    // Check for redirect parameter in URL
    const redirect = searchParams?.get("redirect")
    if (redirect) {
      localStorage.setItem("redirectAfterLogin", redirect)
    }

    const registered = searchParams?.get("registered")
    if (registered === "true") {
      setShowRegistrationSuccess(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)

      // The router navigation is now handled in the login function in auth-provider
      // No need to navigate here as it will cause double navigation
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] p-4">
      <Card className="w-full max-w-md bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-[#4CAF50]" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to LibraryPlus</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {showRegistrationSuccess && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Account created successfully! Please sign in.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
            <div className="space-y-2">
              <div>
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2A2A2A] border-[#333333]"
              />
            </div>
            <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#4CAF50] hover:underline">
              Sign up
            </Link>
          </p>
          <div className="w-full border-t border-[#333333] my-2"></div>
          <p className="text-xs text-muted-foreground text-center">
            <Link href="/admin/login" className="hover:underline">
              Admin Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

