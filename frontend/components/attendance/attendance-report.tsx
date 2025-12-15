"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttendanceStats {
  studentId: string
  studentName: string
  photo?: string
  totalClasses: number
  present: number
  absent: number
  late: number
  trend: "up" | "down" | "stable"
}

interface AttendanceReportProps {
  stats: AttendanceStats[]
}

export function AttendanceReport({ stats }: AttendanceReportProps) {
  const getAttendanceRate = (stat: AttendanceStats) => {
    return Math.round((stat.present / stat.totalClasses) * 100)
  }

  const getStatusBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Excellent</Badge>
    if (rate >= 75) return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">Good</Badge>
    if (rate >= 60) return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Average</Badge>
    return <Badge className="bg-red-500/10 text-red-600 border-red-500/30">Poor</Badge>
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => {
            const rate = getAttendanceRate(stat)
            return (
              <div key={stat.studentId} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={stat.photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {stat.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{stat.studentName}</p>
                      <p className="text-sm text-muted-foreground">{stat.totalClasses} total classes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(stat.trend)}
                    {getStatusBadge(rate)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Attendance Rate</span>
                    <span className="font-medium">{rate}%</span>
                  </div>
                  <Progress
                    value={rate}
                    className={cn(
                      "h-2",
                      rate >= 90 && "[&>div]:bg-emerald-500",
                      rate >= 75 && rate < 90 && "[&>div]:bg-blue-500",
                      rate >= 60 && rate < 75 && "[&>div]:bg-amber-500",
                      rate < 60 && "[&>div]:bg-red-500",
                    )}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stat.present} Present</span>
                    <span>{stat.late} Late</span>
                    <span>{stat.absent} Absent</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
