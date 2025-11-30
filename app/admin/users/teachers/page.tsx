"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download } from "lucide-react"
import { createUser } from "@/app/actions/create-user"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AddTeacherPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget // Capture form reference

    const formData = new FormData(form)
    formData.append('role', 'teacher')

    const result = await createUser(null, formData)

    setLoading(false)

    if (result.success && result.credentials) {
      setCredentials(result.credentials)
      toast.success("Teacher created successfully!")
      form.reset()
    } else {
      toast.error(result.message || "Failed to create teacher")
    }
  }

  const downloadCredentials = () => {
    if (!credentials) return

    const text = `
Teacher Portal Credentials
--------------------------
Email: ${credentials.email}
Password: ${credentials.password}
--------------------------
Please change your password after first login.
    `.trim()

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `teacher-credentials-${credentials.email.split('@')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setCredentials(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Teacher</h1>
        <p className="text-sm text-muted-foreground">Create a new teacher account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Enter the teacher's details below to create their account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" placeholder="Dr. Hassan Ali" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Campus *</Label>
                  <Select name="campus" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">Faisalabad (F)</SelectItem>
                      <SelectItem value="L">Lahore (L)</SelectItem>
                      <SelectItem value="I">Islamabad (I)</SelectItem>
                      <SelectItem value="K">Karachi (K)</SelectItem>
                      <SelectItem value="P">Peshawar (P)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Department *</Label>
                  <Select name="department" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS">Computer Science</SelectItem>
                      <SelectItem value="SE">Software Engineering</SelectItem>
                      <SelectItem value="AI">Artificial Intelligence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Teacher
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Credentials Dialog */}
      <Dialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 space-y-2 font-mono text-sm">
              <p><strong>Email:</strong> {credentials?.email}</p>
              <p><strong>Password:</strong> {credentials?.password}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Download these credentials and share them with the teacher. They won't be shown again.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={downloadCredentials} className="w-full gap-2">
              <Download className="h-4 w-4" /> Download Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
