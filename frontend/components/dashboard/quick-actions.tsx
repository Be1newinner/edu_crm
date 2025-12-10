"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, BookPlus, Layers, CalendarPlus, CreditCard, FileUp } from "lucide-react"

const actions = [
  {
    title: "Add Student",
    description: "Register a new student",
    href: "/students/new",
    icon: UserPlus,
    variant: "default" as const,
  },
  {
    title: "Create Course",
    description: "Add a new course",
    href: "/courses/new",
    icon: BookPlus,
    variant: "outline" as const,
  },
  {
    title: "New Batch",
    description: "Create a batch",
    href: "/batches/new",
    icon: Layers,
    variant: "outline" as const,
  },
  {
    title: "Mark Attendance",
    description: "Record attendance",
    href: "/attendance",
    icon: CalendarPlus,
    variant: "outline" as const,
  },
  {
    title: "Record Payment",
    description: "Collect fees",
    href: "/fees",
    icon: CreditCard,
    variant: "outline" as const,
  },
  {
    title: "Upload Document",
    description: "Add files",
    href: "/documents",
    icon: FileUp,
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Button key={action.title} variant={action.variant} className="h-auto flex-col gap-2 p-4" asChild>
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
