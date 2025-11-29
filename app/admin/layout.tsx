"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, Users, BookOpen, Settings, FileText } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: "Students", href: "/admin/users/students", icon: null },
      { label: "Teachers", href: "/admin/users/teachers", icon: null },
      { label: "Admins", href: "/admin/users/admins", icon: null },
    ],
  },
  { label: "Courses", href: "/admin/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar navItems={navItems} title="Admin Portal" role="Administrator" />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
