"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, Download, Loader2, Trash2, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createUser } from "@/app/actions/create-user"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

// Types
type Student = {
  id: string
  roll_number: string
  batch: string // e.g. BSE-3B
  program: string
  enrollment_year: number
  profile: {
    full_name: string
    email: string
  }
}

type Teacher = {
  id: string
  employee_id: string
  department: string
  designation: string
  profile: {
    full_name: string
    email: string
  }
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("students")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string; rollNo?: string } | null>(null)

  // Data State
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Form State for Dynamic Logic
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")

  const supabase = createClient()

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true)

      // Fetch Students
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          *,
          profile:profiles(full_name, email)
        `)

      if (studentsData) setStudents(studentsData as any)

      // Fetch Teachers
      const { data: teachersData } = await supabase
        .from('teachers')
        .select(`
          *,
          profile:profiles(full_name, email)
        `)

      if (teachersData) setTeachers(teachersData as any)

      setDataLoading(false)
    }

    fetchData()
  }, [supabase])

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('=== FORM SUBMIT TRIGGERED ===')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Debug: Log all form data
    console.log('Form Data:')
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    // Append derived fields for Student
    if (activeTab === 'students' || formData.get('role') === 'student') {
      // We need to reconstruct the batch string if we are using separate inputs
      // But the server action expects 'program' and 'section' separately to build metadata
      // Wait, server action expects: batchYear, rollNo, program, section
      // And it builds: rollNumber = batchYear + campus + rollNo
      // And metadata batch = program + section (e.g. BSE-3B)

      // Let's ensure we pass the correct values
    }

    const result = await createUser(null, formData)

    console.log('Server Action Result:', result)

    setLoading(false)

    if (result.success && result.credentials) {
      console.log('Success! Credentials:', result.credentials)
      setCredentials(result.credentials)
      setIsAddUserOpen(false)
      toast.success("User created successfully!")
      // Refresh data
      window.location.reload() // Simple reload to fetch new data
    } else {
      console.error('Failed:', result.message)
      toast.error(result.message || "Failed to create user")
    }
  }

  const downloadCredentials = () => {
    if (!credentials) return

    const text = `
Student Portal Credentials
--------------------------
Email: ${credentials.email}
Password: ${credentials.password}
${credentials.rollNo ? `Roll No: ${credentials.rollNo}` : ""}
--------------------------
Please change your password after first login.
    `.trim()

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `credentials-${credentials.email}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Dynamic Section Logic
  const getSections = () => {
    if (!selectedDept || !selectedSemester) return []

    // CS/BCS: 3 sections (A, B, C)
    // SE/BSE: 2 sections (A, B)
    // AI/BAI: 1 section (A)

    let count = 0
    if (selectedDept === 'CS' || selectedDept === 'BCS') count = 3
    else if (selectedDept === 'SE' || selectedDept === 'BSE') count = 2
    else if (selectedDept === 'AI' || selectedDept === 'BAI') count = 1

    const sections = []
    const letters = ['A', 'B', 'C']
    for (let i = 0; i < count; i++) {
      // Return semester+letter (e.g., "3A", "3B") - server uses this directly
      sections.push(`${selectedSemester}${letters[i]}`)
    }
    return sections
  }

  const filteredStudents = students.filter(s =>
    s.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTeachers = teachers.filter(t =>
    t.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.profile?.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Users</h1>
          <p className="text-sm text-muted-foreground">Add and manage students and teachers</p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="students" className="mt-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Roll No</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Batch</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dataLoading ? (
                    <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No students found</td></tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.roll_number}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{student.profile?.full_name}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{student.profile?.email}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{student.batch}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="text-primary hover:underline text-xs"><Edit className="h-4 w-4" /></button>
                          <button className="text-destructive hover:underline text-xs"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">ID</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Department</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dataLoading ? (
                    <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No teachers found</td></tr>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{teacher.employee_id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{teacher.profile?.full_name}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{teacher.profile?.email}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{teacher.department}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="text-primary hover:underline text-xs"><Edit className="h-4 w-4" /></button>
                          <button className="text-destructive hover:underline text-xs"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                <input type="hidden" name="role" value="student" />

                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Ali Ahmed" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Campus</Label>
                    <Select name="campus" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                    <Label>Batch Year</Label>
                    <Input name="batchYear" placeholder="24" maxLength={2} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Program</Label>
                    <Select name="program" required onValueChange={setSelectedDept}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BSE">BSE (Software)</SelectItem>
                        <SelectItem value="BCS">BCS (Comp Sci)</SelectItem>
                        <SelectItem value="BAI">BAI (AI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Semester</Label>
                    <Select name="semester" required onValueChange={setSelectedSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                    <Label>Section</Label>
                    <Select name="section" required disabled={!selectedDept || !selectedSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSections().map(sec => (
                          <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Roll Number (4 Digits)</Label>
                    <Input name="rollNo" placeholder="3029" maxLength={4} required />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Student
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                <input type="hidden" name="role" value="teacher" />

                <div className="grid gap-2">
                  <Label htmlFor="t-name">Full Name</Label>
                  <Input id="t-name" name="name" placeholder="Dr. Hassan Ali" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Campus</Label>
                    <Select name="campus" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                    <Label>Department</Label>
                    <Select name="department" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS">Computer Science</SelectItem>
                        <SelectItem value="SE">Software Engineering</SelectItem>
                        <SelectItem value="AI">Artificial Intelligence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Teacher
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">Email: <span className="font-mono font-normal">{credentials?.email}</span></p>
              <p className="text-sm font-medium">Password: <span className="font-mono font-normal">{credentials?.password}</span></p>
              {credentials?.rollNo && (
                <p className="text-sm font-medium">Roll No: <span className="font-mono font-normal">{credentials?.rollNo}</span></p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Please download these credentials and share them with the user. They will not be shown again.
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
