"use client"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useState } from "react"

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: "profile", label: "Profile", icon: User },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="max-w-2xl">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Dr. Hassan"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    defaultValue="dr.hassan@nu.edu.pk"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Department</label>
                  <input
                    type="text"
                    defaultValue="Computer Science"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Office</label>
                  <input
                    type="text"
                    defaultValue="Block A, Room 305"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Campus</label>
                  <input
                    type="text"
                    defaultValue="Islamabad"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
