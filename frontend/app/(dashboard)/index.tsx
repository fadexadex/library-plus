"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This is a redirect component that sends users to the dashboard page
export default function IndexRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return null
}

