import { notFound } from "next/navigation"

interface Props {
  params: {
    id: string
  }
}

async function getBook(id: string) {
  // Simulate fetching a book from a database
  const books = [
    { id: "1", title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
    { id: "2", title: "Pride and Prejudice", author: "Jane Austen" },
  ]

  const book = books.find((book) => book.id === id)

  if (!book) {
    return null
  }

  return book
}

export default async function BookPage({ params: { id } }: Props) {
  const book = await getBook(id)

  if (!book) {
    notFound()
  }

  return (
    <div>
      <h1>Admin Book Details</h1>
      <p>ID: {book.id}</p>
      <p>Title: {book.title}</p>
      <p>Author: {book.author}</p>
    </div>
  )
}

