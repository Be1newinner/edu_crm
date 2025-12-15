"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"

interface AttendanceDay {
  date: Date
  present: number
  absent: number
  late: number
  total: number
}

interface AttendanceCalendarProps {
  attendanceData?: AttendanceDay[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function AttendanceCalendar({ attendanceData = [], onDateSelect, selectedDate }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    if (calendarRef.current) {
      gsap.to(calendarRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          setCurrentDate(new Date(year, month - 1, 1))
          gsap.fromTo(calendarRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 })
        },
      })
    } else {
      setCurrentDate(new Date(year, month - 1, 1))
    }
  }

  const nextMonth = () => {
    if (calendarRef.current) {
      gsap.to(calendarRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          setCurrentDate(new Date(year, month + 1, 1))
          gsap.fromTo(calendarRef.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 })
        },
      })
    } else {
      setCurrentDate(new Date(year, month + 1, 1))
    }
  }

  const getAttendanceForDate = (day: number): AttendanceDay | undefined => {
    const date = new Date(year, month, day)
    return attendanceData.find(
      (a) => a.date.getDate() === day && a.date.getMonth() === month && a.date.getFullYear() === year,
    )
  }

  const getStatusColor = (attendance?: AttendanceDay) => {
    if (!attendance) return "bg-muted"
    const rate = attendance.present / attendance.total
    if (rate >= 0.9) return "bg-emerald-500/20 border-emerald-500/50"
    if (rate >= 0.7) return "bg-amber-500/20 border-amber-500/50"
    return "bg-red-500/20 border-red-500/50"
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const days: (number | null)[] = []
  for (let i = 0; i < startingDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Attendance Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[140px] text-center font-medium">
              {MONTHS[month]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={calendarRef}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }
              const attendance = getAttendanceForDate(day)
              return (
                <button
                  key={day}
                  onClick={() => onDateSelect?.(new Date(year, month, day))}
                  className={cn(
                    "aspect-square rounded-lg border flex flex-col items-center justify-center text-sm transition-all hover:scale-105",
                    getStatusColor(attendance),
                    isSelected(day) && "ring-2 ring-primary",
                    isToday(day) && "font-bold",
                  )}
                >
                  <span className={cn(isToday(day) && "text-primary")}>{day}</span>
                  {attendance && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round((attendance.present / attendance.total) * 100)}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span>90%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" />
            <span>70-90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50" />
            <span>&lt;70%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
