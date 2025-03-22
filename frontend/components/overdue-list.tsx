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
import { MoreVertical, CheckCircle, Calendar, AlertCircle, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for overdue loans
const overdueLoans = [
  {
    id: 1,
    bookTitle: "The Catcher in the Rye",
    bookId: "B009",
    borrower: "Alex Johnson",
    borrowerId: "U131",
    borrowDate: "2023-04-01",
    dueDate: "2023-05-01",
    daysOverdue: 30,
    status: "Overdue",
    fineAmount: "$6.00",
  },
  {
    id: 2,
    bookTitle: "Lord of the Flies",
    bookId: "B010",
    borrower: "Maria Garcia",
    borrowerId: "U132",
    borrowDate: "2023-04-10",
    dueDate: "2023-05-10",
    daysOverdue: 21,
    status: "Overdue",
    fineAmount: "$4.20",
  },
  {
    id: 3,
    bookTitle: "Brave New World",
    bookId: "B011",
    borrower: "David Wilson",
    borrowerId: "U133",
    borrowDate: "2023-04-15",
    dueDate: "2023-05-15",
    daysOverdue: 16,
    status: "Overdue",
    fineAmount: "$3.20",
  },
  {
    id: 4,
    bookTitle: "Animal Farm",
    bookId: "B012",
    borrower: "Jennifer Lee",
    borrowerId: "U134",
    borrowDate: "2023-04-20",
    dueDate: "2023-05-20",
    daysOverdue: 11,
    status: "Overdue",
    fineAmount: "$2.20",
  },
  {
    id: 5,
    bookTitle: "Fahrenheit 451",
    bookId: "B013",
    borrower: "Christopher Brown",
    borrowerId: "U135",
    borrowDate: "2023-04-25",
    dueDate: "2023-05-25",
    daysOverdue: 6,
    status: "Overdue",
    fineAmount: "$1.20",
  },
]

export function OverdueList() {
  const { toast } = useToast()

  const handleReturnBook = (id: number, title: string) => {
    // Mock API call to POST /api/loans/:id/return
    toast({
      title: "Book Returned",
      description: `"${title}" has been marked as returned.`,
    })
  }

  const handleSendReminder = (id: number, borrower: string) => {
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent to ${borrower}.`,
    })
  }

  return (
    <div className="rounded-md border border-[#333333] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1E1E1E]">
          <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
            <TableHead>Book</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead>Days Overdue</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overdueLoans.map((loan) => (
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
              <TableCell className="hidden md:table-cell">{loan.dueDate}</TableCell>
              <TableCell>
                <Badge className="bg-red-500">
                  {loan.daysOverdue} {loan.daysOverdue === 1 ? "day" : "days"}
                </Badge>
              </TableCell>
              <TableCell>{loan.fineAmount}</TableCell>
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
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleReturnBook(loan.id, loan.bookTitle)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Return Book</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleSendReminder(loan.id, loan.borrower)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Send Reminder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Extend Loan</span>
                    </DropdownMenuItem>
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

