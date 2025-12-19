"use client"

import * as React from "react"
import useSWR from "swr"
import { getStudents } from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { studentColumns } from "@/components/students/student-columns"
import { StudentFilters } from "@/components/students/student-filters"
import { AddStudentDialog } from "@/components/students/add-student-dialog"
import { StudentCard } from "@/components/students/student-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutGrid, List, Download, Upload } from "lucide-react"

function StudentsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-sm" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  )
}

export default function StudentsPage() {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])

  const {
    data: students,
    isLoading,
    mutate,
  } = useSWR("students", async () => {
    const response = await getStudents()
    return response.data?.data || []
  })


  const filteredStudents = React.useMemo(() => {
    if (!students) return []
    if (statusFilter.length === 0) return students
    return students.filter((s) => statusFilter.includes(s.status))
  }, [students, statusFilter])

  const handleStudentAdded = () => {
    mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <StudentsTableSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your institute&apos;s students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <AddStudentDialog onSuccess={handleStudentAdded} />
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StudentFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "grid")}>
          <TabsList className="h-9">
            <TabsTrigger value="table" className="gap-1.5 px-3">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="gap-1.5 px-3">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <DataTable
          columns={studentColumns}
          data={filteredStudents}
          searchKey="name"
          searchPlaceholder="Search students..."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">No students found.</div>
          )}
        </div>
      )}
    </div>
  )
}
