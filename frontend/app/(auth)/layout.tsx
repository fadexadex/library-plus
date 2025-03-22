import type React from "react"
import { redirect } from "next/navigation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if admin is logged in on the client side
  if (typeof window !== "undefined") {
    const adminToken = localStorage.getItem("adminToken")
    if (adminToken) {
      redirect("/admin/dashboard")
    }

    const userToken = localStorage.getItem("token")
    if (userToken) {
      redirect("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

