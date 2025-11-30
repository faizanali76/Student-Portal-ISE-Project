"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BookOpen, BarChart3, Bell, Settings, FileText } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Enroll Course", href: "/student/enroll", icon: <BookOpen className="h-4 w-4" /> },
  { label: "My Courses", href: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Attendance", href: "/student/attendance", icon: <Bell className="h-4 w-4" /> },
  { label: "Results", href: "/student/results", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Reports", href: "/student/reports", icon: <FileText className="h-4 w-4" /> },
  { label: "Settings", href: "/student/settings", icon: <Settings className="h-4 w-4" /> },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar navItems={navItems} title="Student Portal" role="Student" />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
