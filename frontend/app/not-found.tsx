import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-[#E0E0E0] p-4">
      <BookX className="h-24 w-24 text-[#4CAF50] mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Button asChild className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  )
}

