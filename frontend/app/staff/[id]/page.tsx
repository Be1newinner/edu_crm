"use client"
import { useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { getStaff, getBatches } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Pencil, Mail, Calendar, Building2, GraduationCap, Layers, CalendarCheck, Award } from "lucide-react"

export default function StaffDetailPage() {
  const params = useParams()
  const staffId = params.id as string

  const { data: staff, isLoading } = useSWR(`staff-${staffId}`, async () => {
    const response = await getStaff(staffId)
    return response.data
  })

  const { data: batches } = useSWR("batches", async () => {
    const response = await getBatches()
    return response.data || []
  })

  if (isLoading || !staff) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-1" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    )
  }

  const initials =
    staff.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ST"

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/staff">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{staff.name}</h1>
            <p className="text-muted-foreground">{staff.employeeId}</p>
          </div>
        </div>
        <Button className="gap-2" asChild>
          <Link href={`/staff/${staffId}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-semibold">{staff.name}</h3>
              <p className="text-sm text-muted-foreground">{staff.employeeId}</p>
              {staff.salaryGrade && (
                <Badge variant="secondary" className="mt-2">
                  Grade: {staff.salaryGrade}
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {staff.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{staff.email}</p>
                  </div>
                </div>
              )}
              {staff.department && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{staff.department}</p>
                  </div>
                </div>
              )}
              {staff.qualification && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Qualification</p>
                    <p className="text-sm font-medium">{staff.qualification}</p>
                  </div>
                </div>
              )}
              {staff.dateOfJoining && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Joining</p>
                    <p className="text-sm font-medium">{new Date(staff.dateOfJoining).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="batches">
            <TabsList>
              <TabsTrigger value="batches" className="gap-1.5">
                <Layers className="h-4 w-4" />
                Batches
              </TabsTrigger>
              <TabsTrigger value="attendance" className="gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-1.5">
                <Award className="h-4 w-4" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="batches" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Batches</CardTitle>
                  <CardDescription>Batches this staff member is teaching</CardDescription>
                </CardHeader>
                <CardContent>
                  {batches && batches.length > 0 ? (
                    <div className="space-y-3">
                      {batches.slice(0, 3).map((batch) => (
                        <div key={batch.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{batch.name}</p>
                            <p className="text-sm text-muted-foreground">{batch.description}</p>
                          </div>
                          <Badge variant="secondary">
                            {batch.currentEnrollment}/{batch.maxCapacity} students
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">No batches assigned</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                  <CardDescription>Staff attendance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Attendance records will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Reviews</CardTitle>
                  <CardDescription>Performance evaluation history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Performance data will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
