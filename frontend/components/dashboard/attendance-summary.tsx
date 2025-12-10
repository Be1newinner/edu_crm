"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AttendanceSummaryProps {
  rate: number
}

export function AttendanceSummary({ rate }: AttendanceSummaryProps) {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 85) return "bg-success"
    if (rate >= 70) return "bg-warning"
    return "bg-destructive"
  }

  const getAttendanceLabel = (rate: number) => {
    if (rate >= 85) return "Excellent"
    if (rate >= 70) return "Good"
    return "Needs Improvement"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Attendance Overview</CardTitle>
        <CardDescription>Overall attendance rate this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold">{rate}%</p>
            <p className="text-sm text-muted-foreground">{getAttendanceLabel(rate)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Target: 90%</p>
            <p className="text-xs text-muted-foreground">{rate >= 90 ? "Target met!" : `${90 - rate}% to go`}</p>
          </div>
        </div>
        <Progress value={rate} className={`h-3 ${getAttendanceColor(rate)}`} />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xl font-semibold text-success">142</p>
            <p className="text-xs text-muted-foreground">Present Today</p>
          </div>
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xl font-semibold text-warning">8</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xl font-semibold text-destructive">6</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
