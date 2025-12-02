"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, FileText, ClipboardList, BookOpen, Settings } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Courses", href: "/teacher/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Mark Attendance", href: "/teacher/attendance", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Upload Marks", href: "/teacher/marks", icon: <FileText className="h-4 w-4" /> },
  { label: "Settings", href: "/teacher/settings", icon: <Settings className="h-4 w-4" /> },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar navItems={navItems} title="Teacher Portal" role="Educator" />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
