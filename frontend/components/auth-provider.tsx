"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiService, type User } from "@/lib/api-service"

// Define user roles
export type UserRole = "ADMIN" | "CUSTOMER"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // Get current user data
          const userData = await apiService.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle redirects based on auth status
  useEffect(() => {
    if (!isLoading) {
      const authRoutes = ["/login", "/register", "/forgot-password"]
      const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route))
      const publicRoutes = ["/", "/books", "/search"]
      const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))

      if (!isAuthenticated && pathname && !isAuthRoute && !isPublicRoute) {
        router.push("/login")
      } else if (isAuthenticated && isAuthRoute) {
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const response = await apiService.login({ email, password })

        // Check if response and token exist
        if (!response || !response.token) {
          throw new Error("Invalid response from server")
        }

        localStorage.setItem("token", response.token)

        // Ensure user data exists before setting it
        if (response.user && response.user.firstName) {
          setUser(response.user)
          setIsAuthenticated(true)

          toast({
            title: "Login successful",
            description: `Welcome back, ${response.user.firstName}!`,
          })
        } else {
          // If user data is missing, fetch it separately
          const userData = await apiService.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)

          toast({
            title: "Login successful",
            description: "Welcome back!",
          })
        }

        // Check for redirect after login
        const redirectUrl = localStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin")
          router.push(redirectUrl)
          return
        }

        // Check if there was a book the user was trying to borrow
        const borrowAfterLogin = localStorage.getItem("borrowAfterLogin")
        if (borrowAfterLogin) {
          localStorage.removeItem("borrowAfterLogin")
          router.push(`/books/${borrowAfterLogin}`)
        } else {
          router.push("/") // Redirect to home page after successful login
        }
      } catch (error) {
        console.error("Login failed:", error)
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast, router],
  )

  const register = useCallback(
    async (userData: RegisterData) => {
      setIsLoading(true)
      try {
        // Call register API
        await apiService.register(userData)

        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })

        return
      } catch (error) {
        console.error("Registration failed:", error)
        // More user-friendly error message extraction
        const errorMessage = error instanceof Error ? error.message : "Could not create your account"

        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      // Remove token
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

