# LibraryPlus - Modern Library Management System

## Overview

LibraryPlus is an advanced library management system designed for schools, universities, and public libraries. It streamlines book discovery, borrowing, and purchasing, providing an intuitive dark-themed interface for both users and administrators.

### Live Demo
[Live Frontend URL](#) | [Demo Video](#)

### Demo Credentials
- **User & Admin Account:**
  - **Email:** johndoe200@gmail.com
  - **Password:** ExplicitCyclo

## Why Choose LibraryPlus?

LibraryPlus offers a seamless, digital-first approach to managing libraries efficiently. Users can easily browse, borrow, and buy books, while administrators gain powerful tools for inventory control, loan management, and user oversight. The built-in analytics and AI assistant further enhance library operations.

## Features

### For Users
- **Book Discovery:** Browse and search the library catalog
- **Borrowing System:** Request books and track approvals
- **Return Management:** Submit return requests
- **Purchase Books:** Buy books with Stripe integration
- **Personal Dashboard:** Monitor borrowing history
- **Notifications:** Get alerts on due dates and approvals
- **User Profile:** Manage personal information

### For Administrators
- **Dashboard:** View library analytics and stats
- **Book Management:** Add, edit, and delete books
- **Batch Uploads:** Upload multiple books via CSV
- **Loan Handling:** Approve/reject borrow requests
- **Return Processing:** Manage overdue books
- **User Management:** Track user activity
- **Sales Tracking:** Monitor purchases
- **AI Assistant:** Smart suggestions for admin tasks
- **Reports & Analytics:** Gain insights on library usage

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- Stripe account for payments

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/yourusername/library-plus.git
   cd library-plus
   ```

2. **Backend Setup**
   ```sh
   cd backend
   npm install
   npm run start:dev
   ```

3. **Frontend Setup**
   ```sh
   cd frontend
   npm install --force
   npm run dev
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the backend directory with:
   ```plaintext
   DATABASE_URL="your_postgresql_database_url"
   PORT=6001
   JWT_SECRET="your_jwt_secret"
   CLOUD_NAME="your_cloudinary_cloud_name"
   API_KEY="your_cloudinary_api_key"
   API_SECRET="your_cloudinary_api_secret"
   BASE_URL="http://localhost:6000"
   HOST_EMAIL_ADDRESS="your_host_email_address"
   HOST_EMAIL_PASSWORD="your_host_email_password"
   STRIPE_TEST_KEY="your_stripe_test_key"
   GROQ_API_KEY="your_groq_api_key"
   ```

5. **Run the Application**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:6001](http://localhost:6001)

## Usage Guide

### For Users
1. **Register/Login**
   - Sign up and log in to access features.
2. **Find Books**
   - Search by title, author, or category.
3. **Borrow Books**
   - Request to borrow books and await approval.
4. **Return Books**
   - Initiate return requests for borrowed books.
5. **Purchase Books**
   - Buy books via Stripe and track purchase history.

### For Administrators
1. **Admin Login**
   - Use provided credentials to access the admin panel.
2. **Manage Books**
   - Add, update, delete, or bulk upload books.
3. **Handle Borrow Requests**
   - Approve or reject loan requests.
4. **Manage Users**
   - Track user activity and borrowing history.
5. **View Reports**
   - Access analytics on library usage.

## Technology Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Payments:** Stripe
- **File Uploads:** Cloudinary, Multer
- **AI Features:** Groq API

## License
LibraryPlus is licensed under the MIT License.

