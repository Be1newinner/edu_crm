"use client"

import * as React from "react"
import useSWR from "swr"
import { getCourses } from "@/lib/api"
import { CourseCard } from "@/components/courses/course-card"
import { AddCourseDialog } from "@/components/courses/add-course-dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"

export default function CoursesPage() {
  const [search, setSearch] = React.useState("")

  const {
    data: courses,
    isLoading,
    mutate,
  } = useSWR("courses", async () => {
    const response = await getCourses()
    return response.data || []
  })

  const filteredCourses = React.useMemo(() => {
    if (!courses) return []
    if (!search) return courses
    const searchLower = search.toLowerCase()
    return courses.filter(
      (c) => c.name.toLowerCase().includes(searchLower) || c.code.toLowerCase().includes(searchLower),
    )
  }, [courses, search])

  const handleCourseAdded = () => {
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage your institute&apos;s course catalog</p>
        </div>
        <AddCourseDialog onSuccess={handleCourseAdded} />
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {search ? "No courses match your search" : "No courses found. Add your first course!"}
          </div>
        )}
      </div>
    </div>
  )
}
