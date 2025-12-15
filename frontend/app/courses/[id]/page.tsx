"use client"
import { useParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { getCourse, getBatches, getStudents } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Pencil, Clock, GraduationCap, CreditCardIcon, Users, Layers, BookOpen } from "lucide-react"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

  const { data: course, isLoading } = useSWR(`course-${courseId}`, async () => {
    const response = await getCourse(courseId)
    return response.data
  })

  const { data: batches } = useSWR("batches", async () => {
    const response = await getBatches()
    return response.data || []
  })

  const { data: students } = useSWR("students", async () => {
    const response = await getStudents()
    return response.data || []
  })

  if (isLoading || !course) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-1" />
          <Skeleton className="h-48 lg:col-span-2" />
        </div>
      </div>
    )
  }

  const courseBatches = batches?.filter((b) => b.courseIds.includes(course.id)) || []
  const totalEnrollment = courseBatches.reduce((sum, b) => sum + b.currentEnrollment, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/courses">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {course.code}
              </Badge>
            </div>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>
        <Button className="gap-2" asChild>
          <Link href={`/courses/${courseId}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-xl font-bold">{course.durationMonths} months</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <GraduationCap className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-xl font-bold">{course.credits}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <CreditCardIcon className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fee</p>
              <p className="text-xl font-bold">₹{course.feeAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <Users className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-xl font-bold">{totalEnrollment}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="batches">
        <TabsList>
          <TabsTrigger value="batches" className="gap-1.5">
            <Layers className="h-4 w-4" />
            Batches
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="gap-1.5">
            <BookOpen className="h-4 w-4" />
            Curriculum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Batches</CardTitle>
              <CardDescription>Batches running this course</CardDescription>
            </CardHeader>
            <CardContent>
              {courseBatches.length > 0 ? (
                <div className="space-y-4">
                  {courseBatches.map((batch) => (
                    <div key={batch.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{batch.name}</p>
                          <p className="text-sm text-muted-foreground">{batch.description}</p>
                        </div>
                        <Badge variant={batch.currentEnrollment >= batch.maxCapacity ? "destructive" : "secondary"}>
                          {batch.currentEnrollment >= batch.maxCapacity ? "Full" : "Open"}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Enrollment</span>
                          <span>
                            {batch.currentEnrollment}/{batch.maxCapacity}
                          </span>
                        </div>
                        <Progress value={(batch.currentEnrollment / batch.maxCapacity) * 100} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">No batches for this course yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>Topics and modules covered in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-8 text-center text-muted-foreground">Curriculum details will be available here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
