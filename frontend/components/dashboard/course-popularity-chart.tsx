"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CoursePopularityChartProps {
  data: { course: string; students: number }[]
}

const COLORS = [
  "oklch(0.55 0.15 195)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.12 85)",
  "oklch(0.6 0.2 300)",
  "oklch(0.65 0.22 25)",
]

export function CoursePopularityChart({ data }: CoursePopularityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Course Popularity</CardTitle>
        <CardDescription>Students enrolled per course</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            students: {
              label: "Students",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
              <YAxis
                dataKey="course"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fontSize: 12 }}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="students" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.course}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
