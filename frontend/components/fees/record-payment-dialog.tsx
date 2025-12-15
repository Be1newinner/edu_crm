"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CreditCard, Banknote, Smartphone, Building } from "lucide-react"
import type { Student, FeeRecord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface RecordPaymentDialogProps {
  students: Student[]
  feeRecords: FeeRecord[]
  onSubmit?: (data: {
    studentId: string
    feeRecordId: string
    amount: number
    paymentMethod: string
    transactionId?: string
    notes?: string
  }) => void
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building },
]

export function RecordPaymentDialog({ students, feeRecords, onSubmit }: RecordPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    feeRecordId: "",
    amount: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
  })

  const selectedStudent = students.find((s) => s.id === formData.studentId)
  const studentFeeRecords = feeRecords.filter((f) => f.studentId === formData.studentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      studentId: formData.studentId,
      feeRecordId: formData.feeRecordId,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId || undefined,
      notes: formData.notes || undefined,
    })
    toast.success("Payment recorded successfully")
    setOpen(false)
    setFormData({
      studentId: "",
      feeRecordId: "",
      amount: "",
      paymentMethod: "cash",
      transactionId: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Student</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value, feeRecordId: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.enrollmentNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && studentFeeRecords.length > 0 && (
            <div className="space-y-2">
              <Label>Fee Record</Label>
              <Select
                value={formData.feeRecordId}
                onValueChange={(value) => setFormData({ ...formData, feeRecordId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee record" />
                </SelectTrigger>
                <SelectContent>
                  {studentFeeRecords.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {record.academicYear} - Due: ₹{(record.totalAmount - record.paidAmount).toLocaleString("en-IN")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                    formData.paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <method.icon
                    className={cn(
                      "h-5 w-5",
                      formData.paymentMethod === method.id ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-xs">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {formData.paymentMethod !== "cash" && (
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                placeholder="Enter transaction ID"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.studentId || !formData.amount}>
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
