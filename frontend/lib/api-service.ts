// Types for API responses and requests
export interface Book {
  bookId: string
  title: string
  author: string
  isbn: string
  category: string
  copies: number
  shelf: string
  price: string
  coverImage: string
  description: string
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK"
  createdAt: string
  updatedAt: string
}   

export interface BorrowRequest {
  borrowId: string
  bookId: string
  userId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "OVERDUE" | "RETURNED" | "RETURN_REQUESTED"
  dueDate: string | null
  borrowDate: string
  returned: boolean
  createdAt: string
  updatedAt: string
  rejectionReason: string | null
  approvalCode: string | null
  book: {
    title: string
  }
}

export interface Notification {
  notificationId: string
  userId: string
  message: string
  read: boolean
  time: string
}

export interface Activity {
  activityId: string
  userId: string
  bookId: string
  action: string
  timestamp: string
  user?: {
    firstName: string
    lastName: string
  }
  book?: {
    title: string
  }
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface PaginationData {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export interface BooksResponse {
  books: Book[]
  pagination: PaginationData
}

// Add the Purchase type
export interface Purchase {
  purchaseId: string
  userId: string
  bookId: string
  quantity: number
  transactionId: string | null
  price: string
  createdAt: string
  user?: {
    firstName: string
    lastName: string
  }
  book?: {
    title: string
  }
}

// API Service
class ApiService {
  private baseUrl = "https://library-plus-production.up.railway.app/api/v1"

  // Helper method to get auth token
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("adminToken")
    }
    return null
  }

  // Helper method for API requests
  private async request<T>(
    endpoint: string,
    method = "GET",
    data?: any,
    isFormData = false,
    requiresAuth = true,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getToken()

    const headers: HeadersInit = {}

    if (requiresAuth) {
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      } else if (requiresAuth) {
        throw new Error("Authentication required")
      }
    }

    if (!isFormData && method !== "GET") {
      headers["Content-Type"] = "application/json"
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data) {
      if (isFormData) {
        options.body = data
      } else if (method !== "GET") {
        options.body = JSON.stringify(data)
      }
    }

