"use client"

import { Avatar } from "@/components/ui/avatar"
import type { Activity } from "@/lib/api-service"
import { BookOpen, User, Clock, ShoppingCart, RotateCcw } from "lucide-react"

interface RecentActivitiesProps {
  activities?: Activity[]
}

export default function RecentActivities({ activities = [] }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recent activities found.</div>
  }

  const getActivityIcon = (action: string) => {
    if (action.includes("borrow") || action.includes("loan")) {
      return <BookOpen className="h-4 w-4 text-blue-500" />
    } else if (action.includes("return")) {
      return <RotateCcw className="h-4 w-4 text-green-500" />
    } else if (action.includes("purchase") || action.includes("bought") || action.includes("sold")) {
      return <ShoppingCart className="h-4 w-4 text-amber-500" />
    } else if (action.includes("user") || action.includes("register")) {
      return <User className="h-4 w-4 text-purple-500" />
    } else {
      return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    }
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {activities.slice(0, 10).map((activity) => (
        <div key={activity.activityId} className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 bg-[#2A2A2A] flex items-center justify-center">
            {activity.action.includes("user") ? (
              <User className="h-5 w-5 text-[#4CAF50]" />
            ) : (
              getActivityIcon(activity.action)
            )}
          </Avatar>
          <div className="space-y-1 flex-1">
            <p className="text-sm">
              <span className="font-medium">
                {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : "Unknown user"}
              </span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              {activity.book && <span className="font-medium">"{activity.book.title}"</span>}
            </p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

