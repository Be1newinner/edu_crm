import { Types } from "mongoose";
import { batchInputZodType} from "./batch.interface";
import { BatchModel } from "./batch.model";
import AppError from "../../shared/utils/AppError";

export async function createBatchService(payload: batchInputZodType) {
    if (!Types.ObjectId.isValid(payload.instituteId)) {
        throw new AppError("Invalid Institute Id ", 400)
    }
    const batch = await BatchModel.create(payload)
    return batch
}

export async function updateBatchService(id:string,payload: batchInputZodType) {
    const batch = await BatchModel.findByIdAndUpdate(id,{$set:payload},{new:true})
    return batch
}

export async function deleteBatchService(id:string) {
    const batch = await BatchModel.findByIdAndDelete(id)
    if(!batch) throw new AppError("Batch not found",400)
    return batch
}
export async function getBatchByIdService(id:string) {
    const batch = await BatchModel.findOne({id})
    if(!batch) throw new AppError("Batch not found",400)
    return batch
}

export async function getAllBatchService() {
    const batch = await BatchModel.find({})
    return batch
}