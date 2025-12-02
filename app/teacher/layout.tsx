"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, FileText, ClipboardList, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

const navItems = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Courses", href: "/teacher/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Mark Attendance", href: "/teacher/attendance", icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Upload Marks", href: "/teacher/marks", icon: <FileText className="h-4 w-4" /> },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>()
  const [email, setEmail] = useState<string>()

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: teacher } = await supabase
          .from('teachers')
          .select('profiles(full_name, email)')
          .eq('user_id', user.id)
          .single()

        if (teacher) {
          setUserName((teacher.profiles as any)?.full_name)
          setEmail((teacher.profiles as any)?.email)
        }
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="flex">
      <Sidebar
        navItems={navItems}
        title="Teacher Portal"
        role="Educator"
        userName={userName}
        userInfo={email}
      />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
