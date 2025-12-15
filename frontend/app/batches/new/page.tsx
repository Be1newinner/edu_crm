"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { createBatch, getCourses } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewBatchPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    maxCapacity: "",
    startDate: "",
    description: "",
    courseIds: [] as string[],
  })

  const { data: courses } = useSWR("courses", async () => {
    const response = await getCourses()
    return response.data || []
  })

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      courseIds: prev.courseIds.includes(courseId)
        ? prev.courseIds.filter((id) => id !== courseId)
        : [...prev.courseIds, courseId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createBatch({
        name: formData.name,
        maxCapacity: Number.parseInt(formData.maxCapacity) || 30,
        startDate: new Date(formData.startDate).toISOString(),
        description: formData.description,
        courseIds: formData.courseIds,
      })

      if (response.success && response.data) {
        router.push(`/batches/${response.data.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/batches">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Batch</h1>
          <p className="text-muted-foreground">Set up a batch for student enrollment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>Basic information about the batch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Batch Name *</Label>
                <Input
                  id="name"
                  placeholder="FSD Morning Batch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity *</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  placeholder="30"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this batch..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Courses</CardTitle>
            <CardDescription>Select courses for this batch</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 rounded-md border p-4">
              {courses && courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={formData.courseIds.includes(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <label htmlFor={`course-${course.id}`} className="flex-1 cursor-pointer">
                        <p className="text-sm font-medium">{course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.code} • {course.durationMonths} months • ₹{course.feeAmount.toLocaleString()}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">No courses available</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/batches">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Batch
          </Button>
        </div>
      </form>
    </div>
  )
}
