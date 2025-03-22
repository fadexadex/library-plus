"use client"

import { useState, useCallback } from "react"

export const useFallbackUrl = () => {
  const [useFallback, setUseFallback] = useState(false)

  const toggleFallbackUrl = useCallback(() => {
    setUseFallback((prev) => !prev)
    return !prev
  }, [])

  return { useFallback, toggleFallbackUrl }
}

