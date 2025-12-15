"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, Mail, Building2 } from "lucide-react"
import type { Staff } from "@/lib/types"
import Link from "next/link"

const departmentColors: Record<string, string> = {
  "Computer Science": "bg-primary/15 text-primary border-primary/30",
  Administration: "bg-info/15 text-info border-info/30",
  "Data Science": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Design: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "Cloud & DevOps": "bg-chart-4/15 text-chart-4 border-chart-4/30",
}

export const staffColumns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 hover:bg-transparent"
      >
        Staff Member
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const staff = row.original
      const initials =
        staff.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "ST"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{staff.name}</p>
            <p className="text-xs text-muted-foreground">{staff.employeeId}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | undefined
      return email ? (
        <div className="flex items-center gap-1.5 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          {email}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as string | undefined
      const colorClass = department ? departmentColors[department] || "bg-muted text-muted-foreground" : ""
      return department ? (
        <Badge variant="outline" className={colorClass}>
          <Building2 className="mr-1 h-3 w-3" />
          {department}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
    cell: ({ row }) => {
      const qualification = row.getValue("qualification") as string | undefined
      return <span className="text-sm">{qualification || "-"}</span>
    },
  },
  {
    accessorKey: "salaryGrade",
    header: "Grade",
    cell: ({ row }) => {
      const grade = row.getValue("salaryGrade") as string | undefined
      return grade ? <Badge variant="secondary">{grade}</Badge> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "dateOfJoining",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 hover:bg-transparent"
      >
        Joined
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfJoining"))
      return <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
