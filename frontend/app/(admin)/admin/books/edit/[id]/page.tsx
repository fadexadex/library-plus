"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { apiService, type Book } from "@/lib/api-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBook, setIsLoadingBook] = useState(true)
  const [error, setError] = useState("")
  const [book, setBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    copies: "",
    shelf: "",
    price: "",
    description: "",
    stockStatus: "IN_STOCK",
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const bookId = params.id

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin/login")
    }
  }, [router])

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      setIsLoadingBook(true)
      setError("")
      try {
        const bookData = await apiService.getBook(bookId)
        setBook(bookData)

        // Set form data from book
        setFormData({
          title: bookData.title || "",
          author: bookData.author || "",
          isbn: bookData.isbn || "",
          category: bookData.category || "",
          copies: bookData.copies?.toString() || "0",
          shelf: bookData.shelf || "",
          price: bookData.price?.toString() || "0",
          description: bookData.description || "",
          stockStatus: bookData.stockStatus || "IN_STOCK",
        })

        // Set cover preview if available
        if (bookData.coverImage) {
          setCoverPreview(bookData.coverImage)
        }
      } catch (error) {
        console.error("Failed to fetch book:", error)
        setError("Failed to load book details. Please try again.")
      } finally {
        setIsLoadingBook(false)
      }
    }

    if (bookId) {
      fetchBook()
    }
  }, [bookId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create FormData object for file upload
      const formDataObj = new FormData()

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Add cover image if available
      if (coverImage) {
        formDataObj.append("cover", coverImage)
      }

      console.log("Updating book data:", Object.fromEntries(formDataObj.entries()))

      const response = await apiService.updateBook(bookId, formDataObj)

      toast({
        title: "Success",
        description: response.message || "Book updated successfully",
      })

      router.push("/admin/books")
    } catch (error) {
      console.error("Failed to update book:", error)
      setError("Failed to update book. Please try again.")
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#4CAF50]" />
          <span className="ml-2">Loading book details...</span>
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/books")}>Back to Books</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/books" className="flex items-center text-[#4CAF50] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book Management
        </Link>
      </div>

      <Card className="bg-[#1E1E1E] border-[#333333] max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Book</CardTitle>
          <CardDescription>Update the details of "{book?.title}"</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form id="edit-book-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                  placeholder="Fiction, Non-Fiction, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copies">Copies *</Label>
                <Input
                  id="copies"
                  name="copies"
                  type="number"
                  min="0"
                  value={formData.copies}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelf">Shelf Location</Label>
                <Input
                  id="shelf"
                  name="shelf"
                  value={formData.shelf}
                  onChange={handleInputChange}
                  className="bg-[#2A2A2A] border-[#333333]"
                  placeholder="A1, B2, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="bg-[#2A2A2A] border-[#333333]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockStatus">Stock Status *</Label>
                <Select
                  value={formData.stockStatus}
                  onValueChange={(value) => handleSelectChange("stockStatus", value)}
                >
                  <SelectTrigger id="stockStatus" className="bg-[#2A2A2A] border-[#333333]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-[#333333]">
                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-[#2A2A2A] border-[#333333] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image</Label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="cover"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#2A2A2A] border-[#333333] hover:bg-[#2A2A2A]/70"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 2MB)</p>
                      </div>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                {coverPreview && (
                  <div className="w-32 h-40 relative overflow-hidden rounded-lg border border-[#333333]">
                    <img
                      src={coverPreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/books")}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-book-form"
            className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Book"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

