import { Types } from "mongoose";
import { batchInputZodType } from "./batch.interface";
import { BatchModel } from "./batch.model";
import AppError from "../../shared/utils/AppError";
import { StudentModel } from "../students/students.model";

export async function createBatchService(payload: batchInputZodType) {
    if (!Types.ObjectId.isValid(payload.instituteId)) {
        throw new AppError("Invalid Institute Id ", 400)
    }
    const batch = await BatchModel.create(payload)
    return batch
}

export async function updateBatchService(id: string, payload: batchInputZodType) {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid Batch Id ", 400)
    }
    const batch = await BatchModel.findByIdAndUpdate(id, { $set: payload }, { new: true })
    if (!batch) throw new AppError("Batch not found", 404)
    return batch
}

export async function deleteBatchService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid Batch Id ", 400)
    }
    const batch = await BatchModel.findByIdAndDelete(id)
    if (!batch) throw new AppError("Batch not found", 404)
}
export async function getBatchByIdService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid Batch Id ", 400)
    }
    const batch = await BatchModel.findById(id).select("-createdAt -updatedAt -__v").lean()
    if (!batch) throw new AppError("Batch not found", 404)
    return batch
}

export async function getAllBatchService(search?: string) {
    const filter: Record<string, unknown> = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }
    const batch = await BatchModel.find(filter).select("-createdAt -updatedAt -__v ").lean()
    return batch
}

export async function getStudentsByBatchService(batchId:string) {
    const students = await StudentModel.find({batchIds:batchId})
        .select("-__v -createdAt -updatedAt")
        .lean();
    return students;
}
