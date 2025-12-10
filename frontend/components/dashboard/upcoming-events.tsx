"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "FSD Batch Final Exam",
    date: "Dec 15, 2024",
    time: "10:00 AM",
    type: "exam",
  },
  {
    id: 2,
    title: "Data Science Demo Day",
    date: "Dec 18, 2024",
    time: "2:00 PM",
    type: "event",
  },
  {
    id: 3,
    title: "Fee Payment Deadline",
    date: "Dec 20, 2024",
    time: "11:59 PM",
    type: "deadline",
  },
  {
    id: 4,
    title: "New Batch Orientation",
    date: "Dec 22, 2024",
    time: "9:00 AM",
    type: "event",
  },
]

const typeColors: Record<string, string> = {
  exam: "bg-destructive/15 text-destructive",
  event: "bg-primary/15 text-primary",
  deadline: "bg-warning/15 text-warning-foreground",
}

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
        <CardDescription>Important dates and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4 rounded-lg border border-border p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{event.title}</p>
                  <Badge variant="secondary" className={typeColors[event.type]}>
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
