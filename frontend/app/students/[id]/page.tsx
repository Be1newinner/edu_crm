"use client"
import { useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { getStudent, getStudentFees, getBatches } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Layers,
  CreditCard,
  FileText,
  CalendarCheck,
} from "lucide-react"

const statusColors: Record<string, string> = {
  ENROLLED: "bg-success/15 text-success border-success/30",
  PROSPECT: "bg-info/15 text-info border-info/30",
  DROPPED: "bg-destructive/15 text-destructive border-destructive/30",
  ALUMNI: "bg-muted text-muted-foreground border-muted",
}

const feeStatusColors: Record<string, string> = {
  PAID: "bg-success/15 text-success",
  PARTIAL: "bg-warning/15 text-warning-foreground",
  PENDING: "bg-info/15 text-info",
  OVERDUE: "bg-destructive/15 text-destructive",
}

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string

  const { data: student, isLoading: studentLoading } = useSWR(`student-${studentId}`, async () => {
    const response = await getStudent(studentId)
    return response.data?.data
  })

  const { data: fees } = useSWR(student ? `student-fees-${studentId}` : null, async () => {
    const response = await getStudentFees({ studentId })
    return response.data?.data || []
  })

  const { data: batches } = useSWR("batches", async () => {
    const response = await getBatches()
    return response.data?.data || []
  })

  if (studentLoading || !student) {
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
    student.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ST"

  const studentBatches = batches?.filter((b) => student.batchIds.includes(b.id)) || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/students">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">{student.rollNumber}</p>
          </div>
        </div>
        <Button className="gap-2" asChild>
          <Link href={`/students/${studentId}/edit`}>
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
              <h3 className="mt-4 text-xl font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
              <Badge variant="outline" className={`mt-2 ${statusColors[student.status]}`}>
                {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              {student.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{student.email}</p>
                  </div>
                </div>
              )}
              {student.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{student.phone}</p>
                  </div>
                </div>
              )}
              {student.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {student.gender && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-sm font-medium capitalize">{student.gender.toLowerCase()}</p>
                  </div>
                </div>
              )}
              {student.address && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{student.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Guardian Info */}
            {(student.guardianName || student.guardianPhone) && (
              <div className="mt-6 border-t pt-6">
                <h4 className="mb-3 text-sm font-medium">Guardian Information</h4>
                {student.guardianName && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Guardian Name</p>
                      <p className="text-sm font-medium">{student.guardianName}</p>
                    </div>
                  </div>
                )}
                {student.guardianPhone && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Guardian Phone</p>
                      <p className="text-sm font-medium">{student.guardianPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
              <TabsTrigger value="fees" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                Fees
              </TabsTrigger>
              <TabsTrigger value="attendance" className="gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="batches" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Batches</CardTitle>
                  <CardDescription>
                    {student.individualStudy ? "Individual study student" : "Batches the student is enrolled in"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {studentBatches.length > 0 ? (
                    <div className="space-y-3">
                      {studentBatches.map((batch) => (
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
                    <p className="py-8 text-center text-muted-foreground">
                      {student.individualStudy ? "This student studies individually" : "No batches enrolled"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fee History</CardTitle>
                  <CardDescription>Payment records and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  {fees && fees.length > 0 ? (
                    <div className="space-y-3">
                      {fees.map((fee) => (
                        <div key={fee.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{fee.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(fee.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{fee.totalAmount.toLocaleString()}</p>
                            <Badge className={feeStatusColors[fee.status]}>
                              {fee.status.charAt(0) + fee.status.slice(1).toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">No fee records found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                  <CardDescription>Monthly attendance summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Attendance records will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Uploaded files and certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No documents uploaded yet
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
