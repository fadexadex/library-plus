"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

// Mock data for permissions
const permissionGroups = [
  {
    id: 1,
    name: "Books Management",
    permissions: [
      { id: 1, name: "View Books", key: "books:view" },
      { id: 2, name: "Add Books", key: "books:add" },
      { id: 3, name: "Edit Books", key: "books:edit" },
      { id: 4, name: "Delete Books", key: "books:delete" },
    ],
  },
  {
    id: 2,
    name: "Inventory Management",
    permissions: [
      { id: 5, name: "View Inventory", key: "inventory:view" },
      { id: 6, name: "Add Stock", key: "inventory:add" },
      { id: 7, name: "Remove Stock", key: "inventory:remove" },
    ],
  },
  {
    id: 3,
    name: "Lending Management",
    permissions: [
      { id: 8, name: "View Loans", key: "loans:view" },
      { id: 9, name: "Create Loan", key: "loans:create" },
      { id: 10, name: "Return Book", key: "loans:return" },
    ],
  },
  {
    id: 4,
    name: "Sales Management",
    permissions: [
      { id: 11, name: "View Sales", key: "sales:view" },
      { id: 12, name: "Create Sale", key: "sales:create" },
    ],
  },
  {
    id: 5,
    name: "User Management",
    permissions: [
      { id: 13, name: "View Users", key: "users:view" },
      { id: 14, name: "Add Users", key: "users:add" },
      { id: 15, name: "Edit Users", key: "users:edit" },
      { id: 16, name: "Delete Users", key: "users:delete" },
    ],
  },
  {
    id: 6,
    name: "Reports & Analytics",
    permissions: [
      { id: 17, name: "View Reports", key: "reports:view" },
      { id: 18, name: "Generate Reports", key: "reports:generate" },
    ],
  },
]

// Mock data for roles
const roles = [
  { id: 1, name: "Administrator" },
  { id: 2, name: "Librarian" },
  { id: 3, name: "Sales Staff" },
  { id: 4, name: "Member" },
  { id: 5, name: "Guest" },
]

export function PermissionsList() {
  const [selectedRole, setSelectedRole] = useState("1")
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    // Administrator has all permissions by default
    "books:view": true,
    "books:add": true,
    "books:edit": true,
    "books:delete": true,
    "inventory:view": true,
    "inventory:add": true,
    "inventory:remove": true,
    "loans:view": true,
    "loans:create": true,
    "loans:return": true,
    "sales:view": true,
    "sales:create": true,
    "users:view": true,
    "users:add": true,
    "users:edit": true,
    "users:delete": true,
    "reports:view": true,
    "reports:generate": true,
  })

  const handleRoleChange = (value: string) => {
    setSelectedRole(value)

    // Mock different permission sets for different roles
    if (value === "1") {
      // Administrator
      setPermissions({
        "books:view": true,
        "books:add": true,
        "books:edit": true,
        "books:delete": true,
        "inventory:view": true,
        "inventory:add": true,
        "inventory:remove": true,
        "loans:view": true,
        "loans:create": true,
        "loans:return": true,
        "sales:view": true,
        "sales:create": true,
        "users:view": true,
        "users:add": true,
        "users:edit": true,
        "users:delete": true,
        "reports:view": true,
        "reports:generate": true,
      })
    } else if (value === "2") {
      // Librarian
      setPermissions({
        "books:view": true,
        "books:add": true,
        "books:edit": true,
        "books:delete": false,
        "inventory:view": true,
        "inventory:add": true,
        "inventory:remove": true,
        "loans:view": true,
        "loans:create": true,
        "loans:return": true,
        "sales:view": true,
        "sales:create": false,
        "users:view": true,
        "users:add": false,
        "users:edit": false,
        "users:delete": false,
        "reports:view": true,
        "reports:generate": false,
      })
    } else if (value === "3") {
      // Sales Staff
      setPermissions({
        "books:view": true,
        "books:add": false,
        "books:edit": false,
        "books:delete": false,
        "inventory:view": true,
        "inventory:add": true,
        "inventory:remove": true,
        "loans:view": true,
        "loans:create": false,
        "loans:return": false,
        "sales:view": true,
        "sales:create": true,
        "users:view": true,
        "users:add": false,
        "users:edit": false,
        "users:delete": false,
        "reports:view": true,
        "reports:generate": false,
      })
    } else if (value === "4") {
      // Member
      setPermissions({
        "books:view": true,
        "books:add": false,
        "books:edit": false,
        "books:delete": false,
        "inventory:view": false,
        "inventory:add": false,
        "inventory:remove": false,
        "loans:view": true,
        "loans:create": false,
        "loans:return": false,
        "sales:view": false,
        "sales:create": false,
        "users:view": false,
        "users:add": false,
        "users:edit": false,
        "users:delete": false,
        "reports:view": false,
        "reports:generate": false,
      })
    } else {
      // Guest
      setPermissions({
        "books:view": true,
        "books:add": false,
        "books:edit": false,
        "books:delete": false,
        "inventory:view": false,
        "inventory:add": false,
        "inventory:remove": false,
        "loans:view": false,
        "loans:create": false,
        "loans:return": false,
        "sales:view": false,
        "sales:create": false,
        "users:view": false,
        "users:add": false,
        "users:edit": false,
        "users:delete": false,
        "reports:view": false,
        "reports:generate": false,
      })
    }
  }

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-64">
          <Label htmlFor="role-select">Select Role</Label>
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger id="role-select" className="mt-1 bg-[#1E1E1E] border-[#333333]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E1E] border-[#333333]">
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
          <Save className="mr-2 h-4 w-4" /> Save Permissions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissionGroups.map((group) => (
          <Card key={group.id} className="bg-[#1E1E1E] border-[#333333]">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">{group.name}</h3>
              <div className="space-y-3">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.key}
                      checked={permissions[permission.key] || false}
                      onCheckedChange={(checked) => handlePermissionChange(permission.key, checked as boolean)}
                    />
                    <Label htmlFor={permission.key} className="cursor-pointer">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

