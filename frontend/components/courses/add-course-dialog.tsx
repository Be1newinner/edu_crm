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
import { BookPlus, Loader2 } from "lucide-react"
import { createCourse } from "@/lib/api"
import type { Course } from "@/lib/types"

interface AddCourseDialogProps {
  onSuccess?: (course: Course) => void
}

export function AddCourseDialog({ onSuccess }: AddCourseDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    durationMonths: "",
    credits: "",
    feeAmount: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createCourse({
        name: formData.name,
        code: formData.code,
        durationMonths: Number.parseInt(formData.durationMonths) || 0,
        credits: Number.parseInt(formData.credits) || 0,
        feeAmount: Number.parseInt(formData.feeAmount) || 0,
        description: formData.description,
      })

      if (response.success && response.data) {
        onSuccess?.(response.data)
        setOpen(false)
        setFormData({
          name: "",
          code: "",
          durationMonths: "",
          credits: "",
          feeAmount: "",
          description: "",
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
          <BookPlus className="h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>Add a new course to your institute&apos;s curriculum.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="course-name">Course Name *</Label>
              <Input
                id="course-name"
                placeholder="Full Stack Development"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-code">Course Code *</Label>
              <Input
                id="course-code"
                placeholder="FSD101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-duration">Duration (months) *</Label>
              <Input
                id="course-duration"
                type="number"
                placeholder="6"
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-credits">Credits</Label>
              <Input
                id="course-credits"
                type="number"
                placeholder="24"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-fee">Fee Amount (₹) *</Label>
              <Input
                id="course-fee"
                type="number"
                placeholder="45000"
                value={formData.feeAmount}
                onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="course-description">Description</Label>
              <Textarea
                id="course-description"
                placeholder="Describe the course curriculum and outcomes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
