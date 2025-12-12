import mongoose from "mongoose"

const StudentFeeSchema = new mongoose.Schema({
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeTemplate' },
  invoiceNumber: { type: String, required: true, unique: true },
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'PENDING'
  },
  payments: [{
    amount: Number,
    paymentDate: Date,
    method: { type: String, enum: ['CASH', 'UPI', 'CARD', 'BANK', 'ONLINE'] },
    transactionId: String,
    paidBy: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export const StudentFeeModel=mongoose.model("StudentFee",StudentFeeSchema)