"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  children?: NavItem[]
}

interface SidebarProps {
  navItems: NavItem[]
  title: string
  role: string
  userName?: string
  userInfo?: string // email for teachers/admin, roll number for students
}

export function Sidebar({ navItems, title, role, userName, userInfo }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const isActive = (href: string) => pathname.startsWith(href)

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Menu Button - Fixed positioning on tablet and mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md p-2 text-foreground hover:bg-secondary md:left-6 md:top-6 lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="border-b border-sidebar-border p-6">
          <div className="flex items-center gap-3 mb-2">
            <img src="/myPortal-removebg-preview.png" alt="MyPortal" className="h-8 w-8 object-contain" />
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          </div>
          <p className="text-xs text-muted-foreground capitalize">{role}</p>
        </div>

        {/* Navigation - Reduced spacing between items from space-y-1 to minimal gaps */}
        <nav className="overflow-y-auto flex flex-col h-[calc(100vh-220px)] p-3">
          <div className="space-y-0.5 flex-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <div className="flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 flex-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleExpand(item.label)
                        }}
                        className="p-1 hover:bg-sidebar-accent rounded-sm"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.label) && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                    {expandedItems.includes(item.label) && (
                      <div className="space-y-0.5 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
                              isActive(child.href)
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Info - Above Logout */}
        {userName && (
          <div className="border-t border-sidebar-border px-3 py-3">
            <div className="px-4 py-2 space-y-0.5">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
              {userInfo && (
                <p className="text-xs text-muted-foreground truncate">{userInfo}</p>
              )}
            </div>
          </div>
        )}

        {/* Logout - Made functional and fixed spacing */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Content offset */}
      <div className={cn("transition-all duration-300", isOpen ? "lg:ml-64" : "")} />
    </>
  )
}
