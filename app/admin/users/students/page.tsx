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

export default function AddStudentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string; rollNo?: string } | null>(null)
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")

  const getSections = () => {
    if (!selectedDept || !selectedSemester) return []

    let count = 0
    if (selectedDept === 'CS' || selectedDept === 'BCS') count = 3
    else if (selectedDept === 'SE' || selectedDept === 'BSE') count = 2
    else if (selectedDept === 'AI' || selectedDept === 'BAI') count = 1

    const sections = []
    const letters = ['A', 'B', 'C']
    for (let i = 0; i < count; i++) {
      sections.push(`${selectedSemester}${letters[i]}`)
    }
    return sections
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget // Capture form reference

    const formData = new FormData(form)
    formData.append('role', 'student')

    const result = await createUser(null, formData)

    setLoading(false)

    if (result.success && result.credentials) {
      setCredentials(result.credentials)
      toast.success("Student created successfully!")
      // Reset form
      form.reset()
      setSelectedDept("")
      setSelectedSemester("")
    } else {
      toast.error(result.message || "Failed to create student")
    }
  }

  const downloadCredentials = () => {
    if (!credentials) return

    const text = `
Student Portal Credentials
--------------------------
Email: ${credentials.email}
Password: ${credentials.password}
Roll No: ${credentials.rollNo}
--------------------------
Please change your password after first login.
    `.trim()

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `student-credentials-${credentials.rollNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setCredentials(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Student</h1>
        <p className="text-sm text-muted-foreground">Create a new student account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Enter the student's details below to create their account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" placeholder="Ali Ahmed" required />
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
                  <Label>Batch Year *</Label>
                  <Input name="batchYear" placeholder="24" maxLength={2} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Program *</Label>
                  <Select name="program" required onValueChange={setSelectedDept}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BSE">BSE (Software Engineering)</SelectItem>
                      <SelectItem value="BCS">BCS (Computer Science)</SelectItem>
                      <SelectItem value="BAI">BAI (Artificial Intelligence)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Semester *</Label>
                  <Select name="semester" required onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Section *</Label>
                  <Select name="section" required disabled={!selectedDept || !selectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSections().map(sec => (
                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Roll Number (4 Digits) *</Label>
                  <Input name="rollNo" placeholder="3029" maxLength={4} required />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Student
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
            <DialogTitle>Student Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 space-y-2 font-mono text-sm">
              <p><strong>Email:</strong> {credentials?.email}</p>
              <p><strong>Password:</strong> {credentials?.password}</p>
              <p><strong>Roll No:</strong> {credentials?.rollNo}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Download these credentials and share them with the student. They won't be shown again.
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
