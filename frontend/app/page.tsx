"use client"
import useSWR from "swr"
import { GraduationCap, Users, BookOpen, Layers, IndianRupee, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart"
import { CoursePopularityChart } from "@/components/dashboard/course-popularity-chart"
import { FeeStatusChart } from "@/components/dashboard/fee-status-chart"
import { RecentEnrollments } from "@/components/dashboard/recent-enrollments"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AttendanceSummary } from "@/components/dashboard/attendance-summary"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { getDashboardStats } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="col-span-2 h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useSWR("dashboard-stats", async () => {
    const response = await getDashboardStats()
    return response.data?.data
  })
  console.log(data)

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your institute.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          change={12}
          changeLabel="vs last month"
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          title="Staff Members"
          value={data.totalStaff}
          change={4}
          changeLabel="vs last month"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Active Courses"
          value={data.totalCourses}
          change={8}
          changeLabel="vs last quarter"
          icon={BookOpen}
          variant="default"
        />
        <StatCard
          title="Running Batches"
          value={data.totalBatches}
          change={-2}
          changeLabel="vs last month"
          icon={Layers}
          variant="default"
        />
      </div>

      {/* Financial Stats */}
         <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Fee Collected"
          value={formatCurrency(data.totalFeeCollected)}
          change={15}
          changeLabel="vs last month"
          icon={IndianRupee}
          variant="success"
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(data.pendingFees)}
          change={-8}
          changeLabel="improved"
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <EnrollmentChart data={data.enrollmentTrend} />
        <RecentEnrollments students={data.recentEnrollments} />
      </div>

      {/* Second Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <CoursePopularityChart data={data.coursePopularity} />
        <FeeStatusChart data={data.feesByStatus} />
        <AttendanceSummary rate={data.attendanceRate} />
      </div>

      {/* Quick Actions & Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <UpcomingEvents />
      </div>
   
    </div>
  )
}
