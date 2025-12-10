"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Student } from "@/lib/types"

interface RecentEnrollmentsProps {
  students: Student[]
}

const statusColors: Record<string, string> = {
  ENROLLED: "bg-success/15 text-success hover:bg-success/20",
  PROSPECT: "bg-info/15 text-info hover:bg-info/20",
  DROPPED: "bg-destructive/15 text-destructive hover:bg-destructive/20",
  ALUMNI: "bg-muted text-muted-foreground hover:bg-muted",
}

export function RecentEnrollments({ students }: RecentEnrollmentsProps) {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Enrollments</CardTitle>
        <CardDescription>Latest student enrollments</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-1 px-6 pb-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {student.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "ST"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 overflow-hidden">
                  <p className="truncate text-sm font-medium leading-none">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                </div>
                <Badge variant="secondary" className={statusColors[student.status]}>
                  {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
