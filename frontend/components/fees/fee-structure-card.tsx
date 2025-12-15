"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Copy, IndianRupee } from "lucide-react"
import type { FeeStructure } from "@/lib/types"

interface FeeStructureCardProps {
  structure: FeeStructure
  onEdit?: (structure: FeeStructure) => void
  onDelete?: (id: string) => void
}

export function FeeStructureCard({ structure, onEdit, onDelete }: FeeStructureCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{structure.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{structure.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(structure)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(structure.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(structure.totalAmount)}</p>
              <p className="text-xs text-muted-foreground">Total Amount</p>
            </div>
          </div>
          <Badge variant={structure.isActive ? "default" : "secondary"}>
            {structure.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Fee Components</p>
          <div className="space-y-1">
            {structure.components.slice(0, 3).map((component, index) => (
              <div key={index} className="flex items-center justify-between text-sm py-1 px-2 rounded bg-muted/50">
                <span className="text-muted-foreground">{component.name}</span>
                <span className="font-medium">{formatCurrency(component.amount)}</span>
              </div>
            ))}
            {structure.components.length > 3 && (
              <p className="text-xs text-muted-foreground text-center py-1">
                +{structure.components.length - 3} more components
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Academic Year</span>
            <span className="font-medium">{structure.academicYear}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
