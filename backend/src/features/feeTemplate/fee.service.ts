import { Types } from "mongoose";
import { feeTemplateZodInputType } from "./fee.interface";
import { FeeTemplateModel } from "./fee.model";
import AppError from "../../shared/utils/AppError";

export const createFeeTemplateService = async (payload: feeTemplateZodInputType) => {
    if (!Types.ObjectId.isValid(payload.instituteId)) throw new AppError("Invalid Institute Id", 400)
    if (payload.courseId&&!Types.ObjectId.isValid(payload.courseId)) throw new AppError("Invalid course Id", 400)
    if (payload.batchId&&!Types.ObjectId.isValid(payload.batchId)) throw new AppError("Invalid Batch Id", 400)
    const exist = await FeeTemplateModel.findOne({ instituteId: payload.instituteId, name: payload.name })
    if (exist) {
        throw new AppError("Fee Template Already exist", 409)
    }
    const feeTemplate = await FeeTemplateModel.create(payload)
    return feeTemplate
}