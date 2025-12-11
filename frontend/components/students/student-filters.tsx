"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, X } from "lucide-react"

interface StudentFiltersProps {
  statusFilter: string[]
  onStatusChange: (statuses: string[]) => void
}

const statuses = [
  { value: "ENROLLED", label: "Enrolled" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "DROPPED", label: "Dropped" },
  { value: "ALUMNI", label: "Alumni" },
]

export function StudentFilters({ statusFilter, onStatusChange }: StudentFiltersProps) {
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusChange(statusFilter.filter((s) => s !== status))
    } else {
      onStatusChange([...statusFilter, status])
    }
  }

  const clearFilters = () => {
    onStatusChange([])
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-transparent">
            <Filter className="h-4 w-4" />
            Status
            {statusFilter.length > 0 && (
              <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                {statusFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={statusFilter.includes(status.value)}
              onCheckedChange={() => toggleStatus(status.value)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {statusFilter.length > 0 && (
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={clearFilters}>
          Clear
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
