"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Header from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <main className="pt-16 pb-8">{children}</main>
    </div>
  )
}

