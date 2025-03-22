const dbSchemaContext = `
Database Schema for Library Management System:

 **Important Notes:**
- **Table and column names are case-sensitive** in PostgreSQL.
- **Always use double quotes** (e.g., "BorrowedBook") when referencing tables and columns in queries.
- Unquoted identifiers are automatically converted to lowercase, which may lead to errors.

Tables:
1. **User**
   - userId (UUID, Primary Key)
   - email (String, Unique)
   - password (String)
   - firstName (String)
   - lastName (String)
   - role (Enum: ADMIN, CUSTOMER, Default: CUSTOMER)
   - createdAt (DateTime, Default: now())
   - updatedAt (DateTime, Auto-updated)

2. **Book**
   - bookId (UUID, Primary Key)
   - title (String)
   - author (String)
   - isbn (String, Unique)
   - category (String)
   - copies (Integer)
   - shelf (String)
   - price (Decimal)
   - coverImage (String)
   - description (String)
   - stockStatus (Enum: IN_STOCK, OUT_OF_STOCK)
   - createdAt (DateTime, Default: now())
   - updatedAt (DateTime, Auto-updated)

3. **BorrowedBook**
   - borrowId (UUID, Primary Key)
   - bookId (UUID, Foreign Key → Book.bookId)
   - userId (UUID, Foreign Key → User.userId)
   - status (Enum: APPROVED, PENDING, REJECTED, OVERDUE, RETURNED, RETURN_REQUESTED, Default: PENDING)
   - dueDate (DateTime, Nullable)
   - borrowDate (DateTime, Default: now())
   - returned (Boolean, Default: false)
   - createdAt (DateTime, Default: now())
   - updatedAt (DateTime, Auto-updated)
   - rejectionReason (String, Nullable)
   - approvalCode (String, Nullable)
   - **Unique Constraint:** (userId, bookId)

4. **Purchase**
   - purchaseId (UUID, Primary Key)
   - userId (UUID, Foreign Key → User.userId)
   - bookId (UUID, Foreign Key → Book.bookId)
   - quantity (Integer)
   - transactionId (String, Nullable)
   - price (Decimal)
   - createdAt (DateTime, Default: now())

5. **Notification**
   - notificationId (UUID, Primary Key)
   - userId (UUID, Foreign Key → User.userId)
   - message (String)
   - read (Boolean, Default: false)
   - time (DateTime, Default: now())

6. **RecentActivity**
   - activityId (UUID, Primary Key)
   - userId (UUID, Foreign Key → User.userId)
   - bookId (UUID, Foreign Key → Book.bookId)
   - action (String)
   - timestamp (DateTime, Default: now())

**Enums:**
1. **Role**
   - ADMIN
   - CUSTOMER

2. **StockStatus**
   - IN_STOCK
   - OUT_OF_STOCK

3. **BorrowStatus**
   - APPROVED
   - PENDING
   - REJECTED
   - OVERDUE
   - RETURNED
   - RETURN_REQUESTED
`;

export default dbSchemaContext;
