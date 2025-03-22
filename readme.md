# LibraryPlus - Modern Library Management System

## Overview
LibraryPlus is a modern library management system designed for book discovery, borrowing, and purchasing. With a dark-themed interface, it offers distinct experiences for users and administrators, making it ideal for schools, universities, and public libraries.

### Live URL - [Live Frontend URL](#)
### Demo Link - [Demo of the Project](#)

**Demo User Credentials:**  
Email: johndoe200@gmail.com  
Password: ExplicitCyclo  

## Features

### User Features
- Browse and search the library catalog
- Request to borrow books
- Manage book returns
- Purchase books with integrated payment processing
- Track borrowing history and current loans
- Receive notifications on loan approvals and due dates
- Manage personal profile

### Admin Features
- Dashboard with library statistics
- Add, edit, and delete books
- Upload books in bulk via CSV
- Track book availability
- Approve/reject borrow requests
- Process book returns and overdue items
- Monitor book purchases and revenue
- Manage library members
- AI-powered assistant for administrative tasks
- View analytics on borrowing patterns

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- Stripe account (for payment processing)

### Setup

1. Clone the repository:
```sh
git clone https://github.com/yourusername/library-plus.git
cd library-plus
```
2. Backend Setup:
```sh
cd backend
npm install
npm run start:dev
```
3. Frontend Setup:
```sh
cd frontend
npm install --force
npm run dev
```
4. Configure environment variables in `backend/.env`:
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
5. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:6001](http://localhost:6001)

## Usage Guide

### Users
1. **Register/Login**: Create an account or log in.
2. **Browse Books**: Use the search or filter books by category.
3. **Borrow Books**: Click "Borrow" and wait for approval.
4. **Return Books**: Go to "My Borrowings" and submit a return request.
5. **Purchase Books**: Click "Buy" and complete checkout with Stripe.

### Administrators
1. **Login**: Access the admin panel with credentials.
2. **Manage Books**: Add, edit, or delete books. Upload books in bulk.
3. **Approve Requests**: Review and process borrow/return requests.
4. **User Management**: Oversee library members and their activities.
5. **Reports**: View analytics on borrowing trends and revenue.

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Stripe
- **File Uploads**: Multer
- **AI Integration**: Groq API

## License
This project is licensed under the MIT License.

