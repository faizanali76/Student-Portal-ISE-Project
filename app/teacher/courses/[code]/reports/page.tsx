import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default async function CourseReportsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Link href={`/teacher/courses/${code}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download course analytics</p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-2">Attendance Report</h2>
          <p className="text-sm text-muted-foreground mb-4">Summary of student attendance for the semester</p>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-2">Results Report</h2>
          <p className="text-sm text-muted-foreground mb-4">Grade distribution and performance analytics</p>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-2">Student Performance</h2>
          <p className="text-sm text-muted-foreground mb-4">Individual student performance metrics</p>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
