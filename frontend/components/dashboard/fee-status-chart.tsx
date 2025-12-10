"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface FeeStatusChartProps {
  data: { status: string; count: number; amount: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  PAID: "oklch(0.65 0.18 145)",
  PARTIAL: "oklch(0.75 0.12 85)",
  PENDING: "oklch(0.6 0.15 250)",
  OVERDUE: "oklch(0.55 0.2 25)",
}

export function FeeStatusChart({ data }: FeeStatusChartProps) {
  const chartData = data.map((item) => ({
    name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
    value: item.count,
    amount: item.amount,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Fee Collection Status</CardTitle>
        <CardDescription>Distribution of fee payment statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            PAID: { label: "Paid", color: STATUS_COLORS.PAID },
            PARTIAL: { label: "Partial", color: STATUS_COLORS.PARTIAL },
            PENDING: { label: "Pending", color: STATUS_COLORS.PENDING },
            OVERDUE: { label: "Overdue", color: STATUS_COLORS.OVERDUE },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name.toUpperCase()]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
