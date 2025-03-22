# LibraryPlus - Modern Library Management System

## Overview

LibraryPlus is a comprehensive library management system designed to streamline book management, borrowing, and purchasing processes. With a sleek dark-themed interface, LibraryPlus offers separate experiences for administrators and regular users, making it ideal for schools, universities, and public libraries.

## Live URL
[Live Frontend URL](#)

## Demo Link
[Demo of the Project in Action](#)

## Features

### For Users

- **Book Discovery**: Browse and search the entire library catalog
- **Borrowing System**: Request to borrow books with a streamlined approval process
- **Return Management**: Submit return requests when finished with books
- **Purchase Options**: Buy books directly through integrated payment processing
- **Personal Dashboard**: Track borrowing history and current loans
- **Notifications**: Receive updates about loan approvals, due dates, and more
- **User Profile**: Manage personal information and preferences

### For Administrators

- **Comprehensive Dashboard**: Overview of library statistics and activities
- **Book Management**: Add, edit, and delete books individually
- **Batch Operations**: Upload multiple books via CSV for efficient catalog expansion
- **Inventory Control**: Track book quantities and availability
- **Loan Management**: Approve or reject borrow requests
- **Return Processing**: Handle book returns and manage overdue items
- **Sales Tracking**: Monitor book purchases and revenue
- **User Management**: Oversee library members and their activities
- **AI Assistant**: Get AI-powered help for administrative tasks
- **Analytics**: View detailed reports on borrowing patterns and popular books

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- Stripe account (for payment processing)

### Setup

1. Clone the repository

```sh
git clone https://github.com/yourusername/library-plus.git
cd library-plus
```

2. Backend Setup

```sh
cd backend
npm install
npm run start:dev
```

3. Frontend Setup

```sh
cd frontend
npm install --force
npm run dev
```

4. Configure environment variables
   Create a `.env` file in the backend directory with the following variables:

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

5. Access the application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:6001](http://localhost:6001)

## Usage Guide

### For Users

1. **Registration and Login**

   - Create an account using the "Sign Up" option
   - Log in with your credentials

2. **Finding Books**

   - Browse the catalog from the "Books" page
   - Use the search function to find specific titles or authors
   - Filter books by category or availability

3. **Borrowing Books**

   - Click the "Borrow" button on any available book
   - Wait for administrator approval
   - Check "My Borrowings" to track request status

4. **Returning Books**

   - Go to "My Borrowings" and find the book you want to return
   - Click "Return" to initiate the return process
   - Return the physical book according to library policy

5. **Purchasing Books**

   - Click "Buy" on any book you wish to purchase
   - Complete the checkout process with Stripe
   - View your purchase history in your profile

### For Administrators

1. **Admin Login**

   - Access the admin panel via the "Admin Login" link
   - Use your administrator credentials

2. **Managing Books**

   - Add new books individually with the "Add Book" button
   - Upload multiple books using the "Batch Upload" feature
   - Edit or delete books as needed

3. **Handling Borrow Requests**

   - Review pending requests in the "Borrow Requests" section
   - Approve or reject requests with optional comments
   - Process return requests when books are returned

4. **User Management**

   - View and manage user accounts
   - Track user borrowing history and activities

5. **Analytics and Reporting**

   - Access the "Reports" section for detailed insights
   - Monitor library usage patterns and popular books
   - Track sales and revenue data

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **File Uploads**: Multer
- **AI Integration**: Groq API

## License

This project is licensed under the MIT License .

