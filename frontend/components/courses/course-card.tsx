"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, CreditCardIcon, GraduationCap, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react"
import type { Course } from "@/lib/types"
import Link from "next/link"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
            {course.code}
          </Badge>
          <h3 className="font-semibold leading-tight">{course.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description || "No description available"}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3 border-t pt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{course.durationMonths} months</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>{course.credits} credits</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <CreditCardIcon className="h-4 w-4" />
          <span>₹{course.feeAmount.toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
