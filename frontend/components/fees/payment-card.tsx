"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Receipt, Download, Eye, CreditCard, Banknote, Smartphone, Building } from "lucide-react"
import type { Payment } from "@/lib/types"

interface PaymentCardProps {
  payment: Payment
  studentName: string
  studentPhoto?: string
  onViewReceipt?: (payment: Payment) => void
}

export function PaymentCard({ payment, studentName, studentPhoto, onViewReceipt }: PaymentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "upi":
        return <Smartphone className="h-4 w-4" />
      case "bank_transfer":
        return <Building className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30"
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/30"
      case "refunded":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={studentPhoto || "/placeholder.svg"} />
              <AvatarFallback>
                {studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{studentName}</p>
              <p className="text-sm text-muted-foreground">{payment.receiptNumber}</p>
            </div>
          </div>
          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment Date</p>
            <p className="text-sm font-medium">
              {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getPaymentMethodIcon(payment.paymentMethod)}
            <span className="capitalize">{payment.paymentMethod.replace("_", " ")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onViewReceipt?.(payment)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Receipt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
