import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Filter, Download } from "lucide-react"
import { RolesList } from "@/components/roles-list"
import { PermissionsList } from "@/components/permissions-list"

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage user roles and access permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90">
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-[#333333]">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Input placeholder="Search roles..." className="bg-[#1E1E1E] border-[#333333]" />
        </div>
        <Button variant="outline" className="w-full md:w-auto bg-[#1E1E1E] border-[#333333]">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="bg-[#1E1E1E] border-[#333333]">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Manage roles and their associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <RolesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card className="bg-[#1E1E1E] border-[#333333]">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Configure permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