    try {
      const response = await fetch(url, options)

      // Special case for 404 when fetching borrow requests - return empty array instead of error
      if (response.status === 404 && endpoint.includes("/borrow-requests")) {
        return [] as unknown as T
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: User }> {
    // Make sure we're not nesting email and password incorrectly
    return this.request("/auth/login", "POST", credentials, false, false)
  }

  async adminLogin(email: string, password: string): Promise<{ token: string }> {
    return this.request("/auth/admin/login", "POST", { email, password }, false, false)
  }

  async register(userData: { firstName: string; lastName: string; email: string; password: string }): Promise<{
    token: string
  }> {
    return this.request("/auth/register", "POST", userData, false, false)
  }

  async getCurrentUser(): Promise<User> {
    return this.request("/auth/me")
  }

  // Book endpoints
  async getBooks(page = 1): Promise<BooksResponse> {
    return this.request(`/general/books?page=${page}`, "GET", null, false, false)
  }

  async getBook(bookId: string): Promise<Book> {
    console.log(`Fetching book with ID: ${bookId} from endpoint: /general/books/${bookId}`)
    try {
      const book = await this.request<Book>(`/general/books/${bookId}`, "GET", null, false, false)
      console.log("Book data received successfully:", book)
      return book
    } catch (error) {
      console.error(`Failed to fetch book with ID: ${bookId}`, error)
      throw error
    }
  }

  async createBook(bookData: FormData): Promise<{ message: string }> {
    try {
      // Make sure we're sending the FormData correctly with the right authorization
      return this.request("/admin/books/create", "POST", bookData, true)
    } catch (error) {
      console.error("Create book error:", error)
      throw error
    }
  }

  // New method for updating a book
  async updateBook(bookId: string, bookData: FormData): Promise<{ message: string }> {
    try {
      return this.request(`/admin/books/${bookId}`, "PATCH", bookData, true)
    } catch (error) {
      console.error(`Update book error for book ID ${bookId}:`, error)
      throw error
    }
  }

  // New method for deleting a book
  async deleteBook(bookId: string): Promise<{ message: string }> {
    try {
      return this.request(`/admin/books/${bookId}`, "DELETE")
    } catch (error) {
      console.error(`Delete book error for book ID ${bookId}:`, error)
      throw error
    }
  }

  // Update the API service to properly handle file uploads and improve error handling
  async batchCreateBooks(file: File): Promise<{ message: string }> {
    // Accept all allowed MIME types
    const allowedMimeTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    // Also check file extension as a fallback
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = ["csv", "xls", "xlsx"]

    if (!allowedMimeTypes.includes(file.type) && !(fileExtension && allowedExtensions.includes(fileExtension))) {
      throw new Error("Only CSV files are allowed")
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      console.log("Sending batch create request with file:", file.name, "Type:", file.type, "Size:", file.size)
      return this.request("/admin/books/batch-create", "POST", formData, true)
    } catch (error) {
      console.error("Batch create error:", error)
      throw error
    }
  }

  // Add this new search method to the ApiService class
  async searchBooks(query: string): Promise<Book[]> {
    if (!query.trim()) {
      return []
    }

    try {
      console.log(`Searching books with query: ${query}`)
      const response = await this.request<{ data: Book[] }>(
        `/general/search?q=${encodeURIComponent(query)}`,
        "GET",
        null,
        false,
        false,
      )

      // Log the response for debugging
      console.log("Search response:", response)

      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} books matching query`)
        return response.data
      } else if (Array.isArray(response)) {
        console.log(`Found ${response.length} books matching query (direct array)`)
        return response
      } else {
        console.warn("Unexpected search response format:", response)
        return []
      }
    } catch (error) {
      console.error(`Failed to search books with query: ${query}`, error)
      return []
    }
  }

  // Borrow request endpoints
  async borrowBook(bookId: string): Promise<{ message: string }> {
    return this.request(`/user/books/${bookId}/borrow`, "POST")
  }

  async returnBook(borrowId: string): Promise<{ message: string }> {
    return this.request(`/user/books/${borrowId}/return`, "POST")
  }

  async getBorrowRequests(): Promise<BorrowRequest[]> {
    return this.request("/user/borrow-requests")
  }

  async getBorrowRequest(borrowId: string): Promise<BorrowRequest> {
    return this.request(`/user/borrow-requests/${borrowId}`)
  }

  async getAdminBorrowRequests(status?: string): Promise<BorrowRequest[]> {
    const endpoint = status ? `/admin/borrow-requests?status=${status}` : "/admin/borrow-requests"

    try {
      const response = await this.request<BorrowRequest[] | { message: string }>(endpoint)
      // Check if it's a message response indicating no requests found
      if (Array.isArray(response)) {
        return response
      }
      // If it's a message object, return empty array
      return []
    } catch (error) {
      return []
    }
  }

  async updateBorrowRequestStatus(borrowId: string, status: string): Promise<{ message: string }> {
    return this.request(`/admin/borrow-requests/${borrowId}/status`, "PUT", { status })
  }

  // Notification endpoints
  async getNotifications(): Promise<Notification[]> {
    const token = this.getToken()
    if (!token) {
      return []
    }

    try {
      return this.request("/general/notifications")
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      return []
    }
  }

  async getAdminNotifications(): Promise<Notification[]> {
    const token = this.getToken()
    if (!token) {
      return []
    }

    try {
      return this.request("/admin/notifications")
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error)
      return []
    }
  }

  // Activity endpoints
  async getAdminActivities(): Promise<Activity[]> {
    return this.request("/admin/activities")
  }

  // Add this new method for initiating payment
  async initiatePayment(paymentData: {
    bookId: string
    title: string
    price: number
    quantity: number
  }): Promise<{ message: string; url: string }> {
    try {
      // Make sure we're using the authentication token
      const token = this.getToken()
      if (!token) {
        throw new Error("Authentication required. Please log in to make a purchase.")
      }

      // Use the request method which will automatically include the token
      const response = await this.request<{ message: string; url: string }>(
        "/general/purchase/initiate",
        "POST",
        paymentData,
      )

      // Validate the response
      if (!response || !response.url) {
        throw new Error("Invalid response from payment service")
      }

      return response
    } catch (error) {
      console.error("Payment initiation error:", error)
      throw error
    }
  }

  // Method to ask AI assistant
  async askAI(query: string): Promise<{ response: string }> {
    try {
      return this.request("/admin/ask-ai", "POST", { query })
    } catch (error) {
      console.error("AI query error:", error)
      throw error
    }
  }

  // Method to get admin purchases
  async getAdminPurchases(): Promise<Purchase[]> {
    try {
      console.log("Fetching admin purchases")
      const response = await this.request<Purchase[]>("/admin/purchases")
      console.log(`Retrieved ${response.length} purchases`)
      return response
    } catch (error) {
      console.error("Get purchases error:", error)
      // Return empty array instead of throwing
      return []
    }
  }

  // Add these new analytics endpoints to the existing ApiService class

  // Inside the ApiService class, add these methods:

  // Sales analytics
  async getSalesByMonth(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/sales/monthly")
    } catch (error) {
      console.error("Failed to fetch monthly sales data:", error)
      return []
    }
  }

  async getSalesByCategory(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/sales/by-category")
    } catch (error) {
      console.error("Failed to fetch sales by category data:", error)
      return []
    }
  }

  async getTopSellingBooks(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/sales/top-books")
    } catch (error) {
      console.error("Failed to fetch top selling books:", error)
      return []
    }
  }

  // Borrowing analytics
  async getBorrowingTrends(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/borrowing/trends")
    } catch (error) {
      console.error("Failed to fetch borrowing trends:", error)
      return []
    }
  }

  async getReturnRates(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/borrowing/return-rates")
    } catch (error) {
      console.error("Failed to fetch return rates:", error)
      return []
    }
  }

  async getOverdueStats(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/borrowing/overdue")
    } catch (error) {
      console.error("Failed to fetch overdue stats:", error)
      return []
    }
  }

  // User analytics
  async getUserGrowth(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/users/growth")
    } catch (error) {
      console.error("Failed to fetch user growth data:", error)
      return []
    }
  }

  async getUserActivity(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/users/activity")
    } catch (error) {
      console.error("Failed to fetch user activity data:", error)
      return []
    }
  }

  // Inventory analytics
  async getInventoryByCategory(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/inventory/by-category")
    } catch (error) {
      console.error("Failed to fetch inventory by category:", error)
      return []
    }
  }

  async getLowStockItems(): Promise<any[]> {
    try {
      return this.request("/admin/analytics/inventory/low-stock")
    } catch (error) {
      console.error("Failed to fetch low stock items:", error)
      return []
    }
  }

  // Dashboard summary
  async getDashboardSummary(): Promise<any> {
    try {
      return this.request("/admin/analytics/dashboard-summary")
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error)
      return {
        totalBooks: 0,
        activeUsers: 0,
        pendingRequests: 0,
        returnRequests: 0,
        totalSales: 0,
        monthlySales: 0,
        salesGrowth: 0,
        booksOnLoan: 0,
      }
    }
  }

  // Add these methods to the ApiService class:

  // Notification methods
  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    return this.request(`/general/notifications/${notificationId}/mark-as-read`, "POST")
  }

  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    return this.request(`/general/notifications/${notificationId}`, "DELETE")
  }

  // Helper method to format price correctly
  formatPrice(price: string | number): string {
    // If price is a string, convert to number first
    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

    // Format with 2 decimal places and no extra zeros
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice)
  }

  // Get user count
  async getUserCount() {
    const token = this.getToken()
    if (!token) {
      throw new Error("No admin token found")
    }

    try {
      const response = await fetch(`${this.baseUrl}/admin/user/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch user count")
      }

      return await response.json()
    } catch (error) {
      console.error("Get user count error:", error)
      throw error
    }
  }
}

export const apiService = new ApiService()

