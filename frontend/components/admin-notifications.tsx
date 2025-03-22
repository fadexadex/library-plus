"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Check } from "lucide-react"
import type { Notification } from "@/lib/api-service"
import { useRouter } from "next/navigation"

interface AdminNotificationsProps {
  notifications: Notification[]
  isLoading?: boolean
}

// Update notifications to navigate to notification page on click
export default function AdminNotifications({ notifications, isLoading = false }: AdminNotificationsProps) {
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const router = useRouter()

  const markAsRead = (notificationId: string) => {
    setReadNotifications((prev) => {
      const newSet = new Set(prev)
      newSet.add(notificationId)
      return newSet
    })
  }

  const markAllAsRead = () => {
    const allIds = notifications.map((notification) => notification.notificationId)
    setReadNotifications(new Set(allIds))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.notificationId)
    router.push("/notifications")
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read && !readNotifications.has(notification.notificationId),
  ).length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && <Badge className="bg-[#FFC107] text-black">{unreadCount}</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full bg-[#333333]" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isRead = notification.read || readNotifications.has(notification.notificationId)

            return (
              <Card
                key={notification.notificationId}
                className={`bg-[#1E1E1E] border-[#333333] transition-colors mb-3 ${
                  isRead ? "opacity-70" : "border-l-4 border-l-[#4CAF50]"
                } cursor-pointer hover:bg-[#2A2A2A]`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1 flex-1">
                      <p className={`${isRead ? "font-normal" : "font-medium"}`}>{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(notification.time).toLocaleString()}</p>
                    </div>
                    {!isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.notificationId)
                        }}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="bg-[#1E1E1E] border-[#333333]">
          <CardContent className="p-6 text-center text-muted-foreground">No notifications to display</CardContent>
        </Card>
      )}
    </div>
  )
}

