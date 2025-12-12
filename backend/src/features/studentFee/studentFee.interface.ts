import { Types } from "mongoose"
export enum STATUS {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}

export enum METHOD {
    CASH = 'CASH',
    UPI = 'UPI',
    CARD = 'CARD',
    BANK = 'BANK',
    ONLINE = 'ONLINE'
}
export interface IStudentFee {
    instituteId: Types.ObjectId,
    studentId: Types.ObjectId,
    feeTemplateId?: Types.ObjectId,
    invoiceNumber: string,
    totalAmount?: number,
    paidAmount?: number
    dueDate?: Date
    status: STATUS,
    payments: {
        amount?: number,
        paymentDate: Date,
        method:METHOD,
        transactionId?: string,
        paidBy?: string
    }[],
    createdAt: Date | string
}