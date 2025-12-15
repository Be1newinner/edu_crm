"use client"

import * as React from "react"
import useSWR from "swr"
import { getStaffList } from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { staffColumns } from "@/components/staff/staff-columns"
import { AddStaffDialog } from "@/components/staff/add-staff-dialog"
import { StaffCard } from "@/components/staff/staff-card"
import { DepartmentFilter } from "@/components/staff/department-filter"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutGrid, List, Download } from "lucide-react"

const departments = [
  "Computer Science",
  "Data Science",
  "Design",
  "Cloud & DevOps",
  "Administration",
  "Finance",
  "Marketing",
]

export default function StaffPage() {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [deptFilter, setDeptFilter] = React.useState<string[]>([])

  const {
    data: staff,
    isLoading,
    mutate,
  } = useSWR("staff", async () => {
    const response = await getStaffList()
    return response.data || []
  })

  const filteredStaff = React.useMemo(() => {
    if (!staff) return []
    if (deptFilter.length === 0) return staff
    return staff.filter((s) => s.department && deptFilter.includes(s.department))
  }, [staff, deptFilter])

  const handleStaffAdded = () => {
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
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage your institute&apos;s staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <AddStaffDialog onSuccess={handleStaffAdded} />
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DepartmentFilter departments={departments} selected={deptFilter} onChange={setDeptFilter} />
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
        <DataTable columns={staffColumns} data={filteredStaff} searchKey="name" searchPlaceholder="Search staff..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStaff.map((member) => (
            <StaffCard key={member.id} staff={member} />
          ))}
          {filteredStaff.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">No staff members found.</div>
          )}
        </div>
      )}
    </div>
  )
}
