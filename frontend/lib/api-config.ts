// Centralized API configuration
// This allows easy updates if the base URL changes

export const API_CONFIG = {
  baseUrl: "https://library-plus-production.up.railway.app/api/v1",

  // Auth endpoints
  auth: {
    login: "/auth/login",
    adminLogin: "/auth/admin/login",
    me: "/auth/me",
    register: "/auth/register",
  },

  // Books endpoints
  books: {
    list: "/general/books",
    details: (id: string) => `/general/books/${id}`,
  },

  // Borrowing endpoints
  borrowing: {
    borrow: (id: string) => `/user/books/${id}/borrow`,
    requests: "/user/borrow-requests",
    requestDetails: (id: string) => `/user/borrow-requests/${id}`,
    return: (id: string) => `/user/books/${id}/return`,
  },

  // Notifications endpoint
  notifications: {
    list: "/general/notifications",
  },

  // Admin endpoints
  admin: {
    createBook: "/admin/books/create",
    batchCreateBooks: "/admin/books/batch-create",
    borrowRequests: "/admin/borrow-requests",
    borrowRequestDetails: (id: string) => `/admin/borrow-requests/${id}`,
    updateBorrowRequestStatus: (id: string) => `/admin/borrow-requests/${id}/status`,
    activities: "/admin/activities",
  },
}

// Helper function to update the base URL
export const updateBaseUrl = (newUrl: string) => {
  API_CONFIG.baseUrl = newUrl
}

// Helper function to get full URL
export const getFullUrl = (endpoint: string) => {
  return `${API_CONFIG.baseUrl}${endpoint}`
}

