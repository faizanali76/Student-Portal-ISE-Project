"use client"
import { Button } from "@/components/ui/button"
import { Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TeacherProfilePage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Link href="/teacher/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
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
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input
                  type="tel"
                  defaultValue="+92-300-9876543"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                />
              </div>
            </div>
            <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <input
                  type="text"
                  defaultValue="Computer Science"
                  disabled
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-secondary text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Office Location</label>
                <input
                  type="text"
                  defaultValue="Block A, Room 305"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Office Hours</label>
                <input
                  type="text"
                  defaultValue="Mon & Wed: 2-4 PM"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
                />
              </div>
            </div>
            <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary">DH</span>
            </div>
            <h3 className="font-semibold text-foreground">Dr. Hassan</h3>
            <p className="text-xs text-muted-foreground">Computer Science</p>
            <Button className="w-full mt-4 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
