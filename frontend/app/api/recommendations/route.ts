import { NextResponse } from "next/server"

// Mock data for recommendations
const recommendations = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    rating: 4.5,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    rating: 4.8,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    rating: 4.7,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 4,
    title: "The Song of Achilles",
    author: "Madeline Miller",
    category: "Historical Fiction",
    rating: 4.6,
    coverImage: "/placeholder.svg?height=200&width=150",
  },
]

export async function GET(request: Request) {
  try {
    // In a real application, you would:
    // 1. Get user preferences or history
    // 2. Generate personalized recommendations

    // Mock successful response
    return NextResponse.json({ success: true, data: recommendations }, { status: 200 })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch recommendations" }, { status: 500 })
  }
}

