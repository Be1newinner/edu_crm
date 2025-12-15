"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, Building2, MoreVertical, Eye, Pencil, Trash2, GraduationCap } from "lucide-react"
import type { Staff } from "@/lib/types"
import Link from "next/link"

interface StaffCardProps {
  staff: Staff
}

export function StaffCard({ staff }: StaffCardProps) {
  const initials =
    staff.name
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
              <h4 className="font-medium leading-tight">{staff.name}</h4>
              <p className="text-xs text-muted-foreground">{staff.employeeId}</p>
              {staff.salaryGrade && <Badge variant="secondary">{staff.salaryGrade}</Badge>}
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
                <Link href={`/staff/${staff.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/staff/${staff.id}/edit`}>
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
          {staff.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{staff.email}</span>
            </div>
          )}
          {staff.department && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span>{staff.department}</span>
            </div>
          )}
          {staff.qualification && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{staff.qualification}</span>
            </div>
          )}
        </div>

        <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          Joined {new Date(staff.dateOfJoining).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
