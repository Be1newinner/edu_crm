import z from "zod";
import { STATUS } from "./studentFee.interface";

export const studentFeeZodSchema = z.object({
  instituteId: z.string().min(24).max(24),
  studentId: z.string().min(24).max(24),
  feeTemplateId: z.string().min(24).max(24),
  invoiceNumber: z.string(),
  totalAmount: z.number().int().positive(),
  paidAmount: z.number().int().positive(),
  dueDate: z.coerce.date(),
  status: z.enum(Object.values(STATUS)),
  payments: z.array(
    z.object({
      amount: z.number().int().positive(),
      paymentDate: z.coerce.date(),
      method: z.enum(['CASH', 'UPI', 'CARD', 'BANK', 'ONLINE'] ),
      transactionId:z.string().optional(),
      paidBy: z.string().optional()
    })),
  createdAt: z.coerce.date().optional()
})

export type studentFeeZodType=z.infer<typeof studentFeeZodSchema>