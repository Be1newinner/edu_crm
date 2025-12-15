"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Users, MoreVertical, Eye, Pencil, Trash2, UserPlus } from "lucide-react"
import type { Batch } from "@/lib/types"
import Link from "next/link"

interface BatchCardProps {
  batch: Batch
}

export function BatchCard({ batch }: BatchCardProps) {
  const enrollmentPercentage = (batch.currentEnrollment / batch.maxCapacity) * 100
  const isFull = batch.currentEnrollment >= batch.maxCapacity

  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight">{batch.name}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{batch.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/batches/${batch.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/batches/${batch.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isFull}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Students
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Starts {new Date(batch.startDate).toLocaleDateString()}</span>
          </div>
          <Badge variant={isFull ? "destructive" : "secondary"}>{isFull ? "Full" : "Open"}</Badge>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Enrollment</span>
            <span className="font-medium">
              {batch.currentEnrollment}/{batch.maxCapacity}
            </span>
          </div>
          <Progress value={enrollmentPercentage} className={isFull ? "bg-destructive/20" : ""} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{batch.currentEnrollment} students</span>
          </div>
          <Badge variant="outline">{batch.courseIds.length} course(s)</Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
