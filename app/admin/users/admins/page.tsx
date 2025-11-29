"use client"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { useState } from "react"

const admins = [
  { id: 1, name: "Admin User", email: "admin@nu.edu.pk", role: "Super Admin", lastActive: "Nov 27, 2024" },
  { id: 2, name: "System Manager", email: "system@nu.edu.pk", role: "Admin", lastActive: "Nov 26, 2024" },
]

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredAdmins = admins.filter(
    (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.includes(searchQuery),
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Administrators</h1>
          <p className="text-sm text-muted-foreground">Manage admin accounts and permissions</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-input text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Add New Administrator</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
                <option>Admin</option>
                <option>Super Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="border-border hover:bg-secondary text-foreground"
            >
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Admin</Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Last Active</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{admin.name}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{admin.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{admin.role}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{admin.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
