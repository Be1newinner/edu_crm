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
import { Building2, X } from "lucide-react"

interface DepartmentFilterProps {
  departments: string[]
  selected: string[]
  onChange: (departments: string[]) => void
}

export function DepartmentFilter({ departments, selected, onChange }: DepartmentFilterProps) {
  const toggleDepartment = (dept: string) => {
    if (selected.includes(dept)) {
      onChange(selected.filter((d) => d !== dept))
    } else {
      onChange([...selected, dept])
    }
  }

  const clearFilters = () => {
    onChange([])
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-transparent">
            <Building2 className="h-4 w-4" />
            Department
            {selected.length > 0 && (
              <Badge variant="secondary" className="ml-1 rounded-full px-1.5 text-xs">
                {selected.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {departments.map((dept) => (
            <DropdownMenuCheckboxItem
              key={dept}
              checked={selected.includes(dept)}
              onCheckedChange={() => toggleDepartment(dept)}
            >
              {dept}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selected.length > 0 && (
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={clearFilters}>
          Clear
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
