"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { BarChart3, Users, BookOpen, FileText, GraduationCap, UserCog } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    children: [
      { label: "Students", href: "/admin/users/students", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Teachers", href: "/admin/users/teachers", icon: <UserCog className="h-4 w-4" /> },
    ],
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      { label: "All Courses", href: "/admin/courses", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Assign Courses", href: "/admin/courses/assign", icon: <UserCog className="h-4 w-4" /> },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>()
  const [email, setEmail] = useState<string>()

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserName(profile.full_name)
          setEmail(profile.email)
        }
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="flex">
      <Sidebar
        navItems={navItems}
        title="Admin Portal"
        role="Administrator"
        userName={userName}
        userInfo={email}
      />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
