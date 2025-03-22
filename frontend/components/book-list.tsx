"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, BookCopy, ShoppingCart, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/api-service"
import { apiService } from "@/lib/api-service"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BookListProps {
  books: Book[]
  isAdmin: boolean
  onBookDeleted?: (bookId: string) => void
}

export function BookList({ books, isAdmin, onBookDeleted }: BookListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleBorrow = async (id: string, title: string) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const response = await apiService.borrowBook(id)
      toast({
        title: "Borrow Request Submitted",
        description: response.message,
      })
    } catch (error) {
      console.error("Failed to borrow book:", error)
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/books/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/books/edit/${id}`)
  }

  const confirmDelete = (book: Book) => {
    setBookToDelete(book)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!bookToDelete) return

    const bookId = bookToDelete.bookId
    setIsDeleting((prev) => ({ ...prev, [bookId]: true }))

    try {
      const response = await apiService.deleteBook(bookId)

      toast({
        title: "Success",
        description: response.message || "Book deleted successfully",
      })

      // Notify parent component about the deletion
      if (onBookDeleted) {
        onBookDeleted(bookId)
      }

      // Remove the book from the local list
      books = books.filter((book) => book.bookId !== bookId)
    } catch (error) {
      console.error("Failed to delete book:", error)
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting((prev) => ({ ...prev, [bookId]: false }))
      setShowDeleteDialog(false)
      setBookToDelete(null)
    }
  }

  return (
    <>
      <div className="rounded-md border border-[#333333] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1E1E1E]">
            <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
              <TableHead className="w-[300px]">Title & Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.bookId} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-muted-foreground">{book.author}</div>
                  </div>
                </TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>
                  <Badge className={book.stockStatus === "IN_STOCK" ? "bg-green-500" : "bg-red-500"}>
                    {book.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell>{book.copies}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleBorrow(book.bookId, book.title)}
                      disabled={book.stockStatus === "OUT_OF_STOCK" || isLoading[book.bookId]}
                    >
                      <BookCopy className="mr-1 h-4 w-4" />
                      {isLoading[book.bookId] ? "..." : "Borrow"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewDetails(book.bookId)}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
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
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(book.bookId)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Sell</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500"
                            onClick={() => confirmDelete(book)}
                            disabled={isDeleting[book.bookId]}
                          >
                            {isDeleting[book.bookId] ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            <span>{isDeleting[book.bookId] ? "Deleting..." : "Delete"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1E1E1E] border-[#333333]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{bookToDelete?.title}" from the library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

