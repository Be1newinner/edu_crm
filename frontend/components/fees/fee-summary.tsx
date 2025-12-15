"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { IndianRupee, TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface FeeSummaryProps {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  collectionRate: number
  monthlyTarget: number
  monthlyCollected: number
}

export function FeeSummary({
  totalCollected,
  totalPending,
  totalOverdue,
  collectionRate,
  monthlyTarget,
  monthlyCollected,
}: FeeSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyProgress = (monthlyCollected / monthlyTarget) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-500/10">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-emerald-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{collectionRate}% collection rate</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalOverdue)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-red-600">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Target</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyCollected)}</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">of {formatCurrency(monthlyTarget)}</span>
              <span className="font-medium">{Math.round(monthlyProgress)}%</span>
            </div>
            <Progress value={monthlyProgress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
