"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, Search, Users, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import type { Student, Batch } from "@/lib/types"
import { toast } from "sonner"

interface StudentAttendance {
  student: Student
  status: "present" | "absent" | "late" | null
}

interface MarkAttendanceProps {
  students: Student[]
  batches: Batch[]
  onSave?: (attendanceData: { studentId: string; status: string; batchId: string; date: Date }[]) => void
}

function getInitials(name: string | undefined): string {
  if (!name) return "??"
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export function MarkAttendance({ students, batches, onSave }: MarkAttendanceProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [search, setSearch] = useState("")
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [selectAll, setSelectAll] = useState<"present" | "absent" | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered = students.filter((s) => !selectedBatch || s.batchIds?.includes(selectedBatch))
    setAttendance(filtered.map((student) => ({ student, status: null })))
  }, [students, selectedBatch])

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(listRef.current.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.3 })
    }
  }, [attendance.length])

  const filteredAttendance = attendance.filter((a) => {
    const studentName = a.student.name?.toLowerCase() || ""
    const rollNumber = a.student.rollNumber?.toLowerCase() || ""
    const searchTerm = search.toLowerCase()
    return studentName.includes(searchTerm) || rollNumber.includes(searchTerm)
  })

  const setStatus = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => prev.map((a) => (a.student.id === studentId ? { ...a, status } : a)))
  }

  const handleSelectAll = (status: "present" | "absent") => {
    setSelectAll(status)
    setAttendance((prev) => prev.map((a) => ({ ...a, status })))
  }

  const handleSave = () => {
    const data = attendance
      .filter((a) => a.status !== null)
      .map((a) => ({
        studentId: a.student.id,
        status: a.status!,
        batchId: selectedBatch,
        date: new Date(selectedDate),
      }))
    onSave?.(data)
    toast.success(`Attendance saved for ${data.length} students`)
  }

  const stats = {
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
    unmarked: attendance.filter((a) => a.status === null).length,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select a batch and mark student attendance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll("present")}
              className={cn(selectAll === "present" && "bg-emerald-500/10 border-emerald-500")}
            >
              <Check className="h-4 w-4 mr-1" />
              All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll("absent")}
              className={cn(selectAll === "absent" && "bg-red-500/10 border-red-500")}
            >
              <X className="h-4 w-4 mr-1" />
              All Absent
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{attendance.length} Students</span>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            {stats.present} Present
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
            {stats.absent} Absent
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            {stats.late} Late
          </Badge>
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {stats.unmarked} Unmarked
          </Badge>
        </div>

        <div ref={listRef} className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredAttendance.map(({ student, status }) => (
            <div
              key={student.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                status === "present" && "bg-emerald-500/5 border-emerald-500/30",
                status === "absent" && "bg-red-500/5 border-red-500/30",
                status === "late" && "bg-amber-500/5 border-amber-500/30",
                status === null && "bg-card",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined || "/placeholder.svg"} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student.name || "Unknown Student"}</p>
                  <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStatus(student.id, "present")}
                  className={cn(
                    "h-9 w-9 rounded-full transition-all",
                    status === "present"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "hover:bg-emerald-500/10 text-emerald-600",
                  )}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStatus(student.id, "late")}
                  className={cn(
                    "h-9 w-9 rounded-full transition-all",
                    status === "late"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "hover:bg-amber-500/10 text-amber-600",
                  )}
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStatus(student.id, "absent")}
                  className={cn(
                    "h-9 w-9 rounded-full transition-all",
                    status === "absent" ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-red-500/10 text-red-600",
                  )}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={stats.unmarked === attendance.length}>
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
