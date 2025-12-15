"use client"

import * as React from "react"
import useSWR from "swr"
import { getBatches } from "@/lib/api"
import { BatchCard } from "@/components/batches/batch-card"
import { AddBatchDialog } from "@/components/batches/add-batch-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BatchesPage() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "open" | "full">("all")

  const {
    data: batches,
    isLoading,
    mutate,
  } = useSWR("batches", async () => {
    const response = await getBatches()
    return response.data || []
  })

  const filteredBatches = React.useMemo(() => {
    if (!batches) return []
    let result = batches

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter((b) => b.name.toLowerCase().includes(searchLower))
    }

    if (statusFilter === "open") {
      result = result.filter((b) => b.currentEnrollment < b.maxCapacity)
    } else if (statusFilter === "full") {
      result = result.filter((b) => b.currentEnrollment >= b.maxCapacity)
    }

    return result
  }, [batches, search, statusFilter])

  const handleBatchAdded = () => {
    mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">Manage student batches and enrollments</p>
        </div>
        <AddBatchDialog onSuccess={handleBatchAdded} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>
                All Batches
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "open"}
                onCheckedChange={() => setStatusFilter("open")}
              >
                Open for Enrollment
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "full"}
                onCheckedChange={() => setStatusFilter("full")}
              >
                Full
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="px-3">
              All
            </TabsTrigger>
            <TabsTrigger value="open" className="px-3">
              Open
            </TabsTrigger>
            <TabsTrigger value="full" className="px-3">
              Full
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Batches Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBatches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
        {filteredBatches.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {search ? "No batches match your search" : "No batches found. Create your first batch!"}
          </div>
        )}
      </div>
    </div>
  )
}
