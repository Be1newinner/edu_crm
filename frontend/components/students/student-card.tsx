"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, Phone, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react"
import type { Student } from "@/lib/types"
import Link from "next/link"

interface StudentCardProps {
  student: Student
}

const statusColors: Record<string, string> = {
  ENROLLED: "bg-success/15 text-success border-success/30",
  PROSPECT: "bg-info/15 text-info border-info/30",
  DROPPED: "bg-destructive/15 text-destructive border-destructive/30",
  ALUMNI: "bg-muted text-muted-foreground border-muted",
}

export function StudentCard({ student }: StudentCardProps) {
  const initials =
    student.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ST"

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-medium leading-tight">{student.name}</h4>
              <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
              <Badge variant="outline" className={`text-xs ${statusColors[student.status]}`}>
                {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/students/${student._id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/students/${student.id}/edit`}>
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
        </div>

        <div className="mt-4 space-y-2">
          {student.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{student.email}</span>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{student.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>{student.batchIds.length > 0 ? `${student.batchIds.length} batch(es)` : "Individual Study"}</span>
          <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
