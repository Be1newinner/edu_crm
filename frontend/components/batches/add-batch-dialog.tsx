"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, Loader2 } from "lucide-react"
import { createBatch, getCourses } from "@/lib/api"
import type { Batch, Course } from "@/lib/types"
import useSWR from "swr"

interface AddBatchDialogProps {
  onSuccess?: (batch: Batch) => void
}

export function AddBatchDialog({ onSuccess }: AddBatchDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    maxCapacity: "",
    startDate: "",
    description: "",
    courseIds: [] as string[],
  })

  const { data: courses } = useSWR<Course[]>(open ? "courses-for-batch" : null, async () => {
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
        onSuccess?.(response.data)
        setOpen(false)
        setFormData({
          name: "",
          maxCapacity: "",
          startDate: "",
          description: "",
          courseIds: [],
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Layers className="h-4 w-4" />
          Create Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>Set up a new batch for student enrollment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="batch-name">Batch Name *</Label>
              <Input
                id="batch-name"
                placeholder="FSD Morning Batch"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-capacity">Max Capacity *</Label>
              <Input
                id="batch-capacity"
                type="number"
                placeholder="30"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-startDate">Start Date *</Label>
              <Input
                id="batch-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="batch-description">Description</Label>
              <Textarea
                id="batch-description"
                placeholder="Describe this batch..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label>Assign Courses</Label>
            <ScrollArea className="h-40 rounded-md border p-3">
              {courses && courses.length > 0 ? (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={formData.courseIds.includes(course.id)}
                        onCheckedChange={() => toggleCourse(course.id)}
                      />
                      <label
                        htmlFor={`course-${course.id}`}
                        className="flex-1 cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <span className="font-medium">{course.name}</span>
                        <span className="ml-2 text-muted-foreground">({course.code})</span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No courses available</p>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Batch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
