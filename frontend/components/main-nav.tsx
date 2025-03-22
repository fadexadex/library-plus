"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, LogIn, UserPlus, Bell, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { apiService, type Notification } from "@/lib/api-service"

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    setIsAdmin(!!adminToken)
  }, [pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch notifications if user is authenticated
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated && !isAdmin) return

      setIsLoadingNotifications(true)
      try {
        const notificationsData = await apiService.getNotifications()
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setIsLoadingNotifications(false)
      }
    }

    if (isAuthenticated || isAdmin) {
      fetchNotifications()
    }
  }, [isAuthenticated, isAdmin])

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Get user initials for avatar
  const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "GU"

  const handleMarkAllAsRead = () => {
    // In a real app, this would call an API endpoint
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
  ]

  // Add user-specific links if authenticated
  if (isAuthenticated) {
    navLinks.push({ href: "/borrowings", label: "My Borrowings" })
  }

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/admin/login"
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled ? "bg-[#121212]/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-[#4CAF50] mr-2" />
            <span className="text-xl font-bold text-[#4CAF50]">LibraryPlus</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#4CAF50] ${
                  pathname === link.href ? "text-[#4CAF50]" : "text-[#E0E0E0]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`text-sm font-medium transition-colors hover:text-[#4CAF50] ${
                  pathname?.includes("/admin") ? "text-[#4CAF50]" : "text-[#E0E0E0]"
                }`}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated || isAdmin ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#FFC107] text-black">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-[#1E1E1E] border-[#333333]">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleMarkAllAsRead}>
                          Mark all as read
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
                      ) : notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem
                            key={notification.notificationId}
                            className="cursor-pointer p-4"
                            onClick={() => router.push("/notifications")}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium line-clamp-2">{notification.message}</span>
                                {!notification.read && <Badge className="h-2 w-2 rounded-full p-0 bg-[#4CAF50]" />}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.time).toLocaleString()}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">No notifications</div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer justify-center">
                      <Link href="/notifications" className="text-sm text-[#4CAF50]">
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarFallback className="bg-[#4CAF50]/20 text-[#4CAF50] font-medium">
                          {isAdmin ? "AD" : userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#333333]">
                    <DropdownMenuLabel>{isAdmin ? "Administrator" : "My Account"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {isAdmin ? (
                      <>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href="/admin/dashboard">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleAdminLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Admin Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href="/borrowings">
                            <BookOpen className="mr-2 h-4 w-4" />
                            My Borrowings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-black/80 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="fixed top-16 left-0 right-0 z-50 bg-[#121212] border-t border-[#333333] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-[#4CAF50] ${
                      pathname === link.href ? "text-[#4CAF50]" : "text-[#E0E0E0]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-[#4CAF50] ${
                      pathname?.includes("/admin") ? "text-[#4CAF50]" : "text-[#E0E0E0]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {!isAuthenticated && !isAdmin && (
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[#E0E0E0] hover:text-[#4CAF50]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

