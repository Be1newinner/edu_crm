"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/10 border-success/20",
  warning: "bg-warning/10 border-warning/20",
  destructive: "bg-destructive/10 border-destructive/20",
}

const iconVariantStyles = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  destructive: "bg-destructive/15 text-destructive",
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden transition-shadow hover:shadow-md", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center text-sm font-medium",
                    change >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {change >= 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                  {Math.abs(change)}%
                </span>
                {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconVariantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
