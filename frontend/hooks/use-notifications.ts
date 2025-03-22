"use client"

import { useState, useEffect } from "react"
import { apiService, type Notification } from "@/lib/api-service"

export function useNotifications(pollInterval = 5000) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = async () => {
    // Check if user is authenticated before fetching notifications
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken")
    if (!token) return

    try {
      const newNotifications = await apiService.getNotifications()
      setNotifications(newNotifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, pollInterval)

    return () => clearInterval(intervalId)
  }, [pollInterval])

  return { notifications, refetch: fetchNotifications }
}

