"use client"
import { Button } from "@/components/ui/button"
import { Settings, Lock, Bell, Database } from "lucide-react"
import { useState } from "react"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("system")

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure system-wide preferences</p>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: "system", label: "System", icon: Settings },
          { id: "security", label: "Security", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "backup", label: "Backup", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab.id
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
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">System Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Institution Name</label>
                  <input
                    type="text"
                    defaultValue="NUCES Student Management"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@nu.edu.pk"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Attendance Threshold (%)</label>
                  <input
                    type="number"
                    defaultValue="75"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Grading Scale</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
                    <option>4.0 Scale</option>
                    <option>100 Scale</option>
                    <option>Letter Grade</option>
                  </select>
                </div>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Enable Two-Factor Authentication</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Password Reset Required Every 90 Days</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Session Timeout after Inactivity</span>
                </label>
                <div className="mt-4">
                  <label className="text-sm font-medium text-foreground">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  />
                </div>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Settings</Button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Email Notifications for System Events</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Notify on Low Attendance</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Notify on System Maintenance</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Digest Reports Daily</span>
                </label>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Preferences</Button>
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Backup & Restore</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">Last Backup: Nov 27, 2024 - 02:00 AM</p>
                  <p className="text-xs text-muted-foreground">Size: 2.4 GB</p>
                </div>
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Database className="h-4 w-4" />
                  Create Backup Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-secondary text-foreground bg-transparent"
                >
                  Download Last Backup
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Scheduled Backups</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  <span className="text-sm text-foreground">Enable Automatic Backups</span>
                </label>
                <div>
                  <label className="text-sm font-medium text-foreground">Backup Frequency</label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Schedule</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
