"use client"

import { useState, useEffect } from "react"
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar"
import { MarkAttendance } from "@/components/attendance/mark-attendance"
import { AttendanceReport } from "@/components/attendance/attendance-report"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ClipboardCheck, BarChart3, Download, Users, CheckCircle, XCircle, Clock } from "lucide-react"
import { api } from "@/lib/api"
import type { Student, Batch } from "@/lib/types"

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, batchesRes] = await Promise.all([api.students.getAll(), api.batches.getAll()])
        setStudents(studentsRes.data || [])
        setBatches(batchesRes.data || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Generate mock attendance data for calendar
  const generateAttendanceData = () => {
    const data = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Skip weekends
        data.push({
          date,
          present: Math.floor(Math.random() * 20) + 30,
          absent: Math.floor(Math.random() * 5),
          late: Math.floor(Math.random() * 3),
          total: 50,
        })
      }
    }
    return data
  }

  const attendanceData = generateAttendanceData()

  // Generate mock report stats
  const reportStats = students.slice(0, 10).map((student) => ({
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    photo: student.photo || undefined,
    totalClasses: 45,
    present: Math.floor(Math.random() * 10) + 35,
    absent: Math.floor(Math.random() * 5),
    late: Math.floor(Math.random() * 5),
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
  }))

  // Calculate overview stats
  const todayAttendance = attendanceData.find((d) => d.date.toDateString() === new Date().toDateString())

  const overviewStats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Present Today",
      value: todayAttendance?.present || 0,
      icon: CheckCircle,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Absent Today",
      value: todayAttendance?.absent || 0,
      icon: XCircle,
      color: "text-red-500 bg-red-500/10",
    },
    {
      title: "Late Today",
      value: todayAttendance?.late || 0,
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="mark" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mark" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4">
          <MarkAttendance
            students={students}
            batches={batches}
            onSave={(data) => console.log("Saving attendance:", data)}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <AttendanceCalendar
              attendanceData={attendanceData}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
            <Card>
              <CardHeader>
                <CardTitle>
                  Attendance for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceData.find(
                  (d) => d.date.toDateString() === selectedDate.toDateString()
                ) ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-3xl font-bold text-emerald-600">
                          {
                            attendanceData.find(
                              (d) =>
                                d.date.toDateString() ===
                                selectedDate.toDateString()
                            )?.present
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">Present</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-3xl font-bold text-amber-600">
                          {
                            attendanceData.find(
                              (d) =>
                                d.date.toDateString() ===
                                selectedDate.toDateString()
                            )?.late
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">Late</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-3xl font-bold text-red-600">
                          {
                            attendanceData.find(
                              (d) =>
                                d.date.toDateString() ===
                                selectedDate.toDateString()
                            )?.absent
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No attendance data for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AttendanceReport stats={reportStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
