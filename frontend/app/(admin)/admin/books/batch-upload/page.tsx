"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, FileText, Loader2, AlertCircle, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"

export default function BatchUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadResult, setUploadResult] = useState<{ created: number; errors: string[] } | null>(null)

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin/login")
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  // Update the file validation and submission logic
  const validateAndSetFile = (selectedFile: File) => {
    // Accept all allowed MIME types as specified in the server-side filter
    const allowedMimeTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    // Also check file extension as a fallback
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = ["csv", "xls", "xlsx"]

    if (allowedMimeTypes.includes(selectedFile.type) || (fileExtension && allowedExtensions.includes(fileExtension))) {
      setFile(selectedFile)
      setError("")
      setSuccess("")
      setUploadResult(null)
      return true
    }

    // Not an allowed file type
    setError("Only CSV files are allowed. Please ensure your file is a properly formatted CSV file.")
    setFile(null)
    return false
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  // Update the handleSubmit function to handle the file upload properly
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a CSV file")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    setUploadResult(null)

    try {
      console.log("Uploading file:", file.name, "Type:", file.type, "Size:", file.size)

      // Create FormData and append the file with the correct field name
      const formData = new FormData()
      formData.append("file", file)

      const response = await apiService.batchCreateBooks(file)

      // Parse the response to get the number of books created
      let booksCreated = 0
      const errors: string[] = []

      if (response.message) {
        // Try to extract the number of books created from the message
        const match = response.message.match(/Books created: (\d+)/)
        if (match && match[1]) {
          booksCreated = Number.parseInt(match[1], 10)
        }

        // Set upload result
        setUploadResult({ created: booksCreated, errors })
      }

      setSuccess(response.message || "Books uploaded successfully")
      toast({
        title: "Success",
        description: response.message || "Books uploaded successfully",
      })

      // Clear the file input
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // If books were created successfully, redirect to the books page after a delay
      if (booksCreated > 0) {
        setTimeout(() => {
          router.push("/admin/books")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to upload books:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload books. Please check your file format and try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setError("")
    setSuccess("")
    setUploadResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/books" className="flex items-center text-[#4CAF50] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book Management
        </Link>
      </div>

      <Card className="bg-[#1E1E1E] border-[#333333] max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Batch Upload Books</CardTitle>
          <CardDescription>Upload a CSV file to add multiple books at once</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          {uploadResult && uploadResult.created > 0 && (
            <div className="mb-4 text-center">
              <p className="text-green-500 font-medium">
                Successfully created {uploadResult.created} books! Redirecting to books page...
              </p>
              <Button className="mt-2 bg-[#4CAF50] hover:bg-[#4CAF50]/90" onClick={() => router.push("/admin/books")}>
                View Books Now
              </Button>
            </div>
          )}

          <form id="batch-upload-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragging
                    ? "bg-[#4CAF50]/10 border-[#4CAF50]"
                    : file
                      ? "bg-[#2A2A2A]/70 border-[#4CAF50]"
                      : "bg-[#2A2A2A] border-[#333333] hover:bg-[#2A2A2A]/70"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 relative w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-[#333333] hover:bg-[#444444]"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile()
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                    <FileText className="w-12 h-12 mb-2 text-[#4CAF50]" />
                    <p className="mb-2 text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">CSV files only (max 5MB)</p>
                  </div>
                )}
                <input
                  id="csv-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">CSV Format Requirements</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Your CSV file should have the following columns:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>title (required)</li>
                <li>author (required)</li>
                <li>isbn (required)</li>
                <li>category (required)</li>
                <li>copies (required)</li>
              </ul>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>shelf (optional)</li>
                <li>price (required)</li>
                <li>description (optional)</li>
                <li>stockStatus (required, either "IN_STOCK" or "OUT_OF_STOCK")</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/books")}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="batch-upload-form"
            className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Books
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

