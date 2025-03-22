"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { BookOpen, Package, Users, ShoppingCart, Search, Menu, X, Home, BookCopy, LogOut, Bell } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { logout, user } = useAuth()

  const routes = useMemo(
    () => [
      {
        label: "Dashboard",
        icon: Home,
        href: "/",
        color: "text-[#E0E0E0]",
      },
      {
        label: "Books",
        icon: BookOpen,
        href: "/books",
        color: "text-[#E0E0E0]",
      },
      {
        label: "Inventory",
        icon: Package,
        href: "/inventory",
        color: "text-[#E0E0E0]",
        adminOnly: true,
      },
      {
        label: "My Borrowings",
        icon: BookCopy,
        href: "/borrowings",
        color: "text-[#E0E0E0]",
        customerOnly: true,
      },
      {
        label: "Lending",
        icon: BookCopy,
        href: "/lending",
        color: "text-[#E0E0E0]",
        adminOnly: true,
      },
      {
        label: "Sales",
        icon: ShoppingCart,
        href: "/sales",
        color: "text-[#E0E0E0]",
        adminOnly: true,
      },
      {
        label: "Users",
        icon: Users,
        href: "/users",
        color: "text-[#E0E0E0]",
        adminOnly: true,
      },
      {
        label: "Search",
        icon: Search,
        href: "/search",
        color: "text-[#E0E0E0]",
      },
      {
        label: "Notifications",
        icon: Bell,
        href: "/notifications",
        color: "text-[#E0E0E0]",
      },
    ],
    [],
  )

  // Filter routes based on user role
  const filteredRoutes = useMemo(() => {
    if (!user) return routes.filter((route) => !route.adminOnly && !route.customerOnly)

    const isAdmin = user?.role === "ADMIN"
    return routes.filter((route) => (!route.adminOnly || isAdmin) && (!route.customerOnly || !isAdmin))
  }, [routes, user])

  const handleLogout = async () => {
    await logout()
  }

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full bg-[#4CAF50] text-white shadow-lg hover:bg-[#4CAF50]/90"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setIsOpen(false)}>
            <div
              className="fixed inset-y-0 left-0 w-72 bg-[#1E1E1E] p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="text-xl font-bold text-[#4CAF50]">LibraryPlus</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-1">
                {filteredRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-colors hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]",
                      pathname === route.href ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "text-[#E0E0E0]",
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", pathname === route.href ? "text-[#4CAF50]" : route.color)} />
                    {route.label}
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-6 left-0 right-0 px-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base hover:bg-red-500/10 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-[#1E1E1E] pt-20 md:flex">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-colors hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]",
                pathname === route.href ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "text-[#E0E0E0]",
              )}
            >
              <route.icon className={cn("h-5 w-5", pathname === route.href ? "text-[#4CAF50]" : route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-[#333333] px-4 py-6">
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2 text-base hover:bg-red-500/10 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

