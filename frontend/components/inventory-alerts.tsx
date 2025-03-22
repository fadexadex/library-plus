import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for inventory alerts
const alerts = [
  {
    id: 1,
    type: "low-stock",
    book: "1984",
    message: "Only 2 copies left in stock",
    severity: "high",
  },
  {
    id: 2,
    type: "high-demand",
    book: "The Alchemist",
    message: "High demand - Consider ordering more",
    severity: "medium",
  },
  {
    id: 3,
    type: "low-stock",
    book: "The Catcher in the Rye",
    message: "Only 3 copies left in stock",
    severity: "medium",
  },
  {
    id: 4,
    type: "overdue",
    book: "Lord of the Flies",
    message: "5 copies overdue for more than 30 days",
    severity: "high",
  },
  {
    id: 5,
    type: "high-demand",
    book: "Dune",
    message: "Trending - Consider ordering more",
    severity: "low",
  },
]

export default function InventoryAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center space-x-4 rounded-lg p-3 ${
            alert.severity === "high"
              ? "bg-red-500/10"
              : alert.severity === "medium"
                ? "bg-amber-500/10"
                : "bg-blue-500/10"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              alert.severity === "high"
                ? "bg-red-500/20"
                : alert.severity === "medium"
                  ? "bg-amber-500/20"
                  : "bg-blue-500/20"
            }`}
          >
            {alert.type === "low-stock" && (
              <TrendingDown
                className={`h-5 w-5 ${
                  alert.severity === "high"
                    ? "text-red-500"
                    : alert.severity === "medium"
                      ? "text-amber-500"
                      : "text-blue-500"
                }`}
              />
            )}
            {alert.type === "high-demand" && (
              <TrendingUp
                className={`h-5 w-5 ${
                  alert.severity === "high"
                    ? "text-red-500"
                    : alert.severity === "medium"
                      ? "text-amber-500"
                      : "text-blue-500"
                }`}
              />
            )}
            {alert.type === "overdue" && (
              <AlertTriangle
                className={`h-5 w-5 ${
                  alert.severity === "high"
                    ? "text-red-500"
                    : alert.severity === "medium"
                      ? "text-amber-500"
                      : "text-blue-500"
                }`}
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{alert.book}</h4>
              <Badge
                className={`${
                  alert.severity === "high"
                    ? "bg-red-500"
                    : alert.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                }`}
              >
                {alert.severity === "high" ? "High" : alert.severity === "medium" ? "Medium" : "Low"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

