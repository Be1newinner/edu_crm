import { Types } from "mongoose";
import { feeTemplateZodInputType } from "./fee.interface";
import { FeeTemplateModel } from "./fee.model";
import AppError from "../../shared/utils/AppError";
import { StudentFeeModel } from "../studentFee/studentFee.model";
import { StudentModel } from "../students/students.model";

export const createFeeTemplateService = async (
  payload: feeTemplateZodInputType
) => {
  if (!Types.ObjectId.isValid(payload.instituteId))
    throw new AppError("Invalid Institute Id", 400);
  if (payload.courseId && !Types.ObjectId.isValid(payload.courseId))
    throw new AppError("Invalid course Id", 400);
  if (payload.batchId && !Types.ObjectId.isValid(payload.batchId))
    throw new AppError("Invalid Batch Id", 400);
  const exist = await FeeTemplateModel.findOne({
    instituteId: payload.instituteId,
  });
  if (exist) {
    throw new AppError("Fee Template Already exist", 409);
  }
  const feeTemplate = await FeeTemplateModel.create(payload);
  return feeTemplate;
};

export const createFeeInvoiceService = async (id: string, payload) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid student Id", 400);
  const feeTemplate = await FeeTemplateModel.findById({
    _id: payload.feeTemplateId,
  });
  if (!feeTemplate) throw new AppError("Fee Template Id not found", 404);
  const feeInvoice = {
    invoiceNumber: `INV-${Date.now()}`,
    studentId: payload.studentId,
    feeTemplateId: feeTemplate._id,
    totalAmount: feeTemplate.totalAmount,
    dueDate: payload.dueDate ?? new Date(),
    status: "PENDING",
    createdAt: new Date(),
  };
  return feeInvoice;
};

export const createInvoicePaymentService = async (id: string, payload) => {
  if (!id) {
    throw new AppError("invoice Id is required", 400);
  }
  const feeTemplateId = await StudentFeeModel.findOne({
    feeTemplateId: payload.invoiceNumber,
  });
  if (!feeTemplateId) throw new AppError("Fee Template Id not found", 404);
  const InvoicePayment = {
    amount: payload.amount,
    transactionId: payload.transactionId,
    method: payload.method,
    paidBy:payload.paidBy,
  };
  return InvoicePayment;
};

export const feeReportService = async () => {
  const feeReports = await StudentModel.find({});
  return feeReports;
};

export const singleStudentFeeSummaryService = async (id:string) => {
  const feeReports = await FeeTemplateModel.findById(id);
  return feeReports;
};
