"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BookOpen, BarChart3, Bell, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

const navItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Enroll Course", href: "/student/enroll", icon: <BookOpen className="h-4 w-4" /> },
  { label: "My Courses", href: "/student/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Attendance", href: "/student/attendance", icon: <Bell className="h-4 w-4" /> },
  { label: "Results", href: "/student/results", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Notifications", href: "/student/notifications", icon: <Bell className="h-4 w-4" /> },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>()
  const [rollNumber, setRollNumber] = useState<string>()

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: student } = await supabase
          .from('students')
          .select('roll_number, profiles(full_name)')
          .eq('user_id', user.id)
          .single()

        if (student) {
          setUserName((student.profiles as any)?.full_name)
          setRollNumber(student.roll_number)
        }
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="flex">
      <Sidebar
        navItems={navItems}
        title="Student Portal"
        role="Student"
        userName={userName}
        userInfo={rollNumber}
      />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
