"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Notification } from "@/lib/api-service"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true)
      try {
        const notificationsData = await apiService.getNotifications()
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [toast])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Call the API to mark notification as read
      await apiService.markNotificationAsRead(notificationId)

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      toast({
        title: "Success",
        description: "Notification marked as read",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = () => {
    // In a real app, this would call an API endpoint
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // Call the API to delete notification
      await apiService.deleteNotification(notificationId)

      // Update local state
      setNotifications((prev) => prev.filter((notification) => notification.notificationId !== notificationId))

      toast({
        title: "Success",
        description: "Notification deleted",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to delete notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "read") return notification.read
    return true
  })

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">Stay updated with important alerts and information</p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="bg-[#1E1E1E] border-[#333333] self-start sm:self-auto"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#1E1E1E] border-[#333333]">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount > 0 && <Badge className="ml-2 bg-[#4CAF50]">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card className="bg-[#1E1E1E] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  {activeTab === "all"
                    ? "All Notifications"
                    : activeTab === "unread"
                      ? "Unread Notifications"
                      : "Read Notifications"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "all"
                    ? "All your notifications"
                    : activeTab === "unread"
                      ? "Notifications you haven't read yet"
                      : "Notifications you've already read"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full bg-[#333333]" />
                    ))}
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.notificationId}
                        className={`p-2 rounded-lg flex items-center justify-between gap-2 ${
                          notification.read ? "bg-[#1E1E1E]" : "bg-[#1E1E1E]/70 border border-[#4CAF50]/30"
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.message}</h4>
                            {!notification.read && <Badge className="bg-[#4CAF50] text-xs py-0 px-2">New</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.time).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMarkAsRead(notification.notificationId)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteNotification(notification.notificationId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No notifications to display</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

