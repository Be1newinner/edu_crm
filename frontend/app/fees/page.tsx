"use client"

import { useState, useEffect } from "react"
import { FeeSummary } from "@/components/fees/fee-summary"
import { FeeStructureCard } from "@/components/fees/fee-structure-card"
import { StudentFeeRecord } from "@/components/fees/student-fee-record"
import { PaymentCard } from "@/components/fees/payment-card"
import { RecordPaymentDialog } from "@/components/fees/record-payment-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus, FileText, CreditCard, LayoutGrid, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { Student, FeeStructure, FeeRecord, Payment } from "@/lib/types"
import { toast } from "sonner"

export default function FeesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, structuresRes, recordsRes, paymentsRes] = await Promise.all([
          api.students.getAll(),
          api.fees.structures.getAll(),
          api.fees.records.getAll(),
          api.fees.payments.getAll(),
        ])
        setStudents(studentsRes.data || [])
        setFeeStructures(structuresRes.data || [])
        setFeeRecords(recordsRes.data || [])
        setPayments(paymentsRes.data || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStudentById = (id: string) => students.find((s) => s.id === id)

  const filteredRecords = feeRecords.filter((record) => {
    const student = getStudentById(record.studentId)
    if (!student) return false
    const matchesSearch =
      search === "" ||
      (student.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (student.rollNumber?.toLowerCase() || "").includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate summary stats
  const totalCollected = feeRecords.reduce((sum, r) => sum + r.paidAmount, 0)
  const totalPending = feeRecords.reduce((sum, r) => sum + (r.totalAmount - r.paidAmount), 0)
  const totalOverdue = feeRecords
    .filter((r) => r.status === "overdue")
    .reduce((sum, r) => sum + (r.totalAmount - r.paidAmount), 0)
  const collectionRate = Math.round((totalCollected / (totalCollected + totalPending)) * 100) || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fees & Payments</h1>
          <p className="text-muted-foreground">
            Manage fee structures, records, and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RecordPaymentDialog
            students={students}
            feeRecords={feeRecords}
            onSubmit={(data) => console.log("Recording payment:", data)}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <FeeSummary
        totalCollected={totalCollected}
        totalPending={totalPending}
        totalOverdue={totalOverdue}
        collectionRate={collectionRate}
        monthlyTarget={500000}
        monthlyCollected={380000}
      />

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records" className="gap-2">
            <FileText className="h-4 w-4" />
            Fee Records
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Recent Payments
          </TabsTrigger>
          <TabsTrigger value="structures" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Fee Structures
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Overdue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => {
              const student = getStudentById(record.studentId);
              if (!student) return null;
              return (
                <StudentFeeRecord
                  key={record.id}
                  record={record}
                  student={student}
                  onSendReminder={(r) =>
                    toast.info(`Reminder sent for ${student.name}`)
                  }
                  onGenerateInvoice={(r) =>
                    toast.success(`Invoice generated for ${student.name}`)
                  }
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payments.map((payment) => {
              const record = feeRecords.find(
                (r) => r.id === payment.feeRecordId
              );
              const student = record ? getStudentById(record.studentId) : null;
              return (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  studentName={student?.name || "Unknown"}
                  studentPhoto={student?.photo || undefined}
                  onViewReceipt={(p) => console.log("View receipt:", p)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="structures" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Structure
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map((structure) => (
              <FeeStructureCard
                key={structure.id}
                structure={structure}
                onEdit={(s) => console.log("Edit structure:", s)}
                onDelete={(id) => console.log("Delete structure:", id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Overdue Fee Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeRecords
                  .filter((r) => r.status === "overdue")
                  .map((record) => {
                    const student = getStudentById(record.studentId);
                    if (!student) return null;
                    return (
                      <StudentFeeRecord
                        key={record.id}
                        record={record}
                        student={student}
                        onSendReminder={(r) =>
                          toast.info(`Urgent reminder sent for ${student.name}`)
                        }
                        onGenerateInvoice={(r) =>
                          toast.success(`Invoice generated for ${student.name}`)
                        }
                      />
                    );
                  })}
              </div>
              {feeRecords.filter((r) => r.status === "overdue").length ===
                0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No overdue fee records</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
