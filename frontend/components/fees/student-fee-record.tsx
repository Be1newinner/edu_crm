"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Send, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import type { FeeRecord, Student } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StudentFeeRecordProps {
  record: FeeRecord
  student: Student
  onSendReminder?: (record: FeeRecord) => void
  onGenerateInvoice?: (record: FeeRecord) => void
}

export function StudentFeeRecord({ record, student, onSendReminder, onGenerateInvoice }: StudentFeeRecordProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const paidPercentage = (record.paidAmount / record.totalAmount) * 100
  const dueAmount = record.totalAmount - record.paidAmount

  const getInitials = (name: string) => {
    const parts = name?.split(" ") || []
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name?.[0]?.toUpperCase() || "?"
  }

  const getStatusBadge = () => {
    switch (record.status) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "partial":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.photo || undefined} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSendReminder?.(record)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onGenerateInvoice?.(record)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Fee</p>
            <p className="font-semibold">{formatCurrency(record.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="font-semibold text-emerald-600">{formatCurrency(record.paidAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due</p>
            <p className={cn("font-semibold", dueAmount > 0 ? "text-red-600" : "text-emerald-600")}>
              {formatCurrency(dueAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium">{Math.round(paidPercentage)}%</span>
          </div>
          <Progress
            value={paidPercentage}
            className={cn(
              "h-2",
              paidPercentage === 100 && "[&>div]:bg-emerald-500",
              paidPercentage >= 50 && paidPercentage < 100 && "[&>div]:bg-blue-500",
              paidPercentage < 50 && "[&>div]:bg-amber-500",
            )}
          />
        </div>

        {record.dueDate && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Due Date</span>
            <span
              className={cn("font-medium", new Date(record.dueDate) < new Date() && dueAmount > 0 && "text-red-600")}
            >
              {new Date(record.dueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
