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
import { Edit, MoreVertical, Trash2, Shield, Users } from "lucide-react"

// Mock data for roles
const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access with all permissions",
    users: 3,
    permissions: 24,
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Librarian",
    description: "Manage books, inventory, and lending",
    users: 8,
    permissions: 18,
    createdAt: "2023-01-20",
  },
  {
    id: 3,
    name: "Sales Staff",
    description: "Process sales and manage inventory",
    users: 12,
    permissions: 12,
    createdAt: "2023-02-05",
  },
  {
    id: 4,
    name: "Member",
    description: "Basic access to borrow books",
    users: 245,
    permissions: 5,
    createdAt: "2023-02-10",
  },
  {
    id: 5,
    name: "Guest",
    description: "Limited access to view books only",
    users: 0,
    permissions: 2,
    createdAt: "2023-03-01",
  },
]

export function RolesList() {
  return (
    <div className="rounded-md border border-[#333333] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1E1E1E]">
          <TableRow className="hover:bg-[#1E1E1E]/80 border-[#333333]">
            <TableHead className="w-[200px]">Role Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">Users</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id} className="hover:bg-[#1E1E1E]/80 border-[#333333]">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#4CAF50]" />
                  {role.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{role.description}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {role.users}
                </div>
              </TableCell>
              <TableCell>
                <Badge className="bg-[#4CAF50]">{role.permissions}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{role.createdAt}</TableCell>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Manage Permissions</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
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

