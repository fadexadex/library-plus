"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, BookCopy, CheckCircle, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for loans
const activeLoans = [
  {
    id: 1,
    bookTitle: "To Kill a Mockingbird",
    bookId: "B001",
    borrower: "John Smith",
    borrowerId: "U123",
    borrowDate: "2023-05-15",
    dueDate: "2023-06-15",
    status: "Active",
  },
  {
    id: 2,
    bookTitle: "1984",
    bookId: "B002",
    borrower: "Jane Doe",
    borrowerId: "U124",
    borrowDate: "2023-05-20",
    dueDate: "2023-06-20",
    status: "Active",
  },
  {
    id: 3,
    bookTitle: "The Great Gatsby",
    bookId: "B003",
    borrower: "Robert Johnson",
    borrowerId: "U125",
    borrowDate: "2023-05-22",
    dueDate: "2023-06-22",
    status: "Active",
  },
  {
    id: 4,
    bookTitle: "Pride and Prejudice",
    bookId: "B004",
    borrower: "Emily Davis",
    borrowerId: "U126",
    borrowDate: "2023-05-25",
    dueDate: "2023-06-25",
    status: "Active",
  },
]

const historyLoans = [
  {
    id: 5,
    bookTitle: "The Hobbit",
    bookId: "B005",
    borrower: "Michael Wilson",
    borrowerId: "U127",
    borrowDate: "2023-04-10",
    dueDate: "2023-05-10",
    returnDate: "2023-05-08",
    status: "Returned",
  },
  {
    id: 6,
    bookTitle: "Sapiens",
    bookId: "B006",
    borrower: "Sarah Brown",
    borrowerId: "U128",
    borrowDate: "2023-04-15",
    dueDate: "2023-05-15",
    returnDate: "2023-05-14",
    status: "Returned",
  },
]

const reservedBooks = [
  {
    id: 7,
    bookTitle: "Dune",
    bookId: "B007",
    borrower: "Thomas Anderson",
    borrowerId: "U129",
    reservationDate: "2023-05-28",
    availableDate: "2023-06-10",
    status: "Reserved",
  },
  {
    id: 8,
    bookTitle: "The Alchemist",
    bookId: "B008",
    borrower: "Lisa Campbell",
    borrowerId: "U130",
    reservationDate: "2023-05-29",
    availableDate: "2023-06-15",
    status: "Reserved",
  },
]

interface LoansListProps {
  status: "active" | "history" | "reserved"
}

export function LoansList({ status }: LoansListProps) {
  const { toast } = useToast()

  const handleReturnBook = (id: number, title: string) => {
    // Mock API call to POST /api/loans/:id/return
    toast({
      title: "Book Returned",
      description: `"${title}" has been marked as returned.`,
    })
  }

  const handleExtendLoan = (id: number, title: string) => {
    toast({
      title: "Loan Extended",
      description: `The loan for "${title}" has been extended by 14 days.`,
    })
  }

  let data = activeLoans
  if (status === "history") {
    data = historyLoans
  } else if (status === "reserved") {
    data = reservedBooks
  }

  return (
    <div className="rounded-md border border-[#333333] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1E1E1E]">
          <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
            <TableHead>Book</TableHead>
            <TableHead>Borrower</TableHead>
            {status === "active" && (
              <>
                <TableHead className="hidden md:table-cell">Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
              </>
            )}
            {status === "history" && (
              <>
                <TableHead className="hidden md:table-cell">Borrow Date</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead>Return Date</TableHead>
              </>
            )}
            {status === "reserved" && (
              <>
                <TableHead>Reservation Date</TableHead>
                <TableHead>Available Date</TableHead>
              </>
            )}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((loan) => (
            <TableRow key={loan.id} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
              <TableCell>
                <div>
                  <div className="font-medium">{loan.bookTitle}</div>
                  <div className="text-xs text-muted-foreground">ID: {loan.bookId}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{loan.borrower}</div>
                  <div className="text-xs text-muted-foreground">ID: {loan.borrowerId}</div>
                </div>
              </TableCell>
              {status === "active" && (
                <>
                  <TableCell className="hidden md:table-cell">{loan.borrowDate}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                </>
              )}
              {status === "history" && (
                <>
                  <TableCell className="hidden md:table-cell">{loan.borrowDate}</TableCell>
                  <TableCell className="hidden md:table-cell">{loan.dueDate}</TableCell>
                  <TableCell>{(loan as any).returnDate}</TableCell>
                </>
              )}
              {status === "reserved" && (
                <>
                  <TableCell>{(loan as any).reservationDate}</TableCell>
                  <TableCell>{(loan as any).availableDate}</TableCell>
                </>
              )}
              <TableCell>
                <Badge
                  className={
                    loan.status === "Active"
                      ? "bg-blue-500"
                      : loan.status === "Returned"
                        ? "bg-green-500"
                        : "bg-amber-500"
                  }
                >
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#333333]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {status === "active" && (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleReturnBook(loan.id, loan.bookTitle)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Return Book</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleExtendLoan(loan.id, loan.bookTitle)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Extend Loan</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    {status === "reserved" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <BookCopy className="mr-2 h-4 w-4" />
                        <span>Convert to Loan</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

